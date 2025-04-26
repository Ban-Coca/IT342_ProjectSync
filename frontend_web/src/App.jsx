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
import ProjectDetailsPage from './pages/ProjectPages/ProjectDetailsPage'
import { useAuth } from './contexts/authentication-context'
import ProjectsPage from './pages/ProjectPages/ProjectsPage'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useEffect } from 'react'
import { setupMessageListener } from './service/firebase/firebaseService'
import NotificationsPage from './pages/Notification'
import Dashboard from './pages/Dashboard'
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100%' 
      }}>
        <Grid
          size="60"
          speed="1.5"
          color="black" 
        />
      </div>
    )
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
    useEffect(() => {
      setupMessageListener()
      console.log('Firebase message listener set up')
    }, []),
    <>
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
          <Route
            path="/projects/:projectId" 
            element={
              <ProtectedRoute>
                <ProjectDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
        </Routes>
    </>
        
  )
}

export default App
