import React from "react";
import MailListPage from "./MailListPage";

interface Props {
  reloadKey: number;
}

const MailListSentPage: React.FC<Props> = ({ reloadKey }) => {
  return <MailListPage mode="sent" reloadKey={reloadKey} />;
};

export default MailListSentPage;
