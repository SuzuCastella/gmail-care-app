import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
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
      const res = await fetchWithAuth(
        `/auth/gmail_auth?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (res.ok) {
        setGmailStatus("Gmail連携が完了しました！");
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

      {email && (
        <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem" }}>
          <button
            onClick={handleGmailAuth}
            style={gmailButtonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, gmailButtonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, gmailButtonStyle)
            }
          >
            Gmailと連携
          </button>
          <button
            onClick={handleFetchMailsWithKotori}
            disabled={loading}
            style={updateButtonStyle(loading)}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, updateButtonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, updateButtonStyle(loading))
            }
          >
            {loading ? "更新中..." : "最新のメールを取得"}
          </button>
        </div>
      )}

      {gmailStatus && (
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#374151" }}>
          {gmailStatus}
        </p>
      )}

      <div style={menuGridStyle}>
        {menuItems.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleNavigate(btn.path)}
            disabled={btn.disabled}
            style={{
              ...menuButtonStyle,
              backgroundColor: btn.disabled ? "#9ca3af" : "#ffffff",
              cursor: btn.disabled ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px)")
            }
          >
            <img src={btn.icon} alt={btn.label} style={iconStyle} />
            <div>{btn.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

// --- メニュー定義 ---
const menuItems = [
  {
    label: "受信トレイ",
    path: "/inbox",
    icon: "/images/inbox.png",
    disabled: false,
  },
  {
    label: "送信済み",
    path: "/sent",
    icon: "/images/sent.png",
    disabled: false,
  },
  {
    label: "ことり日記",
    path: "/kotori-menu",
    icon: "/images/diary.png",
    disabled: false,
  },
  {
    label: "新規メール",
    path: "/compose",
    icon: "/images/compose.png",
    disabled: false,
  },
  {
    label: "ゴミ箱",
    path: "/trash",
    icon: "/images/trash.png",
    disabled: false,
  },
  {
    label: "設定",
    path: "/settings",
    icon: "/images/settings.png",
    disabled: false,
  },
];

// --- CSS定義 ---
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
  borderRadius: "0.75rem",
  border: "none",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "all 0.2s",
  cursor: "pointer",
  transform: "translateY(0px)",
};

const gmailButtonHoverStyle: React.CSSProperties = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
};

const updateButtonStyle = (loading: boolean): React.CSSProperties => ({
  backgroundColor: loading ? "#a7f3d0" : "#2563eb",
  color: "white",
  padding: "1rem 2rem",
  fontSize: "1.25rem",
  fontWeight: "bold",
  borderRadius: "0.75rem",
  border: "none",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "all 0.2s",
  cursor: loading ? "not-allowed" : "pointer",
  transform: "translateY(0px)",
});

const updateButtonHoverStyle: React.CSSProperties = {
  transform: "translateY(-5px)",
  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
};

const menuGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "2rem",
  marginTop: "3rem",
  width: "100%",
  maxWidth: "800px",
};

const menuButtonStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  padding: "1rem",
  borderRadius: "1rem",
  border: "2px solid #3b82f6",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "all 0.2s",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const iconStyle: React.CSSProperties = {
  width: "60px",
  height: "60px",
  marginBottom: "0.5rem",
};
