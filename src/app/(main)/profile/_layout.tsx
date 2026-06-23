import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileStackLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="edit" />
            <Stack.Screen name="security" />
        </Stack>
    );
}
