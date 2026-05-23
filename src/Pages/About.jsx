import React from "react";
import { Link } from "react-router-dom";


const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About Zaptro</h1>

        <p className="about-intro">
          Welcome to <span>Zaptro</span>, your one-stop destination for the
          latest and greatest in electronics. From cutting-edge gadgets to
          must-have accessories, we’re here to power up your tech life with
          premium products and unbeatable service.
        </p>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Zaptro, our mission is to make innovative technology accessible
            to everyone. We’re passionate about connecting people with the tools
            and tech they need to thrive in a digital world.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Zaptro?</h2>
          <ul>
            <li>Top-quality electronic products</li>
            <li>Lightning-fast and secure shipping</li>
            <li>Reliable customer support</li>
            <li>Easy returns and hassle-free shopping</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            We envision a future where technology elevates everyday life.
            Zaptro is committed to offering cutting-edge solutions that are
            practical and affordable.
          </p>
        </div>

        <div className="about-bottom">
          <h3>Join the Zaptro Family</h3>
          <p>
            Whether you’re a tech enthusiast or just looking for something
            cool and functional — Zaptro has something for everyone.
          </p>
          <Link to="/product">
            <button className="about-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
