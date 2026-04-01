import React from 'react';
import { ComparisonContent } from '../types/messageTypes';

interface ComparisonTableProps {
  data: ComparisonContent;
}

export default function ComparisonTable({ data }: ComparisonTableProps) {
  // Safety check
  if (!data || !data.plans || data.plans.length === 0) {
    return null;
  }

  // Get all unique keys from all plans
  const allKeys = Array.from(
    new Set(
      data.plans.flatMap(plan => 
        Object.keys(plan).filter(key => key !== 'name')
      )
    )
  );

  const hasHTML = (text: string) => /<[^>]+>/.test(text);

  return (
    <div className="w-full overflow-x-auto">
      {data.title && (
        <h3 className="font-bold text-base mb-3">{data.title}</h3>
      )}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left font-semibold">
              Feature
            </th>
            {data.plans.map((plan, idx) => (
              <th 
                key={idx} 
                className="border border-gray-300 p-2 text-center font-semibold"
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allKeys.map((key, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-2 font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </td>
              {data.plans.map((plan, planIdx) => {
                const value = plan[key] || '-';
                return (
                  <td 
                    key={planIdx} 
                    className="border border-gray-300 p-2 text-center"
                  >
                    {hasHTML(value) ? (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: value }}
                      />
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
