import { Link } from "react-router-dom"
import "./landing-page.css"
import Squares from "./squares"

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-background">
        <Squares direction="diagonal" speed={0.5} borderColor="rgba(56, 189, 248, 0.1)" squareSize={50} />
      </div>
      <div className="landing-content">
        <div className="landing-header">          <div className="logo">
            <span className="logo-square"></span>
            <span className="logo-text">SiteBuilder</span>
          </div>
          <div className="landing-nav">
            <Link to="/auth" className="nav-link">
              Login
            </Link>
            <Link to="/dashboard" className="nav-button">
              Get Started
            </Link>
          </div>
        </div>

        <div className="landing-hero">
          <h1>Build beautiful websites without code</h1>
          <p>
            Design and launch responsive websites in minutes with our intuitive drag-and-drop editor. No coding
            required.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="primary-button">
              Start Building Now
            </Link>
            <a href="#features" className="secondary-button">
              Learn More
            </a>
          </div>
        </div>

        <div className="landing-features" id="features">
          <h2>Why choose SiteBuilder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Drag & Drop Editor</h3>
              <p>Intuitive interface that makes website building accessible to everyone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Responsive Design</h3>
              <p>All websites automatically adapt to any screen size</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Ready-made Templates</h3>
              <p>Start with professionally designed templates for any purpose</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Export Options</h3>
              <p>Export to HTML or React components with a single click</p>
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
                <h4>About </h4>
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
