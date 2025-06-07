import React, { useState } from "react";

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

  if (!mail)
    return <div className="p-4">返信対象のメールを選んでください。</div>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md mt-4">
      <h3 className="text-lg font-bold mb-2">返信文を作成</h3>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "生成中..." : "GPTで返信を作成"}
      </button>

      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={6}
        className="w-full mt-3 p-2 border rounded resize-y"
        placeholder="ここに返信文が表示されます"
      />

      <div className="mt-2 flex gap-2">
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          コピーする
        </button>
        <button
          onClick={() => alert("送信処理はまだ実装されていません")}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          仮の送信ボタン
        </button>
      </div>
    </div>
  );
};

export default ReplyForm;
