import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import DashboardPage from './pages/DashboardPage';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage.tsx';
import SigninPage from './pages/SigninPage';
import DashboardLayout from './components/Layouts/DashboardLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <>
      <ThemeProvider storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* App Related Pages */}
            <Route path={'/'} element={<Home />} />

            <Route path={'/dashboard'} element={<DashboardLayout />}>
              <Route path={''} element={<DashboardPage />} />
              <Route path={'analytics'} element={<AnalyticsPage />} />
              <Route path={'settings'} element={<SettingsPage />} />
            </Route>

            <Route path={'/about'} element={<About />} />
            <Route path={'/services'} element={<ServicesPage />} />

            <Route path={'/signin'} element={<SigninPage />} />
            <Route path={'*'} element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
