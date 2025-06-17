import React, { useState, useEffect } from "react";
import KotoriHeader from "../components/KotoriHeader";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const KotoriDiaryPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [condition, setCondition] = useState("普通");
  const [sleepHours, setSleepHours] = useState(7);
  const [conditionDetail, setConditionDetail] = useState("");
  const [diaryText, setDiaryText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [registeredToday, setRegisteredToday] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkTodayDiary = async () => {
      try {
        const res = await fetch(
          `/kotori-diary/today/check?user_email=${encodeURIComponent(
            user.email
          )}`
        );
        const data = await res.json();
        setRegisteredToday(data.registered);
      } catch {
        setError("登録状況の確認に失敗しました");
      }
    };

    checkTodayDiary();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const res = await fetch("/kotori-diary/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: user.email,
          condition,
          sleep_hours: sleepHours,
          condition_detail: conditionDetail,
          diary_text: diaryText,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "登録に失敗しました");
      }

      setSuccessMsg("日記を保存し、家族に送信しました！");
      setRegisteredToday(true);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <KotoriHeader message="ことり日記を記入しましょう" />

      <div style={formStyle}>
        {registeredToday === null ? (
          <p>確認中です...</p>
        ) : registeredToday ? (
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ 本日の日記はすでに登録済みです！
          </p>
        ) : (
          <>
            <Label>今日の体調</Label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={inputStyle}
            >
              <option value="大変良好">大変良好</option>
              <option value="良好">良好</option>
              <option value="普通">普通</option>
              <option value="悪い">悪い</option>
              <option value="大変悪い">大変悪い</option>
            </select>

            <Label>睡眠時間（時間）</Label>
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              style={inputStyle}
            />

            <Label>その他の体調状況</Label>
            <textarea
              value={conditionDetail}
              onChange={(e) => setConditionDetail(e.target.value)}
              rows={3}
              style={inputStyle}
            />

            <Label>ひとこと日記</Label>
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              rows={3}
              style={inputStyle}
            />

            <button onClick={handleSubmit} style={submitButtonStyle}>
              日記を登録
            </button>

            {successMsg && (
              <p style={{ color: "green", marginTop: "1rem" }}>
                ✅ {successMsg}
              </p>
            )}
            {error && (
              <p style={{ color: "red", marginTop: "1rem" }}>⚠ {error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontWeight: "bold", marginTop: "1rem" }}>{children}</div>
);

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const formStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "1rem",
  padding: "2rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
};

const submitButtonStyle: React.CSSProperties = {
  marginTop: "2rem",
  backgroundColor: "#22c55e",
  color: "white",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  padding: "1rem 2rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1.2rem",
};

export default KotoriDiaryPage;
