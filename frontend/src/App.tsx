import React, { useState } from "react";
import MailListGrouped from "./components/MailListGrouped";
import MailViewer from "./components/MailViewer";
import ReplyForm from "./components/ReplyForm";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

const App: React.FC = () => {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* ヘッダー */}
      <header className="bg-white shadow-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          📬 Gmail やさしい支援アプリ
        </h1>
        <span className="text-sm text-gray-500">powered by AI Care</span>
      </header>

      {/* メイン */}
      <main className="flex flex-1 overflow-hidden">
        {/* メール一覧 */}
        <aside className="w-full md:w-[360px] border-r bg-white overflow-y-auto shadow-sm">
          <h2 className="px-4 py-3 text-lg font-semibold text-gray-700 border-b bg-gray-50">
            📂 メール一覧
          </h2>
          <MailListGrouped
            onSelect={setSelectedMail}
            selectedMail={selectedMail}
          />
        </aside>

        {/* メール詳細と返信 */}
        <section className="flex-1 bg-gray-100 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {selectedMail ? (
              <>
                <MailViewer mail={selectedMail} />
                <ReplyForm mail={selectedMail} />
              </>
            ) : (
              <div className="text-center text-gray-500 mt-20">
                ✉️ メールを選択すると詳細が表示されます
              </div>
            )}
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-white text-center text-gray-400 text-sm py-4 border-t">
        © 2025 Gmail やさしい支援アプリ
      </footer>
    </div>
  );
};

export default App;
