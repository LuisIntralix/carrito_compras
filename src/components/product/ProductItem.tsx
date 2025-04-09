import {Image, View, Pressable} from 'react-native';
import {Product} from '@/types/product.interface';
import {Text} from '../ui';
import {useAppDispatch} from '@/redux/hooks';
import {openProductSheet} from '@/redux/features/productSheet/productSheetSlice';

interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({product}: ProductItemProps) => {
  const dispatch = useAppDispatch();

  const handlePress = () => {
    dispatch(openProductSheet(product));
  };

  return (
    <Pressable
      className="bg-white rounded-lg p-3 m-1 flex-1 shadow-sm border border-gray-200"
      onPress={handlePress}>
      <Image
        source={{uri: product.image}}
        className="w-full h-32 rounded-lg mb-2"
        resizeMode="contain"
      />
      <Text className="text-sm font-bold mb-1" numberOfLines={1}>
        {product.title}
      </Text>
      <Text className="text-xs text-gray-600 mb-2" numberOfLines={2}>
        {product.description}
      </Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </Text>
        <Text
          className={`text-xs ${
            product.quantity && product.quantity < 3
              ? 'text-red-500'
              : 'text-gray-600'
          }`}>
          {product.quantity} disponibles
        </Text>
      </View>
    </Pressable>
  );
};

