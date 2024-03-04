import React, { useEffect, useState } from 'react'
import Styles from "../../../../css/home/layout/Products/ProductCard.module.css"
import { FaStar } from "react-icons/fa";
import { useSelector } from 'react-redux';


export default function ProductCard({ product }: any) {
  const user = useSelector((state: any) => state.user.user);
  

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
          {
            user.cart.cartItems.some((cartItem: any) => cartItem.id === product.id) ?
              <div className={Styles.purchaseInQuantityContainer}>
                <button className={Styles.addToCartButton} style={{inlineSize: "35px"}}> - </button>
                  <p>{user.cart.cartItems[0].quantity}</p>
                <button className={Styles.addToCartButton} style={{inlineSize: "35px"}}> + </button>
              </div>
              :
              <button className={Styles.addToCartButton}>Add To Cart</button>
          }
        </div>
      </div>
    </div>
  )
}
