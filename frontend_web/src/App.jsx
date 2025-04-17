import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './pages/Homepage'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import LoginPage from './pages/AuthenticationPages/Login'
import SignupPage from './pages/AuthenticationPages/Signup'
import ForgotPassword from './pages/AuthenticationPages/ForgotPassword'
import VerifyCode from './pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
import TaskPage from './pages/TaskPage'
import LandingPage from './pages/LandingPage'
import { AuthenticationProvider, useAuth } from './contexts/authentication-context'
import ProjectsPage from './pages/ProjectsPage'
import { Toaster } from '@/components/ui/sonner'
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children;
};
function App() {
  return (
    <AuthenticationProvider>
      <Toaster richColors/>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <RedirectIfAuthenticated>
                <LandingPage />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/login" 
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RedirectIfAuthenticated>
                <SignupPage />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <RedirectIfAuthenticated>
                <ForgotPassword />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/verify-code" 
            element={
              <RedirectIfAuthenticated>
                <VerifyCode />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <RedirectIfAuthenticated>
                <PasswordReset />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthenticationProvider>
    
  )
}

export default App
