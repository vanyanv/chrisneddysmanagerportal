import { NotesSectionProps } from '@/types';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

export const NotesSection = ({
  notes,
  issues,
  onNotesChange,
  onIssuesChange,
  isExpanded,
  onToggle,
  sectionKey = 'notes',
}: NotesSectionProps) => {
  return (
    <div className='bg-white rounded-2xl shadow-md border'>
      <div className='p-4 cursor-pointer' onClick={() => onToggle(sectionKey)}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center'>
              <AlertCircle className='w-5 h-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-800 text-lg'>
                Notes & Issues
              </h3>
              <p className='text-sm text-gray-600'>Add any comments</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className='w-5 h-5 text-gray-400' />
          ) : (
            <ChevronDown className='w-5 h-5 text-gray-400' />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className='px-4 pb-4'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                General Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder='Any notes for today...'
                rows={3}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Issues to Address
              </label>
              <textarea
                value={issues}
                onChange={(e) => onIssuesChange(e.target.value)}
                placeholder='Any issues that need attention...'
                rows={3}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
