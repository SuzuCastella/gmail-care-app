import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MailViewer from "../components/MailViewer";

const MailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
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
      {/* ヘッダー部分 */}
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
          onClick={handleGoHome}
          style={{ height: "60px", cursor: "pointer" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
            メールの内容をAIでやさしくお手伝いします！
          </div>
        </div>
      </div>

      {/* メール詳細＋AI操作部 */}
      <div
        style={{
          marginTop: "3rem",
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        {/* MailViewer統合 */}
        <MailViewer key={id} />
      </div>
    </div>
  );
};

export default MailDetailPage;
