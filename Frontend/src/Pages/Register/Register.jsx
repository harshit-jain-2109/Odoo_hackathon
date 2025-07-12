import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { skills } from "./Skills";
import axios from "axios";
import "./Register.css";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: [],
  });
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);

  const [activeKey, setActiveKey] = useState("registration");

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const { data } = await axios.get("/user/unregistered/getDetails");
        console.log("User Data: ", data.data);
        const edu = data?.data?.education;
        edu.forEach((ele) => {
          ele.id = uuidv4();
        });
        if (edu.length === 0) {
          edu.push({
            id: uuidv4(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            score: "",
            description: "",
          });
        }
        const proj = data?.data?.projects;
        proj.forEach((ele) => {
          ele.id = uuidv4();
        });
        console.log(proj);
        if (proj) {
          setTechStack(proj.map((item) => "Select some Tech Stack"));
        }
        setForm((prevState) => ({
          ...prevState,
          name: data?.data?.name,
          email: data?.data?.email,
          username: data?.data?.username,
          skillsProficientAt: data?.data?.skillsProficientAt,
          skillsToLearn: data?.data?.skillsToLearn,
          linkedinLink: data?.data?.linkedinLink,
          githubLink: data?.data?.githubLink,
          portfolioLink: data?.data?.portfolioLink,
          education: edu,
          bio: data?.data?.bio,
          projects: proj ? proj : prevState.projects,
        }));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
          navigate("/login");
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab", "Preview"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked ? [...prevState[name], value] : prevState[name].filter((item) => item !== value),
      }));
    } else {
      if (name === "bio" && value.length > 500) {
        toast.error("Bio should be less than 500 characters");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddSkill = (e) => {
    const { name } = e.target;
    if (name === "skill_to_learn") {
      if (skillsToLearn === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsToLearn.includes(skillsToLearn)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsProficientAt.includes(skillsToLearn)) {
        toast.error("Skill already added in skills proficient at");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: [...prevState.skillsToLearn, skillsToLearn],
      }));
    } else {
      if (skillsProficientAt === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsProficientAt.includes(skillsProficientAt)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsToLearn.includes(skillsProficientAt)) {
        toast.error("Skill already added in skills to learn");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: [...prevState.skillsProficientAt, skillsProficientAt],
      }));
    }
  };

  const handleRemoveSkill = (e, temp) => {
    const skill = e.target.innerText.split(" ")[0];
    if (temp === "skills_proficient_at") {
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: prevState.skillsProficientAt.filter((item) => item !== skill),
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: prevState.skillsToLearn.filter((item) => item !== skill),
      }));
    }
  };

  const handleRemoveEducation = (e, tid) => {
    const updatedEducation = form.education.filter((item, i) => item.id !== tid);
    setForm((prevState) => ({
      ...prevState,
      education: updatedEducation,
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      projects: prevState.projects.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const validateRegForm = () => {
    if (!form.username) {
      toast.error("Username is empty");
      return false;
    }
    if (!form.skillsProficientAt.length) {
      toast.error("Enter atleast one Skill you are proficient at");
      return false;
    }
    if (!form.skillsToLearn.length) {
      toast.error("Enter atleast one Skill you want to learn");
      return false;
    }
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) {
      toast.error("Enter atleast one link among portfolio, github and linkedin");
      return false;
    }
    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.githubLink && githubRegex.test(form.githubLink) === false) {
      toast.error("Enter a valid github link");
      return false;
    }
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.linkedinLink && linkedinRegex.test(form.linkedinLink) === false) {
      toast.error("Enter a valid linkedin link");
      return false;
    }
    if (form.portfolioLink && form.portfolioLink.includes("http") === false) {
      toast.error("Enter a valid portfolio link");
      return false;
    }
    return true;
  };

  const validateEduForm = () => {
    form.education.forEach((edu, index) => {
      if (!edu.institution) {
        toast.error(`Institution name is empty in education field ${index + 1}`);
        return false;
      }
      if (!edu.degree) {
        toast.error("Degree is empty");
        return false;
      }
      if (!edu.startDate) {
        toast.error("Start date is empty");
        return false;
      }
      if (!edu.endDate) {
        toast.error("End date is empty");
        return false;
      }
      if (!edu.score) {
        toast.error("Score is empty");
        return false;
      }
    });
    return true;
  };

  const validateAddForm = () => {
    if (!form.bio) {
      toast.error("Bio is empty");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }
    var flag = true;
    form.projects.forEach((project, index) => {
      if (!project.title) {
        toast.error(`Title is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.techStack.length) {
        toast.error(`Tech Stack is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.startDate) {
        toast.error(`Start Date is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.endDate) {
        toast.error(`End Date is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.projectLink) {
        toast.error(`Project Link is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.description) {
        toast.error(`Description is empty in project ${index + 1}`);
        flag = false;
      }
      if (project.startDate > project.endDate) {
        toast.error(`Start Date should be less than End Date in project ${index + 1}`);
        flag = false;
      }
      if (!project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        toast.error(`Please provide valid project link in project ${index + 1}`);
        flag = false;
      }
    });
    return flag;
  };

  const handleSaveRegistration = async () => {
    const check = validateRegForm();
    if (check) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveRegDetails", form);
        toast.success("Details saved successfully");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSaveEducation = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    if (check1 && check2) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveEduDetail", form);
        toast.success("Details saved successfully");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSaveAdditional = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    const check3 = await validateAddForm();
    if (check1 && check2 && check3) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveAddDetail", form);
        toast.success("Details saved successfully");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    const check3 = validateAddForm();
    if (check1 && check2 && check3) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/registerUser", form);
        toast.success("Registration Successful");
        navigate("/discover");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  return (
    <div className="register_page">
      {/* Floating Bubble Elements */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      <h1 className="register_title">Registration Form</h1>
      
      {loading ? (
        <div className="register_section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="register_section">
          {/* Custom Tab Navigation */}
          <div className="custom-tabs">
            <button 
              className={`custom-tab ${activeKey === 'registration' ? 'active' : ''}`}
              onClick={() => setActiveKey('registration')}
            >
              📝 Registration
            </button>
            <button 
              className={`custom-tab ${activeKey === 'education' ? 'active' : ''}`}
              onClick={() => setActiveKey('education')}
            >
              🎓 Education
            </button>
            <button 
              className={`custom-tab ${activeKey === 'longer-tab' ? 'active' : ''}`}
              onClick={() => setActiveKey('longer-tab')}
            >
              💼 Additional
            </button>
            <button 
              className={`custom-tab ${activeKey === 'Preview' ? 'active' : ''}`}
              onClick={() => setActiveKey('Preview')}
            >
              👁️ Preview
            </button>
          </div>

          {/* Registration Tab */}
          {activeKey === 'registration' && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.name}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  onChange={handleInputChange}
                  value={form.username}
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">LinkedIn Link</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    className="form-input"
                    value={form.linkedinLink}
                    onChange={handleInputChange}
                    placeholder="Enter your LinkedIn link"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Link</label>
                  <input
                    type="url"
                    name="githubLink"
                    className="form-input"
                    value={form.githubLink}
                    onChange={handleInputChange}
                    placeholder="Enter your GitHub link"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio Link</label>
                <input
                  type="url"
                  name="portfolioLink"
                  className="form-input"
                  value={form.portfolioLink}
                  onChange={handleInputChange}
                  placeholder="Enter your portfolio link"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills Proficient At</label>
                <select
                  className="form-select"
                  value={skillsProficientAt}
                  onChange={(e) => setSkillsProficientAt(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                {form.skillsProficientAt.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {form.skillsProficientAt.map((skill, index) => (
                      <span
                        key={index}
                        className="skill-badge"
                        onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
                      >
                        {skill} <span className="remove-icon">×</span>
                      </span>
                    ))}
                  </div>
                )}
                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '10px' }}
                  name="skill_proficient_at" 
                  onClick={handleAddSkill}
                >
                  Add Skill
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Skills To Learn</label>
                <select
                  className="form-select"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                {form.skillsToLearn.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {form.skillsToLearn.map((skill, index) => (
                      <span
                        key={index}
                        className="skill-badge"
                        onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
                      >
                        {skill} <span className="remove-icon">×</span>
                      </span>
                    ))}
                  </div>
                )}
                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '10px' }}
                  name="skill_to_learn" 
                  onClick={handleAddSkill}
                >
                  Add Skill
                </button>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveRegistration} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <span className="loading-spinner"></span> : "Save"}
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeKey === 'education' && (
            <div>
              {form.education.map((edu, index) => (
                <div className="card" key={edu.id}>
                  <div className="card-header">
                    <h3 className="card-title">Education {index + 1}</h3>
                    {index !== 0 && (
                      <button 
                        className="remove-card"
                        onClick={(e) => handleRemoveEducation(e, edu.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Institution Name</label>
                      <input
                        type="text"
                        name="institution"
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Enter institution name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Enter degree"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="form-input"
                        value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="form-input"
                        value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade/Percentage</label>
                    <input
                      type="number"
                      name="score"
                      className="form-input"
                      value={edu.score}
                      onChange={(e) => handleEducationChange(e, index)}
                      placeholder="Enter grade/percentage"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-textarea"
                      value={edu.description}
                      onChange={(e) => handleEducationChange(e, index)}
                      placeholder="Enter achievements or experience"
                    />
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setForm((prevState) => ({
                      ...prevState,
                      education: [
                        ...prevState.education,
                        {
                          id: uuidv4(),
                          institution: "",
                          degree: "",
                          startDate: "",
                          endDate: "",
                          score: "",
                          description: "",
                        },
                      ],
                    }));
                  }}
                >
                  Add Education
                </button>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveEducation} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <span className="loading-spinner"></span> : "Save"}
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Additional Tab */}
          {activeKey === 'longer-tab' && (
            <div>
              <div className="form-group">
                <label className="form-label">Bio (Max 500 Characters)</label>
                <textarea
                  name="bio"
                  className="form-textarea"
                  value={form.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  style={{ minHeight: '120px' }}
                />
                <small style={{ color: '#666' }}>
                  {form.bio.length}/500 characters
                </small>
              </div>

              <div>
                <label className="form-label">Projects</label>
                {form.projects.map((project, index) => (
                  <div className="card" key={project.id}>
                    <div className="card-header">
                      <h3 className="card-title">Project {index + 1}</h3>
                      <button
                        className="remove-card"
                        onClick={() => {
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.filter((item) => item.id !== project.id),
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-input"
                        value={project.title}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="Enter project title"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tech Stack</label>
                      <select
                        className="form-select"
                        value={techStack[index]}
                        onChange={(e) => {
                          setTechStack((prevState) => prevState.map((item, i) => (i === index ? e.target.value : item)));
                        }}
                      >
                        <option>Select some Tech Stack</option>
                        {skills.map((skill, index) => (
                          <option key={index} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      {form.projects[index].techStack.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {form.projects[index].techStack.map((skill, i) => (
                            <span
                              key={i}
                              className="skill-badge"
                              onClick={(e) => {
                                setForm((prevState) => ({
                                  ...prevState,
                                  projects: prevState.projects.map((item, i) =>
                                    i === index
                                      ? { ...item, techStack: item.techStack.filter((item) => item !== skill) }
                                      : item
                                  ),
                                }));
                              }}
                            >
                              {skill} <span className="remove-icon">×</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={(e) => {
                          if (techStack[index] === "Select some Tech Stack") {
                            toast.error("Select a tech stack to add");
                            return;
                          }
                          if (form.projects[index].techStack.includes(techStack[index])) {
                            toast.error("Tech Stack already added");
                            return;
                          }
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.map((item, i) =>
                              i === index ? { ...item, techStack: [...item.techStack, techStack[index]] } : item
                            ),
                          }));
                        }}
                      >
                        Add Tech Stack
                      </button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          className="form-input"
                          value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          className="form-input"
                          value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project Link</label>
                      <input
                        type="url"
                        name="projectLink"
                        className="form-input"
                        value={project.projectLink}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="Enter project link"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project Description</label>
                      <textarea
                        name="description"
                        className="form-textarea"
                        value={project.description}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="Describe your project..."
                        style={{ minHeight: '100px' }}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setForm((prevState) => ({
                        ...prevState,
                        projects: [
                          ...prevState.projects,
                          {
                            id: uuidv4(),
                            title: "",
                            techStack: [],
                            startDate: "",
                            endDate: "",
                            projectLink: "",
                            description: "",
                          },
                        ],
                      }));
                      setTechStack([...techStack, "Select some Tech Stack"]);
                    }}
                  >
                    Add Project
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveAdditional} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <span className="loading-spinner"></span> : "Save"}
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeKey === 'Preview' && (
            <div>
              <div className="preview-section">
                <h2 className="preview-title">Registration Preview</h2>
                
                <div className="preview-card">
                  <h3>Personal Information</h3>
                  <div className="preview-grid">
                    <div><strong>Name:</strong> {form.name}</div>
                    <div><strong>Email:</strong> {form.email}</div>
                    <div><strong>Username:</strong> {form.username}</div>
                  </div>
                  
                  <div className="preview-links">
                    {form.linkedinLink && (
                      <div><strong>LinkedIn:</strong> <a href={form.linkedinLink} target="_blank" rel="noopener noreferrer">{form.linkedinLink}</a></div>
                    )}
                    {form.githubLink && (
                      <div><strong>GitHub:</strong> <a href={form.githubLink} target="_blank" rel="noopener noreferrer">{form.githubLink}</a></div>
                    )}
                    {form.portfolioLink && (
                      <div><strong>Portfolio:</strong> <a href={form.portfolioLink} target="_blank" rel="noopener noreferrer">{form.portfolioLink}</a></div>
                    )}
                  </div>
                </div>

                <div className="preview-card">
                  <h3>Skills</h3>
                  <div className="skills-section">
                    <div>
                      <strong>Proficient At:</strong>
                      <div className="skills-preview">
                        {form.skillsProficientAt.map((skill, index) => (
                          <span key={index} className="skill-badge-preview">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Want to Learn:</strong>
                      <div className="skills-preview">
                        {form.skillsToLearn.map((skill, index) => (
                          <span key={index} className="skill-badge-preview">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="preview-card">
                  <h3>Education</h3>
                  {form.education.map((edu, index) => (
                    <div key={edu.id} className="education-preview">
                      <h4>{edu.institution}</h4>
                      <div className="education-details">
                        <div><strong>Degree:</strong> {edu.degree}</div>
                        <div><strong>Duration:</strong> {edu.startDate} - {edu.endDate}</div>
                        <div><strong>Score:</strong> {edu.score}</div>
                        {edu.description && <div><strong>Description:</strong> {edu.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="preview-card">
                  <h3>Bio</h3>
                  <p className="bio-preview">{form.bio}</p>
                </div>

                {form.projects.length > 0 && (
                  <div className="preview-card">
                    <h3>Projects</h3>
                    {form.projects.map((project, index) => (
                      <div key={project.id} className="project-preview">
                        <h4>{project.title}</h4>
                        <div className="project-details">
                          <div><strong>Duration:</strong> {project.startDate} - {project.endDate}</div>
                          <div><strong>Link:</strong> <a href={project.projectLink} target="_blank" rel="noopener noreferrer">{project.projectLink}</a></div>
                          <div><strong>Tech Stack:</strong>
                            <div className="tech-stack-preview">
                              {project.techStack.map((tech, i) => (
                                <span key={i} className="skill-badge-preview">{tech}</span>
                              ))}
                            </div>
                          </div>
                          <div><strong>Description:</strong> {project.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-success" 
                  onClick={handleSubmit} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <span className="loading-spinner"></span> : "Submit Registration"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Register;