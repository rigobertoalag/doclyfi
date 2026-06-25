import { Colors } from '@/shared/constants/colors';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_bottom',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        animationDuration: 320,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="purchase" />
      <Stack.Screen name="deposits" />
      <Stack.Screen name="contracts" />
      <Stack.Screen name="services" />
      <Stack.Screen name="plans" />
    </Stack>
  );
}
