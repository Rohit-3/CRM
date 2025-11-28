import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { RequireAuth } from './components/auth/RequireAuth';
import { ScrollToTop } from './components/auth/ScrollToTop';
import { Toaster } from './components/ui/toaster';
import Header from './components/common/Header';
import routes from './routes';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster />
        <RequireAuth whiteList={['/login', '/404']}>
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
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
        </RequireAuth>
      </AuthProvider>
    </Router>
  );
};

export default App;
