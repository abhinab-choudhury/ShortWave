import { toast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/lib/utils';
import { useEffect, useState, createContext } from 'react';

export interface User {
  userId: string;
  email: string;
  name?: string;
  profilePic?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance().get('/auth/me');
      if (response.status == 200) {
        setUser(response.data.data.user);
      }
      if (response.status == 401) {
        setUser(null);
        toast({
          variant: 'destructive',
          title: 'Session Expired',
        });
      }
    } catch (err) {
      setUser(null);
      console.log('Error: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await axiosInstance().post('/auth/logout');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    setUser,
    logout,
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider {...props} value={value}>
      {children}
    </AuthContext.Provider>
  );
}
