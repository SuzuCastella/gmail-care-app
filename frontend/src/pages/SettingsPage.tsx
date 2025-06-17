import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KotoriHeader from "../components/KotoriHeader";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [openAccount, setOpenAccount] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const [newName, setNewName] = useState("");
  const [newYomi, setNewYomi] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserInfo(parsed);
      setNewName(parsed.name);
      setNewYomi(parsed.yomi || parsed.name_kana);
    }
  }, []);

  const handleSaveName = async () => {
    if (!newName || !newYomi) {
      setError("名前・読みは空にできません");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/user/update_info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userInfo.email,
          name: newName,
          name_kana: newYomi,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError("更新失敗: " + (err.detail || "不明なエラー"));
        return;
      }

      setUserInfo({ ...userInfo, name: newName, yomi: newYomi });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userInfo, name: newName, yomi: newYomi })
      );
      setError("");
      alert("名前を更新しました");
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      setError("新しいパスワードが一致しません");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/user/change_password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userInfo.email,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError("パスワード変更失敗: " + (err.detail || "不明なエラー"));
        return;
      }
      setError("");
      alert("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const confirmAndLogout = () => {
    localStorage.removeItem("user");
    setConfirmLogout(false);
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      <KotoriHeader message="設定画面です" />

      {/* アカウント情報 */}
      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setOpenAccount(!openAccount)}
        >
          👤 アカウント情報 {openAccount ? "▲" : "▼"}
        </div>
        {openAccount && (
          <div style={innerBoxStyle}>
            <div>メールアドレス: {userInfo?.email}</div>
            <div>
              名前:{" "}
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              読み:{" "}
              <input
                value={newYomi}
                onChange={(e) => setNewYomi(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button onClick={handleSaveName} style={buttonStyle}>
              名前を更新
            </button>
          </div>
        )}
      </div>

      {/* パスワード変更 */}
      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setOpenPassword(!openPassword)}
        >
          🔑 パスワード変更 {openPassword ? "▲" : "▼"}
        </div>
        {openPassword && (
          <div style={innerBoxStyle}>
            <div>
              現在のパスワード:{" "}
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              新しいパスワード:{" "}
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              確認用:{" "}
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button onClick={handleChangePassword} style={buttonStyle}>
              パスワードを変更
            </button>
          </div>
        )}
      </div>

      {/* ログアウト */}
      <div style={sectionStyle}>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          🚪 ログアウト
        </button>
      </div>

      {confirmLogout && (
        <div style={confirmBoxStyle}>
          <div>本当にログアウトしますか？</div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={confirmAndLogout} style={yesButtonStyle}>
              はい
            </button>
            <button
              onClick={() => setConfirmLogout(false)}
              style={noButtonStyle}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {error && <div style={errorStyle}>⚠ {error}</div>}
    </div>
  );
};

export default SettingsPage;

// --- CSSスタイル群 ---
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "1rem",
  padding: "1rem",
  marginBottom: "1.5rem",
};

const sectionHeaderStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const innerBoxStyle: React.CSSProperties = {
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  width: "100%",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const logoutButtonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "white",
  padding: "0.75rem 2rem",
  borderRadius: "0.5rem",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const confirmBoxStyle: React.CSSProperties = {
  backgroundColor: "#fff0f0",
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "1rem",
};

const yesButtonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "white",
  padding: "0.5rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

const noButtonStyle: React.CSSProperties = {
  backgroundColor: "#6b7280",
  color: "white",
  padding: "0.5rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginTop: "1.5rem",
  fontWeight: "bold",
};
