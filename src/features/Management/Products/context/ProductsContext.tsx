import React, { createContext, useContext, useState } from 'react';

interface ProductsContextType {
  refreshProducts: () => void;
  refreshKey: number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshProducts = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ProductsContext.Provider value={{ refreshProducts, refreshKey }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within ProductsProvider');
  }
  return context;
};