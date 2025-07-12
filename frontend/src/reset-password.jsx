"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./auth.css";
import axios from "axios";

export default function ResetPasswordForm() {
  const [resetData, setResetData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false);
      setError("Invalid or missing reset token. Please request a new password reset.");
    }
    // In a real app, you would validate the token with the backend here
  }, [token]);

  const handleInputChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate username
    if (!resetData.username.trim()) {
      setError("Username is required.");
      return;
    }

    // Validate passwords match
    if (resetData.password !== resetData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength (basic validation)
    if (resetData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // Using the specified endpoint /user/setpassword with PATCH request
      const resetPasswordUrl = "https://it-project-2025.onrender.com/api/v1/user/setpassword";
      const response = await axios.patch(resetPasswordUrl, {
        token: token,
        name: resetData.username,
        newpassword: resetData.password
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Your password has been successfully reset! You can now log in with your new password.");
      setResetData({ username: "", password: "", confirmPassword: "" });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);

    } catch (error) {
      console.error("Reset password error:", error);
      
      if (error.response?.status === 400) {
        setError("Invalid token or token has expired. Please request a new password reset.");
      } else if (error.response?.status === 404) {
        setError("User not found. Please check your username.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reset password. Please try again or request a new reset link.");
      }
    }
    setIsLoading(false);
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-right" style={{ width: "100%" }}>
          <div className="auth-card">
            <div className="auth-header">
              <h2>Invalid Reset Link</h2>
              <p>This password reset link is invalid or has expired.</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button
              className="submit-btn"
              onClick={() => navigate("/auth")}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-right" style={{ width: "100%" }}>
        <div className="auth-card">
          <div className="auth-header">
            <h2>Reset Your Password</h2>
            <p>Enter your username and create a new secure password below.</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="form-container">
            <form onSubmit={handleSubmit}>
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
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
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
                    value={resetData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
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
                    value={resetData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
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
                    id="confirmPassword"
                    name="confirmPassword"
                    value={resetData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Resetting password..." : "Reset Password"}
              </button>
            </form>

            <div className="back-to-login">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/auth")}
              >
                ← Back to Sign In
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              <small>This reset link will expire in 1 hour for security purposes.</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
