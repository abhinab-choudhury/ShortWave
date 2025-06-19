import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import DashboardPage from './pages/DashboardPage';
import SigninPage from './pages/SigninPage';
import DashboardLayout from './components/Layouts/DashboardLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import CampaignAnalyticsPage from './pages/CampaignAnalyticsPage';
import LinkAnalyticsPage from './pages/LinkAnalyticsPage';

function App() {
  return (
    <>
      <ThemeProvider storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* App Related Pages */}
            <Route path={'/home'} element={<Home />} />
            <Route path={'/'} element={<Navigate to="/home" />} />

            <Route path={'/'} element={<DashboardLayout />}>
              <Route path={'/dashboard'} element={<DashboardPage />} />
              <Route path={'/analytics'} element={<AnalyticsPage />} />
              <Route
                path={'/analytics/:campaign'}
                element={<CampaignAnalyticsPage />}
              />
              <Route
                path={'/analytics/:campaign/:linkid'}
                element={<LinkAnalyticsPage />}
              />
              <Route path={'/settings'} element={<SettingsPage />} />
            </Route>

            <Route path={'/signin'} element={<SigninPage />} />
            <Route path={'*'} element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
