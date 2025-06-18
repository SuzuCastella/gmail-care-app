import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterStep1Page: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nameKanji: "",
    nameKana: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleNext = () => {
    if (!form.nameKanji || !form.nameKana || !form.email || !form.password) {
      setError("すべての項目を入力してください");
      return;
    }
    if (form.email !== form.emailConfirm) {
      setError("メールアドレスが一致しません");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    navigate("/register/confirm", { state: form });
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f6ff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          maxWidth: "900px",
          margin: "0 auto 2rem",
        }}
      >
        <img
          src="/images/kotori.png"
          alt="ことり"
          style={{ width: "80px", height: "80px", borderRadius: "9999px" }}
        />
        <div
          style={{
            position: "relative",
            background: "#dbeafe",
            padding: "1rem 1.5rem",
            borderRadius: "1rem",
            color: "#1e3a8a",
            lineHeight: "1.6",
            fontSize: "1rem",
            flex: 1,
          }}
        >
          <p style={{ margin: 0 }}>
            こんにちは！
            <br />
            あなたのメールのお手伝いをする「ことり」です。
            <br />
            よろしくお願いします。
            <br />
            まずは、自己紹介をお願いします！
          </p>
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

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{ width: "100%", fontSize: "1rem", borderSpacing: "0.5rem" }}
        >
          <tbody>
            <tr>
              <td>お名前（漢字）</td>
              <td>
                <input
                  name="nameKanji"
                  value={form.nameKanji}
                  onChange={handleChange}
                  placeholder="例）山田 太郎"
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td>お名前（よみ）</td>
              <td>
                <input
                  name="nameKana"
                  value={form.nameKana}
                  onChange={handleChange}
                  placeholder="例）やまだ たろう"
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td>Gmail アドレス</td>
              <td>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="例）your@gmail.com"
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td>Gmail アドレス（確認）</td>
              <td>
                <input
                  name="emailConfirm"
                  type="email"
                  value={form.emailConfirm}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td>パスワード（英数記号）</td>
              <td>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </td>
            </tr>
            <tr>
              <td>パスワード（確認）</td>
              <td>
                <input
                  name="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {error && (
          <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold" }}>
            ⚠️ {error}
          </div>
        )}

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button onClick={() => navigate(-1)} style={buttonStyle("gray")}>
            ← 戻る
          </button>
          <button onClick={handleNext} style={buttonStyle("blue")}>
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
};

// 共通スタイル
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
};

const buttonStyle = (color: "blue" | "gray"): React.CSSProperties => ({
  backgroundColor: color === "blue" ? "#2563eb" : "#ccc",
  color: "white",
  fontSize: "1rem",
  padding: "0.7rem 2rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
});

export default RegisterStep1Page;
