import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './pages/Homepage'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import LoginPage from './pages/AuthenticationPages/Login'
import SignupPage from './pages/AuthenticationPages/Signup'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage/>
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage/>
        }/>
        <Route
          path="/home"
          element={
            <Homepage/>
          }/>
      </Routes>
    </Router>
  )
}

export default App
