import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import productsReducer from './features/products/productsSlice';
import productSheetReducer from './features/productSheet/productSheetSlice';
import cartReducer from './features/cart/cartSlice';
import {watchProducts} from './features/products/productsSaga';
import {watchCart} from './features/cart/cartSaga';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([watchProducts(), watchCart()]);
}

export const store = configureStore({
  reducer: {
    products: productsReducer,
    productSheet: productSheetReducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

