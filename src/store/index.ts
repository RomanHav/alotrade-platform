import { configureStore } from '@reduxjs/toolkit';
import productFormReducer from './slices/productFormSlice';
import brandFormReducer from './slices/brandFormSlice';

export const store = configureStore({
  reducer: {
    productForm: productFormReducer,
    brandForm: brandFormReducer,
  },
  // можно включить devTools в dev окружении
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
