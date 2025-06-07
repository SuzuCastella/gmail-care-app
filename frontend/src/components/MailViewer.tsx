import React, { useState } from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

interface Props {
  mail: Mail | null;
}

const MailViewer: React.FC<Props> = ({ mail }) => {
  const [summary, setSummary] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  if (!mail) {
    return <div className="p-4">メールを選択してください。</div>;
  }

  const handleSummarize = async () => {
    const res = await fetch("http://localhost:8000/voice/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: mail.snippet }),
    });
    const data = await res.json();
    if (data?.filename) {
      setAudioSrc(`http://localhost:8000/voice/audio/${data.filename}`);
    }
  };

  const handleGetSimplifiedSummary = async () => {
    const res = await fetch("http://localhost:8000/gpt/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: mail.snippet }),
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
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold">{mail.subject}</h2>
      <p className="text-sm text-gray-600">From: {mail.from}</p>
      {mail.emotion && (
        <p className="mt-1 text-md">
          感情: {emotionEmoji(mail.emotion)} {mail.emotion}
        </p>
      )}
      <hr className="my-2" />
      <p className="text-md whitespace-pre-wrap">{mail.snippet}</p>

      <div className="mt-4 space-x-2">
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
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <p className="text-sm font-medium">やさしい要約:</p>
          <p>{summary}</p>
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
