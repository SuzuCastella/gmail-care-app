import React, { useEffect, useState } from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

interface Props {
  onSelect: (mail: Mail) => void;
  selectedMail: Mail | null;
}

const MailList: React.FC<Props> = ({ onSelect, selectedMail }) => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/mail/list");
        const data = await res.json();
        if (data?.emails) {
          setEmails(data.emails);
        }
      } catch (e) {
        console.error("メール取得エラー", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

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
    <div className="p-4 border rounded-xl bg-white shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-3 text-primary">
        📥 受信メール一覧
      </h2>
      {loading && <p className="text-gray-500">読み込み中...</p>}
      <ul className="space-y-3">
        {emails.map((mail) => {
          const isSelected = selectedMail?.id === mail.id;
          return (
            <li
              key={mail.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-500 shadow-inner"
                    : "bg-gray-50 hover:bg-blue-50"
                }`}
              onClick={() => onSelect(mail)}
            >
              <p className="text-md font-semibold text-gray-800">
                {mail.subject}
              </p>
              <p className="text-sm text-gray-600">From: {mail.from}</p>
              {mail.emotion && (
                <span className="inline-block mt-1 px-2 py-0.5 text-sm rounded-full bg-blue-100 text-blue-700">
                  {emotionEmoji(mail.emotion)} {mail.emotion}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MailList;
