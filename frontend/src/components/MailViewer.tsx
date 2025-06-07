import React, { useState } from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
  emotion?: string;
}

interface Props {
  mail: Mail | null;
}

const MailViewer: React.FC<Props> = ({ mail }) => {
  const [summary, setSummary] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  if (!mail) {
    return (
      <div className="p-4 bg-white rounded shadow text-gray-500">
        メールを選択してください。
      </div>
    );
  }

  const handleSummarize = async () => {
    const res = await fetch("http://localhost:8000/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: mail.body || mail.snippet }),
    });
    const data = await res.json();
    if (data?.filename) {
      setAudioSrc(`http://localhost:8000/voice/audio/${data.filename}`);
    }
  };

  const handleGetSimplifiedSummary = async () => {
    const res = await fetch("http://localhost:8000/gpt/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: mail.body || mail.snippet }),
    });
    const data = await res.json();
    if (data?.summary) {
      setSummary(data.summary);
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
    <div className="p-4 border rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-bold mb-2">{mail.subject}</h2>
      <p className="text-sm text-gray-600 mb-1">From: {mail.from}</p>
      {mail.emotion && (
        <p className="text-sm text-blue-700 mb-2">
          感情: {emotionEmoji(mail.emotion)} {mail.emotion}
        </p>
      )}
      <hr className="my-3" />

      <div className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-4">
        {mail.body || mail.snippet}
      </div>

      <div className="space-x-2 mb-4">
        <button
          onClick={handleGetSimplifiedSummary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          やさしい要約を表示
        </button>
        <button
          onClick={handleSummarize}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          読み上げる
        </button>
      </div>

      {summary && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm font-semibold text-blue-800 mb-1">
            やさしい要約:
          </p>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {audioSrc && (
        <div className="mt-4">
          <audio controls src={audioSrc} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default MailViewer;
