import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const ComposeEditorPage: React.FC = () => {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string>("");
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false); // ✅ 破棄確認フラグ追加

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed.email);
    }
  }, []);

  const handleSend = async () => {
    if (!userEmail) {
      setError("ユーザー情報が取得できませんでした");
      return;
    }
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
      setSuccessMessage("メールを送信しました！");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError("通信エラーが発生しました");
    }
  };

  const handleSaveDraft = async () => {
    if (!userEmail) {
      setError("ユーザー情報が取得できませんでした");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/drafts/", {
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
        setError("下書き保存失敗: " + (err.detail || "不明なエラー"));
        return;
      }
      setSuccessMessage("下書きを保存しました！");
      setTimeout(() => navigate("/compose/drafts"), 1500);
    } catch (err) {
      setError("通信エラーが発生しました");
    }
  };

  const handleDiscard = () => {
    setConfirmDiscard(true);
  };

  const confirmAndDiscard = () => {
    setConfirmDiscard(false);
    navigate("/home");
  };

  const handleAiAssist = () => {
    setBody(body + "\n（AI補助文章がここに挿入されます）");
  };

  return (
    <div style={containerStyle}>
      <KotoriHeader message="新規メールの作成ページです" />

      <div style={backButtonContainerStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          戻る
        </button>
      </div>

      <div style={contentStyle}>
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
              style={instructionInputStyle}
              placeholder="例: もっと丁寧に"
            />
            <button onClick={handleAiAssist} style={aiButtonStyle}>
              AI生成
            </button>
          </div>
        </div>

        <div style={buttonRowStyle}>
          <Button color="#3b82f6" text="送信" onClick={handleSend} />
          <Button color="#10b981" text="下書き保存" onClick={handleSaveDraft} />
          <Button color="#f43f5e" text="破棄" onClick={handleDiscard} />
        </div>

        {confirmDiscard && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              本当に破棄してもよろしいですか？
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={confirmAndDiscard} style={yesButtonStyle}>
                はい
              </button>
              <button
                onClick={() => setConfirmDiscard(false)}
                style={noButtonStyle}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div style={successMessageStyle}>✅ {successMessage}</div>
        )}

        {error && <div style={errorStyle}>⚠ {error}</div>}
      </div>
    </div>
  );
};

export default ComposeEditorPage;

// 共通コンポーネントとスタイル

const Input = ({ label, value, onChange }: any) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
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
      style={inputStyle}
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

const contentStyle: React.CSSProperties = { width: "100%", maxWidth: "800px" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
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

const instructionInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
};

const aiButtonStyle: React.CSSProperties = {
  backgroundColor: "#22c55e",
  color: "white",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  border: "none",
  cursor: "pointer",
};

const buttonRowStyle: React.CSSProperties = {
  marginTop: "2rem",
  display: "flex",
  gap: "1.5rem",
};

const successMessageStyle: React.CSSProperties = {
  color: "green",
  marginTop: "1.5rem",
  fontWeight: "bold",
  fontSize: "1.2rem",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginTop: "1.5rem",
  fontWeight: "bold",
};

const yesButtonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

const noButtonStyle: React.CSSProperties = {
  backgroundColor: "#6b7280",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};
