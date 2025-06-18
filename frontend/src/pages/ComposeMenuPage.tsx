import React from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const ComposeMenuPage: React.FC = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: "新規メール作成",
      icon: "/images/compose_page1.png",
      onClick: () => navigate("/compose/new"),
    },
    {
      label: "下書き一覧",
      icon: "/images/compose_page2.png",
      onClick: () => navigate("/compose/drafts"),
    },
  ];

  return (
    <div style={containerStyle}>
      <KotoriHeader message="メールの作成ページです" />
      <div style={buttonContainerStyle}>
        {buttons.map((btn, idx) => (
          <button key={idx} onClick={btn.onClick} style={buttonStyle}>
            <img src={btn.icon} alt={btn.label} style={iconStyle} />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComposeMenuPage;

// --- スタイル ---
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "2rem",
  marginTop: "3rem",
};

const buttonStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "220px",
  height: "200px",
  border: "2px solid #3b82f6",
  borderRadius: "1rem",
  backgroundColor: "#fff",
  color: "#111",
  fontSize: "1.5rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const iconStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  marginBottom: "1rem",
};

// ホバー用にCSS追加
const style = document.createElement("style");
style.innerHTML = `
  button:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);
