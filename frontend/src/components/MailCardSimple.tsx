import React from "react";
import "../styles/mailcard.css";

interface Mail {
  id: string;
  from_: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  emotion?: string;
  spam_score?: number; // ★ スコア型に変更
}

interface Props {
  mail: Mail;
  onViewDetail: () => void;
}

// ★ 危険度に応じた背景色生成関数
const getBackgroundColor = (score: number | undefined) => {
  if (score === undefined) return "white";

  // 0-100 を 0-1 に正規化
  const normalized = score / 100;

  // 線形ではなく、強めの非線形マッピング (指数スケーリング)
  const intensity = Math.pow(normalized, 1.5); // ← ここ重要

  const red = 255;
  const green = Math.round(255 * (1 - intensity));
  const blue = Math.round(255 * (1 - intensity));

  return `rgb(${red}, ${Math.max(green, 0)}, ${Math.max(blue, 0)})`;
};

const MailCardSimple: React.FC<Props> = ({ mail, onViewDetail }) => {
  const bgColor = getBackgroundColor(mail.spam_score);

  return (
    <div
      className="mail-card-button"
      style={{ backgroundColor: bgColor }}
      onClick={onViewDetail}
    >
      <div className="subject">{mail.subject}</div>
      <div className="snippet">{mail.snippet}</div>
      <div className="from">From: {mail.from_}</div>

      {/* 危険度が高い場合のみ警告表示 */}
      {mail.spam_score !== undefined && mail.spam_score >= 50 && (
        <div className="text-red-600 font-bold text-sm mt-1">
          ⚠ 危険度 {mail.spam_score}%
        </div>
      )}
    </div>
  );
};

export default MailCardSimple;
