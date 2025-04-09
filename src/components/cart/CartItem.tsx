import React from 'react';
import {View, Image, Pressable} from 'react-native';
import Toast from 'react-native-toast-message';
import {Text} from '@/components/ui';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {CartItem as CartItemType} from '@/types/cart.interface';
import {useAppDispatch} from '@/redux/hooks';
import {
  updateQuantityRequest,
  removeFromCartRequest,
} from '@/redux/features/cart/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({item}: CartItemProps) => {
  const dispatch = useAppDispatch();
  // La cantidad en el carrito
  const cartQuantity = item.quantity;
  // La cantidad disponible del producto (stock)
  const stockQuantity = item.stock || 0;

  const handleIncrement = () => {
    // Verificar que no exceda la cantidad disponible del producto
    if (cartQuantity < stockQuantity) {
      dispatch(
        updateQuantityRequest({id: item.id, quantity: cartQuantity + 1}),
      );
    }
  };

  const handleDecrement = () => {
    // Si la cantidad va a llegar a 0, eliminamos el producto
    if (cartQuantity - 1 === 0) {
      dispatch(removeFromCartRequest(item.id));
      Toast.show({
        type: 'info',
        text1: item.title,
        text2: 'Producto eliminado del carrito',
      });
    } else {
      // Si no, actualizamos la cantidad
      dispatch(
        updateQuantityRequest({id: item.id, quantity: cartQuantity - 1}),
      );
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCartRequest(item.id));
    Toast.show({
      type: 'info',
      text1: item.title,
      text2: 'Producto eliminado del carrito',
    });
  };

  return (
    <View className="flex-row bg-white rounded-lg p-4 mb-3 shadow-sm">
      {/* Imagen del producto */}
      <Image
        source={{uri: item.image}}
        className="w-20 h-20 rounded-lg"
        resizeMode="contain"
      />

      {/* Detalles del producto */}
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between">
          <Text className="text-base font-bold flex-1 mr-2" numberOfLines={2}>
            {item.title}
          </Text>
          <Pressable onPress={handleRemove}>
            <MaterialCommunityIcons name="close" size={24} color="#EF4444" />
          </Pressable>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-blue-600 font-bold">
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
          <Text
            className={`text-sm ${
              stockQuantity < 3 ? 'text-red-500' : 'text-gray-600'
            }`}>
            Stock: {stockQuantity || 'No disponible'}
          </Text>
        </View>

        {/* Controles de cantidad */}
        <View className="flex-row items-center mt-2">
          <Pressable
            onPress={handleDecrement}
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
            <MaterialCommunityIcons name="minus" size={20} color="#374151" />
          </Pressable>

          <Text className="mx-4 font-bold">{cartQuantity}</Text>

          <Pressable
            onPress={handleIncrement}
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
            <MaterialCommunityIcons name="plus" size={20} color="#374151" />
          </Pressable>

          <Text className="ml-4 text-gray-500">
            ${item.price.toFixed(2)} c/u
          </Text>
        </View>
      </View>
    </View>
  );
};

