import { useDispatch, useSelector } from "react-redux";
import Styles from "../../css/cart/FloatingCart.module.css"
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { updateCart } from "../../redux/slices/userSlice";
import { UPDATE_CART } from "../../graphql/mutations/userMutations";
import { useMutation } from "@apollo/client";
import { Dropdown } from "react-bootstrap";

interface ChildComponentProps {
  setCartToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const FloatingCart: React.FC<ChildComponentProps> = ({ setCartToggle }) => {
  const user = useSelector((state: any) => state.user.user);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const products = useSelector((state: any) => state.products.products)
  const dispatch = useDispatch();
  const [updateCartMutation] = useMutation(UPDATE_CART);

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
    <div className={Styles.floatingCartContainer}>
      <div>
        <div className={Styles.floatingCartHeading}>
          <h5>{user.cart.cartItems.length} ITEMS</h5>
          <Link to={"/user/cart"}>
            <h5>VIEW CART</h5>
          </Link>
        </div>
        <Dropdown.Divider />
      </div>
      {
        user.cart.cartItems.length > 0 ?
          <div className={Styles.cartProductsContainer}>
            {
              user.cart.cartItems.map((cartItem: any, i: any) => {
                const product = products.find((product: any) => product.id === cartItem.product_id)
                return (
                  <div key={product.id} className={Styles.floatingCartProduct}>
                    <div className={Styles.floatingCartProductContainer}>
                      <div className={Styles.floatingCartProductTexts}>
                        <p className={Styles.floatingCartProductTitle}>{product.title}</p>
                        <div className={Styles.floatingCartProductInfo}>
                          <div className={Styles.priceContainer}>
                            <p>₹{product.discountedPrice}</p>
                            <p>* {cartItem.quantity} = ₹{product.discountedPrice * cartItem.quantity}</p>
                          </div>
                          <div className={Styles.floatingCartProductQuantityContainer}>
                            <button onClick={() => cartItem.quantity !== 0 && onCartUpdate(product, cartItem.quantity - 1)} className={Styles.addToCartButton}> - </button>
                            <p>{cartItem.quantity}</p>
                            <button onClick={() => onCartUpdate(product, cartItem.quantity + 1)} className={Styles.addToCartButton}> + </button>
                          </div>
                        </div>
                      </div>
                      <div className={Styles.floatingCartProductImageContainer}>
                        <img src={product.thumbnail} alt="" />
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
            <h6>No products in the cart!</h6>
          </div>
      }
      <div>
        <Dropdown.Divider />
        <div className={Styles.floatingCartTotalContainer}>
          <h5>SUBTOTAL : </h5>
          <h5>₹{user.cart.total}</h5>
        </div>
      </div>
      {
        user.cart.cartItems.length > 0 &&
        <div className={Styles.floatingCartButtonContainer}>
          {
            isLoggedIn ?
              <Link to={"/user/cart"}><button onClick={()=>setCartToggle(false)} className={Styles.checkOutButton}>CHECKOUT</button></Link>
              :
              <Link to={"/auth/signup"}><button className={Styles.createAccountButton}>CREATE ACCOUNT</button></Link>
          }
        </div>
      }
    </div>
  )
}


export default FloatingCart;