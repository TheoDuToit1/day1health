// Gemini integration (optional - install @google/generative-ai if needed)
// This file is not currently used. The chatbot uses Hugging Face.
// To use Gemini, install: npm install @google/generative-ai

export function geminiNotConfigured() {
  throw new Error('Gemini is not configured. Using Hugging Face instead.');
}

// Uncomment below to enable Gemini support after installing the package
/*
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
  };
}

export async function sendToGemini(
  messages: GeminiMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
    });

    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const messageWithSystem = `${systemPrompt}\n\nUser: ${lastMessage.parts}`;
    
    const result = await chat.sendMessage(messageWithSystem);
    const response = result.response;
    const text = response.text();

    const inputTokens = Math.ceil(
      messages.reduce((sum, msg) => sum + msg.parts.length, 0) / 4
    );
    const outputTokens = Math.ceil(text.length / 4);

    return {
      content: text,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
      },
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

export async function streamFromGemini(
  messages: GeminiMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
  onChunk: (text: string) => void
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
    });

    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const messageWithSystem = `${systemPrompt}\n\nUser: ${lastMessage.parts}`;
    
    const result = await chat.sendMessageStream(messageWithSystem);

    let fullContent = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullContent += chunkText;
      onChunk(chunkText);
    }

    const inputTokens = Math.ceil(
      messages.reduce((sum, msg) => sum + msg.parts.length, 0) / 4
    );
    const outputTokens = Math.ceil(fullContent.length / 4);

    return {
      content: fullContent,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
      },
    };
  } catch (error) {
    console.error('Error streaming from Gemini API:', error);
    throw new Error('Failed to stream response from AI assistant');
  }
}
*/
