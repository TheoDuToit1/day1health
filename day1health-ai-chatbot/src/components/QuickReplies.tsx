import React from 'react';
import { QuickRepliesContent } from '../types/messageTypes';

interface QuickRepliesProps {
  data: QuickRepliesContent;
  onReply?: (reply: string) => void;
}

export default function QuickReplies({ data, onReply }: QuickRepliesProps) {
  // Safety check
  if (!data || !data.quickReplies || data.quickReplies.length === 0) {
    return null;
  }

  // Check if text contains HTML
  const hasHTML = /<[^>]+>/.test(data.text);

  return (
    <div className="space-y-3">
      {data.text && (
        hasHTML ? (
          <div 
            className="text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        ) : (
          <p className="text-sm">{data.text}</p>
        )
      )}
      <div className="flex flex-wrap gap-2">
        {data.quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => onReply?.(reply)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}
