import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { skills } from "./Skills";
import axios from "axios";
import "./EditProfile.css";
import Badge from "react-bootstrap/Badge";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../util/UserContext";

// Constants
const AVAILABILITY_OPTIONS = [
  'Weekdays',
  'Weekends',
  'Mornings',
  'Afternoons',
  'Evenings',
  'Flexible',
  'Limited'
];

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    profilePhoto: null,
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    availability: [],
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
    if (user) {
      setForm((prevState) => ({
        ...prevState,
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
        skillsProficientAt: user?.skillsProficientAt || [],
        skillsToLearn: user?.skillsToLearn || [],
        availability: user?.availability || [],
        portfolioLink: user?.portfolioLink || "",
        githubLink: user?.githubLink || "",
        linkedinLink: user?.linkedinLink || "",
        education: user?.education || [{
          id: uuidv4(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          score: "",
          description: "",
        }],
        bio: user?.bio || "",
        projects: user?.projects || [],
      }));
      setTechStack(user?.projects?.map(() => "Select some Tech Stack") || []);
    }
  }, [user]);

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab", "Preview"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    }
  };

  const handleFileChange = async (e) => {
    const data = new FormData();
    data.append("picture", e.target.files[0]);
    try {
      toast.info("Uploading your pic please wait upload confirmation..");
      const response = await axios.post("/user/uploadPicture", data);
      toast.success("Pic uploaded successfully");
      setForm(prev => ({
        ...prev,
        profilePhoto: response.data.data.url,
      }));
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked 
          ? [...prevState[name], value] 
          : prevState[name].filter((item) => item !== value),
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

  const handleAvailabilityChange = (e) => {
    const { value, checked } = e.target;
    setForm(prevState => ({
      ...prevState,
      availability: checked
        ? [...prevState.availability, value]
        : prevState.availability.filter(item => item !== value)
    }));
  };

  const handleAddSkill = (e) => {
    const { name } = e.target;
    const skillToAdd = name === "skill_to_learn" ? skillsToLearn : skillsProficientAt;
    const targetField = name === "skill_to_learn" ? "skillsToLearn" : "skillsProficientAt";
    const otherField = name === "skill_to_learn" ? "skillsProficientAt" : "skillsToLearn";

    if (skillToAdd === "Select some skill") {
      toast.error("Select a skill to add");
      return;
    }
    if (form[targetField].includes(skillToAdd)) {
      toast.error("Skill already added");
      return;
    }
    if (form[otherField].includes(skillToAdd)) {
      toast.error(`Skill already added in ${name === "skill_to_learn" ? "skills proficient at" : "skills to learn"}`);
      return;
    }

    setForm((prevState) => ({
      ...prevState,
      [targetField]: [...prevState[targetField], skillToAdd],
    }));
  };

  const handleRemoveSkill = (e, field) => {
    const skill = e.target.innerText.split(" ")[0];
    setForm((prevState) => ({
      ...prevState,
      [field]: prevState[field].filter((item) => item !== skill),
    }));
  };

  const handleRemoveEducation = (id) => {
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.filter((item) => item.id !== id),
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      projects: prevState.projects.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const validateRegForm = () => {
    if (!form.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (form.skillsProficientAt.length === 0) {
      toast.error("Enter at least one skill you are proficient at");
      return false;
    }
    if (form.skillsToLearn.length === 0) {
      toast.error("Enter at least one skill you want to learn");
      return false;
    }
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) {
      toast.error("Enter at least one link among portfolio, github and linkedin");
      return false;
    }
    
    if (form.githubLink) {
      const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
      if (!githubRegex.test(form.githubLink)) {
        toast.error("Enter a valid github link");
        return false;
      }
    }
    
    if (form.linkedinLink) {
      const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
      if (!linkedinRegex.test(form.linkedinLink)) {
        toast.error("Enter a valid linkedin link");
        return false;
      }
    }
    
    if (form.portfolioLink && !form.portfolioLink.includes("http")) {
      toast.error("Enter a valid portfolio link (must include http/https)");
      return false;
    }
    
    if (form.availability.length === 0) {
      toast.error("Please select at least one availability option");
      return false;
    }
    
    return true;
  };

  const validateEduForm = () => {
    let isValid = true;
    form.education.forEach((edu, index) => {
      if (!edu.institution.trim()) {
        toast.error(`Institution name is required in education ${index + 1}`);
        isValid = false;
      }
      if (!edu.degree.trim()) {
        toast.error(`Degree is required in education ${index + 1}`);
        isValid = false;
      }
      if (!edu.startDate) {
        toast.error(`Start date is required in education ${index + 1}`);
        isValid = false;
      }
      if (!edu.endDate) {
        toast.error(`End date is required in education ${index + 1}`);
        isValid = false;
      }
      if (edu.startDate && edu.endDate && edu.startDate > edu.endDate) {
        toast.error(`Start date must be before end date in education ${index + 1}`);
        isValid = false;
      }
      if (!edu.score) {
        toast.error(`Score is required in education ${index + 1}`);
        isValid = false;
      }
    });
    return isValid;
  };

  const validateAddForm = () => {
    if (!form.bio.trim()) {
      toast.error("Bio is required");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }

    let isValid = true;
    form.projects.forEach((project, index) => {
      if (!project.title.trim()) {
        toast.error(`Title is required in project ${index + 1}`);
        isValid = false;
      }
      if (project.techStack.length === 0) {
        toast.error(`Tech Stack is required in project ${index + 1}`);
        isValid = false;
      }
      if (!project.startDate) {
        toast.error(`Start Date is required in project ${index + 1}`);
        isValid = false;
      }
      if (!project.endDate) {
        toast.error(`End Date is required in project ${index + 1}`);
        isValid = false;
      }
      if (project.startDate && project.endDate && project.startDate > project.endDate) {
        toast.error(`Start Date should be before End Date in project ${index + 1}`);
        isValid = false;
      }
      if (!project.projectLink) {
        toast.error(`Project Link is required in project ${index + 1}`);
        isValid = false;
      }
      if (project.projectLink && !project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        toast.error(`Please provide valid project link in project ${index + 1}`);
        isValid = false;
      }
      if (!project.description.trim()) {
        toast.error(`Description is required in project ${index + 1}`);
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSaveRegistration = async () => {
    if (!validateRegForm()) return;
    
    setSaveLoading(true);
    try {
      const { data } = await axios.post("/user/registered/saveRegDetails", form);
      toast.success("Details saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Some error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveEducation = async () => {
    if (!validateRegForm() || !validateEduForm()) return;
    
    setSaveLoading(true);
    try {
      const { data } = await axios.post("/user/registered/saveEduDetail", form);
      toast.success("Details saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Some error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveAdditional = async () => {
    if (!validateRegForm() || !validateEduForm() || !validateAddForm()) return;
    
    setSaveLoading(true);
    try {
      const { data } = await axios.post("/user/registered/saveAddDetail", form);
      toast.success("Details saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Some error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="register_page">
      <h1 className="m-4" style={{ fontFamily: "Oswald", color: "#3BB4A1" }}>
        Update Profile Details
      </h1>
      {loading ? (
        <div className="row m-auto w-100 d-flex justify-content-center align-items-center" style={{ height: "80.8vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="register_section mb-3">
          <Tabs
            defaultActiveKey="registration"
            id="justify-tab-example"
            className="mb-3"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
          >
            <Tab eventKey="registration" title="Registration">
              <div>
                <label style={{ color: "#3BB4A1" }}>Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  value={form.name}
                  disabled
                />
              </div>
              
              <div className="mt-3">
                <label style={{ color: "#3BB4A1" }}>Profile Photo</label>
                <br />
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Email
                </label>
                <br />
                <input
                  type="text"
                  name="email"
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  value={form.email}
                  disabled
                />
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Username
                </label>
                <br />
                <input
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  value={form.username}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Linkedin Link
                </label>
                <br />
                <input
                  type="text"
                  name="linkedinLink"
                  value={form.linkedinLink}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  placeholder="Enter your Linkedin link"
                />
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Github Link
                </label>
                <br />
                <input
                  type="text"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  placeholder="Enter your Github link"
                />
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Portfolio Link
                </label>
                <br />
                <input
                  type="text"
                  name="portfolioLink"
                  value={form.portfolioLink}
                  onChange={handleInputChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #3BB4A1",
                    padding: "5px",
                    width: "100%",
                  }}
                  placeholder="Enter your portfolio link"
                />
              </div>
              
              {/* Availability Section */}
              <div className="mt-3">
                <label style={{ color: "#3BB4A1" }}>Availability</label>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {AVAILABILITY_OPTIONS.map(option => (
                    <div key={option} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`availability-${option}`}
                        value={option}
                        checked={form.availability.includes(option)}
                        onChange={handleAvailabilityChange}
                      />
                      <label className="form-check-label" htmlFor={`availability-${option}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mt-3" style={{ color: "#3BB4A1" }}>
                  Skills Proficient At
                </label>
                <br />
                <Form.Select
                  aria-label="Default select example"
                  value={skillsProficientAt}
                  onChange={(e) => setSkillsProficientAt(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form.skillsProficientAt.length > 0 && (
                  <div className="mt-2">
                    {form.skillsProficientAt.map((skill, index) => (
                      <Badge
                        key={index}
                        bg="secondary"
                        className="me-2 mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleRemoveSkill(e, "skillsProficientAt")}
                      >
                        {skill} &#10005;
                      </Badge>
                    ))}
                  </div>
                )}
                <button 
                  className="btn btn-primary mt-2"
                  name="skill_proficient_at" 
                  onClick={handleAddSkill}
                >
                  Add Skill
                </button>
              </div>
              
              <div className="mt-3">
                <label style={{ color: "#3BB4A1" }}>Skills To Learn</label>
                <br />
                <Form.Select
                  aria-label="Default select example"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form.skillsToLearn.length > 0 && (
                  <div className="mt-2">
                    {form.skillsToLearn.map((skill, index) => (
                      <Badge
                        key={index}
                        bg="secondary"
                        className="me-2 mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleRemoveSkill(e, "skillsToLearn")}
                      >
                        {skill} &#10005;
                      </Badge>
                    ))}
                  </div>
                )}
                <button 
                  className="btn btn-primary mt-2"
                  name="skill_to_learn" 
                  onClick={handleAddSkill}
                >
                  Add Skill
                </button>
              </div>
              
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveRegistration} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <Spinner animation="border" size="sm" /> : "Save"}
                </button>
                <button 
                  onClick={handleNext} 
                  className="mt-2 btn btn-primary"
                >
                  Next
                </button>
              </div>
            </Tab>
            
            <Tab eventKey="education" title="Education">
              {form.education.map((edu, index) => (
                <div className="border border-dark rounded-1 p-3 mb-3" key={edu.id}>
                  {index !== 0 && (
                    <div className="text-end">
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveEducation(edu.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="mb-3">
                    <label style={{ color: "#3BB4A1" }}>Institution Name</label>
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(e, index)}
                      className="form-control"
                      placeholder="Enter your institution name"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label style={{ color: "#3BB4A1" }}>Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(e, index)}
                      className="form-control"
                      placeholder="Enter your degree"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label style={{ color: "#3BB4A1" }}>Grade/Percentage</label>
                    <input
                      type="text"
                      name="score"
                      value={edu.score}
                      onChange={(e) => handleEducationChange(e, index)}
                      className="form-control"
                      placeholder="Enter your grade/percentage"
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label style={{ color: "#3BB4A1" }}>Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ color: "#3BB4A1" }}>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label style={{ color: "#3BB4A1" }}>Description</label>
                    <input
                      type="text"
                      name="description"
                      value={edu.description}
                      onChange={(e) => handleEducationChange(e, index)}
                      className="form-control"
                      placeholder="Enter your experience or achievements"
                    />
                  </div>
                </div>
              ))}
              
              <div className="text-center my-3">
                <button
                  className="btn btn-primary"
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
              
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveEducation} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <Spinner animation="border" size="sm" /> : "Save"}
                </button>
                <button 
                  onClick={handleNext} 
                  className="mt-2 btn btn-primary"
                >
                  Next
                </button>
              </div>
            </Tab>
            
            <Tab eventKey="longer-tab" title="Additional">
              <div className="mb-3">
                <label style={{ color: "#3BB4A1" }}>Bio (Max 500 Characters)</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="4"
                  placeholder="Enter your bio"
                />
                <div className="text-end">
                  <small>{form.bio.length}/500 characters</small>
                </div>
              </div>
              
              <div className="mb-3">
                <label style={{ color: "#3BB4A1" }}>Projects</label>
                
                {form.projects.map((project, index) => (
                  <div className="border border-dark rounded-1 p-3 mb-3" key={project.id}>
                    <div className="text-end">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.filter((item) => item.id !== project.id),
                          }));
                          setTechStack((prevState) => prevState.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label style={{ color: "#3BB4A1" }}>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        className="form-control"
                        placeholder="Enter your project title"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label style={{ color: "#3BB4A1" }}>Tech Stack</label>
                      <div className="d-flex">
                        <Form.Select
                          value={techStack[index] || "Select some Tech Stack"}
                          onChange={(e) => {
                            const newTechStack = [...techStack];
                            newTechStack[index] = e.target.value;
                            setTechStack(newTechStack);
                          }}
                        >
                          <option>Select some Tech Stack</option>
                          {skills.map((skill, idx) => (
                            <option key={idx} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </Form.Select>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            if (!techStack[index] || techStack[index] === "Select some Tech Stack") {
                              toast.error("Select a tech stack to add");
                              return;
                            }
                            if (project.techStack.includes(techStack[index])) {
                              toast.error("Tech Stack already added");
                              return;
                            }
                            handleAdditionalChange({
                              target: {
                                name: "techStack",
                                value: [...project.techStack, techStack[index]]
                              }
                            }, index);
                          }}
                        >
                          Add
                        </button>
                      </div>
                      
                      {project.techStack.length > 0 && (
                        <div className="mt-2">
                          {project.techStack.map((skill, i) => (
                            <Badge
                              key={i}
                              bg="secondary"
                              className="me-2 mb-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                handleAdditionalChange({
                                  target: {
                                    name: "techStack",
                                    value: project.techStack.filter(t => t !== skill)
                                  }
                                }, index);
                              }}
                            >
                              {skill} &#10005;
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label style={{ color: "#3BB4A1" }}>Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ color: "#3BB4A1" }}>End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                          className="form-control"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label style={{ color: "#3BB4A1" }}>Project Link</label>
                      <input
                        type="text"
                        name="projectLink"
                        value={project.projectLink}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        className="form-control"
                        placeholder="Enter your project link"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label style={{ color: "#3BB4A1" }}>Description</label>
                      <textarea
                        name="description"
                        value={project.description}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        className="form-control"
                        rows="3"
                        placeholder="Enter your project description"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setTechStack([...techStack, "Select some Tech Stack"]);
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
                    }}
                  >
                    Add Project
                  </button>
                </div>
              </div>
              
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button 
                  className="btn btn-warning" 
                  onClick={handleSaveAdditional} 
                  disabled={saveLoading}
                >
                  {saveLoading ? <Spinner animation="border" size="sm" /> : "Save"}
                </button>
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EditProfile;