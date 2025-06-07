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
  reloadKey?: number; // ✅ 再読み込みトリガーを受け取る
}

const groupBy = <T,>(array: T[], groupSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
};

const MailListGrouped: React.FC<Props> = ({
  onSelect,
  selectedMail,
  reloadKey,
}) => {
  const [emails, setEmails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number>(0); // 先頭だけ展開

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
  }, [reloadKey]); // ✅ reloadKey が更新されるたびに再取得

  const groupedEmails = groupBy(emails, 20);

  return (
    <div className="text-sm">
      {loading && (
        <p className="px-4 py-2 text-gray-500">📩 メールを読み込み中...</p>
      )}

      {groupedEmails.map((group, index) => (
        <div key={index}>
          {/* グループヘッダー */}
          <div className="flex justify-between items-center px-4 py-2 bg-white border-y text-gray-500 text-xs font-medium">
            <span>
              📂 {index * 20 + 1}〜{index * 20 + group.length} 件
            </span>
            <button
              onClick={() =>
                setExpandedGroupIndex(expandedGroupIndex === index ? -1 : index)
              }
              className="text-blue-600 hover:underline text-xs"
            >
              {expandedGroupIndex === index ? "閉じる" : "表示する"}
            </button>
          </div>

          {/* メール一覧 */}
          {expandedGroupIndex === index && (
            <div className="bg-white">
              {group.map((mail) => (
                <MailCardSimple
                  key={mail.id}
                  mail={mail}
                  onViewDetail={() => onSelect(mail)}
                  isSelected={selectedMail?.id === mail.id}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MailListGrouped;
