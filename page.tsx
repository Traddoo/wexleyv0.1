'use client';

import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useChat } from 'ai/react';
import { toast } from 'sonner';

const INITIAL_MESSAGE = `Hi! I'm your AI assistant. I can help you with:

- Writing and editing
- Analysis and research
- Code and development
- Creative projects
- Image analysis and understanding
- And much more!

How can I assist you today?`;

export default function Home() {
  const { messages, setMessages, isLoading } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: INITIAL_MESSAGE,
      },
    ],
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (message: string, file?: File) => {
    try {
      const userMessage = { id: Date.now().toString(), role: 'user' as const, content: message };
      setMessages([...messages, userMessage]);

      const formData = new FormData();
      formData.append('messages', JSON.stringify([...messages, userMessage]));
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      if (reader) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: '',
        };
        setMessages([...messages, userMessage, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          content += decoder.decode(value);
          setMessages([
            ...messages,
            userMessage,
            { ...assistantMessage, content },
          ]);
        }
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error:', error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-background to-muted/20">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <ChatSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-muted/50 data-[hover]:bg-muted transition-colors" />
        <ResizablePanel defaultSize={80}>
          <div className="flex h-screen flex-col">
            <ChatMessages messages={messages} />
            <ChatInput onSend={handleSubmit} isLoading={isLoading} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}