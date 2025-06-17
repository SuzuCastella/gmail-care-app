import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  fetchMails: () => void;
}

const HomePage: React.FC<Props> = ({ fetchMails }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [gmailStatus, setGmailStatus] = useState<string>("");
  const [kotoriMessage, setKotoriMessage] = useState<string>("ホーム画面です");
  const [loading, setLoading] = useState<boolean>(false);
  const [kotoriEnabled, setKotoriEnabled] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setEmail(parsed.email);
      setKotoriEnabled(parsed.kotori_enabled ?? true);
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleGmailAuth = async () => {
    if (!email) return;
    try {
      const res = await fetch(
        `/auth/gmail_auth?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (res.ok) {
        setGmailStatus("✅ Gmail連携が完了しました！");
      } else {
        setGmailStatus(`❌ 失敗: ${data.error || "原因不明です"}`);
      }
    } catch (e) {
      setGmailStatus("❌ ネットワークエラーです");
    }
  };

  const handleFetchMailsWithKotori = async () => {
    setLoading(true);
    setKotoriMessage("処理中です。しばらくお待ちください...");
    try {
      await fetchMails();
      setKotoriMessage("メールを更新しました！");
    } catch (e) {
      setKotoriMessage("メール取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* ヘッダー */}
      <div style={headerStyle}>
        <img
          src="/images/home.png"
          alt="FUMI"
          onClick={() => handleNavigate("/home")}
          style={{ height: "60px", cursor: "pointer" }}
        />
        <div style={kotoriStyle}>
          <img
            src="/images/kotori.png"
            alt="ことり"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <div style={kotoriBubble}>{kotoriMessage}</div>
        </div>
      </div>

      {/* Gmail連携 */}
      {email && (
        <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem" }}>
          <button onClick={handleGmailAuth} style={gmailButtonStyle}>
            Gmailと連携する
          </button>
          <button
            onClick={handleFetchMailsWithKotori}
            disabled={loading}
            style={updateButtonStyle(loading)}
          >
            {loading ? "更新中..." : "最新のGmailを取得する"}
          </button>
        </div>
      )}

      {gmailStatus && (
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#374151" }}>
          {gmailStatus}
        </p>
      )}

      {/* メインボタン */}
      <div style={menuGridStyle}>
        {[
          { label: "受信トレイ", path: "/inbox", disabled: false },
          { label: "送信済み", path: "/sent", disabled: false },
          {
            label: "ことり日記",
            path: "/kotori-menu",
            disabled: !kotoriEnabled,
          }, // ✅ ここ
          { label: "新規メール", path: "/compose", disabled: false },
          { label: "ゴミ箱", path: "/trash", disabled: false },
          { label: "設定/使い方", path: "/settings", disabled: false },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleNavigate(btn.path)}
            style={{
              ...menuButtonStyle,
              backgroundColor: btn.disabled ? "#9ca3af" : "#3b82f6",
              cursor: btn.disabled ? "not-allowed" : "pointer",
            }}
            disabled={btn.disabled}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

// --- CSS スタイル ---
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "900px",
};
const kotoriStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};
const kotoriBubble: React.CSSProperties = {
  backgroundColor: "#dbeafe",
  border: "1px solid #60a5fa",
  borderRadius: "20px",
  padding: "1rem",
  fontWeight: "bold",
  maxWidth: "400px",
};
const gmailButtonStyle: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
};
const updateButtonStyle = (loading: boolean): React.CSSProperties => ({
  backgroundColor: loading ? "#a7f3d0" : "#22c55e",
  color: "white",
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  border: "none",
  cursor: loading ? "not-allowed" : "pointer",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
});
const menuGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.5rem",
  marginTop: "3rem",
  width: "100%",
  maxWidth: "800px",
};
const menuButtonStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  padding: "1.5rem",
  borderRadius: "0.75rem",
  border: "none",
  color: "white",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
};
