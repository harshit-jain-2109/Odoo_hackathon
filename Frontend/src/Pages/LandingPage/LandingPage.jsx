import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check visibility of elements for animations
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport && !isVisible[index]) {
          setIsVisible(prev => ({ ...prev, [index]: true }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  };

  const heroSectionStyle = {
    position: "relative",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    overflow: "hidden",
  };

  const heroContentStyle = {
    textAlign: "center",
    zIndex: 10,
    color: "white",
    maxWidth: "800px",
    padding: "0 20px",
  };

  const mainTitleStyle = {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: "800",
    background: "linear-gradient(45deg, #00f5ff, #00d4ff, #0099ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "24px",
    letterSpacing: "-0.02em",
    lineHeight: "1.1",
    textShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
  };

  const subtitleStyle = {
    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
    lineHeight: "1.6",
    fontWeight: "300",
  };

  const ctaButtonStyle = {
    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
    color: "white",
    border: "none",
    padding: "16px 32px",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
    transform: "translateY(0)",
  };

  const floatingElementStyle = {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const whySectionStyle = {
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: "120px 20px",
    position: "relative",
  };

  const sectionTitleStyle = {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: "700",
    textAlign: "center",
    color: "black",
    marginBottom: "80px",
    position: "relative",
  };

  const featuresGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const featureCardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    transition: "all 0.3s ease",
    transform: "translateY(0)",
  };

  const featureIconStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "white",
    fontWeight: "bold",
  };

  const featureData = [
    {
      icon: "🎯",
      title: "Learn From Experts",
      description: "Gain insights and practical knowledge directly from experienced mentors who excel in their respective fields.",
      gradient: "linear-gradient(45deg, #667eea, #764ba2)"
    },
    {
      icon: "💡",
      title: "Share Your Expertise", 
      description: "Have a skill or passion you're eager to share? Become a mentor and contribute to the growth of aspiring learners.",
      gradient: "linear-gradient(45deg, #f093fb, #f5576c)"
    },
    {
      icon: "🤝",
      title: "Collaborative Environment",
      description: "Connect with like-minded individuals, participate in group projects, and engage in discussions that fuel creativity.",
      gradient: "linear-gradient(45deg, #4facfe, #00f2fe)"
    },
    {
      icon: "🌟",
      title: "Diverse Learning Opportunities",
      description: "Explore a wide range of topics and disciplines, from traditional crafts to cutting-edge technologies - all free of cost.",
      gradient: "linear-gradient(45deg, #43e97b, #38f9d7)"
    },
    {
      icon: "📈",
      title: "Continuous Growth",
      description: "Learning is a lifelong journey. Our platform empowers you to continuously expand your knowledge and embrace new opportunities.",
      gradient: "linear-gradient(45deg, #fa709a, #fee140)"
    }
  ];

  const handleButtonClick = () => {
    // Navigate to login page
    navigate('/login');
  };

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-10px)";
    e.currentTarget.style.boxShadow = "0 30px 60px rgba(0, 0, 0, 0.15)";
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
  };

  const handleButtonHover = (e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 107, 107, 0.4)";
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 107, 107, 0.3)";
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        {/* Floating Elements */}
        <div style={{
          ...floatingElementStyle,
          width: "100px",
          height: "100px",
          top: "20%",
          left: "10%",
          animation: "float 6s ease-in-out infinite",
        }}></div>
        <div style={{
          ...floatingElementStyle,
          width: "60px",
          height: "60px",
          top: "70%",
          right: "15%",
          animation: "float 4s ease-in-out infinite reverse",
        }}></div>
        <div style={{
          ...floatingElementStyle,
          width: "80px",
          height: "80px",
          top: "40%",
          right: "20%",
          animation: "float 5s ease-in-out infinite",
        }}></div>
        
        <div style={heroContentStyle}>
          <h1 style={mainTitleStyle}>SKILLIFY</h1>
          <p style={subtitleStyle}>
            Teach what you know.  Learn what you need.
          </p>
          <button 
            style={ctaButtonStyle}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onClick={handleButtonClick}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Why Skill Swap Section */}
      <section style={whySectionStyle}>
        <h2 style={sectionTitleStyle}>
          Why Choose Skillify?
          <div style={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "4px",
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            borderRadius: "2px",
          }}></div>
        </h2>
        
        <div style={featuresGridStyle}>
          {featureData.map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll"
              style={{
                ...featureCardStyle,
                animationDelay: `${index * 0.1}s`,
                opacity: isVisible[index] ? 1 : 0,
                transform: isVisible[index] ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease",
              }}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div style={{
                ...featureIconStyle,
                background: feature.gradient,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2d3748",
                marginBottom: "16px",
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: "#4a5568",
                lineHeight: "1.7",
                fontSize: "1rem",
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-on-scroll {
          transition: all 0.6s ease;
        }
        
        * { 
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;