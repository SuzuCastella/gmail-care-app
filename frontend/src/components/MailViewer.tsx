import React, { useState } from "react";
import "../styles/ui.css"; // ✅ ボタン・見た目強化用CSS

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
  emotion?: string;
  date?: string;
}

interface Props {
  mail: Mail | null;
}

const MailViewer: React.FC<Props> = ({ mail }) => {
  const [summary, setSummary] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  if (!mail) {
    return (
      <div className="p-6 text-gray-500 text-center">
        📩 メールを選択してください
      </div>
    );
  }

  const handleSummarize = async () => {
    const res = await fetch("/gpt/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: mail.body || mail.snippet }),
    });
    const data = await res.json();
    if (data?.summary) setSummary(data.summary);
  };

  const handleSpeak = async () => {
    const res = await fetch("/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: mail.body || mail.snippet }),
    });
    const data = await res.json();
    if (data?.filename) {
      setAudioSrc(`http://localhost:8000/voice/audio/${data.filename}`);
    }
  };

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {/* 件名・送信者・日付・感情 */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">{mail.subject}</h2>
        <p className="text-sm text-gray-600">From: {mail.from}</p>
        {mail.date && (
          <p className="text-sm text-gray-500">Date: {mail.date}</p>
        )}
        {mail.emotion && (
          <p className="text-sm text-blue-700">
            感情: {emotionEmoji(mail.emotion)} {mail.emotion}
          </p>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleSummarize} className="fancy-btn primary-btn">
          🧠 やさしい要約
        </button>
        <button onClick={handleSpeak} className="fancy-btn secondary-btn">
          🔊 読み上げ
        </button>
      </div>

      {/* 本文 */}
      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 mb-2">📩 本文：</p>
        <div className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
          {mail.body || mail.snippet}
        </div>
      </div>

      {/* 要約表示 */}
      {summary && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm font-semibold text-blue-800 mb-1">
            📝 やさしい要約
          </p>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* 音声再生 */}
      {audioSrc && (
        <div className="mt-4">
          <audio controls src={audioSrc} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default MailViewer;
