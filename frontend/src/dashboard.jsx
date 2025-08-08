"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./components/navigation";
import PixelCard from "./components/PixelCard";
import "./dashboard.css";

import placeholderImg from "./public/placeholder.svg";
import ecommImg from "./public/images/ecomm.png";
import portfolioImg from "./public/images/portfolio.png";
import blogImg from "./public/images/blog.png";
import axios from "axios";

export default function Dashboard({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () =>{
    try {
      const allprojects = await axios.get(
        "https://it-project-2025.onrender.com/api/v1/websites/websiteuser",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userAccessToken")}`,
          },
        }
      );
      console.log("Projects fetched:", allprojects);
      return allprojects.data.data;
      
      
    } catch (error) {
      
    }
  }
  useEffect(() => {}, 
  [projects]);

  useEffect(() => {
    // Check if user is authenticated
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData && storedUserData !== "undefined") {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
        localStorage.removeItem("userData"); // clear the bad data
        navigate("/");
      }
    } else {
      navigate("/");
    }
    ;(async()=>{
      const allprojects = await fetchProjects();
      setProjects(allprojects);
      console.log("Projects fetched:", allprojects);
    })()


   

    // Fetch projects from API (to be implemented later)
    // For now, we'll use mock data
    
    
  }, []);

  const handleMenuAction = (action) => {
    if (action === "logout") {
      logoutUser();
    } else if (action === "profile") {
      // Handle profile action
    }
  };
  const logoutUser = async () => {
    try {
      const userAccessToken = localStorage.getItem("userAccessToken");
      localStorage.clear();

      // Dispatch custom event to notify App component about auth state change
      window.dispatchEvent(new Event("authChange"));

      const logout = await axios.post(
        "https://it-project-2025.onrender.com/api/v1/user/logout",
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
      localStorage.clear();
      onLogout(); // Call the logout function passed from App component

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      // Ensure navigation happens even if API call fails
      navigate("/auth");
    }
  };

  const handleEditProject = (projectId) => {
    console.log("Editing project with ID:", projectId);
    navigate(`/editor/${projectId}`);
  };

  const handleNewProject = () => {
    navigate("/editor/new");
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
  };  // Format the date in a user-friendly way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get visible projects - either all projects or just the most recent ones
  const getVisibleProjects = () => {
    if (!projects || !Array.isArray(projects)) return [];
    
    // Sort projects by updatedAt date (most recent first)
    const sortedProjects = [...projects].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    // Return either all projects or just the first 3
    return showAllProjects ? sortedProjects : sortedProjects.slice(0, 3);
  };



  

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
        </div>        <section className="projects-section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <button 
              className="view-all" 
              onClick={() => setShowAllProjects(!showAllProjects)}
            >
              {showAllProjects ? "Show Recent" : "View all"}
            </button>
          </div>

          <div className="projects-grid">            {getVisibleProjects().map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-thumbnail">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={`${project.name} Thumbnail`} 
                    />
                  ) : (
                    <PixelCard
                      variant="pink"
                      className="pixel-thumbnail"
                    />
                  )}
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>Last updated: {formatDate(project.updatedAt)}</p>
                </div>
                <button
                  onClick={() => handleEditProject(project._id)}
                  className="use-template-button"
                >
                  Edit Project
                </button>
              </div>
            ))}
            
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
        </section>        <section className="templates-section">
          <div className="section-header">
            <h2>Templates</h2>
            <button className="view-all">View all templates</button>
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
