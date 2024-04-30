import { useDispatch, useSelector } from "react-redux";
import Styles from "../../css/cart/Cart.module.css"
import { useMutation } from "@apollo/client";
import { UPDATE_CART } from "../../graphql/mutations/userMutations";
import { toast } from "react-toastify";
import { updateCart } from "../../redux/slices/userSlice";
import { Dropdown } from "react-bootstrap";

export default function Cart() {
  const user = useSelector((state: any) => state.user.user);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const [updateCartMutation] = useMutation(UPDATE_CART);
  const products = useSelector((state: any) => state.products.products)
  const onCartUpdate = async (product: any, quantity: any) => {
    if (quantity > 6) {
      toast.warning("Maximum quantity per product per order is 6", { toastId: "maximumQuantityError", autoClose: 3000 })
    }
    else {
      dispatch(updateCart({ product, quantity, isInCart: true }));
      if (isLoggedIn) {
        await updateCartMutation({
          variables: { productId: product.id, quantity }
        });
      }
    }
  };

  return (
    <div className={Styles.cartPage}>
      <h3 className={Styles.productCartPageTitle}>Your Shopping Cart</h3>
      <div className={Styles.cartContainer}>
        <div className={Styles.itemsContainer}>
          {
            user.cart.cartItems.length > 0 ?
              <div className={Styles.cartProductsContainer}>
                {
                  user.cart.cartItems.map((cartItem: any, i: any) => {
                    const product = products.find((product: any) => product.id === cartItem.product_id)
                    return (
                      <div key={product.id} className={Styles.cartProduct}>
                        <div>

                          <div className={Styles.cartProductContainer}>
                            <div className={Styles.cartProductFirstHalf}>
                              <div className={Styles.cartProductImageContainer}>
                                <img src={product.thumbnail} alt="" />
                              </div>
                              <div className={Styles.cartProductTexts}>
                                <div>
                                  <p className={Styles.cartProductTitle}>{product.title}</p>
                                  <p className={Styles.cartProductDescription}>{product.description}</p>
                                </div>
                                <div className={Styles.priceAndButtonsContainer}>
                                  <div className={Styles.priceContainer}>
                                    <h5>₹{product.discountedPrice}</h5>
                                    <p>M.R.P: <del>₹{product.price}</del></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={Styles.cartProductInfo}>
                              <div className={Styles.finalPriceContainer}>
                                <p>₹{product.discountedPrice} * {cartItem.quantity} =</p>
                                <h5>₹{product.discountedPrice * cartItem.quantity}</h5>
                              </div>
                              <div className={Styles.cartProductQuantityContainer}>
                                <button onClick={() => cartItem.quantity !== 0 && onCartUpdate(product, cartItem.quantity - 1)} className={Styles.addToCartButton}> - </button>
                                <p>{cartItem.quantity}</p>
                                <button onClick={() => onCartUpdate(product, cartItem.quantity + 1)} className={Styles.addToCartButton}> + </button>
                              </div>
                            </div>
                          </div>
                          <div className={Styles.priceAndButtonsContainerBottom}>
                            <div className={Styles.priceContainer}>
                              <h5>₹{product.discountedPrice}</h5>
                              <p>M.R.P: <del>₹{product.price}</del></p>
                            </div>
                            <div className={Styles.cartProductInfoSmaller}>
                              <div className={Styles.finalPriceContainer}>
                                <p>₹{product.discountedPrice} * {cartItem.quantity} =</p>
                                <h5>₹{product.discountedPrice * cartItem.quantity}</h5>
                              </div>
                              <div className={Styles.cartProductQuantityContainer}>
                                <button onClick={() => cartItem.quantity !== 0 && onCartUpdate(product, cartItem.quantity - 1)} className={Styles.addToCartButton}> - </button>
                                <p>{cartItem.quantity}</p>
                                <button onClick={() => onCartUpdate(product, cartItem.quantity + 1)} className={Styles.addToCartButton}> + </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {
                          (i < user.cart.cartItems.length - 1) &&
                          <Dropdown.Divider />
                        }
                      </div>
                    )
                  })
                }
              </div>
              :
              <div className={Styles.noProductsContainer}>
                <h4>No products in the cart!</h4>
              </div>
          }
        </div>
        <div className={Styles.paymentContainer}>
          <div className={Styles.cartTotalContainer}>
            <h5>SUBTOTAL : </h5>
            <p>₹{user.cart.total}</p>
          </div>
          {
            user.cart.total > 0 && <button className={Styles.checkoutButton}>Proceed To Checkout</button>
          }
        </div>
      </div>
    </div >
  )
}
