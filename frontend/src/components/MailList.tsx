import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import MailCardSimple from "./MailCardSimple";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

const MailList: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMails = async () => {
      if (!user) return;

      try {
        const res = await fetch("http://localhost:8000/mail/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!res.ok) {
          throw new Error("メールの取得に失敗しました");
        }

        const data = await res.json();
        setMails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [user]);

  if (loading) {
    return <div className="p-4 text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="p-4">
      {mails.length === 0 ? (
        <p className="text-gray-500">メールが見つかりません</p>
      ) : (
        mails.map((mail) => (
          <MailCardSimple
            key={mail.id}
            mail={mail}
            onViewDetail={() => navigate(`/mail/${mail.id}`)} // ✅ 詳細ページへ遷移
          />
        ))
      )}
    </div>
  );
};

export default MailList;
