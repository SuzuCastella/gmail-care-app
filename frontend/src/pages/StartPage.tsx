import React from "react";
import { useNavigate } from "react-router-dom";

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#fff8ef",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {/* ロゴ画像 */}
      <img
        src="/images/fumi-logo.png"
        alt="FUMI ロゴ"
        style={{
          width: "360px",
          maxWidth: "80%",
          marginBottom: "2rem",
        }}
      />

      {/* スタートボタン */}
      <button
        onClick={() => navigate("/auth-choice")}
        style={{
          fontSize: "1.5rem",
          padding: "1rem 3rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "9999px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
      >
        スタート
      </button>
    </div>
  );
};

export default StartPage;
