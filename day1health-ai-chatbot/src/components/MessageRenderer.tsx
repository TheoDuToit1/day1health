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
    return <div className="text-sm whitespace-pre-wrap">{message}</div>;
  }

  // Safety check for structured messages
  if (!message || !message.messageType || !message.content) {
    console.warn('Invalid message structure:', message);
    return <div className="text-sm text-red-500">Unable to display message</div>;
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
        return (
          <div className="text-sm whitespace-pre-wrap">
            {textContent.text || 'No content'}
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
