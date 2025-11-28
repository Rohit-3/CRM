import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { RequireAuth } from './components/auth/RequireAuth';
import { ScrollToTop } from './components/auth/ScrollToTop';
import { Toaster } from './components/ui/toaster';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import routes from './routes';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/404';

  return (
    <RequireAuth whiteList={['/login', '/404']}>
      <div className="flex min-h-screen bg-background">
        {!isAuthPage && <Sidebar />}
        <div className={`flex-1 flex flex-col ${!isAuthPage ? 'ml-64' : ''}`}>
          {!isAuthPage && <TopBar />}
          <main className={`flex-grow ${!isAuthPage ? 'mt-16 p-8 max-w-[1920px] mx-auto w-full' : ''}`}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }
            >
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster />
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
