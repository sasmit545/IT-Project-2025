"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import axios from "axios";

export default function AuthForm({ onAuthentication }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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
  ];

  useEffect(() => {
    // Check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
    }, 5000);
    
    return () => {
      
      // clearInterval(interval);
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const loginUrl = "https://it-project-2025.onrender.com/api/v1/user/login";
    try {
      const resp = await axios.post(loginUrl, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(resp);

      if (resp.status === 200) {
        console.log(resp.data.message);
        localStorage.setItem(
          "userRefreshToken",
          resp.data.message.refreshToken
        );
        localStorage.setItem("userAccessToken", resp.data.message.accessToken);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: loginData.username,
            email: resp.data.message.email,
          })
        );
        onAuthentication(true);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const registerUrl =
      "https://it-project-2025.onrender.com/api/v1/user/register";
    try {
      const details = await axios.post(registerUrl, registerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (details.status === 201) {
        console.log(details.data.message);
        setRegisterData({ username: "", email: "", password: "" });
        setActiveTab("login");
        setError("");
        setSuccessMessage("Registration successful! Please log in with your credentials.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    
    const forgotPasswordUrl = "https://it-project-2025.onrender.com/api/v1/user/forgotpassword";
    
    try {
      const response = await axios.post(forgotPasswordUrl, { email: forgotPasswordData.email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.status === 200) {
        setForgotPasswordData({ email: "" });
        setSuccessMessage(
          "Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions within 1 hour."
        );
        
        // Auto switch back to login after 5 seconds
        setTimeout(() => {
          setActiveTab("login");
          setSuccessMessage("");
        }, 5000);
      }
      
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        setError(error.response.data.message || "Failed to send reset email. Please try again.");
      } else {
        // Network error or other issues
        setError("Failed to send reset email. Please check your internet connection and try again.");
      }
    }
    setIsLoading(false);
  };

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
                <div
                  key={index}
                  className={`dynamic-text ${
                    currentTextIndex === index ? "active" : ""
                  }`}
                >
                  <h1>{text.title}</h1>
                  <p>{text.subtitle}</p>
                </div>
              ))}
            </div>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Intuitive drag-and-drop interface
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Responsive designs that work everywhere
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">
                  Export to HTML or React components
                </div>
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
            <h2>
              {activeTab === "login" 
                ? "Welcome back" 
                : activeTab === "register" 
                ? "Create an account"
                : "Reset your password"}
            </h2>
            <p>
              {activeTab === "login"
                ? "Sign in to continue building amazing websites"
                : activeTab === "register"
                ? "Start creating beautiful websites in minutes"
                : "Enter your email address and we'll send you instructions to reset your password"}
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
          {successMessage && <div className="success-message">{successMessage}</div>}

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
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); handleTabSwitch("forgot"); }}>
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
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

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "forgot" && (
            <div className="form-container">
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
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
                      id="forgot-email"
                      name="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      placeholder="Enter your registered email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
                </button>
              </form>

              <div className="back-to-login">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => handleTabSwitch("login")}
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          <div className="auth-footer">
            <p>
              By continuing, you agree to our{" "}
              <a href="#terms">Terms of Service</a> and{" "}
              <a href="#privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
