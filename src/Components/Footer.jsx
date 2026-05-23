import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Info Section */}
        <div className="footer-section">
          <Link to="/" className="logo">
            <h1>Zaptro</h1>
          </Link>
          <p>Powering Your World with the Best in Electronics.</p>
          <p>123 Electronics St, Style City, NY 10001</p>
          <p>Email: support@Zaptro.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li>Contact Us</li>
            <li>Shipping & Returns</li>
            <li>FAQs</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitterSquare />
            <FaPinterest />
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Stay in the Loop</h3>
          <p>Subscribe to get special offers and more</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} <span>Zaptro</span>. All rights reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
