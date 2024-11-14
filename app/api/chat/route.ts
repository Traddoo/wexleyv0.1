import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const messagesJson = formData.get('messages');
    
    if (!messagesJson) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const messages = JSON.parse(messagesJson as string);
    const file = formData.get('file') as File | null;

    let messageList = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant that provides accurate and detailed responses.',
      },
      ...messages,
    ];

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');

      if (file.type.startsWith('image/')) {
        messageList = [
          ...messageList,
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Here is an image I want to discuss:' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.type};base64,${base64}`,
                },
              },
            ],
          },
        ];
      }
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      stream: true,
      messages: messageList,
      max_tokens: 16384,
      temperature: 0.7,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[CHAT ERROR]', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}