import React, { useState } from "react";
import "../styles/ui.css";

interface Mail {
  id: string;
  from_: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
}

interface Props {
  mail: Mail | null;
}

const ReplyForm: React.FC<Props> = ({ mail }) => {
  const [replyText, setReplyText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState<string>("");

  const handleGenerate = async () => {
    if (!mail) return;

    setLoading(true);
    try {
      const res = await fetch("/reply/generate", {
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

  const handleRefineReply = async () => {
    if (!chatInput || !replyText) return;

    try {
      const res = await fetch("/reply/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: replyText,
          instruction: chatInput,
        }),
      });

      const data = await res.json();
      if (data?.reply) {
        setReplyText(data.reply);
      } else {
        alert("再生成に失敗しました。");
      }
    } catch (err) {
      console.error("再生成エラー:", err);
      alert("再生成中にエラーが発生しました。");
    }
  };

  if (!mail) {
    return (
      <div className="p-4 text-gray-500">
        📩 返信対象のメールを選んでください。
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-800">✍️ 返信文を作成</h3>

      {/* ボタン群 */}
      <div className="flex flex-wrap gap-3">
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

      {/* 本文 + チャットBotエリア */}
      <div className="flex flex-col md:flex-row gap-4">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="reply-area flex-1"
          placeholder="ここに返信文が表示されます"
          rows={8}
        />

        <div className="w-full md:w-1/3 space-y-2">
          <p className="text-sm text-gray-600 font-semibold">🤖 AIへの指示</p>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="例：「もっと丁寧に」「ありがとうを入れて」"
            className="w-full p-2 border rounded-md text-sm"
          />
          <button
            onClick={handleRefineReply}
            className="fancy-btn outline-btn w-full"
          >
            🔁 GPTで再生成
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;
