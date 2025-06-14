import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../components/UserContext"; // ✅ ここでユーザー情報からアイコン取得
import "../styles/ui.css";

interface MailDetail {
  id: string;
  from_: string;
  subject: string;
  body: string;
  date: string;
  emotion?: string;
}

const MailViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [mail, setMail] = useState<MailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [reply, setReply] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    setMail(null);
    setSummary("");
    setAudioSrc("");
    setReply("");
    setInstruction("");
    setLoading(true);

    const fetchMailDetail = async () => {
      try {
        const res = await fetch(`/mail/detail/${id}`);
        const data = await res.json();
        setMail(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMailDetail();
  }, [id]);

  const formatDateJST = (utcDate: string) => {
    const date = new Date(utcDate);
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return jstDate.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSummarize = async () => {
    if (!mail) return;
    try {
      setIsProcessing(true);
      const res = await fetch("/gpt/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mail.body }),
      });
      const data = await res.json();
      if (data?.summary) setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = async () => {
    if (!mail) return;
    try {
      setIsProcessing(true);
      const res = await fetch("/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mail.body }),
      });
      const data = await res.json();
      if (data?.filename) {
        setAudioSrc(`/voice/audio/${data.filename}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!mail) return;
    try {
      setIsProcessing(true);
      const res = await fetch("/reply/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mail.body }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefineReply = async () => {
    if (!reply || !instruction) return;
    try {
      setIsRefining(true);
      const res = await fetch("/reply/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: reply,
          instruction: instruction,
        }),
      });
      const data = await res.json();
      setReply(data.reply);
      setInstruction("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!mail) return <p>メールが見つかりませんでした。</p>;

  return (
    <div className="detail-card space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-800">{mail.subject}</h2>
        <p className="text-sm text-gray-600">送信元: {mail.from_}</p>
        <p className="text-sm text-gray-500">
          日時: {formatDateJST(mail.date)}
        </p>
      </div>

      {/* ことり吹き出し */}
      <div className="kotori-assist-with-icon">
        <img src="/images/kotori.png" alt="ことり" className="kotori-icon" />
        <div>
          <p className="kotori-text">
            {isProcessing
              ? "ことりが考えています。お待ちください！"
              : "ことりがお手伝いします！"}
          </p>
          {!isProcessing && (
            <div className="flex gap-3">
              <button
                onClick={handleSummarize}
                className="fancy-btn primary-btn"
              >
                要約
              </button>
              <button onClick={handleSpeak} className="fancy-btn secondary-btn">
                読み上げ
              </button>
              <button
                onClick={handleGenerateReply}
                className="fancy-btn ai-btn"
              >
                返信生成
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 本文 */}
      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 mb-2">本文：</p>
        <div className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed">
          {mail.body}
        </div>
      </div>

      {/* 要約 */}
      {summary && (
        <div className="summary-card">
          <h3>ことりが要約しました</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* 読み上げ */}
      {audioSrc && (
        <div className="summary-card">
          <h3>ことりが読み上げます</h3>
          <audio controls src={audioSrc} className="w-full" />
        </div>
      )}

      {/* AI返信 */}
      {reply &&
        (isRefining ? (
          <div className="summary-card">
            <h3>ことりが考えています。しばらくお待ちください！</h3>
            <div className="text-center mt-4">
              <img
                src="/images/kotori.png"
                alt="ことり"
                className="kotori-icon"
              />
            </div>
          </div>
        ) : (
          <div className="reply-card">
            <h3>ことりが作った返信文です</h3>
            <textarea
              className="reply-textarea"
              rows={8}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="instruction-area">
              <img
                src={`/images/${user?.icon || "icon1"}.png`}
                alt="user"
                className="user-icon"
              />
              <input
                type="text"
                className="instruction-input"
                placeholder="編集指示（例: もっと丁寧に）"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <button onClick={handleRefineReply} className="refine-button">
                AI再編集
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MailViewer;
