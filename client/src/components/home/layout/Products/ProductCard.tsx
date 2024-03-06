import React, { useEffect, useState } from 'react';
import Styles from "../../../../css/home/layout/Products/ProductCard.module.css";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { UPDATE_CART } from '../../../../graphql/mutations/userMutations';
import { updateCart } from "../../../../redux/slices/userSlice";
import { toast } from 'react-toastify';

export default function ProductCard({ product }: any) {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [updateCartMutation] = useMutation(UPDATE_CART);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);

  const [cartItem, setCartItem] = useState(user.cart.cartItems.find((item: any) => item.product_id === product.id));
  const [isInCart, setIsInCart] = useState(!!cartItem);
  const [cartQuantity, setCartQuantity] = useState(isInCart ? cartItem?.quantity : 0);

  const onCartUpdate = async (quantity: any) => {
    if (quantity > 6) {
      toast.warning("Maximum quantity per product per order is 6", {toastId:"maximumQuantityError", autoClose:3000})
    }
    else {
      dispatch(updateCart({ product, quantity, isInCart }));
      if (isLoggedIn) {
        await updateCartMutation({
          variables: { productId: product.id, quantity }
        });
      }
    }
  };

  useEffect(() => {
    setCartItem(user.cart.cartItems.find((item: any) => item.product_id === product.id))
    setIsInCart(!!cartItem)
    setCartQuantity(isInCart ? cartItem?.quantity : 0)
  }, [cartItem, isInCart, product.id, user])

  return (
    <div className={Styles.productCard}>
      <div>
        <div className={Styles.productImageContainer}>
          <img src={product.thumbnail} alt="" />
        </div>
        <h3 className={Styles.productTitle}>{product.title}</h3>
        <div className={Styles.ratingContainer}>
          {product.rating && (
            <>
              <FaStar style={{ color: "#ffcf00" }} />
              <p>{product.rating.toFixed(1)}</p>
            </>
          )}
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
          {isInCart ? (
            <div className={Styles.purchaseInQuantityContainer}>
              <button onClick={() => cartQuantity !== 0 && onCartUpdate(cartQuantity - 1)} className={Styles.addToCartButton}> - </button>
              <p>{cartQuantity}</p>
              <button onClick={() => onCartUpdate(cartQuantity + 1)} className={Styles.addToCartButton}> + </button>
            </div>
          ) : (
            <button onClick={() => onCartUpdate(1)} className={Styles.addToCartButton}>Add To Cart</button>
          )}
        </div>
      </div>
    </div>
  );
}
