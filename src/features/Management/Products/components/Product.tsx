import { lazy, Suspense, useState } from 'react';
import { useProduct, ConfirmationModal, useProducts } from '../index';
import { useNavigate, useParams } from 'react-router';
import { useAlert } from '../hooks/useAlert';
import { useProductsContext } from '../context/ProductsContext';
const AlertModal = lazy(() => import('./ui/AlertModal').then(module => ({
  default: module.AlertModal
})));
const UpdateProductForm = lazy(() => import('./UpdateProductForm').then(module => ({
  default: module.UpdateProductForm
})));


export function Product() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { alertModal, showError, showSuccess, closeAlert } = useAlert();

  if(!id){
    return(
      <div className='max-w-4xl mx-auto p-6 text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Product ID is missing</h1>
        <button 
          onClick={() => useNavigate()('/')}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Back
        </button>
      </div>
    );
  }

  const navigate = useNavigate();
  const { refreshProducts, refreshKey } = useProductsContext();
  const { product, loading, error } = useProduct(id, refreshKey);
  const { deleteProduct } = useProducts();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    refreshProducts(); // Forzar actualización del producto
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        refreshProducts(); // Actualizar el contexto
        showSuccess('Deleted', 'Product deleted successfully.', () => {});
        navigate('/'); 
      } else {
        showError('Deletion Failed', result.error || 'Failed to delete product. Please try again.');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Error', 'An error occurred while deleting the product.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='max-w-4xl mx-auto p-6 text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Product not found</h1>
        <button 
          onClick={() => navigate('/')}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='mb-6'>
        <button 
          onClick={() => navigate('/')}
          className='text-blue-500 hover:text-blue-700 mb-4'
        >
          ← Back to Products
        </button>
        
        <div className='bg-white rounded-lg shadow-lg p-6'>

          <div className='flex justify-between items-start mb-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>
                {isEditing ? 'Edit Product' : product.name}
              </h1>
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                product.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

          </div>

          {isEditing ? (
            <Suspense fallback={<div>Loading...</div>}>
              <UpdateProductForm 
                product={product}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            </Suspense>
          ) : (
            <div>
              <div className='mb-6 w-full'>
                {product.image ? (
                  <img 
                    src={product.image.url} 
                    alt={product.name} 
                    fetchPriority='high'
                    loading='eager'
                    className='w-full h-64 object-cover rounded-lg'
                  />
                ) : (
                  <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg'>
                    <span className='text-gray-500'>No Image</span>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold mb-3 text-lg'>Description</h3>
                  <p className='text-gray-700 mb-6 leading-relaxed'>{product.description}</p>
                  
                  <h3 className='font-semibold mb-3 text-lg'>Product Information</h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='text-gray-600'>Price:</span>
                      <span className='font-semibold text-lg'>Q{product.price}</span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='text-gray-600'>Stock:</span>
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <span className='text-gray-600'>Created:</span>
                      <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className='flex justify-between py-2'>
                      <span className='text-gray-600'>Last Updated:</span>
                      <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='font-semibold mb-3 text-lg'>Quick Actions</h3>
                  <div className='space-y-3'>
                    <button 
                      onClick={handleEdit}
                      className='w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      Edit Product
                    </button>
                    <button 
                      onClick={handleDeleteClick}
                      className='w-full px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors'
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Product'
        message={`Are you sure you want to delete '${product?.name}'? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmButtonClass='bg-red-500 hover:bg-red-600'
        isLoading={isDeleting}
      />
      {AlertModal && (
        <Suspense fallback={null}>
          <AlertModal
            isOpen={alertModal.isOpen}
            type={alertModal.type}
            title={alertModal.title}
            message={alertModal.message}
            onConfirm={closeAlert}
          />
        </Suspense>
      )}
    </div>
  );
}