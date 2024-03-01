import React, { useState } from 'react'
import Styles from "../../../../css/home/layout/Products/ProductCard.module.css"
import { FaStar } from "react-icons/fa";


export default function ProductCard({ product }: any) {
  return (
    <div className={Styles.productCard}>
      <div className={Styles.productImageContainer}>
        <img src={product.thumbnail} alt="productThumbnail" />
      </div>
      <div className={Styles.productInfo}>
        <h4>{product.title}</h4>
        <div className={Styles.priceContainer}>
          <h5>₹{product.price * 80}</h5>
          <del>₹{((product.price * 80) + (product.price * (product.discountPercentage / 100) * 80)).toFixed(0).slice(0, -2) + 99}</del>
        </div>
        <div className={Styles.ratingContainer}>
          <FaStar style={{ color: "#ffcf00" }} />
          <p>{product.rating.toFixed(1)}</p>
        </div>
      </div>
    </div>
  )
}
