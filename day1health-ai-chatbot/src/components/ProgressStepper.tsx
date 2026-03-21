import React from 'react';
import { ProgressContent } from '../types/messageTypes';

interface ProgressStepperProps {
  data: ProgressContent;
}

export default function ProgressStepper({ data }: ProgressStepperProps) {
  // Safety check
  if (!data || !data.steps || data.steps.length === 0) {
    return null;
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-700';
      case 'active': return 'text-blue-700 font-semibold';
      case 'pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Step {data.currentStep} of {data.totalSteps}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round((data.currentStep / data.totalSteps) * 100)}% complete
        </span>
      </div>
      
      <div className="space-y-4">
        {data.steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getStepColor(step.status)}`}
            >
              {step.status === 'complete' ? '✓' : idx + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${getTextColor(step.status)}`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
