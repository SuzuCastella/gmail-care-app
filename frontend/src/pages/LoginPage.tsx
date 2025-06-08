import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "ログインに失敗しました");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("ログインに成功しました！");
      navigate("/home"); // ✅ ホームへ遷移
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fef6f2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* ロゴとタイトル */}
      <img
        src="/images/kotori.png"
        alt="ことり"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "9999px",
          marginBottom: "1rem",
        }}
      />
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#dc6f00",
          marginBottom: "2rem",
        }}
      >
        FUMI
      </h1>

      {/* ログインカード */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          ログイン
        </h2>

        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          メールアドレス
        </label>
        <input
          type="email"
          placeholder="your@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "1rem",
          }}
        />

        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          パスワード
        </label>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "1rem",
          }}
        />

        {errorMsg && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}
          >
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#3b82f6",
            color: "white",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
