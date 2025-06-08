import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fefefe",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      {/* 上部：FUMIロゴとことり */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <img
          src="/images/home.png"
          alt="FUMI"
          onClick={() => handleNavigate("/inbox")}
          style={{
            height: "60px",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img
            src="/images/kotori.png"
            alt="ことり"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <div
            style={{
              backgroundColor: "#dbeafe",
              border: "1px solid #60a5fa",
              borderRadius: "20px",
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: "bold",
              maxWidth: "400px",
            }}
          >
            「ことり」です。分からないことがあったら、色々聞いてください！
          </div>
        </div>
      </div>

      {/* メインボタン */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          marginTop: "3rem",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {[
          { label: "受信トレイ", path: "/inbox" },
          { label: "送信済み", path: "/sent" },
          { label: "思い出", path: "/memory" },
          { label: "新規メール", path: "/compose" },
          { label: "ゴミ箱", path: "/trash" },
          { label: "設定/使い方", path: "/settings" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleNavigate(btn.path)}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              transition: "background 0.2s ease",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
