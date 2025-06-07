import { DuringHoursReminderProps } from '@/types';
import { Clock } from 'lucide-react';
export const DuringHoursReminder = ({
  tasks = [
    'Wipe all tables and counters',
    'Check on the trash',
    'Clean bathroom',
    'Sweep the FOH dining area',
  ],
}: DuringHoursReminderProps) => {
  return (
    <div className='bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center'>
          <Clock className='w-5 h-5 text-white' />
        </div>
        <div>
          <h3 className='font-semibold text-gray-800 text-lg'>
            During Hours of Operation
          </h3>
          <p className='text-sm text-gray-600'>Every 30 Minutes</p>
        </div>
      </div>
      <div className='space-y-2 text-sm text-gray-700'>
        {tasks.map((task, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
            <span>{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
