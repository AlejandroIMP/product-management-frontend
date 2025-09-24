import { Product } from '../../features/Management/Products/components/Product'
import { Layout } from '../../Layouts/layout'
import { ProductsProvider } from '../../features/Management/Products/context/ProductsContext'

function ProductDetail() {
  return (
    <Layout>
      <ProductsProvider>
        <Product />
      </ProductsProvider>
    </Layout>
  )
}

export default ProductDetail