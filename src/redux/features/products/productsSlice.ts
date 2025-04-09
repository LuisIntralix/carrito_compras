import {createSlice} from '@reduxjs/toolkit';
import {Product} from '@/types/product.interface';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProducts: state => {
      state.loading = true;
      state.error = null;
    },
    setProducts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {fetchProducts, setProducts, setLoading, setError} =
  productsSlice.actions;

export default productsSlice.reducer;

