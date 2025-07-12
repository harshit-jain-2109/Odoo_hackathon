import React from "react";
import "./Profile.css";
import Box from "./Box";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/user/registered/getDetails/${username}`);
        console.log(data.data);
        setProfileUser(data.data);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
          if (error.response.data.message === "Please Login") {
            localStorage.removeItem("userInfo");
            setUser(null);
            await axios.get("/auth/logout");
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, navigate, setUser]);

  const convertDate = (dateTimeString) => {
    if (!dateTimeString) return "Present";
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace("/", "-");
    return formattedDate;
  };

  const connectHandler = async () => {
    console.log("Connect");
    try {
      setConnectLoading(true);
      const { data } = await axios.post(`/request/create`, {
        receiverID: profileUser._id,
      });

      console.log(data);
      toast.success(data.message);
      setProfileUser((prevState) => {
        return {
          ...prevState,
          status: "Pending",
        };
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      }
    } finally {
      setConnectLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="container" style={{ minHeight: "86vh" }}>
        {loading ? (
          <div className="row d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '2rem', 
              borderRadius: '20px', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Spinner animation="border" variant="light" />
            </div>
          </div>
        ) : (
          <>
            <div className="profile-box">
              <div className="left-div">
                {/* Profile Photo */}
                <div className="profile-photo">
                  <img src={profileUser?.picture} alt="Profile" />
                </div>
                {/* Name */}
                <div className="misc">
                  <h1 className="profile-name" style={{ marginLeft: "2rem" }}>
                    {profileUser?.name}
                  </h1>
                  {/* Rating */}
                  <div className="rating" style={{ marginLeft: "2rem" }}>
                    {/* Rating stars */}
                    <span className="rating-stars">
                      {profileUser?.rating
                        ? Array.from({ length: Math.floor(profileUser.rating) }, (_, index) => <span key={index}>⭐</span>)
                        : "⭐⭐⭐⭐⭐"}
                    </span>
                    {/* Rating out of 5 */}
                    <span className="rating-value">{profileUser?.rating ? profileUser?.rating : "5"}/5</span>
                  </div>
                  {/* Connect and Report Buttons */}
                  {
                    // If the user is the same as the logged in user, don't show the connect and report buttons
                    user?.username !== username && (
                      <div className="buttons">
                        <button
                          className="connect-button"
                          onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                          disabled={profileUser?.status !== "Connect"}
                        >
                          {connectLoading ? (
                            <>
                              <Spinner animation="border" variant="light" size="sm" style={{ marginRight: "0.5rem" }} />
                              Connecting...
                            </>
                          ) : (
                            profileUser?.status
                          )}
                        </button>
                        <Link to={`/report/${profileUser.username}`}>
                          <button className="report-button">🚩 Report</button>
                        </Link>
                        <Link to={`/rating/${profileUser.username}`}>
                          <button className="report-button bg-success">⭐ Rate</button>
                        </Link>
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="edit-links">
                {user?.username === username && (
                  <Link to="/edit_profile">
                    <button className="edit-button">✎ Edit Profile</button>
                  </Link>
                )}

                {/* Portfolio Links */}
                <div className="portfolio-links">
                  <a
                    href={profileUser?.githubLink ? profileUser.githubLink : "#"}
                    target={profileUser?.githubLink ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    <img src="/assets/images/github.png" className="link" alt="Github" />
                  </a>
                  <a
                    href={profileUser?.linkedinLink ? profileUser.linkedinLink : "#"}
                    target={profileUser?.linkedinLink ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    <img src="/assets/images/linkedin.png" className="link" alt="LinkedIn" />
                  </a>
                  <a
                    href={profileUser?.portfolioLink ? profileUser.portfolioLink : "#"}
                    target={profileUser?.portfolioLink ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    <img src="/assets/images/link.png" className="link" alt="Portfolio" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bio-section">
              <h2>💼 About Me</h2>
              <p className="bio">{profileUser?.bio || "No bio available"}</p>
            </div>

            {/* Availability */}
            <div className="availability-section">
              <h2>⏰ Availability</h2>
              <div className="availability-tags">
                {profileUser?.availability?.length > 0 ? (
                  profileUser.availability.map((time, index) => (
                    <span key={index} className="availability-tag">
                      {time}
                    </span>
                  ))
                ) : (
                  <p style={{ opacity: 0.7 }}>No availability specified</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="skills">
              <h2>🚀 Skills & Expertise</h2>
              {/* Render skill boxes here */}
              <div className="skill-boxes">
                {profileUser?.skillsProficientAt?.length > 0 ? (
                  profileUser.skillsProficientAt.map((skill, index) => (
                    <div className="skill-box" style={{ fontSize: "16px" }} key={index}>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p style={{ opacity: 0.7 }}>No skills listed</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="education">
              <h2>🎓 Education</h2>

              <div className="education-boxes">
                {/* Render education boxes here */}
                {profileUser?.education && profileUser.education.length > 0 ? (
                  profileUser.education.map((edu, index) => (
                    <Box
                      key={index}
                      head={edu?.institution}
                      date={convertDate(edu?.startDate) + " - " + convertDate(edu?.endDate)}
                      spec={edu?.degree}
                      desc={edu?.description}
                      score={edu?.score}
                    />
                  ))
                ) : (
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1.5rem', 
                    borderRadius: '15px', 
                    textAlign: 'center',
                    opacity: 0.7
                  }}>
                    No education details available
                  </div>
                )}
              </div>
            </div>

            {/* Projects */}
            {profileUser?.projects && profileUser?.projects.length > 0 && (
              <div className="projects">
                <h2>💻 Projects</h2>

                <div className="project-boxes">
                  {profileUser.projects.map((project, index) => (
                    <Box
                      key={index}
                      head={project?.title}
                      date={convertDate(project?.startDate) + " - " + convertDate(project?.endDate)}
                      desc={project?.description}
                      skills={project?.techStack}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};



export default Profile;