import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Mail {
  id: string;
  from_: string;
  subject: string;
  body: string;
  date: string;
}

const MailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mail, setMail] = useState<Mail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMailDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/mail/detail/${id}`);
        const data = await res.json();
        setMail(data);
      } catch (e) {
        console.error("メール詳細取得失敗:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMailDetail();
  }, [id]);

  const handleGoHome = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", fontSize: "1.5rem", textAlign: "center" }}>
        📩 メールを読み込み中です...
      </div>
    );
  }

  if (!mail) {
    return (
      <div style={{ padding: "2rem", fontSize: "1.5rem", textAlign: "center" }}>
        ⚠ メールが見つかりませんでした
      </div>
    );
  }

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
      {/* ✅ ヘッダー統一 */}
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
            メール詳細画面です！
          </div>
        </div>
      </div>

      {/* ✅ メール詳細本体 */}
      <div
        style={{
          background: "#ffffff",
          border: "2px solid #d1d5db",
          borderRadius: "1.5rem",
          padding: "2rem",
          marginTop: "3rem",
          width: "100%",
          maxWidth: "900px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#111827",
          }}
        >
          {mail.subject}
        </h2>

        <p style={{ marginBottom: "0.5rem", color: "#374151" }}>
          📧 From: {mail.from_}
        </p>

        <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
          📅 Date: {mail.date}
        </p>

        <div
          style={{
            background: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "1rem",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            color: "#111827",
            border: "1px solid #d1d5db",
          }}
        >
          {mail.body}
        </div>
      </div>
    </div>
  );
};

export default MailDetailPage;
