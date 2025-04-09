import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {fetchProducts} from '@/redux/features/products/productsSlice';
import {Product} from '@/types/product.interface';
import {ProductItem} from './ProductItem';
import {Text, Input} from '../ui';

export const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const {items, loading, error} = useAppSelector(state => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = items.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}: {item: Product}) => (
    <ProductItem product={item} />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          aria-labelledby="searchLabel"
        />
      </View>

      {filteredProducts.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 text-lg text-center">
            No se encontraron productos
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 8}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
      )}
    </SafeAreaView>
  );
};
