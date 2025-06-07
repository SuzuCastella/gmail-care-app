import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MailListPage from "../src/pages/MailListPage";
import MailDetailPage from "../src/pages/MailDetailPage";
import "./styles/ui.css"; // ✅ 共通CSS（ボタンなど）

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-gray-800">
        {/* ヘッダー */}
        <header className="bg-white shadow sticky top-0 z-10 border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 drop-shadow-sm">
              📬 Gmail やさしい支援アプリ
            </h1>
            <span className="text-sm text-gray-500">powered by AI Care</span>
          </div>
        </header>

        {/* メインルーティング */}
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<MailListPage />} />
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
