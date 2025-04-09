import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Text, Button} from '@/components/ui';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {closeProductSheet} from '@/redux/features/productSheet/productSheetSlice';
import {addToCartRequest} from '@/redux/features/cart/cartSlice';
import Toast from 'react-native-toast-message';

export const ProductSheet = () => {
  const dispatch = useAppDispatch();
  const {isOpen, selectedProduct} = useAppSelector(state => state.productSheet);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Estilo animado para el fondo oscuro
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 0.5 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  }, [isOpen]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) dispatch(closeProductSheet());
    },
    [dispatch],
  );

  if (!selectedProduct) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View
        style={[styles.overlay, overlayStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => bottomSheetRef.current?.close()}
        />
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={['80%']}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{backgroundColor: '#f9fafb'}}
        handleIndicatorStyle={{backgroundColor: '#0F766E'}}
        style={styles.bottomSheet}>
        <BottomSheetView className="flex-1 px-4">
          {/* Imagen del producto */}
          <View className="h-48 mt-4 mb-4">
            <Image
              source={{uri: selectedProduct.image}}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>

          {/* Detalles del producto */}
          <View className="flex-1">
            <Text className="text-2xl font-bold mb-2">
              {selectedProduct.title}
            </Text>
            <Text className="text-gray-600 mb-4">
              {selectedProduct.description}
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-3xl font-bold text-blue-600">
                ${selectedProduct.price.toFixed(2)}
              </Text>
              <Text
                className={`text-base ${
                  selectedProduct.stock && selectedProduct.stock < 3
                    ? 'text-red-500'
                    : 'text-gray-600'
                }`}>
                {selectedProduct.stock} disponibles
              </Text>
            </View>

            {/* Categoría */}
            <View className="flex-row items-center mb-4">
              <MaterialCommunityIcons
                name="tag-outline"
                size={24}
                color="#4B5563"
              />
              <Text className="text-gray-600 ml-2">
                {selectedProduct.category}
              </Text>
            </View>

            {/* Rating */}
            <View className="flex-row items-center mb-6">
              <MaterialCommunityIcons name="star" size={24} color="#F59E0B" />
              <Text className="text-gray-600 ml-2">
                {selectedProduct.rating.rate} ({selectedProduct.rating.count}{' '}
                reseñas)
              </Text>
            </View>

            {/* Botón de Agregar al carrito */}
            <Button
              onPress={() => {
                dispatch(
                  addToCartRequest({product: selectedProduct, quantity: 1}),
                );
                dispatch(closeProductSheet());
                Toast.show({
                  type: 'success',
                  text1: selectedProduct!.title,
                  text2: 'El producto se ha agregado correctamente',
                });
              }}
              className="bg-green-600 py-3 rounded-lg items-center justify-center">
              <Text className="text-white font-bold text-lg">
                Agregar al carrito
              </Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
