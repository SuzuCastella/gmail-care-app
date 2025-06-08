import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StartPage from "../src/pages/StartPage";
import AuthChoicePage from "../src/pages/AuthChoicePage";
import RegisterStep1Page from "../src/pages/RegisterStep1Page";
import RegisterConfirmPage from "../src/pages/RegisterConfirmPage";
import RegisterIconPage from "../src/pages/RegisterIconPage";
import RegisterFinishPage from "../src/pages/RegisterFinishPage";
import LoginPage from "../src/pages/LoginPage";
import HomePage from "../src/pages/HomePage";

import MailListPage from "../src/pages/MailListPage";
import MailDetailPage from "../src/pages/MailDetailPage";

import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/ui.css";

const App: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const handleFetchMails = async () => {
    const res = await fetch("http://localhost:8000/mail/fetch", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.status === "success") {
      alert(`📥 ${data.fetched} 件のメールを取得しました！`);
      setReloadKey((prev) => prev + 1);
    } else {
      alert("メールの取得に失敗しました。");
    }
  };

  return (
    <Router>
      <Routes>
        {/* 🌟 スタート画面 */}
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<StartPage />} />

        {/* 🔓 認証フロー */}
        <Route path="/auth-choice" element={<AuthChoicePage />} />
        <Route path="/register" element={<RegisterStep1Page />} />
        <Route path="/register/confirm" element={<RegisterConfirmPage />} />
        <Route path="/register/icon" element={<RegisterIconPage />} />
        <Route path="/register/finish" element={<RegisterFinishPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🏠 ホーム画面（認証後） */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 📥 メール一覧・詳細（認証後） */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <LayoutWithHeaderFooter>
                <MailListPage reloadKey={reloadKey} />
              </LayoutWithHeaderFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/:id"
          element={
            <ProtectedRoute>
              <LayoutWithHeaderFooter>
                <MailDetailPage />
              </LayoutWithHeaderFooter>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

// ✅ 認証後の共通ヘッダー＋フッター付きレイアウト
const LayoutWithHeaderFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-gray-800">
      <header className="bg-white shadow sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 drop-shadow-sm">
            📬 Gmail やさしい支援アプリ
          </h1>
          <span className="text-sm text-gray-500">powered by AI Care</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">{children}</main>

      <footer className="bg-white text-center text-gray-400 text-sm py-4 border-t mt-10">
        © 2025 Gmail やさしい支援アプリ
      </footer>
    </div>
  );
};

export default App;
