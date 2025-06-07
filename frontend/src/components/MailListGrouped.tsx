import React, { useEffect, useState } from "react";
import MailCardSimple from "./MailCardSimple";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  cc?: string;
  emotion?: string;
}

interface Props {
  onSelect: (mail: Mail) => void;
  selectedMail: Mail | null;
}

const groupBy = <T,>(array: T[], groupSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
};

const MailListGrouped: React.FC<Props> = ({ onSelect, selectedMail }) => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number | null>(
    null
  );

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

  const groupedEmails = groupBy(emails, 20);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="px-6 py-4 text-xl font-semibold text-gray-800 border-b border-gray-200 bg-blue-50 flex items-center gap-2">
        📁 メールグループ一覧
      </h2>
      {loading && <p className="text-gray-500 px-6 py-3">読み込み中...</p>}
      <ul className="divide-y divide-gray-200">
        {groupedEmails.map((group, index) => (
          <li key={index} className="">
            <div className="flex justify-between items-center px-6 py-3 bg-gray-100">
              <h3 className="text-sm font-medium text-gray-700">
                メール {index * 20 + 1}〜{index * 20 + group.length} 件
              </h3>
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() =>
                  setExpandedGroupIndex(
                    expandedGroupIndex === index ? null : index
                  )
                }
              >
                {expandedGroupIndex === index
                  ? "閉じる"
                  : "このグループの詳細を見る"}
              </button>
            </div>
            {expandedGroupIndex === index && (
              <ul>
                {group.map((mail) => (
                  <MailCardSimple
                    key={mail.id}
                    mail={mail}
                    onViewDetail={() => onSelect(mail)}
                    isSelected={selectedMail?.id === mail.id}
                  />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailListGrouped;
