import { PrepSectionProps } from '@/types';
import { CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
export const PrepSection = ({
  title,
  sectionKey,
  color,
  prepQuantities,
  onPrepQuantityChange,
  isExpanded,
  onToggle,
  getTaskLabel,
  prepItems = [
    'meat',
    'sauceBatches',
    'sauceBottles',
    'onions',
    'tomato',
    'lettuce',
    'yellowChiles',
    'pickles',
  ],
}: PrepSectionProps) => {
  // Calculate completion based on filled quantities
  const completedItems = prepItems.filter(
    (item) => prepQuantities[item] && prepQuantities[item] !== 0
  ).length;
  const progress = Math.round((completedItems / prepItems.length) * 100);

  return (
    <div className='bg-white rounded-2xl shadow-md border mb-4 '>
      <div className='p-4 cursor-pointer' onClick={() => onToggle(sectionKey)}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
            >
              <CheckCircle2 className='w-5 h-5 text-white' />
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
            {prepItems.map((item) => {
              const hasValue =
                prepQuantities[item] && prepQuantities[item] !== 0;
              return (
                <div
                  key={item}
                  className='flex items-center gap-4 p-3 rounded-xl border'
                >
                  <div className='flex-1 text-black'>
                    <label className='block text-base font-medium text-gray-800 mb-1'>
                      {getTaskLabel(item)}
                    </label>
                    <input
                      type='number'
                      value={prepQuantities[item]}
                      onChange={(e) =>
                        onPrepQuantityChange(item, e.target.value)
                      }
                      placeholder='Enter quantity/amount'
                      className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
                    />
                  </div>
                  {hasValue && (
                    <CheckCircle2 className='w-5 h-5 text-green-500' />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
