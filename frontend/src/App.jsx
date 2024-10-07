import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Footer from './components/footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'; 
import PrivateRoute from './components/auth/PrivateRoute';
import AppNavBar from './components/navbar/AppNavBar';  // Normal navbar
import MinimalNavBar from './components/navbar/MinimalNavBar';  // Minimal navbar

// Lazy load components for better performance
const Homepage = lazy(() => import('./components/homepage/Homepage'));
const CounselorLogin = lazy(() => import('./components/Login/CounselorLogin/CounselorLogin'));
const NewRegistrationForm = lazy(() => import('./components/Login/CounselorLogin/NewRegistration'));
const MainProgram = lazy(() => import('./components/Login/CounselorLogin/MainProgram'));
const DataAnalysis = lazy(() => import('./components/Login/CounselorLogin/DataAnalysis'));
const AdminLoginForm = lazy(() => import('./components/Login/AdminLoginForm'));
const LoginOptions = lazy(() => import('./components/auth/LoginOptions'));

const NavWrapper = ({ children }) => {
  const location = useLocation();

  // List of routes that require MinimalNavBar
  const minimalNavRoutes = [
    '/data-analysis',
    '/main-program',
    '/new-registration',
    '/counselor-login',
    '/login-options',
    '/admin-login-form'
  ];

  // Check if the current route matches any of the minimalNavRoutes
  const isMinimalNavRoute = minimalNavRoutes.includes(location.pathname);

  return (
    <>
      {/* Conditionally render the navbar */}
      {isMinimalNavRoute ? <MinimalNavBar /> : <AppNavBar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <NavWrapper> {/* Wrap the Routes with NavWrapper */}
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/admin-login-form" element={<AdminLoginForm />} />
              <Route path="/login-options" element={<LoginOptions />} />

              {/* Private Routes */}
              <Route 
                path="/counselor-login" 
                element={
                  <PrivateRoute>
                    <CounselorLogin />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/new-registration" 
                element={
                  <PrivateRoute>
                    <NewRegistrationForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/main-program" 
                element={
                  <PrivateRoute>
                    <MainProgram />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/data-analysis" 
                element={
                  <PrivateRoute>
                    <DataAnalysis />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Suspense>
        </NavWrapper>
        <Footer />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
