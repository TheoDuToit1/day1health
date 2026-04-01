// Next.js API route for chat - Using Hugging Face (FREE!)
import { NextApiRequest, NextApiResponse } from 'next';
import { sendToHuggingFace, HFMessage } from '../../src/lib/huggingface';

// In-memory storage for testing
const conversations = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, message, context } = req.body;

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }

    const history = conversations.get(sessionId);

    // Build messages from history
    const hfMessages: HFMessage[] = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add current message
    let currentMessage = message;
    if (context?.currentPage) {
      currentMessage += `\n\n[Context: User is on page: ${context.currentPage}]`;
    }

    hfMessages.push({ role: 'user', content: currentMessage });

    // Get response from Hugging Face
    const hfResponse = await sendToHuggingFace(hfMessages);

    // Parse structured JSON response
    let structuredResponse;
    try {
      // Try to extract JSON from response (handle markdown code blocks)
      let jsonContent = hfResponse.content.trim();
      
      console.log('Raw AI response:', jsonContent); // Debug log
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/g, '');
      }
      
      // Try to find JSON in the response
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      console.log('Cleaned JSON:', jsonContent); // Debug log
      
      structuredResponse = JSON.parse(jsonContent);
      
      // Validate it has required fields
      if (!structuredResponse.messageType || !structuredResponse.content) {
        throw new Error('Invalid message structure');
      }
      
      console.log('Parsed structured response:', structuredResponse); // Debug log
    } catch (parseError) {
      console.warn('Failed to parse structured response:', parseError);
      console.warn('Original content:', hfResponse.content);
      
      // Fallback to plain text format
      structuredResponse = {
        messageType: 'text',
        content: {
          text: hfResponse.content
        }
      };
    }

    // Store in history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: hfResponse.content });

    // Keep only last 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    return res.status(200).json({
      reply: structuredResponse,
      suggestions: ['Tell me more', 'Compare plans', 'Get a quote'],
      metadata: {
        tokensUsed: hfResponse.tokensUsed,
        sessionId: sessionId,
        model: 'Qwen2.5-72B-Instruct (via Hugging Face)',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
