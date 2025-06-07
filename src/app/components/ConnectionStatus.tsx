// components/ConnectionStatus.tsx
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isOnline: boolean;
  isGoogleConfigured: boolean;
}

export const ConnectionStatus = ({
  isOnline,
  isGoogleConfigured,
}: ConnectionStatusProps) => {
  const getStatusMessage = () => {
    if (isOnline && isGoogleConfigured) {
      return 'Connected - Saving to Google Sheets';
    }
    if (isOnline && !isGoogleConfigured) {
      return 'Online - Saving locally (Google Sheets not configured)';
    }
    return 'Offline - Will save locally';
  };

  const getStatusColor = () => {
    if (isOnline && isGoogleConfigured) {
      return 'bg-green-50 border-green-200 text-green-800';
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg mb-4 border ${getStatusColor()}`}
    >
      {isOnline ? (
        <Wifi className='w-4 h-4' />
      ) : (
        <WifiOff className='w-4 h-4' />
      )}
      <span className='text-sm font-medium'>{getStatusMessage()}</span>
    </div>
  );
};
