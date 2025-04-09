import React from 'react';
import {View, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {Text} from '@/components/ui';
import {useAppSelector} from '@/redux/hooks';

interface CartIconProps {
  color?: string;
}

export const CartIcon = ({color = '#000'}: CartIconProps) => {
  const {items} = useAppSelector(state => state.cart);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" asChild>
      <Pressable className="mr-4">
        <View>
          <MaterialCommunityIcons name="cart-outline" size={24} color={color} />
          {itemCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">{itemCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
};
