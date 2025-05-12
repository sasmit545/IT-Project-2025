"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthForm from "./auth.jsx"
import Dashboard from "./dashboard.jsx"
import LandingPage from "./landing-page.jsx"
import Editor from "./pages/editor"
import Template from "./pages/editor/template.jsx"
import Support from "./pages/extras/Support.jsx"
import AboutPage from "./pages/about.jsx"
import ContactPage from "./pages/contact.jsx"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("userData")
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
        <Routes>          <Route path="/" element={<LandingPage />} />
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
            path="/editor/:websiteId?"
            element={
              isAuthenticated ? <Editor onLogout={handleLogout} /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/template/ecomm"
            element={
              isAuthenticated ? <Template onLogout={handleLogout} type={"ecomm"} /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/template/saas"
            element={
              isAuthenticated ? <Template onLogout={handleLogout} type={"saas"} /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/template/marketing"
            element={
              isAuthenticated ? <Template onLogout={handleLogout} type={"marketing"} /> : <Navigate to="/auth" />
            }
          />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App