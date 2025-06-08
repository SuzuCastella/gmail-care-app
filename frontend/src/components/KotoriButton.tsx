import React from "react";

interface Props {
  onClick: () => void;
}

const KotoriButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition"
    >
      <span className="text-xl">🕊</span>
      <span className="font-semibold text-sm">ことり</span>
    </button>
  );
};

export default KotoriButton;
