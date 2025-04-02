import { Message, TextStreamMessage } from '@/components/message';
import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateId } from 'ai';
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from 'ai/rsc';
import { ReactNode } from 'react';
import { z } from 'zod';
import { BlogEditor } from '@/components/blog-editor';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

const DEV_TO_API_KEY = process.env.DEV_COMMUNITY_API_KEY;

export interface BlogPost {
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  dev_to_id?: string;
  dev_to_url?: string;
  tags?: string[];
  description?: string;
}

const BlogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

type BlogPostInput = z.infer<typeof BlogPostSchema>;

let currentBlogPost: BlogPost = {
  title: '',
  content: '',
  status: 'draft',
  tags: [],
  description: '',
};

async function publishToDev() {
  'use server';
  
  if (!DEV_TO_API_KEY) {
    throw new Error('Dev.to API key not configured');
  }

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEV_TO_API_KEY,
    },
    body: JSON.stringify({
      article: {
        title: currentBlogPost.title,
        body_markdown: currentBlogPost.content,
        published: true,
        description: currentBlogPost.description,
        tags: currentBlogPost.tags?.join(', '),
        series: null,
        main_image: null,
        canonical_url: null,
        organization_id: null
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to publish to Dev.to');
  }

  const data = await response.json();
  return data.url;
}

const systemPrompt = `
You are a professional technical blog writer and assistant. Your task is to help users create and publish high-quality technical blog posts.

When a user requests to write a blog post:
1. First, analyze their request and generate a well-structured blog post
2. Include a compelling title, description, and relevant tags
3. Use proper markdown formatting with code examples where relevant
4. Structure the content with clear headings and sections

Format requirements:
- Write in a clear, engaging, and professional tone
- Use markdown for formatting (headings, lists, bold, code)
- Include code snippets in markdown code blocks
- Add a brief description for SEO
- Suggest 3-4 relevant tags

After generating content:
- Show the preview in the BlogEditor
- Ask if they want to publish to Dev.to
- Handle the publishing process when confirmed
`.trim();

const sendMessage = async (message: string) => {
  'use server';

  const messages = getMutableAIState<typeof AI>('messages');
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: 'user', content: message },
  ]);

  const contentStream = createStreamableValue('');
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai('gpt-4'),
    system: systemPrompt,
    messages: messages.get() as CoreMessage[],
    text: async function* ({
      content,
      done,
    }: {
      content: string;
      done: boolean;
    }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: 'assistant', content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      generateBlog: {
        description: "Generate a blog post based on the user's prompt",
        parameters: BlogPostSchema,
        generate: async function* (params: BlogPostInput) {
          const { title, content, tags, description } = params;
          const toolCallId = generateId();

          currentBlogPost = {
            title,
            content,
            status: 'draft',
            tags,
            description,
          };

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: 'assistant',
              content: [
                {
                  type: 'tool-call',
                  toolCallId,
                  toolName: 'generateBlog',
                  args: { title, content, tags, description },
                },
              ],
            },
            {
              role: 'tool',
              content: [
                {
                  type: 'tool-result',
                  toolName: 'generateBlog',
                  toolCallId,
                  result: {
                    title,
                    description,
                    tags,
                    preview: content.substring(0, 150) + '...',
                  },
                },
              ],
            },
          ]);

          return (
            <>
              <Message
                role='assistant'
                content={`I've generated a blog post for you:

📝 Title: ${title}
🏷️ Tags: ${tags.join(', ')}
📋 Description: ${description}

You can review the content below. Would you like to publish it to Dev.to?`}
              />
              <Message
                role='assistant'
                content={
                  <BlogEditor
                    content={content}
                    publishAction={publishToDev}
                  />
                }
              />
            </>
          );
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    'use server';

    if (done) {
      const cookieStore = cookies();
      const supabase = await createClient(cookieStore);

      await supabase.from('chat_history').insert({
        messages: state.messages,
        chat_id: state.chatId,
      });
    }
  },
});
