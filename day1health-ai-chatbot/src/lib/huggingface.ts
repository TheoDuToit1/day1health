import { HfInference } from '@huggingface/inference';
import { SYSTEM_PROMPT } from './prompts';

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing HUGGINGFACE_API_KEY environment variable');
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface HFMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface HFResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
  };
}

export async function sendToHuggingFace(
  messages: HFMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<HFResponse> {
  try {
    // Convert messages to chat format
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Use chat completion API with Qwen model (free and works!)
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';

    // Estimate token usage
    const inputTokens = Math.ceil(
      messages.reduce((sum, msg) => sum + msg.content.length, 0) / 4
    );
    const outputTokens = Math.ceil(content.length / 4);

    return {
      content,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
      },
    };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

export async function streamFromHuggingFace(
  messages: HFMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
  onChunk: (text: string) => void
): Promise<HFResponse> {
  try {
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const stream = hf.chatCompletionStream({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      onChunk(content);
    }

    const inputTokens = Math.ceil(
      messages.reduce((sum, msg) => sum + msg.content.length, 0) / 4
    );
    const outputTokens = Math.ceil(fullContent.length / 4);

    return {
      content: fullContent.trim(),
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
      },
    };
  } catch (error) {
    console.error('Error streaming from Hugging Face API:', error);
    throw new Error('Failed to stream response from AI assistant');
  }
}
