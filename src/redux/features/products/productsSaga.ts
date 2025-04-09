import {call, put, takeLatest} from 'redux-saga/effects';
import {setError, setLoading, setProducts} from './productsSlice';
import {Product} from '@/types/product.interface';
import axios, {AxiosResponse} from 'axios';

function* fetchProducts(): Generator<any, void, AxiosResponse<Product[]>> {
  try {
    yield put(setLoading(true));
    const response = yield call(axios.get, 'https://fakestoreapi.com/products');

    // Agregar cantidades aleatorias a los productos
    const productsWithQuantity = response.data.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 10) + 1,
    }));

    yield put(setProducts(productsWithQuantity));
  } catch (error) {
    yield put(setError('Error al cargar los productos'));
  }
}

export function* watchProducts() {
  yield takeLatest('products/fetchProducts', fetchProducts);
}

