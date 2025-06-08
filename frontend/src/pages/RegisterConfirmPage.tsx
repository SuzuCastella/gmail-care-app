import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state;

  if (!form) {
    // 情報なしで直接アクセスされた場合
    return <div style={{ padding: "2rem" }}>情報がありません。</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f6ff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* 吹き出し＋ことり */}
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
            ありがとうございます！
            <br />
            あなたが入力した情報は以下でお間違いないですか？
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

      {/* 確認情報 */}
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
          style={{
            width: "100%",
            fontSize: "1.1rem",
            borderSpacing: "0.8rem 1rem",
          }}
        >
          <tbody>
            <tr>
              <td>お名前（漢字）</td>
              <td>{form.nameKanji}</td>
            </tr>
            <tr>
              <td>お名前（よみ）</td>
              <td>{form.nameKana}</td>
            </tr>
            <tr>
              <td>Gmail アドレス</td>
              <td>{form.email}</td>
            </tr>
            <tr>
              <td>パスワード</td>
              <td>{"●".repeat(form.password.length)}</td>
            </tr>
          </tbody>
        </table>

        {/* ボタン */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#ccc",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← 戻る
          </button>
          <button
            onClick={() => navigate("/register/icon", { state: form })}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmPage;
