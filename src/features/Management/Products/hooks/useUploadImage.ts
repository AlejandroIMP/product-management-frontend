import { uploadImage } from '../index';
import { useState } from 'react';

export function useUploadImage() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const response = await uploadImage(file);
      return response;
    } catch (err) {
      setError('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  return { upload, uploading, error };
}