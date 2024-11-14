'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Bot, User, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Response downloaded');
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`message-appear flex items-start gap-4 ${
              message.role === 'assistant'
                ? 'bg-card p-6 rounded-lg shadow-sm gradient-border'
                : ''
            }`}
          >
            <Avatar className={`mt-1 ${message.role === 'assistant' ? 'ring-2 ring-primary/20' : ''}`}>
              {message.role === 'assistant' ? (
                <Bot className="p-2" />
              ) : (
                <User className="p-2" />
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <ReactMarkdown className="prose dark:prose-invert max-w-none">
                {message.content}
              </ReactMarkdown>
              {message.role === 'assistant' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="gap-2"
                    onClick={() => handleCopy(message.content)}
                  >
                    <Copy size={14} />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => handleDownload(message.content)}
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}