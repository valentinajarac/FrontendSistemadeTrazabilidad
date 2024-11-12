import React from 'react';
import { XCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-800',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-800',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-800',
    icon: Info,
  },
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} ${style.text} border px-4 py-3 rounded relative mb-4`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span className="flex-grow">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-75 focus:outline-none"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};