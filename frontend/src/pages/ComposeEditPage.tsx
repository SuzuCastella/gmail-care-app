import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const ComposeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { draftId } = useParams<{ draftId: string }>();

  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed.email);
    }
  }, []);

  useEffect(() => {
    if (!draftId || !userEmail) return;

    const fetchDraft = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/drafts/${encodeURIComponent(userEmail)}`
        );
        if (!res.ok) {
          setError("下書きの取得に失敗しました");
          return;
        }
        const drafts = await res.json();
        const draft = drafts.find((d: any) => d.id === Number(draftId));
        if (!draft) {
          setError("指定の下書きが見つかりません");
          return;
        }

        setTo(draft.to);
        setCc(draft.cc);
        setBcc(draft.bcc);
        setSubject(draft.subject);
        setBody(draft.body);
      } catch (err) {
        setError("通信エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId, userEmail]);

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:8000/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          to,
          cc,
          bcc,
          subject,
          body,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError("送信失敗: " + (err.detail || "不明なエラー"));
        return;
      }
      alert("メールを送信しました！");
      navigate("/home");
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const handleSaveDraft = async () => {
    if (!draftId) {
      setError("下書きIDが取得できません");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/drafts/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          to,
          cc,
          bcc,
          subject,
          body,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError("下書き更新失敗: " + (err.detail || "不明なエラー"));
        return;
      }
      alert("下書きを更新しました！");
      navigate("/compose/drafts");
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const handleDiscard = async () => {
    if (!window.confirm("本当に破棄してもよろしいですか？")) return;

    if (!draftId) {
      navigate("/compose/drafts");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/drafts/${draftId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        setError("破棄失敗: " + (err.detail || "不明なエラー"));
        return;
      }
      alert("下書きを削除しました");
      navigate("/compose/drafts");
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const handleAiAssist = () => {
    setBody(body + "\n（AI補助文章がここに挿入されます）");
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>読み込み中です...</div>;
  }

  return (
    <div style={containerStyle}>
      <KotoriHeader message="下書きメール編集ページです" />

      <div style={backButtonContainerStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          戻る
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        <Input label="To" value={to} onChange={setTo} />
        <Input label="Cc" value={cc} onChange={setCc} />
        <Input label="Bcc" value={bcc} onChange={setBcc} />
        <Input label="Subject" value={subject} onChange={setSubject} />
        <Textarea label="本文" value={body} onChange={setBody} />

        <div style={{ marginTop: "2rem" }}>
          <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            AI補助の指示
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
              }}
              placeholder="例: もっと丁寧に"
            />
            <button
              onClick={handleAiAssist}
              style={{
                backgroundColor: "#22c55e",
                color: "white",
                fontWeight: "bold",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              AI生成
            </button>
          </div>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem" }}>
          <Button color="#3b82f6" text="送信" onClick={handleSend} />
          <Button color="#10b981" text="下書き保存" onClick={handleSaveDraft} />
          <Button color="#f43f5e" text="破棄" onClick={handleDiscard} />
        </div>

        {error && (
          <div
            style={{ color: "red", marginTop: "1.5rem", fontWeight: "bold" }}
          >
            ⚠ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposeEditPage;

// 共通UI部品

const Input = ({ label, value, onChange }: any) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      }}
    />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
    <textarea
      rows={8}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      }}
    />
  </div>
);

const Button = ({ color, text, onClick }: any) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: color,
      color: "white",
      fontWeight: "bold",
      borderRadius: "0.5rem",
      padding: "1rem 2rem",
      border: "none",
      cursor: "pointer",
    }}
  >
    {text}
  </button>
);

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const backButtonContainerStyle: React.CSSProperties = {
  marginTop: "1rem",
  marginBottom: "1rem",
};

const backButtonStyle: React.CSSProperties = {
  backgroundColor: "#6b7280",
  color: "white",
  fontSize: "1rem",
  padding: "0.5rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};
