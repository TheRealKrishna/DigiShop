import Styles from "../../../../css/home/layout/Products/Products.module.css"
import ProductCard from './ProductCard';
import { useSelector } from 'react-redux';
export default function Products() {
  const products = useSelector((state: any) => state.products.products);

  return (
    <section className={Styles.productsSection}>
      <div className={Styles.products}>
        {
          products.map((product: any) => {
            return (<ProductCard key={product.id} product={product} />)
          })
        }
      </div>
    </section>
  )
}
