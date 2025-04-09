import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import productsReducer from './features/products/productsSlice';
import productSheetReducer from './features/productSheet/productSheetSlice';
import {watchProducts} from './features/products/productsSaga';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([watchProducts()]);
}

export const store = configureStore({
  reducer: {
    products: productsReducer,
    productSheet: productSheetReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

