"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./dashboard.css"
import axios from "axios"

export default function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

useEffect(() => {
  // Check if user is authenticated
  const storedUserData = localStorage.getItem("userData");

  if (storedUserData) {
    try {
      setUserData(JSON.parse(storedUserData)); // Parse JSON safely
    } catch (err) {
      console.error("Invalid user data in localStorage:", err);
      localStorage.removeItem("userData");
      navigate("/auth");
    }
  } else {
    navigate("/auth");
  }

  // Check if device is mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);

  // Simulate fetching projects
  const timeoutId = setTimeout(() => {
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

  // Cleanup on unmount
  return () => {
    window.removeEventListener("resize", checkIfMobile);
    clearTimeout(timeoutId);
  };
}, [navigate]);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleEditProject = (projectId) => {
    navigate("/editor", { state: { projectId } })
  }

  const handleNewProject = () => {
    navigate("/editor")
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }
const logout_user = async () => {
  try {
    const userAccessToken = localStorage.getItem("userAccessToken")
    localStorage.clear()
    
    // Dispatch custom event to notify App component about auth state change
    window.dispatchEvent(new Event('authChange'))

    const logout = await axios.patch(
      "http://localhost:8000/api/v1/user/logout",
      {}, // empty request body
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
        withCredentials: true, // if using cookies/sessions
      }
    );

    console.log("Logout successful:", logout);
     setUserData(null);
    navigate("/auth");
  } catch (error) {
    console.error("Logout failed:", error);
    // Ensure navigation happens even if API call fails
    navigate("/auth");
  }
};


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-square"></span>
            <span className="logo-text">SiteBuilder</span>
          </div>
        </div>
        <div className="header-right">
          {isMobile ? (
            <>
              <button className="menu-toggle" onClick={toggleMenu}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <div className="mobile-menu-header">

                  <span className="username">{userData?.username || "User"}</span>
                  <button className="close-menu" onClick={toggleMenu}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <a href="#profile">Profile</a>
                  <a href="#settings">Settings</a>
                  <a href="#logout">Logout</a>
                </div>
              </div>
            </>
          ) : (
            <div className="user-menu">
              <span className="username">{userData || "User"}</span>

              <div className="dropdown-menu">
                <ul>
                  <li>
                    <a href="#profile">Profile</a>
                  </li>
                  <li>
                    <a href="#settings">Settings</a>
                  </li>
                  <li>
                    <a href="#logout" onClick={logout_user}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome back, {userData || "User"}!</h1>
          <p>Continue working on your projects or create something new.</p>
        </div>

        <div className="actions-section">
          <button onClick={handleNewProject} className="action-button primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <a href="#all-projects" className="view-all">
              View all
            </a>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <img src={project.thumbnail || "/placeholder.svg"} alt={project.name} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>Last edited: {project.lastEdited}</p>
                </div>
                <div className="project-actions">
                  <button onClick={() => handleEditProject(project.id)} className="edit-button">
                    Edit
                  </button>
                  <button className="more-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="project-card new-project">
              <button onClick={handleNewProject} className="new-project-content">
                <div className="plus-icon">+</div>
                <p>Create New Project</p>
              </button>
            </div>
          </div>
        </section>

        <section className="templates-section">
          <div className="section-header">
            <h2>Templates</h2>
            <a href="#all-templates" className="view-all">
              View all
            </a>
          </div>

          <div className="templates-grid">
            <div className="template-card">
              <div className="template-thumbnail">
                <img src="/placeholder.svg?height=120&width=200" alt="Landing Page Template" />
              </div>
              <div className="template-info">
                <h3>Landing Page</h3>
                <p>Perfect for product launches</p>
              </div>
              <button onClick={handleNewProject} className="use-template-button">
                Use Template
              </button>
            </div>

            <div className="template-card">
              <div className="template-thumbnail">
                <img src="/placeholder.svg?height=120&width=200" alt="Portfolio Template" />
              </div>
              <div className="template-info">
                <h3>Portfolio</h3>
                <p>Showcase your work</p>
              </div>
              <button onClick={handleNewProject} className="use-template-button">
                Use Template
              </button>
            </div>

            <div className="template-card">
              <div className="template-thumbnail">
                <img src="/placeholder.svg?height=120&width=200" alt="Blog Template" />
              </div>
              <div className="template-info">
                <h3>Blog</h3>
                <p>Share your thoughts</p>
              </div>
              <button onClick={handleNewProject} className="use-template-button">
                Use Template
              </button>
            </div>

            <div className="template-card">
              <div className="template-thumbnail">
                <img src="/placeholder.svg?height=120&width=200" alt="E-commerce Template" />
              </div>
              <div className="template-info">
                <h3>E-commerce</h3>
                <p>Sell products online</p>
              </div>
              <button onClick={handleNewProject} className="use-template-button">
                Use Template
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
