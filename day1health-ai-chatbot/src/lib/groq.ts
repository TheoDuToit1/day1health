// Groq integration (optional - install groq-sdk if needed)
// This file is not currently used. The chatbot uses Hugging Face.
// To use Groq, install: npm install groq-sdk

export function groqNotConfigured() {
  throw new Error('Groq is not configured. Using Hugging Face instead.');
}

// Uncomment below to enable Groq support after installing the package
/*
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './prompts';

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
  };
}

export async function sendToGroq(
  messages: GroqMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<GroqResponse> {
  try {
    const messagesWithSystem: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
    });

    const content = chatCompletion.choices[0]?.message?.content || '';
    const usage = chatCompletion.usage;

    return {
      content,
      tokensUsed: {
        input: usage?.prompt_tokens || 0,
        output: usage?.completion_tokens || 0,
      },
    };
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

export async function streamFromGroq(
  messages: GroqMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
  onChunk: (text: string) => void
): Promise<GroqResponse> {
  try {
    const messagesWithSystem: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const stream = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: true,
    });

    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      onChunk(content);

      if (chunk.x_groq?.usage) {
        inputTokens = chunk.x_groq.usage.prompt_tokens;
        outputTokens = chunk.x_groq.usage.completion_tokens;
      }
    }

    return {
      content: fullContent,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
      },
    };
  } catch (error) {
    console.error('Error streaming from Groq API:', error);
    throw new Error('Failed to stream response from AI assistant');
  }
}
*/
