import React from "react";
import "../styles/mailcard.css";

interface Mail {
  id: string;
  from_: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  emotion?: string;
}

interface Props {
  mail: Mail;
  onViewDetail: () => void;
}

const MailCardSimple: React.FC<Props> = ({ mail, onViewDetail }) => {
  return (
    <div className="mail-card-button" onClick={onViewDetail}>
      <div className="subject">{mail.subject}</div>
      <div className="snippet">{mail.snippet}</div>
      <div className="from">From: {mail.from_}</div>
    </div>
  );
};

export default MailCardSimple;
