import { useSearchParams } from "react-router-dom";
import Styles from "../../../css/home/layout/Products/Products.module.css"
import ProductCard from '../layout/Products/ProductCard';
import { useSelector } from 'react-redux';
import { useRef } from "react";
export default function Search() {
  const products = useSelector((state: any) => state.products.products);
  const searchQuery = useSearchParams()[0].get("q");
  const resultsFoundOrNot = useRef(false);

  return (
    <section className={Styles.productsSection}>
      <div className={Styles.products}>
        {
          products.map((product: any) => {
            if (product.title.toLowerCase().includes(searchQuery?.toLowerCase()) || product.description.toLowerCase().includes(searchQuery?.toLowerCase())) {
              resultsFoundOrNot.current = true;
              return (<ProductCard key={product.id} product={product} />)
            }
            return null
          })
        }
        {
          !resultsFoundOrNot.current &&
          <div>
            <h5>No Results Found!</h5>
          </div>
        }
      </div>
    </section>
  )
}
