"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./auth.css"

export default function AuthForm({ onAuthentication }) {
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  const dynamicTexts = [
    {
      title: "Create beautiful websites",
      subtitle: "Design and launch in minutes, not months",
    },
    {
      title: "Drag, drop, done",
      subtitle: "No coding required, just your creativity",
    },
    {
      title: "Your vision, our tools",
      subtitle: "Professional results with minimal effort",
    },
  ]

  useEffect(() => {
    // Check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length)
    }, 5000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setError("")
  }

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // For demo purposes, we'll simulate a successful login
    setTimeout(() => {
      // Store mock token and user data
      localStorage.setItem("userToken", "demo-token-12345")
      localStorage.setItem("userData", JSON.stringify({ username: loginData.username }))

      onAuthentication(true)
      navigate("/dashboard")
      setIsLoading(false)
    }, 1500)
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // For demo purposes, we'll simulate a successful registration
    setTimeout(() => {
      setRegisterData({ username: "", email: "", password: "" })
      setActiveTab("login")
      setError("")

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.textContent = "Registration successful! Please log in with your credentials."
      document.querySelector(".auth-card").prepend(successMessage)

      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage)
        }
      }, 5000)

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="auth-container">
      {!isMobile && (
        <div className="auth-left">
          <div className="dynamic-content">
            <div className="brand">
              <div className="logo">
                <span className="logo-square"></span>
                <span className="logo-text">SiteBuilder</span>
              </div>
            </div>
            <div className="dynamic-text-container">
              {dynamicTexts.map((text, index) => (
                <div key={index} className={`dynamic-text ${currentTextIndex === index ? "active" : ""}`}>
                  <h1>{text.title}</h1>
                  <p>{text.subtitle}</p>
                </div>
              ))}
            </div>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Intuitive drag-and-drop interface</div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Responsive designs that work everywhere</div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Export to HTML or React components</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="auth-right">
        <div className="auth-card">
          {isMobile && (
            <div className="mobile-brand">
              <div className="logo">
                <span className="logo-square"></span>
                <span className="logo-text">SiteBuilder</span>
              </div>
            </div>
          )}

          <div className="auth-header">
            <h2>{activeTab === "login" ? "Welcome back" : "Create an account"}</h2>
            <p>
              {activeTab === "login"
                ? "Sign in to continue building amazing websites"
                : "Start creating beautiful websites in minutes"}
            </p>
          </div>

          <div className="tab-container">
            <button
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => handleTabSwitch("login")}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => handleTabSwitch("register")}
            >
              Register
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {activeTab === "login" && (
            <div className="form-container">
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-container">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-container">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="forgot-password">
                    <a href="#forgot">Forgot password?</a>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "register" && (
            <div className="form-container">
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label htmlFor="reg-username">Username</label>
                  <div className="input-container">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      id="reg-username"
                      name="username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-container">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-container">
                    <svg
                      className="icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="password"
                      id="reg-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </div>
          )}

          <div className="auth-footer">
            <p>
              By continuing, you agree to our <a href="#terms">Terms of Service</a> and{" "}
              <a href="#privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
