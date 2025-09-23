import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          validation: ['zod'],
          // Separar features que no son críticas
          modals: [
            'src/features/Management/Products/components/CreateProductModal.tsx',
            'src/features/Management/Products/components/UpdateProductForm.tsx'
          ]
        }
      }
    }
  },
  // Preload crítico
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router',
      'src/features/Management/Products/hooks/useProducts.ts'
    ]
  }
})
