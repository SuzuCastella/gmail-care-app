import React, { useEffect, useState } from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion: string;
}

const EMOTION_CATEGORIES = [
  "すべて",
  "感謝",
  "励まし",
  "祝福",
  "悲しみ",
  "心配",
  "お願い",
  "通知",
  "雑談",
  "その他",
];

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

const MemoryBook: React.FC = () => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [filter, setFilter] = useState<string>("感謝");

  useEffect(() => {
    const fetchTaggedEmails = async () => {
      try {
        const res = await fetch("http://localhost:8000/emotion/tagged-list");
        const data = await res.json();
        if (data?.emails) {
          setEmails(data.emails);
        }
      } catch (e) {
        console.error("感情タグ付きメール取得失敗:", e);
      }
    };
    fetchTaggedEmails();
  }, []);

  const filtered =
    filter === "すべて" ? emails : emails.filter((e) => e.emotion === filter);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-pink-700">
        💖 思い出帳
      </h2>

      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {EMOTION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded border ${
              filter === cat
                ? "bg-pink-500 text-white"
                : "bg-white text-pink-500 border-pink-300"
            }`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          このカテゴリの思い出はまだありません。
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((mail) => (
            <li key={mail.id} className="p-2 border rounded bg-gray-50">
              <p className="font-semibold">{mail.subject}</p>
              <p className="text-sm text-gray-600">From: {mail.from}</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{mail.snippet}</p>
              <p className="mt-1 text-sm">
                感情: {emotionEmoji(mail.emotion)} {mail.emotion}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemoryBook;
