import type { ResponseProductDto } from "../../index";

interface CardProps {
  product: ResponseProductDto;
  handleCardClick: () => void;
}

export function Card({ product, handleCardClick }: CardProps) {
  return (
    <div 
      key={product.id}
      className='border rounded-lg p-4 mx-2 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer bg-white' 
      onClick={() => handleCardClick && handleCardClick()}
    >
      <div>
      {product.image ? (
        <img 
          src={product.image.url}
          alt={product.name}
          className='w-full h-48 object-cover rounded mb-4'
        />
      ): (
        <div className='w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4'>
          <span className='text-gray-500'>No Image</span>
        </div>
      )}
      </div>
      <div className='flex justify-between items-start mb-2'>
        <h3 className='font-semibold text-lg'>{product.name}</h3>
        <span className={`px-2 py-1 rounded text-xs ${
          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <p className='text-gray-600 mb-2'>{product.description}</p>
      <div className='flex justify-between items-center'>
        <span className='font-bold text-xl'>${product.price}</span>
        <span className='text-sm text-gray-500'>Stock: {product.stock}</span>
      </div>
      <div className='mt-2 text-xs text-gray-400'>
        Created: {new Date(product.createdAt).toLocaleDateString()}
      </div>
      <div>
        <h4>Actions</h4>
        <div>
          <button className='text-blue-500 hover:underline'>Edit</button>
          <button className='text-red-500 hover:underline'>Delete</button>
        </div>
      </div>
    </div>
  );
}