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
import MailListSentPage from "../src/pages/MailListSentPage";
import MailListTrashPage from "../src/pages/MailListTrashPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./components/UserContext";
import "./styles/ui.css";

const App: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const { user } = useUser();

  const handleFetchMails = async () => {
    if (!user) {
      alert("ユーザー情報がありません。ログインし直してください。");
      return;
    }
    try {
      // ✅ inbox
      const resInbox = await fetch("/mail/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      // ✅ sent
      const resSent = await fetch("/mail/fetch_sent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      // ✅ trash
      const resTrash = await fetch("/mail/fetch_trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (resInbox.ok && resSent.ok && resTrash.ok) {
        setReloadKey((prev) => prev + 1);
      } else {
        alert("一部のメール取得に失敗しました。");
      }
    } catch (err) {
      alert("通信エラーが発生しました");
      console.error(err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/auth-choice" element={<AuthChoicePage />} />
        <Route path="/register" element={<RegisterStep1Page />} />
        <Route path="/register/confirm" element={<RegisterConfirmPage />} />
        <Route path="/register/icon" element={<RegisterIconPage />} />
        <Route path="/register/finish" element={<RegisterFinishPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage fetchMails={handleFetchMails} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <LayoutWithHeaderFooter>
                <MailListPage reloadKey={reloadKey} mode="inbox" />
              </LayoutWithHeaderFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sent"
          element={
            <ProtectedRoute>
              <LayoutWithHeaderFooter>
                <MailListSentPage reloadKey={reloadKey} />
              </LayoutWithHeaderFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <LayoutWithHeaderFooter>
                <MailListTrashPage reloadKey={reloadKey} />
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

const LayoutWithHeaderFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-gray-800">
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
};

export default App;
