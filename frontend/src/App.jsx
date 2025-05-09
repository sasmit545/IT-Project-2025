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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
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
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/auth" />
            } 
          />
          <Route 
            path="/editor" 
            element={
              isAuthenticated ? <Editor onLogout={handleLogout} /> : <Navigate to="/auth" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App