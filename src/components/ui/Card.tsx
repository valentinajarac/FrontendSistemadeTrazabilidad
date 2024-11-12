import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    type: 'increase' | 'decrease';
  };
  loading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          )}
        </div>
        {Icon && <Icon className="h-8 w-8 text-gray-400" />}
      </div>

      {trend && !loading && (
        <div className="mt-4">
          <div
            className={`inline-flex items-center text-sm font-medium
              ${trend.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.type === 'increase' ? '↑' : '↓'} {trend.value}%
            <span className="ml-2 text-gray-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};