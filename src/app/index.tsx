import {PageTemplate} from '@/components/ui/PageTemplate';
import {ProductsPage} from '@/components/product/ProductsPage';

export default function HomeScreen() {
  return (
    <PageTemplate>
      <ProductsPage />
    </PageTemplate>
  );
}
