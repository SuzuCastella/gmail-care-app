import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  message: string;
}

const KotoriHeader: React.FC<Props> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto 1.5rem",
      }}
    >
      <img
        src="/images/home.png"
        alt="FUMI"
        onClick={() => navigate("/home")}
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
          {message}
        </div>
      </div>
    </div>
  );
};

export default KotoriHeader;
