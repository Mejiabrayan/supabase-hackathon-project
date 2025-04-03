'use client';

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
    <div className="space-y-4 w-full">
      {publishedUrl && (
        <div className="relative rounded-lg overflow-hidden bg-green-500/10 p-4">
          <div className="absolute inset-0 backdrop-blur-sm ring-1 ring-green-500/20" />
          <div className="relative flex items-center justify-between">
            <p className="text-green-400 font-medium">✨ Blog post published successfully!</p>
            <a 
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              View on Dev.to →
            </a>
          </div>
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
        <div className="relative p-4">
          <div className="prose prose-invert max-w-none">
            <div className="font-normal text-sm text-white/80 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {content}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          onClick={handlePublish}
          disabled={isPublishing || publishedUrl !== null}
          className={`relative overflow-hidden ${
            publishedUrl 
              ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
              : 'bg-white/5 hover:bg-white/10 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPublishing ? 'Publishing...' : publishedUrl ? 'Published ✨' : 'Publish to Dev.to'}
        </Button>
        
        {error && (
          <div className="relative px-3 py-1.5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm ring-1 ring-red-500/20" />
            <p className="relative text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
