import { TaskSectionProps } from '@/types';
import { ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { OpeningTasks, ClosingTasks } from '@/types';

export const TaskSection = ({
  title,
  tasks,
  category,
  icon: Icon,
  sectionKey,
  color,
  isExpanded,
  onToggle,
  onTaskChange,
  getTaskLabel,
}: TaskSectionProps) => {
  const calculateProgress = (
    tasks: OpeningTasks | ClosingTasks | Record<string, boolean>
  ) => {
    const completed = Object.values(tasks).filter(Boolean).length;
    const total = Object.values(tasks).length;
    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress(tasks);

  return (
    <div className='bg-white rounded-2xl shadow-md border mb-4'>
      <div className='p-4 cursor-pointer' onClick={() => onToggle(sectionKey)}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
            >
              <Icon className='w-5 h-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-800 text-lg'>{title}</h3>
              <p className='text-sm text-gray-600'>{progress}% Complete</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className={`h-full transition-all duration-300 ${
                  progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isExpanded ? (
              <ChevronUp className='w-5 h-5 text-gray-400' />
            ) : (
              <ChevronDown className='w-5 h-5 text-gray-400' />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='px-4 pb-4'>
          <div className='space-y-3'>
            {Object.entries(tasks).map(([key, checked]) => (
              <label
                key={key}
                className='flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer border'
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={(e) =>
                    onTaskChange(category, key, e.target.checked)
                  }
                  className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                />
                <span
                  className={`text-base flex-1 ${
                    checked ? 'text-gray-500 line-through' : 'text-gray-800'
                  }`}
                >
                  {getTaskLabel(key)}
                </span>
                {checked && <CheckCircle2 className='w-5 h-5 text-green-500' />}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
