"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface BlogEditorProps {
  content: string;
  publishAction: () => Promise<string>;
}

export function BlogEditor({ content, publishAction }: BlogEditorProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      const url = await publishAction();
      setPublishedUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        readOnly
        className="min-h-[200px] font-mono text-sm"
      />
      <div className="flex items-center gap-4">
        <Button 
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? 'Publishing...' : 'Publish to Dev.to'}
        </Button>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {publishedUrl && (
          <a 
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View published post →
          </a>
        )}
      </div>
    </div>
  );
} 