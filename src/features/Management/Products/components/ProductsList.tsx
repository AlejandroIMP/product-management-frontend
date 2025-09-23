import { useState } from 'react';
import { useProducts } from '../index';
import { Card, SkeletonCard } from '../index';
import { useNavigate } from 'react-router';
import { CreateProductModal } from './CreateProductModal';

export function ProductsList() {
  const { products, loading, error, handleRetry } = useProducts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };


  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className='col-span-1 md:col-span-2 lg:col-span-3'>
        <p className='text-red-500 text-center'>
          {error}
        </p>
        <div className='flex justify-center'>
          <button onClick={handleRetry} className='mt-4 px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 lg:px-16 lg:py-4 lg:text-lg'>
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      {/* Header con botón de crear */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          + Create Product
        </button>
      </div>

      {/* Lista de productos */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {products.map((product) => (
          <div key={product.id} onClick={() => handleCardClick(product.id)}>
            <Card product={product} 
              handleCardClick={() => handleCardClick && handleCardClick(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Modal de crear */}
      <CreateProductModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
    
  );
}