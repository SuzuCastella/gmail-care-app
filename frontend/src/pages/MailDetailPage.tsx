import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MailViewer from "../components/MailViewer";
import ReplyForm from "../components/ReplyForm";
import "../styles/ui.css"; // Fancyボタンスタイル

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
  emotion?: string;
}

const MailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mail, setMail] = useState<Mail | null>(null);

  useEffect(() => {
    // ✅ 仮の実装：今後API or Contextと連携してリアル取得に
    const fetchMail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/mail/${id}`);
        const data = await res.json();
        setMail(data.mail); // 要：バックエンドが `mail` を返す形式
      } catch (error) {
        console.error("メール取得失敗:", error);
      }
    };

    fetchMail();
  }, [id]);

  if (!mail) {
    return (
      <div className="text-gray-500 text-center p-6">
        📩 メールを読み込み中です...
      </div>
    );
  }

  return (
    <div className="detail-card">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">✉️ メール詳細</h2>
        <button onClick={() => navigate(-1)} className="fancy-btn gray-btn">
          ← 戻る
        </button>
      </div>

      {/* メール詳細 */}
      <MailViewer mail={mail} />

      {/* 返信生成 */}
      <ReplyForm mail={mail} />
    </div>
  );
};

export default MailDetailPage;
