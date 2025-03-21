import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './pages/Homepage'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import LoginPage from './pages/Login'

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
          path="/home"
          element={
            <Homepage/>
          }/>
      </Routes>
    </Router>
  )
}

export default App
