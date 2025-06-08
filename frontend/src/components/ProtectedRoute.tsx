import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user } = useUser();

  if (!user || !user.email) {
    // ログイン情報がない場合はログインページへ
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
