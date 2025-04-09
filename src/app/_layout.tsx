import '~/global.css';

import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {Stack, Link} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {Platform, Pressable} from 'react-native';
import {Provider} from 'react-redux';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {store} from '@/redux/store';
import {ProductSheet} from '@/components/product/ProductSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {loadCartRequest} from '@/redux/features/cart/cartSlice';
import {CartIcon} from '@/components/cart/CartIcon';
import Toast from 'react-native-toast-message';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const {isDarkColorScheme} = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Cargar el carrito al iniciar la app
  React.useEffect(() => {
    store.dispatch(loadCartRequest());
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          {Platform.OS === 'android' && (
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          )}
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerTitle: 'Tienda',
                statusBarStyle: Platform.OS === 'android' ? (isDarkColorScheme ? 'light' : 'dark') : undefined,
                headerRight: () => (
                  <CartIcon color={isDarkColorScheme ? '#fff' : '#000'} />
                ),
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                headerTitle: 'Carrito',
                statusBarStyle: Platform.OS === 'android' ? (isDarkColorScheme ? 'light' : 'dark') : undefined,
              }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
          <ProductSheet />
          <Toast />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
