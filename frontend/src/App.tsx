import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MailListPage from "../src/pages/MailListPage";
import MailDetailPage from "../src/pages/MailDetailPage";
import "./styles/ui.css"; // ✅ 共通CSS（ボタンなど）

const App: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0); // 🔁 メール一覧の再読み込み用

  const handleFetchMails = async () => {
    const res = await fetch("http://localhost:8000/mail/fetch", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.status === "success") {
      alert(`📥 ${data.fetched} 件のメールを取得しました！`);
      setReloadKey((prev) => prev + 1); // メール一覧リロードをトリガー
    } else {
      alert("メールの取得に失敗しました。");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-gray-800">
        {/* ヘッダー */}
        <header className="bg-white shadow sticky top-0 z-10 border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 drop-shadow-sm">
              📬 Gmail やさしい支援アプリ
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleFetchMails}
                className="fancy-btn outline-btn"
              >
                📥 メールを取得
              </button>
              <span className="text-sm text-gray-500">powered by AI Care</span>
            </div>
          </div>
        </header>

        {/* メインルーティング */}
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<MailListPage reloadKey={reloadKey} />} />
            <Route path="/mail/:id" element={<MailDetailPage />} />
          </Routes>
        </main>

        {/* フッター */}
        <footer className="bg-white text-center text-gray-400 text-sm py-4 border-t mt-10">
          © 2025 Gmail やさしい支援アプリ
        </footer>
      </div>
    </Router>
  );
};

export default App;
