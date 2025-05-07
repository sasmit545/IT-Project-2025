"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthForm from "./auth.jsx"
import Dashboard from "./dashboard.jsx"
import LandingPage from "./landing-page.jsx"
import Editor from "./pages/editor"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("userAccessToken")
      setIsAuthenticated(!!token)
    }
    
    // Initial check
    checkAuthStatus()
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus)
    
    // Custom event for internal state changes
    window.addEventListener('authChange', checkAuthStatus)
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('authChange', checkAuthStatus)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <AuthForm onAuthentication={setIsAuthenticated} />
            }
          />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/editor" element={isAuthenticated ? <Editor /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
