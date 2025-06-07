import { BasicInfoFormProps } from '@/types';

const BasicInfoForm = ({
  formData,
  onInputChange,
  showTilFields = true,
  shiftOptions = ['opening', 'closing'],
}: BasicInfoFormProps) => {
  return (
    <div className='space-y-3 text-black'>
      <div className='grid grid-cols-2 gap-3 '>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Date
          </label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Shift Type
          </label>
          <select
            value={formData.shift}
            onChange={(e) => onInputChange('shift', e.target.value)}
            className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
          >
            {shiftOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Manager Name
        </label>
        <input
          type='text'
          value={formData.managerName}
          onChange={(e) => onInputChange('managerName', e.target.value)}
          placeholder='Enter your name'
          className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
        />
      </div>

      {showTilFields && (
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Starting Til (w/ Coins)
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                $
              </span>
              <input
                type='number'
                step='0.01'
                min='0'
                value={formData.startingTil}
                onChange={(e) => onInputChange('startingTil', e.target.value)}
                placeholder='0.00'
                className='w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Ending Til (w/ Coins)
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                $
              </span>
              <input
                type='number'
                step='0.01'
                min='0'
                value={formData.endingTil}
                onChange={(e) => onInputChange('endingTil', e.target.value)}
                placeholder='0.00'
                className='w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
              />
            </div>
          </div>
        </div>
      )}

      {/* Simple til difference */}
      {showTilFields && formData.startingTil > 0 && formData.endingTil > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-blue-800'>
              Til Difference:
            </span>
            <span
              className={`text-sm font-bold ${
                formData.endingTil >= formData.startingTil
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ${(formData.endingTil - formData.startingTil).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
