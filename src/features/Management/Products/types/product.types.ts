import type { imageDto } from './image.dto.types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  image?: imageDto;
}