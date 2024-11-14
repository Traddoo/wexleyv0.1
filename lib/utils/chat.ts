import { type Message } from 'ai';

export async function sendChatMessage(messages: Message[]) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
}