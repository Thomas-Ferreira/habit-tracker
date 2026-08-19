import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider> in App.tsx'
    );
  }

  return context;
}
