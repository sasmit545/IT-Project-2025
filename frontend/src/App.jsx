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

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token) {
      setIsAuthenticated(true)
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
        {isAuthenticated && (
          <header className="nav-header">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </header>
        )}
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
