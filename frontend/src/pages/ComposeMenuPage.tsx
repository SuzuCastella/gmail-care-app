import React from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const ComposeMenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <KotoriHeader message="メールの作成ページです" />

      <div style={buttonContainerStyle}>
        <ActionButton
          text="新規メール作成"
          color="#3b82f6"
          onClick={() => navigate("/compose/new")}
        />
        <ActionButton
          text="下書き一覧"
          color="#10b981"
          onClick={() => navigate("/compose/drafts")}
        />
      </div>
    </div>
  );
};

export default ComposeMenuPage;

// ✅ 共通ボタンコンポーネント
const ActionButton = ({
  text,
  color,
  onClick,
}: {
  text: string;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: color,
      color: "white",
      fontSize: "1.5rem",
      padding: "1rem 2rem",
      borderRadius: "0.75rem",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      width: "100%",
      maxWidth: "300px",
    }}
  >
    {text}
  </button>
);

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
  flexDirection: "column",
  gap: "2rem",
  marginTop: "3rem",
};
