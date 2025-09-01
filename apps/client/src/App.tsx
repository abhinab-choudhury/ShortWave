import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Home from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import DashboardPage from "./pages/DashboardPage";
import SigninPage from "./pages/SigninPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import LinkAnalyticsPage from "./pages/LinkAnalyticsPage";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ThemeProvider storageKey="vite-ui-theme">
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Redirect root to /home */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Public Pages */}
                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<SigninPage />} />

                {/* App Pages with Dashboard Layout */}
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

                {/* Catch-All Route */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
