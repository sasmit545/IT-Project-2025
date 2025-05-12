import { Link } from "react-router-dom"
import "../landing-page.css"
import "./contact.css"
import Squares from "../squares"

export default function ContactPage() {
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
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/auth" className="nav-button">
              Get Started
            </Link>
          </div>
        </div>

        <div className="contact-section">
          <h1>Contact Us</h1>
          <p className="contact-intro">
            Have questions about SiteBuilder? We're here to help. Send us a message and we'll get back to you as soon as possible.
          </p>
          
          <div className="contact-container">
            
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="Your email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" placeholder="Subject" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" placeholder="Your message" required></textarea>
                </div>
                
                <button type="submit" className="primary-button">Send Message</button>
              </form>
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
