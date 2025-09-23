import { useEffect, useState } from "react";
import type { ResponseProductDto, AddProductDto, UpdateProductDto } from "../index";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../index";

export function useProducts() {
  const [products, setProducts] = useState<ResponseProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: AddProductDto): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const success = await createProduct(product);
      if (success) {
        await fetchProducts();
        return { success: true };
      }
      const errorMessage = "Failed to create product - Server returned false";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create product";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  const editProduct = async (id: string, product: UpdateProductDto): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const success = await updateProduct(id, product);
      
      if (success) {
        await fetchProducts();
        return { success: true };
      } 
      
      const errorMessage = "Failed to update product - Server returned false";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update product";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  const removeProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const success = await deleteProduct(id);
      
      if (success) {
        await fetchProducts();
        return { success: true };
      }
      
      const errorMessage = "Failed to delete product - Server returned false";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  const handleRetry = () => {
    fetchProducts();
  }




  return { 
    products, 
    createProduct: addProduct, 
    updateProduct: editProduct, 
    deleteProduct: removeProduct, 
    loading, 
    error, 
    handleRetry
  };
}
