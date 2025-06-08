import React from "react";
import { useNavigate } from "react-router-dom";

const AuthChoicePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#f0f6ff",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* 上部：ことりと吹き出し */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "2rem",
          maxWidth: "800px",
        }}
      >
        <img
          src="/images/kotori.png"
          alt="ことり"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "9999px",
          }}
        />

        <div
          style={{
            backgroundColor: "#dbeafe",
            color: "#1e3a8a",
            borderRadius: "1rem",
            padding: "1rem 1.5rem",
            fontSize: "1.1rem",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            lineHeight: "1.6",
            maxWidth: "100%",
            position: "relative",
          }}
        >
          <p style={{ margin: 0 }}>
            こんにちは！
            <br />
            メールアプリFUMIへようこそ！
            <br />
            初めて使われる方は「新規登録」へ、
            <br />
            登録済みの方は「ログイン」へ進んでください。
          </p>

          {/* 吹き出しの三角 */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "-16px",
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderRight: "16px solid #dbeafe",
            }}
          />
        </div>
      </div>

      {/* 下部：ボタンエリア */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/register")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "1.2rem 3rem",
            fontSize: "1.5rem",
            borderRadius: "1rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          新規登録
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "1.2rem 3rem",
            fontSize: "1.5rem",
            borderRadius: "1rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  );
};

export default AuthChoicePage;
