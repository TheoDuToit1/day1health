import React from 'react';
import { ListContent } from '../types/messageTypes';

interface IconListProps {
  data: ListContent;
}

export default function IconList({ data }: IconListProps) {
  // Safety check
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      case 'blue': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const hasHTML = (text: string) => /<[^>]+>/.test(text);

  return (
    <div className="space-y-3">
      {data.title && (
        <h3 className="font-bold text-base">{data.title}</h3>
      )}
      <ul className="space-y-3">
        {data.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {item.icon && (
              <span className="text-xl flex-shrink-0">{item.icon}</span>
            )}
            <div className="flex-1">
              {item.label && (
                <span className={`font-semibold ${getColorClass(item.color)}`}>
                  {item.label}:{' '}
                </span>
              )}
              {hasHTML(item.text) ? (
                <span 
                  className="text-sm prose prose-sm max-w-none inline"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              ) : (
                <span className="text-sm">{item.text}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
