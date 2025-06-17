import React, { useState, useEffect } from "react";
import KotoriHeader from "../components/KotoriHeader";
import { useUser } from "../components/UserContext";

const KotoriGrowthPage: React.FC = () => {
  const { user } = useUser();
  const [point, setPoint] = useState(0);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/kotori-diary/point?user_email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        setPoint(data.point);
        const newLevel = Math.floor(data.point / 5) + 1;
        setLevel(newLevel);
        setMessage(levelMessages[newLevel] || "ことりは元気に育っています！");
      })
      .catch((e) => console.error("ポイント取得失敗", e));
  }, [user]);

  return (
    <div style={containerStyle}>
      <KotoriHeader message="ことりの成長を見ましょう" />
      <div style={cardStyle}>
        <img src="/images/kotori.png" alt="kotori" style={kotoriStyle} />
        <h2 style={{ fontSize: "2rem", margin: "1rem 0" }}>
          ことり Lv.{level}
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          累計ポイント：{point} pt
        </p>
        <p style={{ fontSize: "1.1rem", color: "#2563eb" }}>{message}</p>
      </div>
    </div>
  );
};

// レベルごとのメッセージ
const levelMessages: Record<number, string> = {
  1: "ことりは卵から生まれました 🐣",
  2: "ことりは羽ばたきを始めました 🐤",
  3: "ことりはお歌を練習しています 🎵",
  4: "ことりは空を高く飛び回っています 🕊",
  5: "ことりは家族を見守っています 💖",
  6: "ことりは師匠ことりになりました 🦉",
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

export default KotoriGrowthPage;
