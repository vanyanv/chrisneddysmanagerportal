import { ChecklistHeaderProps } from '@/types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ChecklistHeader = ({
  overallProgress,
  showSetupWarning = false,
  title = 'Daily Checklist',
}: ChecklistHeaderProps) => {
  return (
    <div className='bg-white shadow-sm border-b sticky top-0 z-10'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <CheckCircle2 className='w-8 h-8 text-blue-600' />
            <h1 className='text-xl font-bold text-gray-800'>{title}</h1>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-16 h-3 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-blue-600 transition-all duration-300'
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {overallProgress}%
            </span>
          </div>
        </div>

        {showSetupWarning && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-4 h-4 text-yellow-600' />
              <span className='text-xs text-yellow-800'>
                Setup required for online saving
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistHeader;
