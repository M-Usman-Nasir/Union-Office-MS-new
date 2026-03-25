const META_BASE_URL = process.env.WA_META_BASE_URL || 'https://graph.facebook.com/v21.0';

const assertConfig = () => {
  if (!process.env.WA_ACCESS_TOKEN || !process.env.WA_PHONE_NUMBER_ID) {
    throw new Error('Missing Meta WhatsApp configuration. Set WA_ACCESS_TOKEN and WA_PHONE_NUMBER_ID.');
  }
};

const buildHeaders = () => ({
  Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
});

export const sendTextMessage = async ({ to, body }) => {
  assertConfig();
  const url = `${META_BASE_URL}/${process.env.WA_PHONE_NUMBER_ID}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta sendTextMessage failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const sendInteractiveButtons = async ({ to, body, buttons }) => {
  assertConfig();
  const url = `${META_BASE_URL}/${process.env.WA_PHONE_NUMBER_ID}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: {
          buttons: (buttons || []).slice(0, 3).map((item) => ({
            type: 'reply',
            reply: { id: item.id, title: item.title },
          })),
        },
      },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta sendInteractiveButtons failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const getMediaMetadata = async ({ mediaId }) => {
  assertConfig();
  const url = `${META_BASE_URL}/${mediaId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta getMediaMetadata failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const downloadMediaBuffer = async ({ mediaUrl }) => {
  assertConfig();
  const response = await fetch(mediaUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta downloadMediaBuffer failed: ${response.status} ${errorText}`);
  }
  const arr = await response.arrayBuffer();
  return Buffer.from(arr);
};
