import React from "react";
import { useNavigate } from "react-router-dom";

const KotoriMenuPage: React.FC = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: "日記を記入する",
      icon: "/images/kotori_diary1.png",
      onClick: () => navigate("/kotori-diary"),
    },
    {
      label: "ことりの成長を見る",
      icon: "/images/kotori_diary2.png",
      onClick: () => navigate("/kotori-growth"),
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <img
          src="/images/home.png"
          alt="FUMI"
          onClick={() => navigate("/home")}
          style={{ height: "60px", cursor: "pointer" }}
        />
        <div style={kotoriStyle}>
          <img
            src="/images/kotori.png"
            alt="ことり"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <div style={kotoriBubble}>ことり日記メニューです</div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        {buttons.map((btn) => (
          <div
            key={btn.label}
            onClick={btn.onClick}
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <img src={btn.icon} alt={btn.label} style={iconStyle} />
            <span>{btn.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KotoriMenuPage;

// --- CSS in JS ---
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};

const kotoriStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const kotoriBubble: React.CSSProperties = {
  backgroundColor: "#dbeafe",
  border: "1px solid #60a5fa",
  borderRadius: "20px",
  padding: "1rem",
  fontWeight: "bold",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
  justifyItems: "center",
  marginTop: "3rem",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "300px",
  height: "220px",
  backgroundColor: "#fff",
  border: "3px solid #3b82f6",
  borderRadius: "1.5rem",
  color: "#111",
  fontSize: "1.5rem",
  fontWeight: "bold",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.3s ease",
};

const iconStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  marginBottom: "1rem",
};
