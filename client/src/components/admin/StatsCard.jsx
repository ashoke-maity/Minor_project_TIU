import React from 'react'
import { calculateTrendPercentage, cn } from '../lib/utils'

const StatsCard = ({ 
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount
}) => {

  const { trend, percentage } = calculateTrendPercentage(currentMonthCount, lastMonthCount);
  
  const isDecrement = trend === 'decrement';

  return (
    <article className='stats-card bg-white p-3 sm:p-4 lg:p-5 rounded-lg shadow-sm'>
      <h3 className='text-sm lg:text-base font-medium text-gray-700'>{headerTitle}</h3>

      <div className="content flex justify-between items-center mt-3">
        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className='text-xl lg:text-2xl font-semibold'>{total.toLocaleString()}</h2>
          
          <div className="flex items-center gap-1 lg:gap-2">
            <figure className='flex items-center gap-1'>
              <img 
                src={`/icons/${isDecrement 
                ? 'arrow-down-red.svg' 
                : 'arrow-up-green.svg'}`} 
                className='size-4 lg:size-5' 
                alt='arrow' 
              />
              <figcaption className={cn('text-xs lg:text-sm font-medium', isDecrement ? 'text-red-500' : 'text-success-700')}>
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className='text-xs lg:text-sm font-medium text-gray-500 truncate'>vs last month</p>
          </div>
        </div>

        <img 
          src={`/icons/${isDecrement ? 'decrement.svg' : 'increment.svg'}` }
          className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24' 
          alt='trend graph'
        />
      </div>
    </article>
  )
}

export default StatsCard