import React from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

interface Props {
  mail: Mail;
  onViewDetail: () => void;
  isSelected?: boolean;
}

const MailCardSimple: React.FC<Props> = ({
  mail,
  onViewDetail,
  isSelected,
}) => {
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
      className={`flex items-center justify-between px-4 py-3 border-b 
        transition-all duration-150 cursor-pointer group 
        ${
          isSelected
            ? "bg-blue-100 border-l-4 border-blue-500 shadow-inner"
            : "hover:bg-blue-50"
        }`}
      onClick={onViewDetail}
    >
      {/* アイコン */}
      <div className="text-xl mr-4">{emotionEmoji(mail.emotion || "")}</div>

      {/* メール内容 */}
      <div className="flex-grow">
        <div className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700">
          {mail.subject}
        </div>
        <div className="text-xs text-gray-500 truncate group-hover:text-blue-500">
          {mail.from}
        </div>
      </div>

      {/* 右矢印アイコン風 */}
      <div className="ml-4 text-gray-300 group-hover:text-blue-400 text-lg">
        ▶
      </div>
    </div>
  );
};

export default MailCardSimple;
