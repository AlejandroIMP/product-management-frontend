export function SkeletonCard() {
  return (
    <div className='border rounded-lg p-4 shadow-sm animate-pulse'>
      <div className='flex justify-between items-start mb-2'>
        <div className='h-6 bg-gray-200 rounded w-3/4'></div>
        <div className='h-5 bg-gray-200 rounded w-16'></div>
      </div>
      <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
      <div className='flex justify-between items-center'>
        <div className='h-6 bg-gray-200 rounded w-20'></div>
        <div className='h-4 bg-gray-200 rounded w-16'></div>
      </div>
      <div className='mt-2 h-3 bg-gray-200 rounded w-24'></div>
    </div>
  );
}