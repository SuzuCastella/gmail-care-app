import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const iconCount = 2; // icon1.png ～ icon5.png を想定（必要に応じて増やす）

const RegisterIconPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state;

  const [selected, setSelected] = useState<string>("");

  if (!form) {
    return <div style={{ padding: "2rem" }}>情報がありません。</div>;
  }

  const handleNext = () => {
    if (!selected) {
      alert("アイコンを選択してください");
      return;
    }

    const finalData = { ...form, icon: selected };
    navigate("/register/finish", { state: finalData });
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f6ff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* 吹き出し＋ことり */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          maxWidth: "900px",
          margin: "0 auto 2rem",
        }}
      >
        <img
          src="/images/kotori.png"
          alt="ことり"
          style={{ width: "80px", height: "80px", borderRadius: "9999px" }}
        />
        <div
          style={{
            position: "relative",
            background: "#dbeafe",
            padding: "1rem 1.5rem",
            borderRadius: "1rem",
            color: "#1e3a8a",
            lineHeight: "1.6",
            fontSize: "1rem",
            flex: 1,
          }}
        >
          <p style={{ margin: 0 }}>
            次に、お気に入りのアイコン（写真）を選んでください！
          </p>
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "-16px",
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderRight: "16px solid #dbeafe",
            }}
          />
        </div>
      </div>

      {/* アイコン一覧 */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: iconCount }).map((_, i) => {
            const icon = `icon${i + 1}.png`;
            return (
              <div
                key={icon}
                onClick={() => setSelected(icon)}
                style={{
                  border:
                    selected === icon ? "4px solid #3b82f6" : "2px solid #ccc",
                  borderRadius: "9999px",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={`/images/${icon}`}
                  alt={`アイコン${i + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ボタン */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button onClick={() => navigate(-1)} style={buttonStyle("gray")}>
            ← 戻る
          </button>
          <button onClick={handleNext} style={buttonStyle("blue")}>
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = (color: "blue" | "gray"): React.CSSProperties => ({
  backgroundColor: color === "blue" ? "#2563eb" : "#ccc",
  color: "white",
  fontSize: "1rem",
  padding: "0.7rem 2rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
});

export default RegisterIconPage;
