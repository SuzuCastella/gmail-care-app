import React from "react";
import MailListPage from "./MailListPage";

interface Props {
  reloadKey: number;
}

const MailListTrashPage: React.FC<Props> = ({ reloadKey }) => {
  return <MailListPage mode="trash" reloadKey={reloadKey} />;
};

export default MailListTrashPage;
