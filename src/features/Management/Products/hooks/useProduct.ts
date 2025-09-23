import { useEffect, useState } from "react";
import type { ResponseProductDto } from "../index";
import { getProductById } from "../index";

export function useProduct(id: string) {
  const [product, setProduct] = useState<ResponseProductDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setProduct(null);

    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch product");
        setLoading(false);
      });
  }
  

  return { product, loading, error, handleRetry };
}
