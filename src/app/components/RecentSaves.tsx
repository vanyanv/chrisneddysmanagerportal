import { RecentSavesProps } from '@/types';

export const RecentSaves = ({ savedChecklists }: RecentSavesProps) => {
  if (!savedChecklists || savedChecklists.length === 0) return null;

  return (
    <div className='bg-white rounded-2xl shadow-md border p-4 mt-4'>
      <h3 className='text-lg font-semibold text-gray-800 mb-3'>Recent Saves</h3>
      <div className='space-y-2'>
        {savedChecklists.slice(0, 3).map((checklist) => (
          <div
            key={checklist.id}
            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
          >
            <div>
              <div className='font-medium text-sm'>{checklist.date}</div>
              <div className='text-xs text-gray-600'>
                {checklist.managerName} - {checklist.shift}
              </div>
            </div>
            <div className='text-xs text-gray-500'>
              {new Date(checklist.savedAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
