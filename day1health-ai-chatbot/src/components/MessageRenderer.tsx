import React from 'react';
import { 
  StructuredMessage, 
  CarouselContent, 
  ComparisonContent, 
  CardContent, 
  QuickRepliesContent, 
  ListContent, 
  ProgressContent,
  TextContent 
} from '../types/messageTypes';
import PlanCarousel from './PlanCarousel';
import ComparisonTable from './ComparisonTable';
import PlanCard from './PlanCard';
import QuickReplies from './QuickReplies';
import IconList from './IconList';
import ProgressStepper from './ProgressStepper';
import { formatHTML, hasHTML } from '../utils/htmlFormatter';

interface MessageRendererProps {
  message: StructuredMessage | string;
  onQuickReply?: (reply: string) => void;
  onAction?: (action: string, data?: any) => void;
}

export default function MessageRenderer({ 
  message, 
  onQuickReply,
  onAction 
}: MessageRendererProps) {
  // Handle legacy text-only messages
  if (typeof message === 'string') {
    const hasHTMLContent = hasHTML(message);
    
    if (hasHTMLContent) {
      const formattedHTML = formatHTML(message);
      return (
        <div 
          className="text-sm prose prose-sm max-w-none html-content"
          dangerouslySetInnerHTML={{ __html: formattedHTML }}
        />
      );
    }
    
    return <div className="text-sm whitespace-pre-wrap">{message}</div>;
  }

  // Safety check for structured messages
  if (!message || !message.messageType || !message.content) {
    console.warn('Invalid message structure:', message);
    return (
      <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
        <p className="font-semibold">Unable to display message</p>
        <p className="text-xs mt-1">Message structure: {JSON.stringify(message)}</p>
      </div>
    );
  }

  // Handle structured messages with proper type narrowing
  try {
    switch (message.messageType) {
      case 'carousel':
        return <PlanCarousel data={message.content as CarouselContent} onAction={onAction} />;
        
      case 'comparison':
        return <ComparisonTable data={message.content as ComparisonContent} />;
        
      case 'card':
        return <PlanCard data={message.content as CardContent} onAction={onAction} />;
        
      case 'quick_replies':
        return <QuickReplies data={message.content as QuickRepliesContent} onReply={onQuickReply} />;
        
      case 'list':
        return <IconList data={message.content as ListContent} />;
        
      case 'progress':
        return <ProgressStepper data={message.content as ProgressContent} />;
        
      case 'text':
        const textContent = message.content as TextContent;
        const text = textContent.text || 'No content';
        
        // Check if content contains HTML tags
        const hasHTMLContent = hasHTML(text);
        
        if (hasHTMLContent) {
          // Format and render HTML content safely
          const formattedHTML = formatHTML(text);
          return (
            <div 
              className="text-sm prose prose-sm max-w-none html-content"
              dangerouslySetInnerHTML={{ __html: formattedHTML }}
            />
          );
        }
        
        // Plain text fallback
        return (
          <div className="text-sm whitespace-pre-wrap">
            {text}
          </div>
        );
        
      default:
        console.warn('Unknown message type:', message.messageType);
        return <div className="text-sm">Unable to display message</div>;
    }
  } catch (error) {
    console.error('Error rendering message:', error, message);
    return <div className="text-sm text-red-500">Error displaying message</div>;
  }
}
