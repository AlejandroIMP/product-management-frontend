export { ProductsList } from './components/ProductsList'
export { Card } from './components/ui/Card'
export { SkeletonCard } from './components/ui/SkeletonCard'
export { ConfirmationModal } from './components/ui/ConfirmationModal'
export { AlertModal } from './components/ui/AlertModal'
export type { AlertType } from './components/ui/AlertModal'
export { UpdateProductForm } from './components/UpdateProductForm'
export { getProducts, getProductById, updateProduct, deleteProduct, createProduct } from './services/product.service'
export { useProducts } from './hooks/useProducts'
export { useProduct } from './hooks/useProduct'
export { useAlert } from './hooks/useAlert'
export type * from './types/product.types'
export type * from './types/product.dto.types'
export type * from './types/image.dto.types'
export { uploadImage } from './services/imageUpload.service'
export { useUploadImage } from './hooks/useUploadImage'
export { 
  addProductSchema, 
  updateProductSchema, 
  validateAddProduct, 
  validateUpdateProduct 
} from './validation/product.validation'
export type { AddProductFormData, UpdateProductFormData } from './validation/product.validation'