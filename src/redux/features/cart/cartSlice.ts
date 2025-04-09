import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem, CartState} from '@/types/cart.interface';
import {Product} from '@/types/product.interface';

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Acciones para cargar el carrito desde SecureStore
    loadCartRequest: state => {
      state.loading = true;
      state.error = null;
    },
    loadCartSuccess: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.total = calculateTotal(action.payload);
    },
    loadCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Acciones para agregar items al carrito
    addToCartRequest: (state, action: PayloadAction<{product: Product; quantity: number}>) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.loading = false;
      state.total = calculateTotal(state.items);
    },
    addToCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Acciones para actualizar cantidad
    updateQuantityRequest: (state, action: PayloadAction<{id: number; quantity: number}>) => {
      state.loading = true;
      state.error = null;
    },
    updateQuantitySuccess: (state, action: PayloadAction<{id: number; quantity: number}>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.loading = false;
      state.total = calculateTotal(state.items);
    },
    updateQuantityFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Acción para remover item del carrito
    removeFromCartRequest: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.loading = false;
      state.total = calculateTotal(state.items);
    },
    removeFromCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Acción para limpiar el carrito
    clearCartRequest: state => {
      state.loading = true;
      state.error = null;
    },
    clearCartSuccess: state => {
      state.items = [];
      state.loading = false;
      state.total = 0;
    },
    clearCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Función auxiliar para calcular el total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const {
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
} = cartSlice.actions;

export default cartSlice.reducer;
