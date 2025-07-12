import React from "react";
import Card from "react-bootstrap/Card";
import "./Card.css";
import { Link } from "react-router-dom";

const ProfileCard = ({ profileImageUrl, bio, name, skills, rating, username, availability }) => {
  return (
    <div className="card-container">
      <img className="img-container" src={profileImageUrl} alt="user" />
      <h3>{name}</h3>
      <h6>Rating: {rating} ⭐</h6>
      <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "150px" }}>{bio}</p>
      
      {/* Add Availability section */}
      {availability && availability.length > 0 && (
        <div className="availability-section">
          <h6>Availability</h6>
          <div className="availability-tags">
            {availability.map((time, index) => (
              <span key={index} className="availability-tag">{time}</span>
            ))}
          </div>
        </div>
      )}

      <div className="prof-buttons">
        <Link to={`/profile/${username}`}>
          <button className="primary ghost">View Profile</button>
        </Link>
      </div>
      <div className="profskills">
        <h6>Skills</h6>
        <div className="profskill-boxes">
          {skills.map((skill, index) => (
            <div key={index} className="profskill-box">
              <span className="skill">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;