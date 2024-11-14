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
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`message-appear flex items-start gap-3 p-4 rounded-lg shadow-sm relative transition-shadow duration-200 ${
              message.role === 'assistant'
                ? i === 0
                  ? 'bg-card/50'
                  : 'bg-card/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/50 border-emerald-500'
                : 'bg-card/50 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-2 ring-cyan-500/50 border-cyan-500'
            }`}
          >
            <Avatar 
              className={`mt-0.5 h-8 w-8 flex items-center justify-center ${
                message.role === 'assistant' 
                  ? i === 0
                    ? ''
                    : 'ring-2 ring-emerald-500/20'
                  : 'ring-2 ring-cyan-500/20'
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <ReactMarkdown 
                className="prose dark:prose-invert max-w-none prose-sm"
                components={{
                  p: ({ children }) => <p className="text-sm leading-relaxed">{children}</p>,
                  pre: ({ children }) => <pre className="text-sm">{children}</pre>,
                  code: ({ children }) => <code className="text-xs">{children}</code>,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.role === 'assistant' && i !== 0 && (
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="gap-1.5 hover:bg-emerald-500/10 text-xs h-8"
                    onClick={() => handleCopy(message.content)}
                  >
                    <Copy size={12} />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 hover:bg-emerald-500/10 text-xs h-8"
                    onClick={() => handleDownload(message.content)}
                  >
                    <Download size={12} />
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