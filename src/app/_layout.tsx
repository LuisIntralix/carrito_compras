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
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useColorScheme} from '~/lib/useColorScheme';
import {store} from '@/redux/store';
import {ProductSheet} from '@/components/product/ProductSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerTitle: 'Tienda',
                statusBarStyle: isDarkColorScheme ? 'light' : 'dark',
                headerRight: () => (
                  <Link href="/cart" asChild>
                    <Pressable className="mr-4">
                      <MaterialCommunityIcons
                        name="cart-outline"
                        size={24}
                        color={isDarkColorScheme ? '#fff' : '#000'}
                      />
                    </Pressable>
                  </Link>
                ),
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                headerTitle: 'Carrito',
                statusBarStyle: isDarkColorScheme ? 'light' : 'dark',
              }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
          <ProductSheet />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
