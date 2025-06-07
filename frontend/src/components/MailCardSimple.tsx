import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mailcard.css"; // 💅 四角囲み＋ホバー影スタイル

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

interface Props {
  mail: Mail;
  isSelected?: boolean; // 現在未使用だが保持
}

const MailCardSimple: React.FC<Props> = ({ mail, isSelected }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mail/${mail.id}`);
  };

  const emotionEmoji = (emotion: string) => {
    const map: Record<string, string> = {
      感謝: "🙏",
      励まし: "💪",
      祝福: "🎉",
      悲しみ: "😢",
      心配: "🤔",
      お願い: "📩",
      通知: "📢",
      雑談: "💬",
      その他: "❓",
    };
    return map[emotion] || "📧";
  };

  return (
    <div
      className={`mail-card ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="text-xl w-6 text-center">
        {emotionEmoji(mail.emotion || "")}
      </div>

      <div className="w-[160px] text-sm font-semibold text-gray-800 truncate">
        {mail.from}
      </div>

      <div className="flex-1 text-sm truncate">
        <span className="font-semibold text-gray-900 mr-1">{mail.subject}</span>
        <span className="text-gray-500">{mail.snippet}</span>
      </div>

      <div className="w-16 text-xs text-gray-400 text-right">6月7日</div>
    </div>
  );
};

export default MailCardSimple;
