import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        user: {
            cart: JSON.parse(localStorage.getItem("cart")) && JSON.parse(localStorage.getItem("cart")).total > 0 && JSON.parse(localStorage.getItem("cart")).cartItems.every((cartItem) => cartItem.quantity > 0) ? JSON.parse(localStorage.getItem("cart")) : { cartItems: [], total: 0 }
        },
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = {
                cart: { cartItems: [], total: 0 }
            }
        },
        updateCart: (state, action) => {
            const { product, quantity, isInCart } = action.payload;
            if (isInCart) {
                state.user.cart.total -= product.discountedPrice * (state.user.cart.cartItems[state.user.cart.cartItems.indexOf(state.user.cart.cartItems.find((item) => item.product_id === product.id))].quantity || 1);
                if (quantity < 1) {
                    state.user.cart.cartItems.splice(state.user.cart.cartItems.indexOf(state.user.cart.cartItems.find((item) => item.product_id === product.id)), 1)
                }
                else {
                    state.user.cart.cartItems.find((item) => item.product_id === product.id).quantity = quantity;
                    state.user.cart.total += product.discountedPrice * quantity;
                }
            }
            else {
                state.user.cart.cartItems.push({ product_id: product.id, quantity });
                state.user.cart.total += product.discountedPrice * quantity;
            }
            if (!state.isLoggedIn) {
                localStorage.setItem("cart", JSON.stringify(state.user.cart))
            }
        }
    },
});

export const { login, logout, updateCart } = userSlice.actions;

export default userSlice.reducer;
