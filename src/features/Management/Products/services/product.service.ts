import type { ResponseProductDto, AddProductDto, UpdateProductDto } from "../index";

const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/Product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ResponseProductDto[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const res = await fetch(`${API_URL}/Product/${id}`);
    const data: ResponseProductDto = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}

export async function createProduct(product: AddProductDto) {
  try {
    const res = await fetch(`${API_URL}/Product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    return res;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, product: UpdateProductDto) {
  try {
    // Si hay imagen nueva, usar FormData; si no, JSON
    if (product.image) {
      const formData = new FormData();
      
      // Append all product fields
      if (product.name) formData.append('name', product.name);
      if (product.description) formData.append('description', product.description);
      if (product.price !== undefined) formData.append('price', product.price.toString());
      if (product.stock !== undefined) formData.append('stock', product.stock.toString());
      if (product.isActive !== undefined) formData.append('isActive', product.isActive.toString());
      
      // Append image
      formData.append('image', product.image);

      const res = await fetch(`${API_URL}/Product/${id}`, {
        method: "PUT",
        body: formData, // No incluir Content-Type header con FormData
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.ok;
    } else {
      // Update without image - use JSON
      const res = await fetch(`${API_URL}/Product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive,
          imageId: product.imageId
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.ok;
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/Product/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.ok;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
