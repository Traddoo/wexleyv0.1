'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, onClear, selectedFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only images (JPEG, PNG, GIF) and PDFs are allowed');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleClear = () => {
    setPreview(null);
    onClear();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,application/pdf"
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          {preview ? (
            <div className="relative w-20 h-20 rounded-md overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center">
              <File className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      )}
    </div>
  );
}