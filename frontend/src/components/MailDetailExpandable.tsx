import React, { useState } from "react";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}

interface Props {
  mail: Mail;
  onClose: () => void;
}

const MailDetailExpandable: React.FC<Props> = ({ mail, onClose }) => {
  const [summary, setSummary] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  const handleSummarize = async () => {
    const res = await fetch("/gpt/summarize", {
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

  const handleSpeak = async () => {
    const res = await fetch("/voice/speak", {
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

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 shadow-lg mt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">{mail.subject}</h2>
        <button
          onClick={onClose}
          className="text-red-600 font-semibold hover:underline text-sm"
        >
          閉じる ✖
        </button>
      </div>
      <hr className="my-2" />
      <p className="whitespace-pre-wrap text-gray-800">{mail.snippet}</p>

      <div className="mt-4 space-x-3">
        <button
          onClick={handleSummarize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          やさしい要約を表示
        </button>
        <button
          onClick={handleSpeak}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          読み上げる
        </button>
      </div>

      {summary && (
        <div className="mt-4 bg-white border rounded p-3">
          <p className="font-semibold text-gray-700">📝 やさしい要約:</p>
          <p className="text-gray-800">{summary}</p>
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

export default MailDetailExpandable;
