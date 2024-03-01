import React, { useEffect, useMemo, useState } from 'react'
import Styles from "../../../../css/home/layout/Products/Products.module.css"
import ProductCard from './ProductCard';
export default function Products() {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const response: any = await fetch("https://dummyjson.com/products?limit=100");
    const json = await response.json();
    for (let i = json.products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [json.products[i], json.products[j]] = [json.products[j], json.products[i]];
    }

    setProducts(json.products)
  }

  useMemo(() => {
    fetchProducts()
  }, [])

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
