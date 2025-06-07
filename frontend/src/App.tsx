import React, { useState } from "react";
import MailList from "./components/MailList";
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
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Gmail やさしい支援アプリ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MailList onSelect={setSelectedMail} />
        <div>
          <MailViewer mail={selectedMail} />
          <ReplyForm mail={selectedMail} />
        </div>
      </div>
    </div>
  );
};

export default App;
