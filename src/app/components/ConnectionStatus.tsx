// components/ConnectionStatus.tsx
import React, { useEffect, useState } from 'react';
import { WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isOnline: boolean;
  isGoogleConfigured: boolean;
}

export const ConnectionStatus = ({
  isOnline,
  isGoogleConfigured,
}: ConnectionStatusProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ FIXED: Show neutral state during SSR/hydration
  if (!isMounted) {
    return (
      <div className='flex items-center gap-2 p-3 rounded-lg mb-4 border bg-gray-50 border-gray-200'>
        <div className='w-4 h-4 bg-gray-300 rounded animate-pulse' />
        <span className='text-sm text-gray-600'>Checking connection...</span>
      </div>
    );
  }

  // ✅ Now safe to render dynamic content after mount
  const getStatus = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        className: 'bg-red-50 border-red-200 text-red-700',
        iconClassName: 'text-red-500',
        message: 'Offline - Data will be saved locally',
      };
    }

    if (!isGoogleConfigured) {
      return {
        icon: AlertCircle,
        className: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        iconClassName: 'text-yellow-500',
        message: 'Google Sheets not configured - Using local storage',
      };
    }

    return {
      icon: CheckCircle,
      className: 'bg-green-50 border-green-200 text-green-700',
      iconClassName: 'text-green-500',
      message: 'Connected - Data will sync to Google Sheets',
    };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg mb-4 border ${status.className}`}
    >
      <Icon className={`w-4 h-4 ${status.iconClassName}`} />
      <span className='text-sm font-medium'>{status.message}</span>
    </div>
  );
};
