import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProfileCard from "./ProfileCard";
import "./Discover.css";
import Search from "./Search";
import Spinner from "react-bootstrap/Spinner";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [webDevUsers, setWebDevUsers] = useState([]);
  const [mlUsers, setMlUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("for-you");
  
  // Search related state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/user/registered/getDetails`);
        console.log(data.data);
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    };

    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover");
        console.log(data);
        setDiscoverUsers(data.data.forYou);
        setWebDevUsers(data.data.webDev);
        setMlUsers(data.data.ml);
        setOtherUsers(data.data.others);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
    getDiscoverUsers();
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Search functionality
  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      
      // API call to search users
      const { data } = await axios.get(`/user/search?q=${encodeURIComponent(query.trim())}`);
      setSearchResults(data.data || []);
      setShowSearchResults(true);
      setActiveSection("search");
    } catch (error) {
      console.log(error);
      
      // Fallback: Search in existing data if API fails
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        performLocalSearch(query.trim());
      } else {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Search failed. Please try again.");
        }
        setSearchResults([]);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Fallback local search function
  const performLocalSearch = (query) => {
    const allUsers = [...discoverUsers, ...webDevUsers, ...mlUsers, ...otherUsers];
    const filteredUsers = allUsers.filter(user => 
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.username?.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase()) ||
      user.skillsProficientAt?.some(skill => 
        skill.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setSearchResults(filteredUsers);
    setShowSearchResults(true);
    setActiveSection("search");
    
    if (filteredUsers.length === 0) {
      toast.info(`No results found for "${query}"`);
    } else {
      toast.success(`Found ${filteredUsers.length} result(s) for "${query}"`);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (!query.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleSearchButtonClick = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      toast.warning("Please enter a search term");
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setActiveSection("for-you");
  };

  const sections = [
    { id: "for-you", label: "For You", icon: "👤" },
    { id: "popular", label: "Popular", icon: "🔥" },
    { id: "web-development", label: "Web Development", icon: "💻" },
    { id: "machine-learning", label: "Machine Learning", icon: "🤖" },
    { id: "others", label: "Others", icon: "🌟" },
  ];

  const renderSection = (title, users, sectionId, icon) => (
    <section className="discover-section" id={sectionId}>
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">{icon}</span>
          {title}
        </h2>
        <div className="section-divider"></div>
      </div>
      <div className="profile-cards-grid">
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <ProfileCard
              key={user.username || index}
              profileImageUrl={user?.picture}
              name={user?.name}
              rating={user?.rating ? user?.rating : 4}
              bio={user?.bio}
              skills={user?.skillsProficientAt}
              username={user?.username}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No users found</h3>
            <p>Check back later for new recommendations</p>
          </div>
        )}
      </div>
    </section>
  );

  const renderSearchResults = () => (
    <section className="discover-section" id="search-results">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🔍</span>
          Search Results
          {searchQuery && (
            <span className="search-query">for "{searchQuery}"</span>
          )}
        </h2>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={clearSearch}
          className="clear-search-btn"
        >
          Clear Search
        </Button>
        <div className="section-divider"></div>
      </div>
      
      {searchLoading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Searching...</p>
        </div>
      ) : (
        <div className="profile-cards-grid">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <ProfileCard
                key={user.username || index}
                profileImageUrl={user?.picture}
                name={user?.name}
                rating={user?.rating ? user?.rating : 4}
                bio={user?.bio}
                skills={user?.skillsProficientAt}
                username={user?.username}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="discover-page-professional">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Sidebar Navigation */}
          <Col lg={3} xl={2} className="sidebar-col">
            <nav className="sidebar-nav">
              <div className="nav-brand">
                <h1 className="brand-title">Discover</h1>
                <p className="brand-subtitle">Find talented professionals</p>
              </div>
              
              {/* Search Bar */}
              <div className="search-container">
                <Form className="search-form" onSubmit={handleSearchSubmit}>
                  <div className="search-input-group">
                    <FormControl
                      type="text"
                      placeholder="Search by name, username, skills..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="search-input"
                      disabled={searchLoading}
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="search-btn"
                      onClick={handleSearchButtonClick}
                      disabled={searchLoading}
                      title="Search"
                    >
                      {searchLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "🔍"
                      )}
                    </Button>
                  </div>
                  {searchQuery && (
                    <div className="search-hint">
                      Press Enter or click 🔍 to search
                    </div>
                  )}
                </Form>
              </div>
              
              <div className="nav-menu">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`nav-item ${
                      activeSection === section.id ? "active" : ""
                    }`}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    <span className="nav-label">{section.label}</span>
                  </a>
                ))}
              </div>
            </nav>
          </Col>

          {/* Main Content */}
          <Col lg={9} xl={10} className="main-content-col">
            <div className="main-content">
              {loading ? (
                <div className="loading-container">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="loading-text">Loading professionals...</p>
                </div>
              ) : (
                <div className="content-sections">
                  {showSearchResults ? (
                    renderSearchResults()
                  ) : (
                    <>
                      {renderSection("For You", discoverUsers, "for-you", "👤")}
                      {renderSection("Popular", discoverUsers, "popular", "🔥")}
                      {renderSection("Web Development", webDevUsers, "web-development", "💻")}
                      {renderSection("Machine Learning", mlUsers, "machine-learning", "🤖")}
                      {renderSection("Others", otherUsers, "others", "🌟")}
                    </>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Discover;