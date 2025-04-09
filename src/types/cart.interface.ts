import {Product} from './product.interface';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}
