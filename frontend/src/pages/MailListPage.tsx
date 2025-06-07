import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MailListGrouped from "../components/MailListGrouped";

interface Mail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  emotion?: string;
}

interface Props {
  reloadKey: number; // ✅ Appから渡される「再読み込みキー」
}

const MailListPage: React.FC<Props> = ({ reloadKey }) => {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const navigate = useNavigate();

  const handleSelectMail = (mail: Mail) => {
    setSelectedMail(mail);
    navigate(`/mail/${mail.id}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* メール一覧パネル */}
      <aside className="w-full md:w-[360px] bg-white rounded-xl shadow-md overflow-hidden">
        <MailListGrouped
          onSelect={handleSelectMail}
          selectedMail={selectedMail}
          reloadKey={reloadKey} // ✅ ここで子に渡すことで一覧更新
        />
      </aside>

      {/* プレースホルダ（選択前） */}
      <section className="flex-1 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-400 text-center text-sm p-8">
        ✉️ メールを選択すると詳細画面に移動します
      </section>
    </div>
  );
};

export default MailListPage;
