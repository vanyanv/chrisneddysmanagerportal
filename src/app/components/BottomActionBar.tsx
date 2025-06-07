import { BottomActionBarProps } from '@/types';
import { Save, Download } from 'lucide-react';
export const BottomActionBar = ({
  onSave,
  onDownload,
  isLoading = false,
  saveText = 'Save Checklist',
}: BottomActionBarProps) => {
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4'>
      <div className='flex gap-3'>
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-colors ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Save className='w-5 h-5' />
          {isLoading ? 'Saving...' : saveText}
        </button>
        <button
          onClick={onDownload}
          className='flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors'
        >
          <Download className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};
