import assert from 'assert';
import { normalizePhone, phonesMatch } from '../services/whatsapp/phone.js';
import { extractIncomingEvents } from '../services/whatsapp/actionRouter.js';

function run() {
  assert.strictEqual(normalizePhone('+92 300-1234567'), '923001234567');
  assert.strictEqual(normalizePhone('0092-300-1234567'), '923001234567');
  assert.strictEqual(phonesMatch('03001234567', '+92 300 1234567'), true);
  assert.strictEqual(phonesMatch('923001234567', '923001234568'), false);

  const payload = {
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                {
                  id: 'wamid.sample1',
                  from: '923001234567',
                  type: 'interactive',
                  interactive: {
                    button_reply: {
                      id: 'action_submit_payment_proof',
                    },
                  },
                },
                {
                  id: 'wamid.sample2',
                  from: '923001234567',
                  type: 'image',
                  image: {
                    id: 'media-image-1',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };

  const events = extractIncomingEvents(payload);
  assert.strictEqual(events.length, 2);
  assert.strictEqual(events[0].interactiveButtonId, 'action_submit_payment_proof');
  assert.strictEqual(events[1].imageMediaId, 'media-image-1');

  console.log('WhatsApp adapter tests passed');
}

run();
