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
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { BlogGeneratingState, BlogSuccessState, BlogErrorState } from '@/components/blog-states';

const DEV_TO_API_KEY = process.env.DEV_COMMUNITY_API_KEY;

// Define schema for blog post
const BlogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

type BlogPostInput = z.infer<typeof BlogPostSchema>;

interface BlogPost {
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  dev_to_id?: string;
  dev_to_url?: string;
  tags?: string[];
  description?: string;
}

let currentBlogPost: BlogPost = {
  title: '',
  content: '',
  status: 'draft',
  tags: [],
  description: '',
};

// Define valid status types to match database constraint
type GenerationStatus = 'pending' | 'completed' | 'failed';

async function saveBlogPost(userId: string, post: BlogPost) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      content: post.content,
      status: post.status,
      dev_to_id: post.dev_to_id,
      dev_to_url: post.dev_to_url,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function saveGenerationHistory(
  userId: string,
  prompt: string,
  blogPostId: string | null,
  status: GenerationStatus,
  errorMessage?: string
) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase.from('blog_generation_history').insert({
    user_id: userId,
    prompt,
    blog_post_id: blogPostId || null,
    status,
    error_message: errorMessage,
  });

  if (error) throw error;
}

async function publishToDev() {
  'use server';

  if (!DEV_TO_API_KEY) {
    throw new Error('Dev.to API key not configured');
  }

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
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
          organization_id: null,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to publish to Dev.to');
    }

    const data = await response.json();

    // Save the published post to our database
    const savedPost = await saveBlogPost(user.id, {
      ...currentBlogPost,
      status: 'published',
      dev_to_id: data.id.toString(),
      dev_to_url: data.url,
    });

    // Save generation history
    await saveGenerationHistory(
      user.id,
      'Publish to Dev.to',
      savedPost.id,
      'completed'
    );

    return data.url;
  } catch (error) {
    // Save failed generation history
    if (user) {
      await saveGenerationHistory(
        user.id,
        'Publish to Dev.to',
        '',
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
    throw error;
  }
}

const systemPrompt = `
You are a professional technical blog writer and assistant. Your task is to help users create and publish high-quality technical blog posts.

IMPORTANT INSTRUCTIONS:
1. ALWAYS use the generateBlog tool to create content - do not respond with direct text
2. For ANY user input, treat it as a blog post topic and generate accordingly

When generating blog posts:
1. Title: Create clear, SEO-friendly titles (40-60 characters)
2. Content:
   - Start with a compelling introduction
   - Use H2 and H3 headings for structure
   - Include relevant code examples in \`\`\` blocks
   - Add practical implementation details
   - End with a clear conclusion
3. Tags: Include 3-5 relevant tags
4. Description: Write an engaging meta description (120-160 characters)

Content Guidelines:
- Focus on technical accuracy and depth
- Include code snippets with explanations
- Add real-world use cases and examples
- Maintain a professional but approachable tone
- Target experienced developers

Example Structure:
{
  title: "Building Real-time Apps with Next.js and Supabase",
  content: "# Title\\n\\n## Introduction\\n...\\n## Implementation\\n\`\`\`typescript\\n...\`\`\`\\n## Conclusion",
  tags: ["nextjs", "supabase", "react", "typescript"],
  description: "Learn how to build real-time applications using Next.js and Supabase, with practical examples and best practices for production deployment."
}

Remember: ALWAYS use the generateBlog tool and ensure content is high quality and ready for review.`.trim();

const sendMessage = async (message: string) => {
  'use server';

  const messages = getMutableAIState<typeof AI>('messages');
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  // Show loading state immediately
  const loadingMessage = <Message role="assistant" content={<BlogGeneratingState />} />;
  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: 'user', content: message },
    { role: 'assistant', content: 'Generating blog post...' }
  ]);

  const contentStream = createStreamableValue('');
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  try {
    const { value: stream } = await streamUI({
      model: openai('gpt-4o-mini-2024-07-18'),
      system: systemPrompt,
      messages: messages.get() as CoreMessage[],
      text: async function* ({ content, done }) {
        if (done) {
          contentStream.done();
          messages.done([
            ...(messages.get() as CoreMessage[]),
            { role: 'assistant', content },
          ]);
        } else {
          contentStream.update(content);
        }
        return textComponent;
      },
      tools: {
        generateBlog: {
          description: "Generate a SEO friendly blog post based on the user's prompt and automatically publish it to Dev.to",
          parameters: BlogPostSchema,
          generate: async function* (params: BlogPostInput) {
            const toolCallId = generateId();

            try {
              // Step 1: Initial Generation - Save initial status
              await saveGenerationHistory(user.id, message, null, 'pending');
              
              currentBlogPost = {
                ...params,
                status: 'draft',
              };

              // Save initial draft and update status to completed
              const savedPost = await saveBlogPost(user.id, currentBlogPost);
              await saveGenerationHistory(user.id, message, savedPost.id, 'completed');

              // Return success state with publish button
              return (
                <Message
                  role="assistant"
                  content={
                    <BlogSuccessState
                      title={params.title}
                      tags={params.tags}
                      description={params.description}
                      content={params.content}
                      publishAction={publishToDev}
                    />
                  }
                />
              );
            } catch (err) {
              console.error('Error during blog generation:', err);
              const error = err as Error;
              
              await saveGenerationHistory(
                user.id,
                message,
                null,
                'failed',
                error.message || 'Unknown error'
              );

              return (
                <Message              
                  role="assistant"
                  content={<BlogErrorState error={error.message || 'Unknown error'} />}
                />
              );
            }
          },
        },
      },
    });

    return stream;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return <Message role="assistant" content={<BlogErrorState error="Failed to generate blog post" />} />;
  }
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
  onSetAIState: async ({ done }) => {
    'use server';
    if (done) {
      console.log('Chat completed');
    }
  },
});
