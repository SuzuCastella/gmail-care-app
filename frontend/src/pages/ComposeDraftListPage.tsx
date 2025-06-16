import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

interface Draft {
  id: number;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

const ComposeDraftListPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchDrafts();
    }
  }, [userEmail]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/drafts/${encodeURIComponent(userEmail)}`
      );
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      } else {
        console.error("下書き取得失敗");
      }
    } catch (err) {
      console.error("通信エラー", err);
    }
  };

  const handleOpenDraft = (draftId: number) => {
    navigate(`/compose/edit/${draftId}`);
  };

  return (
    <div style={containerStyle}>
      <KotoriHeader message="送信用メールの下書き一覧です" />

      <div style={listStyle}>
        {drafts.length === 0 ? (
          <div style={emptyTextStyle}>📭 下書きはまだありません</div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              onClick={() => handleOpenDraft(draft.id)}
              style={cardStyle}
            >
              <div style={subjectStyle}>{draft.subject || "(件名なし)"}</div>
              <div style={toStyle}>To: {draft.to}</div>
              <div style={bodyStyle}>{draft.body.slice(0, 80)}...</div>
              <div style={dateStyle}>
                保存日時: {new Date(draft.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComposeDraftListPage;

// ✅ スタイル定義

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const listStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "900px",
  marginTop: "1rem",
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  textAlign: "center",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff7f7",
  borderRadius: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  border: "1px solid #e5e7eb",
  cursor: "pointer",
};

const subjectStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.25rem",
};

const toStyle: React.CSSProperties = {
  marginTop: "0.75rem",
  color: "#555",
};

const bodyStyle: React.CSSProperties = {
  marginTop: "0.5rem",
  color: "#666",
};

const dateStyle: React.CSSProperties = {
  textAlign: "right",
  color: "#999",
  marginTop: "1rem",
  fontSize: "0.85rem",
};
