import {SafeAreaView} from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const PageTemplate: React.FC<Props> = ({children}) => {
  return (
    <SafeAreaView className="flex-auto bg-gray-50 mb-2">
      {children}
      {/** <ProductSheet />*/}
    </SafeAreaView>
  );
};
