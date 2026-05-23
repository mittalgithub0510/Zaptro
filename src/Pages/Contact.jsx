import React from "react";


const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2 className="contact-title">
          Get in Touch with <span>Zaptro</span>
        </h2>

        <div className="contact-grid">
          {/* Info Section */}
          <div className="contact-info">
            <div>
              <h3>Contact Info</h3>
              <p>
                Have a question or need support? We're here to help you.
              </p>
            </div>

            <div className="contact-details">
              <p><strong>📍 Address:</strong> 123 Tech Lane, Kolkata, India</p>
              <p><strong>📧 Email:</strong> support@zaptro.com</p>
              <p><strong>📞 Phone:</strong> +91 98765 43210</p>
            </div>
          </div>

          {/* Form Section */}
          <form className="contact-form">
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea rows="4" placeholder="Type your message..."></textarea>
            </div>

            <button type="submit" className="contact-btn">
              Send Message 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
