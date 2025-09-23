import { useRef, useState, useEffect } from 'react';
import { useProducts, useUploadImage } from '../index';
import type { UpdateProductDto, ResponseProductDto } from '../index';

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
  const [formData, setFormData] = useState<UpdateProductDto>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
    imageId: undefined
  });

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
        alert('Please select a valid image file.');
        return;
      }
      
      if (file.size > 4 * 1024 * 1024) {
        alert('Image size should be less than 4MB.');
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
    // Reset form to original product values
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      imageId: product.image?.id
    });
    
    // Reset image preview
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
    let imageId: string | undefined = formData.imageId;

    // Upload new image if provided
    if (formData.image) {
      try {
        const response = await upload(formData.image);
        
        if (response?.imageId) {
          imageId = response.imageId;
        } else {
          alert(`Error uploading image: ${error || 'Unknown error'}. Please try again.`);
          return; 
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Error uploading image: ${error || 'Unknown error'}. Please try again.`);
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
        onSave();
      } else {
        alert(result?.error || 'Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Section */}
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
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          required
          rows={4}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            required
            min="0"
            value={formData.stock || 0}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
    </form>
  );
}