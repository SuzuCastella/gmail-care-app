import React, { useState } from "react";
import "../styles/ui.css"; // ✅ 必須：ボタン・テキストエリアのリッチスタイルを適用

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}

interface Props {
  mail: Mail | null;
}

const ReplyForm: React.FC<Props> = ({ mail }) => {
  const [replyText, setReplyText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!mail) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/reply/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mail.snippet }),
      });

      const data = await res.json();
      if (data?.reply) {
        setReplyText(data.reply);
      } else {
        setReplyText("返信文の生成に失敗しました。");
      }
    } catch (err) {
      console.error("返信生成エラー:", err);
      setReplyText("返信文の生成に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    alert("返信文をコピーしました！");
  };

  if (!mail) {
    return (
      <div className="p-4 text-gray-500">
        📩 返信対象のメールを選んでください。
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">✍️ 返信文を作成</h3>

      {/* ボタン群 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={handleGenerate}
          className={`fancy-btn primary-btn ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "生成中..." : "🧠 GPTで返信を作成"}
        </button>

        <button
          onClick={handleCopy}
          className="fancy-btn secondary-btn"
          disabled={!replyText}
        >
          📋 コピー
        </button>

        <button
          onClick={() => alert("送信処理はまだ実装されていません")}
          className="fancy-btn gray-btn"
        >
          📤 仮の送信
        </button>
      </div>

      {/* テキストエリア */}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={6}
        className="fancy-area"
        placeholder="ここに返信文が表示されます"
      />
    </div>
  );
};

export default ReplyForm;
