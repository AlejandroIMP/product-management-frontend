import type { imageDto } from "./image.dto.types";

export interface AddProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive?: boolean;
  imageId?: string;
  image?: File;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
  imageId?: string;
  image?: File;
}

export interface ResponseProductDto{
    id: string
    name: string
    description: string
    price: number
    stock: number
    ImageId: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    image: imageDto
}