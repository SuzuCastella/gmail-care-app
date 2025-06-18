import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { fetchWithAuth } from "../api";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setError("ログイン失敗：メールアドレスまたはパスワードが違います");
        return;
      }

      const data = await res.json();

      // ✅ トークンを保存
      localStorage.setItem("token", data.access_token);

      login({
        email: data.user.email,
        name: data.user.name,
        token: data.access_token,
        icon: data.user.icon || "",
      });

      navigate("/home");
    } catch (err) {
      setError("通信エラーが発生しました");
      console.error(err);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <img
          src="/images/home.png"
          alt="FUMIロゴ"
          style={{ width: "160px", marginBottom: "2rem" }}
        />

        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red", fontSize: "0.9rem", margin: "1rem 0" }}>
            {error}
          </p>
        )}

        <button onClick={handleLogin} style={buttonStyle}>
          ログイン
        </button>
      </div>
    </div>
  );
};

// スタイル定義
const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "1rem",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  padding: "3rem",
  maxWidth: "360px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  marginBottom: "1rem",
  fontSize: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  fontSize: "1.1rem",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: "bold",
};

export default LoginPage;
