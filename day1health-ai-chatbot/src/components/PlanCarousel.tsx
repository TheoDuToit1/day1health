import React from 'react';
import { CarouselContent } from '../types/messageTypes';

interface PlanCarouselProps {
  data: CarouselContent;
  onAction?: (action: string, data?: any) => void;
}

export default function PlanCarousel({ data, onAction }: PlanCarouselProps) {
  // Safety check
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {data.title && (
        <p className="font-semibold text-sm mb-2">{data.title}</p>
      )}
      
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
        {data.items.map((plan, idx) => (
          <div
            key={idx}
            className="min-w-[260px] rounded-xl p-4 snap-center shadow-md flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${plan.color}22, ${plan.color}44)`,
              borderLeft: `4px solid ${plan.color}`
            }}
          >
            <h3 className="font-bold text-base mb-1">{plan.planName}</h3>
            <p 
              className="text-xl font-bold mb-3" 
              style={{ color: plan.color }}
            >
              {plan.price}
            </p>
            
            <ul className="space-y-2 mb-3">
              {plan.highlights.map((highlight, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {plan.cta && (
              <button
                onClick={() => onAction?.('view_plan', { plan: plan.planName })}
                className="w-full py-2 px-3 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: plan.color }}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {data.actionButtons && data.actionButtons.length > 0 && (
        <div className="flex gap-2 mt-3">
          {data.actionButtons.map((button, idx) => (
            <button
              key={idx}
              onClick={() => onAction?.(button.toLowerCase().replace(/\s+/g, '_'))}
              className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {button}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
