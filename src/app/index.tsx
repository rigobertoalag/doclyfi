import { Redirect } from 'expo-router';

// Entry point — redirect based on auth state.
// In production, check AsyncStorage for a valid token here.
export default function Index() {
  const isAuthenticated = false; // Replace with real auth check (AsyncStorage / context)
  return <Redirect href={isAuthenticated ? '/(main)/dashboard' : '/(auth)/login'} />;
}