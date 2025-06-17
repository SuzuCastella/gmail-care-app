import React from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const KotoriMenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <KotoriHeader message="ことり日記メニューです" />

      <div style={menuContainerStyle}>
        <button
          onClick={() => navigate("/kotori-diary")}
          style={buttonStyle("#22c55e")}
        >
          📖 日記を記入する
        </button>

        <button
          onClick={() => navigate("/kotori-growth")}
          style={buttonStyle("#f59e0b")}
        >
          🐥 ことりの成長を見る
        </button>
      </div>
    </div>
  );
};

export default KotoriMenuPage;

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const menuContainerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "3rem auto",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

const buttonStyle = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  fontSize: "1.8rem",
  fontWeight: "bold",
  padding: "2rem",
  borderRadius: "1rem",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "background 0.2s ease",
});
