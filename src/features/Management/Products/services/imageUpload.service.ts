import type { ImageUploadResponse } from '../types/image.dto.types';
const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(image: File) {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch(`${API_URL}/Image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Image upload failed');
    }
    const data: ImageUploadResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}