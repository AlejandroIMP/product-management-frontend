import { useRef, useState, useEffect } from 'react';
import { useProducts, useUploadImage } from '../index';
import type { UpdateProductDto, ResponseProductDto } from '../index';
import { AlertModal } from './ui/AlertModal';
import { useAlert } from '../hooks/useAlert';
import { updateProductSchema, validateUpdateProduct } from '../validation/product.validation';

interface UpdateProductFormProps {
  product: ResponseProductDto;
  onCancel: () => void;
  onSave: () => void;
}

export function UpdateProductForm({ product, onCancel, onSave }: UpdateProductFormProps) {
  const { updateProduct, loading } = useProducts();
  const { upload, error } = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { alertModal, showError, showSuccess, closeAlert } = useAlert();
  const [formData, setFormData] = useState<UpdateProductDto>({
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
      const fieldSchema = updateProductSchema.shape[fieldName as keyof typeof updateProductSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
    
        setValidationErrors(prev => {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        });
        return true;
      }
    } catch (error: any) {
      if (error.issues && error.issues[0]) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: error.issues[0].message
        }));
      }
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const result = validateUpdateProduct(formData);
    
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

  // Populate form with product data on mount
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        imageId: product.image?.id
      });
      
      // Clear validation errors when loading new product data
      setValidationErrors({});
      
      // Set image preview if product has an image
      if (product.image?.url) {
        setImagePreview(product.image.url);
      }
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Invalid File Type', 'Please select a valid image file.');
        return;
      }
      
      if (file.size > 4 * 1024 * 1024) {
        showError('Invalid File Size', 'Image size should be less than 4MB.');
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
    setFormData({ ...formData, image: undefined, imageId: undefined });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      imageId: product.image?.id
    });
    
    setValidationErrors({});
    
    if (product.image?.url) {
      setImagePreview(product.image.url);
    } else {
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Validation Error', 'Please correct the errors in the form before submitting.');
      return;
    }

    let imageId: string | undefined = formData.imageId;


    if (formData.image) {
      try {
        const response = await upload(formData.image);
        
        if (response?.imageId) {
          imageId = response.imageId;
        } else {
          showError('Error uploading image', error || 'Unknown error. Please try again.');
          return; 
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        showError('Error uploading image', error instanceof Error ? error.message : 'An unknown error occurred. Please try again.');
        return;
      }
    }

    const formDataToSubmit: UpdateProductDto = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      isActive: formData.isActive,
      imageId: imageId,
    };

    try {
      const result = await updateProduct(product.id, formDataToSubmit);
      if (result?.success) {
        showSuccess('Success', 'Product updated successfully.', () => {});
        onSave();
      } else {
        showError('Update Failed', result?.error || 'Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Update Error', 'An error occurred while updating the product.');
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <label className="block text-sm font-medium mb-2">Product Image</label>
        <div className="space-y-2">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">Click to upload or change product image</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 4MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          type="text"
          required
          maxLength={100}
          value={formData.name || ''}
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
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          required
          rows={4}
          maxLength={255}
          value={formData.description || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            setFormData({ ...formData, description: newValue });
            validateField('description', newValue);
          }}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
            validationErrors.description 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">{(formData.description || '').length}/255 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
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
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            required
            min="0"
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

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActiveUpdate"
          checked={formData.isActive || false}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="mr-3 w-4 h-4"
        />
        <label htmlFor="isActiveUpdate" className="text-sm font-medium">Active Product</label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </div>
      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={closeAlert}
      />
    </form>
  );
}