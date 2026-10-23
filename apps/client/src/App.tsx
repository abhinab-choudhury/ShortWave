import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import DashboardLayout from "./components/layouts/DashboardLayout";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import LoadingScreen from "./components/LoadingScreen";
import { Capacitor } from "@capacitor/core";

const Home = lazy(() => import("./pages/HomePage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SigninPage = lazy(() => import("./pages/SigninPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CampaignAnalyticsPage = lazy(
  () => import("./pages/CampaignAnalyticsPage"),
);
const LinkAnalyticsPage = lazy(() => import("./pages/LinkAnalyticsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <ThemeProvider storageKey="shortwave-theme" defaultTheme="system">
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={Capacitor.isNativePlatform() ? "/signin" : "/home"}
                      replace
                    />
                  }
                />

                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<SigninPage />} />

                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route
                    path="/analytics/:campaignId"
                    element={<CampaignAnalyticsPage />}
                  />
                  <Route
                    path="/analytics/:campaignId/:shortUrl"
                    element={<LinkAnalyticsPage />}
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
