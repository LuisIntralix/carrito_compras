import {call, put, takeLatest} from 'redux-saga/effects';
import * as SecureStore from 'expo-secure-store';
import {PayloadAction} from '@reduxjs/toolkit';
import {Product} from '@/types/product.interface';
import {CartItem} from '@/types/cart.interface';
import {
  loadCartRequest,
  loadCartSuccess,
  loadCartFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  updateQuantityRequest,
  updateQuantitySuccess,
  updateQuantityFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
} from './cartSlice';

const CART_STORAGE_KEY = 'shopping_cart';

// Función auxiliar para guardar el carrito en SecureStore
function* saveCartToStorage(items: CartItem[]): Generator<any, void, any> {
  try {
    yield call(
      [SecureStore, 'setItemAsync'],
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
  }
}

// Cargar carrito desde SecureStore
function* loadCart(): Generator<any, void, any> {
  try {
    const cartData = yield call(
      [SecureStore, 'getItemAsync'],
      CART_STORAGE_KEY,
    );
    const cart = cartData ? JSON.parse(cartData) : [];
    yield put(loadCartSuccess(cart));
  } catch (error) {
    yield put(loadCartFailure('Error al cargar el carrito'));
  }
}

// Agregar al carrito
function* addToCart(
  action: PayloadAction<{product: Product; quantity: number}>,
): Generator<any, void, any> {
  try {
    const {product, quantity} = action.payload;
    const cartItem: CartItem = {...product, quantity};
    yield put(addToCartSuccess(cartItem));

    // Obtener el estado actualizado y guardarlo
    const cartData = yield call(
      [SecureStore, 'getItemAsync'],
      CART_STORAGE_KEY,
    );
    const currentCart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    const existingItemIndex = currentCart.findIndex(
      item => item.id === product.id,
    );

    let updatedCart: CartItem[];
    if (existingItemIndex >= 0) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? {...item, quantity: item.quantity + quantity}
          : item,
      );
    } else {
      updatedCart = [...currentCart, cartItem];
    }

    yield call(saveCartToStorage, updatedCart);
  } catch (error) {
    yield put(addToCartFailure('Error al agregar al carrito'));
  }
}

// Actualizar cantidad
function* updateQuantity(
  action: PayloadAction<{id: number; quantity: number}>,
): Generator<any, void, any> {
  try {
    const {id, quantity} = action.payload;
    yield put(updateQuantitySuccess({id, quantity}));

    const cartData = yield call(
      [SecureStore, 'getItemAsync'],
      CART_STORAGE_KEY,
    );
    const currentCart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    const updatedCart = currentCart.map(item =>
      item.id === id ? {...item, quantity} : item,
    );

    yield call(saveCartToStorage, updatedCart);
  } catch (error) {
    yield put(updateQuantityFailure('Error al actualizar la cantidad'));
  }
}

// Remover del carrito
function* removeFromCart(
  action: PayloadAction<number>,
): Generator<any, void, any> {
  try {
    const id = action.payload;
    yield put(removeFromCartSuccess(id));

    const cartData = yield call(
      [SecureStore, 'getItemAsync'],
      CART_STORAGE_KEY,
    );
    const currentCart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    const updatedCart = currentCart.filter(item => item.id !== id);

    yield call(saveCartToStorage, updatedCart);
  } catch (error) {
    yield put(removeFromCartFailure('Error al remover del carrito'));
  }
}

// Limpiar carrito
function* clearCart(): Generator<any, void, any> {
  try {
    yield call([SecureStore, 'deleteItemAsync'], CART_STORAGE_KEY);
    yield put(clearCartSuccess());
  } catch (error) {
    yield put(clearCartFailure('Error al limpiar el carrito'));
  }
}

export function* watchCart(): Generator<any, void, any> {
  yield takeLatest(loadCartRequest.type, loadCart);
  yield takeLatest(addToCartRequest.type, addToCart);
  yield takeLatest(updateQuantityRequest.type, updateQuantity);
  yield takeLatest(removeFromCartRequest.type, removeFromCart);
  yield takeLatest(clearCartRequest.type, clearCart);
}

