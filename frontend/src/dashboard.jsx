"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "./components/navigation"
import "./dashboard.css"

export default function Dashboard({ onLogout }) {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const storedUserData = localStorage.getItem("userData")

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }

    // Simulate fetching projects
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
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleMenuAction = (action) => {
    if (action === "logout") {
      onLogout()
    } else if (action === "profile") {
      // Navigate to profile page
    } else if (action === "settings") {
      // Navigate to settings page
    }
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
            <button className="view-all">View all</button>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-thumbnail">
                  <img src={project.thumbnail} alt={project.name} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>Last edited: {project.lastEdited}</p>
                </div>
                <div className="project-actions">
                  <button onClick={() => handleEditProject(project.id)} className="edit-button">
                    Edit
                  </button>
                  <button className="more-button" aria-label="More options">
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
            <button className="view-all">View all</button>
          </div>

          <div className="templates-grid">
            {[
              { name: "Landing Page", desc: "Perfect for product launches", img: "/placeholder.svg?height=120&width=200" },
              { name: "Portfolio", desc: "Showcase your work", img: "/placeholder.svg?height=120&width=200" },
              { name: "Blog", desc: "Share your thoughts", img: "/placeholder.svg?height=120&width=200" },
              { name: "E-commerce", desc: "Sell products online", img: "/placeholder.svg?height=120&width=200" }
            ].map((template, index) => (
              <div key={index} className="template-card">
                <div className="template-thumbnail">
                  <img src={template.img} alt={`${template.name} Template`} />
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.desc}</p>
                </div>
                <button onClick={handleNewProject} className="use-template-button">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}