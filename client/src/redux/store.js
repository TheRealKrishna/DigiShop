import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice'; // assuming you have a loginSlice.js file

export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
});
