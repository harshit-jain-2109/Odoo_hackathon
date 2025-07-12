import React, { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  };

  const loginBoxStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
    boxShadow: "0 32px 64px rgba(0, 0, 0, 0.2)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    position: "relative",
    zIndex: 10,
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "800",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
    lineHeight: "1.1",
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    color: "#64748b",
    marginBottom: "40px",
    fontWeight: "400",
    lineHeight: "1.6",
  };

  const buttonStyle = {
    background: isHovered 
      ? "linear-gradient(45deg, #667eea, #764ba2)" 
      : "linear-gradient(45deg, #ff6b6b, #ee5a24)",
    color: "white",
    border: "none",
    padding: "16px 32px",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: isHovered 
      ? "0 12px 35px rgba(102, 126, 234, 0.4)" 
      : "0 8px 25px rgba(255, 107, 107, 0.3)",
    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "100%",
    maxWidth: "280px",
    margin: "0 auto",
  };

  const iconStyle = {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
    transform: isHovered ? "scale(1.1)" : "scale(1)",
  };

  const floatingElementStyle = {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const decorativeElementStyle = {
    position: "absolute",
    background: "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
    borderRadius: "50%",
    filter: "blur(1px)",
  };

  return (
    <div style={containerStyle}>
      {/* Floating Background Elements */}
      <div style={{
        ...floatingElementStyle,
        width: "120px",
        height: "120px",
        top: "15%",
        left: "8%",
        animation: "float 6s ease-in-out infinite",
      }}></div>
      <div style={{
        ...floatingElementStyle,
        width: "80px",
        height: "80px",
        top: "70%",
        right: "12%",
        animation: "float 4s ease-in-out infinite reverse",
      }}></div>
      <div style={{
        ...floatingElementStyle,
        width: "100px",
        height: "100px",
        top: "45%",
        right: "25%",
        animation: "float 5s ease-in-out infinite",
      }}></div>
      <div style={{
        ...decorativeElementStyle,
        width: "200px",
        height: "200px",
        top: "10%",
        right: "5%",
        animation: "float 8s ease-in-out infinite",
      }}></div>
      <div style={{
        ...decorativeElementStyle,
        width: "150px",
        height: "150px",
        bottom: "15%",
        left: "5%",
        animation: "float 7s ease-in-out infinite reverse",
      }}></div>

      {/* Login Box */}
      <div style={loginBoxStyle}>
        <div style={{
          position: "absolute",
          top: "-2px",
          left: "-2px",
          right: "-2px",
          bottom: "-2px",
          background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)",
          borderRadius: "24px",
          zIndex: -1,
          opacity: 0.3,
          filter: "blur(8px)",
        }}></div>
        
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>
          Sign in to access your Skillify account and continue your learning journey
        </p>
        
        <button
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleGoogleLogin}
        >
          <FaGoogle style={iconStyle} />
          Continue with Google
        </button>
        
        <div style={{
          marginTop: "32px",
          padding: "20px 0",
          borderTop: "1px solid rgba(100, 116, 139, 0.2)",
        }}>
          <p style={{
            color: "#64748b",
            fontSize: "0.9rem",
            margin: 0,
          }}>
            New to Skillify?{" "}
            <span style={{
              color: "#667eea",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}>
              Join our community
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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

export default Login;