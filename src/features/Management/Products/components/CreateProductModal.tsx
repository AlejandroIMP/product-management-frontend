import { useRef, useState } from 'react';
import { useProducts, useUploadImage } from '../index';
import type { AddProductDto } from '../index';
import { AlertModal } from './ui/AlertModal';
import { useAlert } from '../hooks/useAlert';
import { addProductSchema, validateAddProduct } from '../validation/product.validation';
import { useProductsContext } from '../context/ProductsContext';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const { createProduct, loading } = useProducts();
  const { upload, error } = useUploadImage();
  const { alertModal, showWarning, showError, showSuccess, closeAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { refreshProducts } = useProductsContext();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState<AddProductDto>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
    imageId: undefined
  });


  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});


  const validateField = (fieldName: string, value: unknown) => {
    try {
      const fieldSchema = addProductSchema.shape[fieldName as keyof typeof addProductSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);

        setValidationErrors(prev => {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        });
        return true;
      }
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: error.errors[0].message
        }));
      }
      return false;
    }
    return true;
  };


  const validateForm = () => {
    const result = validateAddProduct(formData);
    
    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setValidationErrors(errors);
      return false;
    }
    
    setValidationErrors({});
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      
      if (!file.type.startsWith('image/')) {
        showWarning('Invalid File Type', 'Please select a valid image file.');
        return;
      }
      
      if (file.size > 4 * 1024 * 1024) {
        showWarning('File Too Large', 'Image size should be less than 4MB.');
        return;
      }

      setFormData({ ...formData, image: file });
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: undefined });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, stock: 0, isActive: true, imageId: undefined });
    setImagePreview(null);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form before submitting.');
      return;
    }

    let imageId: string | undefined = undefined;
    if (formData.image) {
      try {
        const response = await upload(formData.image);
        
        if (response?.imageId) {
          imageId = response.imageId;
        } else {
          showError('Upload Failed', `Error uploading image: ${error || 'Unknown error'}. Please try again.`);
          setIsDisabled(false);
          return; 
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setIsDisabled(false);
        showError('Upload Failed', `Error uploading image: ${error || 'Unknown error'}. Please try again.`);
        return;
      }
    }
    

    const formDataToSubmit: AddProductDto = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      isActive: formData.isActive,
      imageId: imageId,
    };


    try {
      const result = await createProduct(formDataToSubmit);
      if (result?.success) {
        showSuccess('Success', 'Product created successfully. List will update automatically.', () => {
          refreshProducts();
          onClose();
          resetForm();
          setIsDisabled(false);
        });
      } else {
        showError('Creation Failed', result?.error || 'Failed to create product. Please try again.');
        setIsDisabled(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showError('Error', 'An error occurred while creating the product.');
    } 
  };

  if (!isOpen) return null;

    return (
    <>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Create New Product</h2>
            <button 
              onClick={onClose}
              className='text-gray-600 hover:text-gray-700'
              disabled={loading}
            >
              ✕
            </button>
          </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Product Image</label>
            <div className='space-y-2'>
              {imagePreview ? (
                <div className='relative'>
                  <img 
                    src={imagePreview} 
                    alt='Preview' 
                    className='w-full h-32 object-cover rounded-lg border-2 border-dashed border-gray-300'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <div className='text-gray-400 mb-2'>
                    <svg className='mx-auto h-12 w-12' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                      <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>Click to upload product image</p>
                  <p className='text-xs text-gray-400'>PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input
              type='text'
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData({ ...formData, name: newValue });
                validateField('name', newValue);
              }}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                validationErrors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Description</label>
            <textarea
              required
              maxLength={255}
              value={formData.description}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData({ ...formData, description: newValue });
                validateField('description', newValue);
              }}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 h-20 ${
                validationErrors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">{formData.description.length}/255 characters</p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Price</label>
              <input
                type='number'
                required
                min='0.01'
                step='0.01'
                value={formData.price || ''}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, price: newValue });
                  validateField('price', newValue);
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  validationErrors.price 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Stock</label>
              <input
                type='number'
                required
                min='0'
                value={formData.stock || ''}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, stock: newValue });
                  validateField('stock', newValue);
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  validationErrors.stock 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {validationErrors.stock && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.stock}</p>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isActive'
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className='mr-2'
            />
            <label htmlFor='isActive' className='text-sm font-medium'>Active Product</label>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={() => {
                onClose();
                resetForm();
              }}
              disabled={loading}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isDisabled}
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
            >
              {isDisabled ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={closeAlert}
      />
    </>
  );
}