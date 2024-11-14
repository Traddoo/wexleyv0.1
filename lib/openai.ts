import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateChatCompletion(messages: { role: 'user' | 'assistant' | 'system'; content: string; }[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      stream: true,
    });

    return completion;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}