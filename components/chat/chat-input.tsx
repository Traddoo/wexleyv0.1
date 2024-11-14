'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal, Loader2, Paperclip } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { FileUpload } from './file-upload';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if ((input.trim() || selectedFile) && !isLoading) {
      onSend(input, selectedFile || undefined);
      setInput('');
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-background/80 backdrop-blur-lg p-4 sticky bottom-0">
      <div className="relative flex max-w-2xl mx-auto items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start" side="top">
            <FileUpload
              onFileSelect={setSelectedFile}
              onClear={() => setSelectedFile(null)}
              selectedFile={selectedFile}
            />
          </PopoverContent>
        </Popover>

        <div className="w-full gradient-border rounded-lg bg-card">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? 'Add a message about your file...' : 'Type a message...'}
            className="min-h-[60px] w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={(!input.trim() && !selectedFile) || isLoading}
            className="absolute bottom-2 right-2"
            size="icon"
            variant="ghost"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  );
}