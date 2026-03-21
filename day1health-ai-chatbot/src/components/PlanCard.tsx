import React from 'react';
import { CardContent } from '../types/messageTypes';

interface PlanCardProps {
  data: CardContent;
  onAction?: (action: string, data?: any) => void;
}

export default function PlanCard({ data, onAction }: PlanCardProps) {
  // Safety check
  if (!data) {
    return null;
  }

  // Support both new and legacy formats
  const isLegacyFormat = !!data.plan;
  
  if (isLegacyFormat && data.plan) {
    // Legacy format
    const { plan } = data;
    return (
      <div 
        className="rounded-xl p-5 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${plan.color}22, ${plan.color}44)`,
          borderLeft: `4px solid ${plan.color}`
        }}
      >
        <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
        {plan.tagline && (
          <p className="text-sm text-gray-600 mb-3">{plan.tagline}</p>
        )}
        
        <div className="text-2xl font-bold mb-4" style={{ color: plan.color }}>
          {plan.price}
        </div>

        {plan.benefits && plan.benefits.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Benefits:</p>
            <ul className="space-y-2">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.limitations && plan.limitations.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Important to know:</p>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-orange-500 mt-0.5">⚠</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.buttons && plan.buttons.length > 0 && (
          <div className="flex gap-2 mt-4">
            {plan.buttons.map((button, idx) => (
              <button
                key={idx}
                onClick={() => onAction?.(button.action, { plan: plan.name })}
                className="flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                style={{
                  backgroundColor: idx === 0 ? plan.color : 'transparent',
                  color: idx === 0 ? 'white' : plan.color,
                  border: `2px solid ${plan.color}`
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // New format with richer content
  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${data.color}11, ${data.color}22)`,
        borderLeft: `4px solid ${data.color}`
      }}
    >
      {/* Image Header */}
      {data.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={data.image_url} 
            alt={data.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-xl mb-1">{data.title}</h3>
            {data.subtitle && (
              <p className="text-sm opacity-90">{data.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title (if no image) */}
        {!data.image_url && (
          <>
            <h3 className="font-bold text-xl mb-1" style={{ color: data.color }}>
              {data.title}
            </h3>
            {data.subtitle && (
              <p className="text-sm text-gray-600 mb-3">{data.subtitle}</p>
            )}
          </>
        )}

        {/* Price */}
        {data.price && (
          <div 
            className="text-2xl font-bold mb-4 pb-3 border-b"
            style={{ color: data.color, borderColor: `${data.color}33` }}
          >
            {data.price}
          </div>
        )}

        {/* Text Content */}
        {data.text && data.text.length > 0 && (
          <div className="space-y-3 mb-4">
            {data.text.map((paragraph, idx) => {
              // Check if paragraph contains markdown-style bold
              if (paragraph.includes('**')) {
                // Parse markdown bold (**text**)
                const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={idx} className="text-sm leading-relaxed">
                    {parts.map((part, partIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={partIdx} className="font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return <span key={partIdx}>{part}</span>;
                    })}
                  </p>
                );
              }
              
              // Check if it's a bullet point
              if (paragraph.trim().startsWith('-')) {
                return (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{paragraph.replace(/^-\s*/, '')}</span>
                  </div>
                );
              }
              
              // Regular paragraph
              return (
                <p key={idx} className="text-sm leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        {data.buttons && data.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {data.buttons.map((button, idx) => (
              <button
                key={idx}
                onClick={() => onAction?.(button.payload, { 
                  title: data.title,
                  type: button.type 
                })}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: idx === 0 ? data.color : 'transparent',
                  color: idx === 0 ? 'white' : data.color,
                  border: `2px solid ${data.color}`
                }}
              >
                {button.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
