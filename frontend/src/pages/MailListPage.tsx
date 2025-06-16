import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MailCardSimple from "../components/MailCardSimple";
import { useUser } from "../components/UserContext";

interface Mail {
  id: string;
  from_: string;
  to: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  emotion?: string;
  spam_score?: number;
}

interface Props {
  reloadKey: number;
  mode: "inbox" | "sent" | "trash";
}

const MailListPage: React.FC<Props> = ({ reloadKey, mode }) => {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  const getListEndpoint = (): string => {
    if (mode === "inbox") return "/mail/list";
    if (mode === "sent") return "/mail/list_sent";
    if (mode === "trash") return "/mail/list_trash";
    return "/mail/list";
  };

  const getDisplayText = () => {
    if (mode === "inbox") return "最新の受信メール15件です！";
    if (mode === "sent") return "最新の送信済みメール15件です！";
    if (mode === "trash") return "ゴミ箱の最新15件です！";
  };

  useEffect(() => {
    const loadCachedMails = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(getListEndpoint(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const data = await res.json();
        setMails(data.slice(0, 15));
      } catch (e) {
        console.error("キャッシュ読み込み失敗:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCachedMails();
  }, [reloadKey, user, mode]);

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
            {getDisplayText()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "3rem", width: "100%", maxWidth: "900px" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              color: "#666",
              padding: "2rem",
            }}
          >
            📩 メールを読み込み中です...
          </div>
        ) : mails.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              color: "#666",
              padding: "2rem",
            }}
          >
            📭 表示するメールがありません
          </div>
        ) : (
          mails.map((mail) => (
            <MailCardSimple
              key={mail.id}
              mail={mail}
              onViewDetail={() => navigate(`/mail/${mail.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MailListPage;
