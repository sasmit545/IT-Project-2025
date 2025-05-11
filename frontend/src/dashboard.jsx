"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./components/navigation";
import "./dashboard.css";

import placeholderImg from "./public/placeholder.svg";
import ecommImg from "./public/images/ecomm.png";
import portfolioImg from "./public/images/portfolio.png";
import blogImg from "./public/images/blog.png";

export default function Dashboard({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserData(userData);
    } else {
      // If no user data is found, redirect to login
      navigate("/");
      return;
    }

    // Fetch projects from API (to be implemented later)
    // For now, we'll use mock data
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: "Landing Page",
          lastEdited: "2 days ago",
          thumbnail: "/placeholder.svg?height=150&width=250",
        },
        {
          id: 2,
          name: "Portfolio Site",
          lastEdited: "1 week ago",
          thumbnail: "/placeholder.svg?height=150&width=250",
        },
        {
          id: 3,
          name: "Blog Template",
          lastEdited: "3 weeks ago",
          thumbnail: "/placeholder.svg?height=150&width=250",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleMenuAction = (action) => {
    if (action === "logout") {
      logoutUser();
    } else if (action === "profile") {
      // Handle profile action
    }
  };
  const logoutUser = async () => {
    setIsLoading(true);
    try {
      const apiUrl = "https://it-project-2025.onrender.com/api/v1";

      // Get the stored access token from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const accessToken = userData?.accessToken;

      const response = await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        credentials: "include", // Important for handling cookies
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });
      console.log(response);

      // Clear user data regardless of response
      localStorage.removeItem("userData");

      // Call the onLogout callback from parent
      onLogout();

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear data and redirect even if API call fails
      localStorage.removeItem("userData");
      onLogout();
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (projectId) => {
    navigate("/editor", { state: { projectId } });
  };

  const handleNewProject = () => {
    navigate("/editor");
  };

  const handleNewTemplate = (template) => {
    if (template.name === "Landing Page") {
      navigate("/editor");
    } else if (template.name === "Portfolio") {
      navigate("/template/marketing");
    } else if (template.name === "Blog") {
      navigate("/template/saas");
    } else if (template.name === "E-commerce") {
      navigate("/template/ecomm");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navigation userData={userData} onMenuAction={handleMenuAction} />

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome back, {userData?.username || "User"}!</h1>
          <p>Continue working on your projects or create something new.</p>
        </div>

        <div className="actions-section">
          <button onClick={handleNewProject} className="action-button primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Project
          </button>
          <button className="action-button secondary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Import Project
          </button>
        </div>

        <section className="projects-section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <button className="view-all">View all</button>
          </div>

          <div className="projects-grid">
            <div className="project-card new-project">
              <button
                onClick={handleNewProject}
                className="new-project-content"
              >
                <div className="plus-icon">+</div>
                <p>Create New Project</p>
              </button>
            </div>
          </div>
        </section>

        <section className="templates-section">
          <div className="section-header">
            <h2>Templates</h2>
            <button className="view-all">View all</button>
          </div>

          <div className="templates-grid">
            {[
              {
                name: "Landing Page",
                desc: "Perfect for product launches",
                img: placeholderImg,
              },
              {
                name: "Portfolio",
                desc: "Showcase your work",
                img: portfolioImg,
              },
              {
                name: "Blog",
                desc: "Share your thoughts",
                img: blogImg,
              },
              {
                name: "E-commerce",
                desc: "Sell products online",
                img: ecommImg,
              },
            ].map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-thumbnail">
                  <img src={template.img} alt={`${template.name} Template`} />
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.desc}</p>
                </div>
                <button
                  onClick={() => handleNewTemplate(template)}
                  className="use-template-button"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
