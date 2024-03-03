import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; // assuming you have a loginSlice.js file
import productsReducer from './slices/productsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productsReducer,
    },
});
