import { axiosInstance } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, createContext, useMemo, useCallback, useEffect } from "react";

export interface IUser {
  userId: string;
  email: string;
  name?: string;
  profilePic?: string;
}

export interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AUTH_TOKEN_KEY = "authToken";

function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

function removeTokenFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, "", url.pathname + url.search);
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      removeTokenFromUrl();
    }
  }, []);

  const { isLoading, refetch: refreshUser } = useQuery<IUser | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data?.data?.user);
        return response.data?.data?.user;
      } catch (error) {
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        console.error("Error fetching user: ", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed: ", error);
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      setUser,
      logout,
      refreshUser: async () => {
        await refreshUser();
      },
    }),
    [user, isLoading, refreshUser, logout],
  );

  return (
    <AuthContext.Provider {...props} value={value}>
      {children}
    </AuthContext.Provider>
  );
}
