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
    const messages = JSON.parse(formData.get('messages') as string);
    const file = formData.get('file') as File | null;

    let messageList = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant that provides accurate and detailed responses.',
      },
      ...messages,
    ];

    // If there's a file, process it
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');

      // For images, use the Vision API
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
      // For PDFs and other files, you might want to use different processing methods
      // Add PDF processing logic here if needed
    }

    const response = await openai.chat.completions.create({
      model: file?.type.startsWith('image/') ? 'gpt-4-vision-preview' : 'gpt-4-turbo-preview',
      stream: true,
      messages: messageList,
      max_tokens: 4096,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[CHAT ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}