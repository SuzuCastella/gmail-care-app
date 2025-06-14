import React, { useEffect, useState } from "react";
import MailCardSimple from "./MailCardSimple";
import { useUser } from "./UserContext";
import "../styles/ui.css"; // 共通UIスタイルも反映

interface Mail {
  id: string;
  from_: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  to: string;
  emotion?: string;
}

interface Props {
  onSelect: (mail: Mail) => void;
  selectedMail: Mail | null;
  reloadKey?: number;
}

const groupBy = <T,>(array: T[], groupSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
};

const formatJapaneseDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MailListGrouped: React.FC<Props> = ({
  onSelect,
  selectedMail,
  reloadKey,
}) => {
  const { user } = useUser();
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number>(0);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch("/mail/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setEmails(data.slice(0, 20));
        } else {
          console.warn("データ形式エラー:", data);
          setEmails([]);
        }
      } catch (e) {
        console.error("メール取得エラー", e);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [reloadKey, user]);

  const groupedEmails = groupBy(emails, 20);

  return (
    <div className="text-lg">
      {" "}
      {/* フォント大きく */}
      {loading && (
        <p className="px-4 py-4 text-gray-500 text-center text-xl">
          📩 メールを読み込み中です...
        </p>
      )}
      {groupedEmails.map((group, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center px-6 py-3 bg-blue-100 rounded-t-xl text-blue-700 font-bold text-xl">
            <span>
              📂 {index * 20 + 1}〜{index * 20 + group.length} 件のメール
            </span>
            <button
              onClick={() =>
                setExpandedGroupIndex(expandedGroupIndex === index ? -1 : index)
              }
              className="text-blue-800 underline text-lg"
            >
              {expandedGroupIndex === index ? "閉じる" : "開く"}
            </button>
          </div>

          {expandedGroupIndex === index && (
            <div className="bg-white rounded-b-xl shadow-lg border border-t-0">
              {group.map((mail) => (
                <div
                  key={mail.id}
                  className={`p-5 border-b cursor-pointer ${
                    selectedMail?.id === mail.id
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onSelect(mail)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {mail.subject}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {formatJapaneseDate(mail.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base">{mail.snippet}</p>
                  <p className="text-sm text-gray-500 mt-1">{mail.from_}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {!loading && emails.length === 0 && (
        <p className="px-4 py-8 text-gray-400 text-center text-xl">
          📭 まだメールがありません
        </p>
      )}
    </div>
  );
};

export default MailListGrouped;
