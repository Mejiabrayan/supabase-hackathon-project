'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface BlogPreviewProps {
  publishAction: () => Promise<string>;
}

export function BlogPreview({ publishAction }: BlogPreviewProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      const url = await publishAction();
      setPublishedUrl(url);
      toast.success('Blog post published successfully!', {
        description: 'Your post is now live and ready to be shared',
        action: {
          label: 'View on Dev.to',
          onClick: () => window.open(url, '_blank'),
        },
        duration: 5000,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handlePublish}
          disabled={isPublishing || publishedUrl !== null}
          className="shadow-md inset-shadow-sm inset-shadow-white/20 ring ring-blue-600 inset-ring inset-ring-white/15 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-normal tracking-wide px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
