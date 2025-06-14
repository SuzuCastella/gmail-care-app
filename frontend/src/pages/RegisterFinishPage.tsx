import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterFinishPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToLogin = () => {
    const form = location.state;

    if (!form) {
      alert("情報が不足しています");
      return;
    }

    // ユーザー情報をlocalStorageなどに保存
    const userData = {
      email: form.email,
      name: form.name,
      token: form.token, // ← このトークンは今後API設計により柔軟に
      icon: form.icon, // ✅ ここで選んだアイコンを保存！
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ebf8ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "2rem",
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          maxWidth: "960px",
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* ことり画像 */}
        <img
          src="/images/kotori.png"
          alt="ことり"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            border: "2px solid #90cdf4",
          }}
        />

        {/* 吹き出し */}
        <div
          style={{
            backgroundColor: "#bee3f8",
            border: "1px solid #90cdf4",
            borderRadius: "1rem",
            padding: "1.25rem",
            position: "relative",
            flex: 1,
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#1a202c",
          }}
        >
          入力ありがとうございました！
          <br />
          これにて登録は終了です。
          <br />
          使い方等が分からなければ、ぜひページ上部の「ことり」に話しかけてくださいね！
          {/* 吹き出しのしっぽ */}
          <div
            style={{
              position: "absolute",
              left: "-12px",
              top: "40px",
              width: "20px",
              height: "20px",
              backgroundColor: "#bee3f8",
              borderLeft: "1px solid #90cdf4",
              borderTop: "1px solid #90cdf4",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* ボタン */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={handleGoToLogin}
            style={{
              backgroundColor: "#3182ce",
              color: "#fff",
              padding: "0.75rem 2rem",
              fontSize: "1.1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              width: "140px",
            }}
          >
            次へ⇨
          </button>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: "#fff",
              color: "#3182ce",
              border: "2px solid #3182ce",
              padding: "0.75rem 2rem",
              fontSize: "1.1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
              width: "140px",
            }}
          >
            ⇦戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterFinishPage;
