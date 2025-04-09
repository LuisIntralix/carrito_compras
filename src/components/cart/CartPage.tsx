import {View, ScrollView} from 'react-native';
import {Text, Button} from '@/components/ui';
import {CartItem} from './CartItem';
import {useAppSelector, useAppDispatch} from '@/redux/hooks';
import {clearCartRequest} from '@/redux/features/cart/cartSlice';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const {items, total, loading, error} = useAppSelector(state => state.cart);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600 mb-4">Cargando carrito...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <MaterialCommunityIcons name="alert" size={64} color="#EF4444" />
        <Text className="text-xl text-red-500 mt-4 text-center">
          {error}
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <MaterialCommunityIcons
          name="cart-outline"
          size={64}
          color="#9CA3AF"
        />
        <Text className="text-xl text-gray-500 mt-4 text-center">
          Tu carrito está vacío
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-4">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Resumen y botón de compra */}
      <View className="p-4 bg-white shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg">Total:</Text>
          <Text className="text-2xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Button
            onPress={() => dispatch(clearCartRequest())}
            className="flex-1 bg-red-500 py-3 rounded-lg items-center justify-center">
            <Text className="text-white font-bold">Vaciar carrito</Text>
          </Button>

          <Button
            onPress={() => {}}
            className="flex-1 bg-green-600 py-3 rounded-lg items-center justify-center">
            <Text className="text-white font-bold">Proceder al pago</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
