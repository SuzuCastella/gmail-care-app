import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// ユーザー型の定義（今後アイコンや名前など追加も可能）
interface User {
  email: string;
  name: string;
  token: string;
  icon: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Context作成（初期値は undefined）
const UserContext = createContext<UserContextType | undefined>(undefined);

// Providerコンポーネント
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // ページ初期読み込み時にlocalStorageから復元
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("ユーザー情報の復元に失敗しました:", e);
    }
  }, []);

  // ログイン時に保存
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Contextを使うためのカスタムフック
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser は UserProvider 内で使用してください");
  }
  return context;
};

export { UserContext };
