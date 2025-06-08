import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

const KotoriChat: React.FC<Props> = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = `👤 あなた：${input}`;
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/kotori/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const reply = `🕊 ことり：${data.reply || "返答できませんでした"}`;
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [...prev, "🕊 ことり：エラーが発生しました"]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white shadow-2xl rounded-xl z-50 border flex flex-col">
      {/* ヘッダー */}
      <div className="bg-pink-100 px-4 py-2 rounded-t-xl flex justify-between items-center">
        <span className="font-semibold text-pink-800">
          🕊 ことりとお話し中...
        </span>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          ✕ 閉じる
        </button>
      </div>

      {/* メッセージ履歴 */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {msg}
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="ことりに話しかけてみよう"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="text-white bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded text-sm"
        >
          送信
        </button>
      </div>
    </div>
  );
};

export default KotoriChat;
