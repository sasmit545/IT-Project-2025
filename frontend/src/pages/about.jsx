import { Link } from "react-router-dom"
import "../landing-page.css"
import "./about.css"
import Squares from "../squares"

export default function AboutPage() {
  return (
    <div className="landing-container">
      <div className="landing-background">
        <Squares direction="diagonal" speed={0.5} borderColor="rgba(56, 189, 248, 0.1)" squareSize={50} />
      </div>
      <div className="landing-content">
        <div className="landing-header">
          <div className="logo">
            <span className="logo-square"></span>
            <span className="logo-text">SiteBuilder</span>
          </div>
          <div className="landing-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <Link to="/auth" className="nav-button">
              Get Started
            </Link>
          </div>
        </div>

        <div className="about-hero">
          <h1>About SiteBuilder</h1>
          <p className="about-intro">
            A website builder designed to simplify web development and make beautiful websites accessible to everyone.
          </p>
        </div>

        <div className="about-section">
          <div className="about-story">
            <div className="about-content">
              <h2>Our Story</h2>
              <p>
                We built Site Builder as our IT project at the Indian Institute of Technology Patna in our 4th semester. Our team developed this platform with the goal of making website creation more intuitive and accessible.
              </p>
              <p>
                This project represents our combined effort to apply our technical knowledge in creating a practical tool that addresses the challenges faced by those without extensive coding experience when building websites.
              </p>
            </div>
            <div className="about-image-container">
            </div>
          </div>

          <div className="about-mission">
            <h2>Our Mission</h2>
            <p>
              To provide a user-friendly platform that enables people without technical backgrounds to create professional, responsive websites for their ideas, projects, and businesses.
            </p>
            <div className="mission-values">
              <div className="mission-card">
                <div className="mission-icon">💡</div>
                <h3>Simplicity</h3>
                <p>We focus on creating an intuitive interface that makes website building straightforward and accessible.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">🤝</div>
                <h3>Accessibility</h3>
                <p>We aim to make web development accessible to users with varying levels of technical expertise.</p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">🚀</div>
                <h3>Empowerment</h3>
                <p>We provide tools to help users express themselves online through functional and appealing websites.</p>
              </div>
            </div>
          </div>

          <div className="about-team">
            <h2>Meet Our Team</h2>
            <p className="team-intro">We're a team of computer science students from IIT Patna working together to create this website builder as part of our IT project.</p>
            
            <div className="team-grid">
              <div className="team-member">
          
                <h3>Arush</h3>
                <p className="team-title">Team Member</p>
                <p className="team-bio">Computer Science & AI student at IIT Patna focused on game development and design.</p>
              </div>
              
              <div className="team-member">
          
                <h3>Rahul</h3>
                <p className="team-title">Team Member</p>
                <p className="team-bio">Passionate about learning new things and codes as a side hobby.</p>
              </div>
              
              <div className="team-member">
          
                <h3>Sasmit</h3>
                <p className="team-title">Team Member</p>
                <p className="team-bio">Hardcore Full stack developer leading our project.</p>
              </div>
              
              <div className="team-member">
          
                <h3>Shresth</h3>
                <p className="team-title">Team Member</p>
                <p className="team-bio">Fellow backend developer focused on implementing apis.</p>
              </div>
              
              <div className="team-member">
          
                <h3>Harsh</h3>
                <p className="team-title">Team Member</p>
                <p className="team-bio">Student at IIT Patna area focusing optimising algorithms in the backend apis.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo">
                <span className="logo-square"></span>
                <span className="logo-text">SiteBuilder</span>
              </div>
              <p>Building the web, simplified.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to="/features">Features</Link>
                <Link to="/templates">Templates</Link>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="https://drive.google.com/file/d/18H6BSF_bJrAO_LT_jAKnylnq3xZasSQo/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Documentation</a>
                <Link to="/support">Support</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SiteBuilder. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
