import { query } from '../../config/database.js';
import { resolveResidentByPhone } from './identityResolver.js';
import { deleteSession, getSession, saveSession } from './sessionStore.js';
import { createPaymentProofFromWhatsApp, resolveLatestOutstandingMaintenance } from './maintenanceAdapter.js';
import { downloadMediaBuffer, getMediaMetadata, sendInteractiveButtons, sendTextMessage } from './metaClient.js';

const PROVIDER = 'meta_cloud';
const FLOW_KEY_PAYMENT_PROOF = 'submit_payment_proof';
const ACTION_SUBMIT_PAYMENT_PROOF = 'action_submit_payment_proof';

export const extractIncomingEvents = (payload) => {
  const events = [];
  const entries = payload?.entry || [];
  for (const entry of entries) {
    for (const change of entry?.changes || []) {
      const value = change?.value || {};
      const messages = value?.messages || [];
      for (const msg of messages) {
        events.push({
          eventId: msg.id,
          senderPhone: msg.from,
          type: msg.type,
          textBody: msg?.text?.body || '',
          interactiveButtonId: msg?.interactive?.button_reply?.id || null,
          imageMediaId: msg?.image?.id || null,
          documentMediaId: msg?.document?.id || null,
        });
      }
    }
  }
  return events;
};

const hasProcessedEvent = async (eventId) => {
  if (!eventId) return false;
  const result = await query(
    `SELECT id FROM whatsapp_event_logs
     WHERE provider = $1 AND event_id = $2
     LIMIT 1`,
    [PROVIDER, eventId]
  );
  return result.rows.length > 0;
};

const markEventProcessed = async ({ eventId, senderPhone, payload }) => {
  if (!eventId) return;
  await query(
    `INSERT INTO whatsapp_event_logs (provider, event_id, sender_phone, payload)
     VALUES ($1, $2, $3, $4::jsonb)
     ON CONFLICT (provider, event_id) DO NOTHING`,
    [PROVIDER, eventId, senderPhone || null, JSON.stringify(payload || {})]
  );
};

const sendMainMenu = async ({ to, name }) => {
  await sendInteractiveButtons({
    to,
    body: `Assalam o Alaikum ${name || ''}\nChoose an action from menu:`,
    buttons: [
      { id: ACTION_SUBMIT_PAYMENT_PROOF, title: 'Submit Payment Proof' },
    ],
  });
};

const startPaymentProofFlow = async ({ to, resident }) => {
  const maintenance = await resolveLatestOutstandingMaintenance({
    residentUserId: resident.id,
    unitId: resident.unit_id,
  });
  if (!maintenance) {
    await sendTextMessage({
      to,
      body: 'No outstanding maintenance dues found for your unit. If this is incorrect, contact office admin.',
    });
    return;
  }

  await saveSession({
    senderPhone: to,
    residentUserId: resident.id,
    flowKey: FLOW_KEY_PAYMENT_PROOF,
    flowState: {
      step: 'awaiting_proof_media',
      maintenance_id: maintenance.maintenance_id,
      month: maintenance.month,
      year: maintenance.year,
    },
    ttlMinutes: 30,
  });

  await sendTextMessage({
    to,
    body: `Please send payment proof image/PDF for dues ${maintenance.month}/${maintenance.year}. Max 5MB.`,
  });
};

const processProofMedia = async ({ incomingEvent, resident, session }) => {
  const mediaId = incomingEvent.imageMediaId || incomingEvent.documentMediaId;
  if (!mediaId) {
    await sendTextMessage({
      to: incomingEvent.senderPhone,
      body: 'Please upload an image or PDF file as payment proof.',
    });
    return;
  }

  const metadata = await getMediaMetadata({ mediaId });
  const mediaBuffer = await downloadMediaBuffer({ mediaUrl: metadata.url });

  await createPaymentProofFromWhatsApp({
    residentUserId: resident.id,
    maintenanceId: session.flow_state.maintenance_id,
    mediaBuffer,
    mimeType: metadata.mime_type,
    note: `WhatsApp upload (${incomingEvent.type})`,
  });

  await deleteSession({
    senderPhone: incomingEvent.senderPhone,
    flowKey: FLOW_KEY_PAYMENT_PROOF,
  });

  await sendTextMessage({
    to: incomingEvent.senderPhone,
    body: 'Payment proof submitted successfully. Office admin will review and update status.',
  });
};

export const processIncomingWebhook = async (payload) => {
  const incomingEvents = extractIncomingEvents(payload);
  for (const event of incomingEvents) {
    if (!event.senderPhone || !event.eventId) {
      continue;
    }
    if (await hasProcessedEvent(event.eventId)) {
      continue;
    }

    try {
      const resident = await resolveResidentByPhone(event.senderPhone);
      if (!resident) {
        await sendTextMessage({
          to: event.senderPhone,
          body: 'Your WhatsApp number is not linked with an active resident account. Please contact office admin.',
        });
        await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
        continue;
      }

      if (!resident.society_apartment_id || !resident.unit_id) {
        await sendTextMessage({
          to: event.senderPhone,
          body: 'Your account is not assigned to a unit yet. Please contact office admin.',
        });
        await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
        continue;
      }

      const activeSession = await getSession({
        senderPhone: event.senderPhone,
        flowKey: FLOW_KEY_PAYMENT_PROOF,
      });

      const isSubmitProofAction = event.interactiveButtonId === ACTION_SUBMIT_PAYMENT_PROOF;
      if (isSubmitProofAction) {
        await startPaymentProofFlow({ to: event.senderPhone, resident });
        await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
        continue;
      }

      if (
        activeSession &&
        activeSession.flow_state?.step === 'awaiting_proof_media' &&
        (event.imageMediaId || event.documentMediaId)
      ) {
        await processProofMedia({
          incomingEvent: event,
          resident,
          session: activeSession,
        });
        await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
        continue;
      }

      await sendMainMenu({ to: event.senderPhone, name: resident.name });
      await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
    } catch (error) {
      console.error('WhatsApp event processing failed:', {
        eventId: event.eventId,
        senderPhone: event.senderPhone,
        error: error.message,
      });
      try {
        await sendTextMessage({
          to: event.senderPhone,
          body: 'Could not process your request right now. Please try again shortly.',
        });
      } catch (sendError) {
        console.error('WhatsApp fallback message failed:', sendError.message);
      }
      await markEventProcessed({ eventId: event.eventId, senderPhone: event.senderPhone, payload: event });
    }
  }
};
