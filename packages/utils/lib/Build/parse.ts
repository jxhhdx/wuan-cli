import get from 'lodash/get';

interface Payload {
  message?: string; // Adjust the type based on the actual structure of your payload
}

interface Metadata {
  timestamp: number;
  // Add other metadata properties if needed
}

interface Message {
  action: string;
  payload: Payload;
}

interface ParsedMessage {
  action: string | undefined;
  message: string | undefined;
}

function createMsg(action: string, payload: Payload = {}, metadata: Metadata = {}): { meta: Metadata; data: Message } {
  const meta = Object.assign({}, { timestamp: Date.now() }, metadata);

  return {
    meta,
    data: {
      action,
      payload,
    },
  };
}

function parseMsg(msg: { data: { action?: string; payload?: { message?: string } } }): ParsedMessage {
  const action = get(msg, 'data.action');
  const message = get(msg, 'data.payload.message');
  return {
    action,
    message,
  };
}

export { createMsg, parseMsg };
