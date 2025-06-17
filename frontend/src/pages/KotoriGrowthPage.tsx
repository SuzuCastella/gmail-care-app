import React, { useState, useEffect } from "react";
import KotoriHeader from "../components/KotoriHeader";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const KotoriGrowthPage: React.FC = () => {
  const { user } = useUser();
  const [point, setPoint] = useState(0);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("");
  const [diaryList, setDiaryList] = useState<any[]>([]);
  const [showDiary, setShowDiary] = useState(false);
  const navigate = useNavigate();
  const MAX_LEVEL = 5;

  useEffect(() => {
    if (!user) return;

    fetch(`/kotori-diary/point?user_email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        setPoint(data.point);
        const newLevel = Math.min(Math.floor(data.point / 5) + 1, MAX_LEVEL);
        setLevel(newLevel);
        setMessage(levelMessages[newLevel] || "ことりは元気に育っています！");
      })
      .catch((e) => console.error("ポイント取得失敗", e));

    fetch(`/kotori-diary/list?user_email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setDiaryList(data))
      .catch((e) => console.error("日記履歴取得失敗", e));
  }, [user]);

  const toggleDiary = () => {
    setShowDiary(!showDiary);
  };

  return (
    <div style={containerStyle}>
      <KotoriHeader message="ことりの成長を見ましょう" />
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          戻る
        </button>
      </div>
      <div style={cardStyle}>
        <img
          src={`/images/kotori_lv${level}.png`}
          alt="kotori"
          style={kotoriStyle}
        />
        <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>
          ことり Lv.{level}
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          累計ポイント：{point} pt
        </p>
        <p style={{ fontSize: "1.1rem", color: "#2563eb" }}>{message}</p>

        <button onClick={toggleDiary} style={historyButtonStyle}>
          {showDiary ? "日記履歴を閉じる" : "過去の日記を見る"}
        </button>

        {showDiary && (
          <div style={historyBoxStyle}>
            {diaryList.map((d, index) => (
              <div key={index} style={diaryItemStyle}>
                <b>{d.date}</b>
                <br />
                体調：{d.condition}
                <br />
                睡眠時間：{d.sleep_hours}時間
                <br />
                その他の体調：{d.condition_detail}
                <br />
                ひとこと日記：{d.diary_text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const levelMessages: Record<number, string> = {
  1: "生まれたてのひよこです",
  2: "ことりが羽ばたきの練習を始めています",
  3: "ことりはお歌を練習しています",
  4: "ことりは空を高く飛び回れるようになりました",
  5: "ことりは大人に成長しました",
};

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fefefe",
  padding: "2rem",
  fontFamily: "'Noto Sans JP', sans-serif",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "1rem",
  padding: "2rem",
  textAlign: "center",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

const kotoriStyle: React.CSSProperties = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  border: "2px solid #60a5fa",
};

const historyButtonStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  backgroundColor: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  padding: "0.8rem 1.5rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

const historyBoxStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  textAlign: "left",
  maxHeight: "300px",
  overflowY: "auto",
  border: "1px solid #ccc",
  borderRadius: "0.5rem",
  padding: "1rem",
  background: "#fafafa",
};

const diaryItemStyle: React.CSSProperties = {
  marginBottom: "1.2rem",
  borderBottom: "1px solid #ddd",
  paddingBottom: "1rem",
};

const backButtonStyle: React.CSSProperties = {
  backgroundColor: "#6b7280",
  color: "white",
  padding: "0.5rem 1.5rem",
  borderRadius: "0.5rem",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.2rem",
};

export default KotoriGrowthPage;
