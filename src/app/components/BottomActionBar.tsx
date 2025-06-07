import { useState, useEffect } from 'react';
import { Save, Download, Loader2 } from 'lucide-react';

interface BottomActionBarProps {
  onSave: () => void;
  onDownload: () => void;
  isLoading: boolean;
  isOnline: boolean;
  isGoogleConfigured: boolean;
  saveText: string;
}

export const BottomActionBar = ({
  onSave,
  onDownload,
  isLoading,
  isOnline,
  isGoogleConfigured,
}: BottomActionBarProps) => {
  // ✅ FIXED: Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ FIXED: Show static text during SSR/hydration
  const getSaveButtonText = () => {
    if (!isMounted) {
      // Static text during SSR - matches what server renders
      return 'Save Checklist';
    }

    // Dynamic text after hydration
    if (!isOnline) {
      return 'Save Offline';
    }

    if (!isGoogleConfigured) {
      return 'Save Locally';
    }

    return 'Save to Sheets';
  };

  // ✅ FIXED: Show static icon during SSR/hydration
  const getSaveIcon = () => {
    if (isLoading) {
      return <Loader2 className='w-4 h-4 animate-spin' />;
    }
    return <Save className='w-4 h-4' />;
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg'>
      <div className='flex gap-3'>
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : isMounted && isOnline && isGoogleConfigured
              ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {getSaveIcon()}
          {getSaveButtonText()}
        </button>

        <button
          onClick={onDownload}
          disabled={isLoading}
          className='flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors'
        >
          <Download className='w-4 h-4' />
          Export
        </button>
      </div>

      {/* ✅ FIXED: Show status message only after mount */}
      {isMounted && (
        <div className='mt-2 text-center'>
          <p className='text-xs text-gray-500'>
            {!isOnline
              ? '📱 Working offline - data saved locally'
              : !isGoogleConfigured
              ? '💾 Saving to browser storage'
              : '☁️ Syncing with Google Sheets'}
          </p>
        </div>
      )}
    </div>
  );
};
