import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        user: {
            cart:{
                cartItems:[],
                total: 0
            }
        },
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            process.env.NODE_ENV === "development" && console.log(state.user)
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = {
                cart:{
                    cartItems:[],
                    total: 0
                }
            };
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
