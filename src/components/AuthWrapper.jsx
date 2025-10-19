import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginPage } from '../app/LoginPage';
import { SimpleLoadingScreen } from './screens/SimpleLoadingScreen';

export default function AuthWrapper({ children }) {
  const { user, checkAuth, loading } = useAuthStore();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth();
      } catch (error) {
        // Ignore errors - это нормально для неавторизованных пользователей
      }
      setIsInitialCheck(false);
    };
    init();
  }, [checkAuth]);

  // Показываем загрузку во время начальной проверки или проверки авторизации
  if (isInitialCheck || loading) {
    return <SimpleLoadingScreen message="Loading..." />;
  }

  if (user) {
    return <>{children}</>;
  }

  return <LoginPage />;
}


