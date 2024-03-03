import React, { useState } from 'react'
import Styles from "../../../../css/home/layout/Products/ProductCard.module.css"
import { FaStar } from "react-icons/fa";


export default function ProductCard({ product }: any) {
  return (
    <div className={Styles.productCard}>
      <div>
        <div className={Styles.productImageContainer}>
          <img src={product.thumbnail} alt="productThumbnail" />
        </div>
        <h3 className={Styles.productTitle}>{product.title}</h3>
        <div className={Styles.ratingContainer}>
          {
            product.rating &&
            <>
              <FaStar style={{ color: "#ffcf00" }} />
              <p>{product.rating.toFixed(1)}</p>
            </>
          }
        </div>
      </div>
      <div className={Styles.product}>
        <div className={Styles.productInfo}>
          <div className={Styles.priceContainer}>
            <h5>₹{product.discountedPrice}</h5>
            <p>M.R.P: <del>₹{product.price}</del></p>
          </div>
        </div>
        <div className={Styles.purchaseContainer}>
          <button className={Styles.addToCartButton}>Add To Cart</button>
        </div>
      </div>
    </div>
  )
}
