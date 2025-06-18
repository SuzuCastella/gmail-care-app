import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";

const RegisterFinishPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state;

  const [error, setError] = useState("");

  if (!form) {
    return <div style={{ padding: "2rem" }}>情報がありません。</div>;
  }

  const handleRegister = async () => {
    setError(""); // 一旦エラーをクリア
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.nameKanji,
          name_kana: form.nameKana,
          icon: form.icon,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        let detail = "登録に失敗しました";

        if (Array.isArray(err.detail)) {
          detail = err.detail
            .map((e: any) => `${e.loc?.[1] ?? ""}: ${e.msg}`)
            .join(", ");
        } else if (typeof err.detail === "string") {
          if (err.detail === "Email already registered") {
            detail = "このアカウントは既に登録されています";
          } else {
            detail = err.detail;
          }
        }

        setError(detail);
        return;
      }

      navigate("/login");
    } catch (err: any) {
      setError("通信エラー: " + err.message);
    }
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
          メールアプリFUMIを使ってみましょう！
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            onClick={handleRegister}
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
          {error && (
            <div
              style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterFinishPage;
