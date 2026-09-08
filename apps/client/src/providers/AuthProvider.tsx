import { axiosInstance } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useState,
  createContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { App as CapApp } from "@capacitor/app";

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
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) return token;
    // Also handle capacitor://localhost/dashboard?token=...
    const hash = window.location.hash;
    if (hash.includes("token=")) {
      return new URLSearchParams(hash.split("?")[1] || "").get("token");
    }
  } catch {}
  return null;
}

function removeTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.pathname + url.search);
  } catch {}
}

async function persistToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
    } catch {}
  }
}

async function clearPersistedToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  if (Capacitor.isNativePlatform()) {
    try {
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
    } catch {}
  }
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
  const refreshUserRef = useRef<(() => Promise<unknown>) | null>(null);

  useEffect(() => {
    const handleUrlToken = async () => {
      const token = getTokenFromUrl();
      if (token) {
        await persistToken(token);
        removeTokenFromUrl();
      } else if (Capacitor.isNativePlatform()) {
        // Hydrate from Preferences on cold start (WebView localStorage may be empty)
        try {
          const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
          if (value && !localStorage.getItem(AUTH_TOKEN_KEY)) {
            localStorage.setItem(AUTH_TOKEN_KEY, value);
          }
        } catch {}
      }
    };
    handleUrlToken();

    // Native deep-link: capacitor://localhost/dashboard?token=xxx  and https://.../dashboard?token=xxx
    let listener: { remove: () => Promise<void> } | null = null;
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener("appUrlOpen", async (event) => {
        try {
          const url = new URL(event.url);
          const token = url.searchParams.get("token");
          if (token) {
            await persistToken(token);
            // Remove token from visible URL and refresh auth
            window.history.replaceState({}, "", "/dashboard");
            await refreshUserRef.current?.();
          }
        } catch {}
      }).then((h) => (listener = h));
    }
    return () => {
      listener?.remove();
    };
  }, []);

  const { isLoading, refetch: refreshUser } = useQuery<IUser | null>({
    queryKey: ["me", setUser],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        const token = response.data?.data?.token;
        if (token) {
          await persistToken(token);
        }
        setUser(response.data?.data?.user);
        return response.data?.data?.user;
      } catch (error) {
        setUser(null);
        await clearPersistedToken();
        console.error("Error fetching user: ", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refreshUserRef.current = refreshUser as unknown as () => Promise<unknown>;
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed: ", error);
    } finally {
      await clearPersistedToken();
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
