import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import "../styles/ui.css";
import { fetchWithAuth } from "../api";

interface MailDetail {
  id: string;
  from_: string;
  subject: string;
  body: string;
  date: string;
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
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    setMail(null);
    setSummary("");
    setAudioSrc("");
    setReply("");
    setInstruction("");
    setLoading(true);

    const fetchMailDetail = async () => {
      try {
        const res = await fetchWithAuth(`/mail/detail/${id}`, {
          method: "GET",
        });
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
    const jstDate = new Date(date.getTime());
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
      setActionInProgress(true);
      const res = await fetchWithAuth("/gpt/summarize", {
        method: "POST",
        body: JSON.stringify({ text: mail.body }),
      });
      const data = await res.json();
      if (data?.summary) setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setActionInProgress(false);
    }
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const handleSpeak = async () => {
    if (!mail) return;
    try {
      setIsProcessing(true);
      setActionInProgress(true);
      const res = await fetchWithAuth("/voice/speak", {
        method: "POST",
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
      setActionInProgress(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!mail) return;
    try {
      setIsProcessing(true);
      setActionInProgress(true);
      const res = await fetchWithAuth("/reply/generate", {
        method: "POST",
        body: JSON.stringify({ text: mail.body }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setActionInProgress(false);
    }
  };

  const handleRefineReply = async () => {
    if (!reply || !instruction) return;
    try {
      setIsRefining(true);
      setActionInProgress(true);
      const res = await fetchWithAuth("/reply/refine", {
        method: "POST",
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
      setActionInProgress(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!mail) return <p>メールが見つかりませんでした。</p>;

  return (
    <div className="detail-card space-y-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={handleBack} className="back-button">
          ← 戻る
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">{mail.subject}</h2>
        <p className="text-sm text-gray-600">送信元: {mail.from_}</p>
        <p className="text-sm text-gray-500">
          日時: {formatDateJST(mail.date)}
        </p>
      </div>

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
                disabled={actionInProgress}
              >
                要約
              </button>
              <button
                onClick={handleSpeak}
                className="fancy-btn secondary-btn"
                disabled={actionInProgress}
              >
                読み上げ
              </button>
              <button
                onClick={handleGenerateReply}
                className="fancy-btn ai-btn"
                disabled={actionInProgress}
              >
                返信生成
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 mb-2">本文：</p>
        <div
          className="text-gray-800 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: mail.body }}
        />
      </div>

      {summary && (
        <div className="summary-card">
          <h3>ことりが要約しました</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {audioSrc && (
        <div className="summary-card">
          <h3>ことりが読み上げます</h3>
          <audio controls src={audioSrc} className="w-full" />
        </div>
      )}

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
              <button
                onClick={handleRefineReply}
                className="refine-button"
                disabled={actionInProgress}
              >
                ことりに依頼
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MailViewer;
