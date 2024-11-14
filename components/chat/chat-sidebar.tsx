'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Settings, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';

export function ChatSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-[300px] flex-col bg-card p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
          <div className="h-px w-full bg-muted" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-[300px] flex-col bg-card p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-semibold">AI Assistant</h1>
      </div>

      <Button className="w-full justify-start gap-2 gradient-border" variant="secondary">
        <PlusCircle size={16} />
        New Chat
      </Button>

      <Separator className="my-4" />

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start gap-2 truncate hover:bg-muted/60 transition-colors"
            >
              <MessageSquare size={16} />
              Chat {i + 1}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start gap-2 hover:bg-muted/60">
          <Settings size={16} />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="justify-start gap-2 hover:bg-muted/60"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
          Toggle Theme
        </Button>
      </div>
    </div>
  );
}