import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Product} from '@/types/product.interface';

interface ProductSheetState {
  isOpen: boolean;
  selectedProduct: Product | null;
}

const initialState: ProductSheetState = {
  isOpen: false,
  selectedProduct: null,
};

export const productSheetSlice = createSlice({
  name: 'productSheet',
  initialState,
  reducers: {
    openProductSheet: (state, action: PayloadAction<Product>) => {
      state.isOpen = true;
      state.selectedProduct = action.payload;
    },
    closeProductSheet: state => {
      state.isOpen = false;
      state.selectedProduct = null;
    },
  },
});

export const {openProductSheet, closeProductSheet} = productSheetSlice.actions;

export default productSheetSlice.reducer;
