import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MailViewer from "../components/MailViewer";
import { useUser } from "../components/UserContext";

const MailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // URLのパスからモード判定
  const mode: "inbox" | "sent" | "trash" = location.pathname.includes("/trash")
    ? "trash"
    : location.pathname.includes("/sent")
    ? "sent"
    : "inbox";

  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 返信フォーム
  const [replyTo, setReplyTo] = useState("");
  const [replyCc, setReplyCc] = useState("");
  const [replyBcc, setReplyBcc] = useState("");
  const [replyBody, setReplyBody] = useState("");

  // 転送フォーム
  const [forwardTo, setForwardTo] = useState("");
  const [forwardCc, setForwardCc] = useState("");
  const [forwardBcc, setForwardBcc] = useState("");

  const handleGoHome = () => navigate("/home");
  const handleCancel = () => {
    setShowReply(false);
    setShowForward(false);
  };
  const handleReplyOpen = () => {
    setShowReply(true);
    setShowForward(false);
  };
  const handleForwardOpen = () => {
    setShowForward(true);
    setShowReply(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setStatusMessage("削除中です。お待ちください！");
    try {
      await fetch(`/mail/delete/${id}`, {
        method: "DELETE",
        headers: { "X-User-Email": user?.email || "" },
      });
      navigate("/inbox");
    } catch {
      setStatusMessage("⚠ 削除失敗");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    setStatusMessage("復元中です。お待ちください！");
    try {
      await fetch(`/mail/restore/${id}`, {
        method: "POST",
        headers: { "X-User-Email": user?.email || "" },
      });
      navigate("/inbox");
    } catch {
      setStatusMessage("⚠ 復元失敗");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySend = async () => {
    try {
      const res = await fetch(`/mail/reply/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user?.email || "",
        },
        body: JSON.stringify({
          to: replyTo,
          cc: replyCc,
          bcc: replyBcc,
          body: replyBody,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("返信しました");
        handleCancel();
      } else {
        setStatusMessage(`⚠ 失敗: ${data.detail}`);
      }
    } catch {
      setStatusMessage("⚠ 送信エラー");
    }
  };

  const handleForwardSend = async () => {
    try {
      const res = await fetch(`/mail/forward/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user?.email || "",
        },
        body: JSON.stringify({ to: forwardTo, cc: forwardCc, bcc: forwardBcc }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("転送しました");
        handleCancel();
      } else {
        setStatusMessage(`⚠ 失敗: ${data.detail}`);
      }
    } catch {
      setStatusMessage("⚠ 送信エラー");
    }
  };

  return (
    <div style={containerStyle}>
      {/* ヘッダー */}
      <div style={headerStyle}>
        <img
          src="/images/home.png"
          alt="FUMI"
          onClick={handleGoHome}
          style={{ height: "60px", cursor: "pointer" }}
        />
        <div style={kotoriStyle}>
          <img src="/images/kotori.png" alt="ことり" style={kotoriIcon} />
          <div style={kotoriBubble}>
            {statusMessage ?? "メールの内容をAIでお手伝いします！"}
          </div>
        </div>
      </div>

      {/* 本文 */}
      <div style={cardStyle}>
        <MailViewer key={id} />

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <HoverButton
            onClick={handleReplyOpen}
            color="#2563eb"
            disabled={isDeleting}
          >
            返信
          </HoverButton>
          <HoverButton
            onClick={handleForwardOpen}
            color="#22c55e"
            disabled={isDeleting}
          >
            転送
          </HoverButton>
          {mode === "trash" ? (
            <HoverButton
              onClick={handleRestore}
              color="#f59e0b"
              disabled={isDeleting}
            >
              受信トレイに戻す
            </HoverButton>
          ) : (
            <HoverButton
              onClick={handleDelete}
              color="#ef4444"
              disabled={isDeleting}
            >
              削除
            </HoverButton>
          )}
        </div>
      </div>

      {/* 返信フォーム */}
      {showReply && (
        <FormSection
          title="返信"
          onSend={handleReplySend}
          onCancel={handleCancel}
        >
          <Input label="宛先 (To)" value={replyTo} onChange={setReplyTo} />
          <Input label="Cc" value={replyCc} onChange={setReplyCc} />
          <Input label="Bcc" value={replyBcc} onChange={setReplyBcc} />
          <TextArea label="本文" value={replyBody} onChange={setReplyBody} />
        </FormSection>
      )}

      {/* 転送フォーム */}
      {showForward && (
        <FormSection
          title="転送"
          onSend={handleForwardSend}
          onCancel={handleCancel}
        >
          <Input label="宛先 (To)" value={forwardTo} onChange={setForwardTo} />
          <Input label="Cc" value={forwardCc} onChange={setForwardCc} />
          <Input label="Bcc" value={forwardBcc} onChange={setForwardBcc} />
        </FormSection>
      )}
    </div>
  );
};

// 共通入力フォーム

const Input = ({ label, value, onChange }: any) => (
  <div style={{ margin: "0.5rem 0" }}>
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      }}
    />
  </div>
);

const TextArea = ({ label, value, onChange }: any) => (
  <div style={{ margin: "0.5rem 0" }}>
    <label>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      style={{
        width: "100%",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      }}
    />
  </div>
);

const FormSection = ({ title, onSend, onCancel, children }: any) => (
  <div style={formStyle}>
    <h3>{title}</h3>
    {children}
    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
      <HoverButton onClick={onSend} color="#2563eb">
        送信
      </HoverButton>
      <HoverButton onClick={onCancel} color="#aaa">
        キャンセル
      </HoverButton>
    </div>
  </div>
);

const HoverButton = ({ onClick, color, disabled, children }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      backgroundColor: color,
      color: "white",
      fontWeight: "bold",
      padding: "0.8rem 2rem",
      borderRadius: "0.5rem",
      border: "none",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
    }}
    onMouseOver={(e) =>
      !disabled && (e.currentTarget.style.filter = "brightness(90%)")
    }
    onMouseOut={(e) =>
      !disabled && (e.currentTarget.style.filter = "brightness(100%)")
    }
  >
    {children}
  </button>
);

// スタイル定義
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "900px",
  margin: "0 auto",
};
const kotoriStyle = { display: "flex", alignItems: "center", gap: "1rem" };
const kotoriIcon = { width: "60px", height: "60px", borderRadius: "50%" };
const kotoriBubble = {
  backgroundColor: "#dbeafe",
  padding: "1rem",
  borderRadius: "20px",
  fontWeight: "bold",
  maxWidth: "400px",
};
const cardStyle = {
  margin: "3rem auto 0",
  padding: "2rem",
  background: "white",
  borderRadius: "1rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  maxWidth: "900px",
};
const formStyle = {
  margin: "2rem auto",
  padding: "2rem",
  background: "#fff",
  borderRadius: "1rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  maxWidth: "900px",
};

export default MailDetailPage;
