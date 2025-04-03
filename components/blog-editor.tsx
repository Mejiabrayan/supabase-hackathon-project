"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface BlogPreviewProps {
  content: string;
  publishAction: () => Promise<string>;
}

export function BlogPreview({ content, publishAction }: BlogPreviewProps) {
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
      <div className="prose prose-invert max-w-none">
        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
          {content}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          onClick={handlePublish}
          disabled={isPublishing || publishedUrl !== null}
          className={publishedUrl ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isPublishing ? 'Publishing...' : publishedUrl ? 'Published ✨' : 'Publish to Dev.to'}
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
            View on Dev.to →
          </a>
        )}
      </div>
    </div>
  );
} 