import { Stack } from 'expo-router';
//import { Colors } from '@/shared/constants/colors';

export default function AuthLayout() {
    const Colors = {
        background: '#080D1A',
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'slide_from_right',
            }}
        />
    );
}