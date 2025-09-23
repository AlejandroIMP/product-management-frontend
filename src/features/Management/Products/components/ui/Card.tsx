import type { ResponseProductDto } from '../../index';

interface CardProps {
  product: ResponseProductDto;
  handleCardClick: () => void;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export function Card({ product, handleCardClick, priority, loading }: CardProps) {
  return (
    <div 
      key={product.id}
      className='group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white backdrop-blur-sm' 
      onClick={() => handleCardClick && handleCardClick()}
    >
      {/* Image Container */}
      <div className='relative overflow-hidden'>
        {product.image ? (
          <img 
            src={product.image.url}
            alt={product.name}
            fetchPriority={priority ? 'high' : 'low'}
            loading={loading}
            className='w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
            <div className='text-center'>
              <svg className='mx-auto h-12 w-12 text-gray-400 mb-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <span className='text-gray-500 font-medium'>No Image</span>
            </div>
          </div>
        )}
        
        <div className='absolute top-4 right-4'>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
            product.isActive 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {product.isActive ? '✓ Active' : '✕ Inactive'}
          </span>
        </div>

        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
      </div>

      <div className='p-6'>
        <div className='mb-3'>
          <h3 className='font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2'>
            {product.name}
          </h3>
        </div>

        <p className='text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed'>
          {product.description}
        </p>

        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-baseline'>
            <span className='text-2xl font-bold text-gray-900'>
              Q{product.price}
            </span>
          </div>
          <div className='text-right'>
            <div className='flex items-center text-sm text-gray-500'>
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
              <span className='font-medium'>{product.stock}</span>
              <span className='ml-1'>in stock</span>
            </div>
          </div>
        </div>

        <div className='pt-4 border-t border-gray-100'>
          <div className='flex items-center text-xs text-gray-400'>
            <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            <span>Created {new Date(product.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
      </div>
    </div>
  );
}