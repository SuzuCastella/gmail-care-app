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
}

const MailList: React.FC<Props> = ({ onSelect }) => {
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
    <div className="p-4 border rounded-lg bg-white shadow-md h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">受信メール一覧</h2>
      {loading && <p>読み込み中...</p>}
      <ul className="space-y-2">
        {emails.map((mail) => (
          <li
            key={mail.id}
            className="p-2 border rounded hover:bg-blue-100 cursor-pointer"
            onClick={() => onSelect(mail)}
          >
            <p className="font-semibold">{mail.subject}</p>
            <p className="text-sm text-gray-600">From: {mail.from}</p>
            {mail.emotion && (
              <p className="text-sm">
                {emotionEmoji(mail.emotion)} {mail.emotion}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailList;
