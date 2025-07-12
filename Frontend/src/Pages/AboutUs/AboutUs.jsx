import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="content1-container">
      {/* Floating bubble decorations */}
      <div className="floating-bubble bubble-1"></div>
      <div className="floating-bubble bubble-2"></div>
      <div className="floating-bubble bubble-3"></div>
      <div className="floating-bubble bubble-4"></div>
      
      <div className="content-wrapper">
        <h2 className="title">About Us</h2>
        
        <p className="description italic">
          As students, we have looked for upskilling everywhere. Mostly, we end up paying big amounts to gain
          certifications and learn relevant skills. We thought of SkillSwap to resolve that. Learning new skills and
          gaining more knowledge all while networking with talented people!
        </p>
        
        <p className="description">
          At SkillSwap, we believe in the power of learning and sharing knowledge. Our platform connects individuals
          from diverse backgrounds to exchange practical skills and expertise. Whether you're a seasoned professional
          looking to mentor others or a beginner eager to learn, SkillSwap provides a supportive environment for growth
          and collaboration.
        </p>
        
        <p className="description">
          Our mission is to empower individuals to unlock their full potential through skill sharing. By facilitating
          meaningful interactions and fostering a culture of lifelong learning, we aim to create a community where
          everyone has the opportunity to thrive.
        </p>
      </div>
      
      <div className="image-container">
        <img 
          src="/assets/images/about us.png" 
          alt="About SkillSwap" 
          className="about-image"
        />
      </div>
    </div>
  );
};

export default AboutUs;