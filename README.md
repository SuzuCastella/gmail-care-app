# Gmail Call App 📞✉️

音声で Gmail を作成・受信できる PC・スマホ対応アプリです。

---

## 🚀 機能

- Gmail アカウントログイン（OAuth2）
- 音声録音 → テキスト認識 → メール送信
- メール受信 → 声で読み上げ
- 音声合成 (SoVITS サーバ連携)
- 連絡先管理＋音声共有 ON/OFF 設定
- ダークモード・言語切替（日本語/英語）
- MySQL + Cloud Storage 連携
- スマホ、タブレット対応（レスポンシブデザイン）

---

## 📦 ローカル開発環境構築

### 1. .env ファイル作成

プロジェクトルートに`.env`ファイルを作成し、以下を記入してください。

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
REDIRECT_URI=http://localhost:8000/auth/callback
OPENAI_API_KEY=sk-xxx
GCS_BUCKET_NAME=your-bucket-name
SOVITS_SERVER_URL=http://localhost:5000/synthesize
```

## 実行方法

~/Downloads/gmail-care-app において、
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
~/Downloads/gmail-care-app/frontend において、
npm run dev

& "C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe" -u root -p

PYTHONPATH=. python backend/create_tables.py

git add .
git commit -m "任意のコミットメッセージ"
git push origin main

📘 起動方法（Windows / Mac 両対応）
✅ 前提準備（初回のみ）
Node.js がインストールされていること（公式サイト）

Python 3.11 + pip が使えること

必要なパッケージのインストール

# Python パッケージ

pip install -r requirements.txt

▶️ Windows の場合：start_all.bat
🪄 手順：
プロジェクトルートにある start_all.bat をダブルクリック

✅ 内容：
frontend/node_modules がなければ npm install を実行

npm run dev（Vite）と uvicorn（FastAPI）が自動起動

▶️ Mac / Linux の場合：start_all.sh
🪄 手順：
bash
コードをコピーする
chmod +x start_all.sh # 初回だけ実行
./start_all.sh
✅ 内容：
frontend/node_modules がなければ npm install を実行

npm run dev（Vite）がバックグラウンドで起動

uvicorn（FastAPI）がフォアグラウンドで起動

# RegisterPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errorMsg, setErrorMsg] = useState("");
const navigate = useNavigate();

const handleRegister = async () => {
setErrorMsg("");

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "登録に失敗しました");
      }

      alert("登録が完了しました！ログイン画面へ移動します。");
      navigate("/login");
    } catch (err: any) {
      setErrorMsg(err.message);
    }

};

return (

<div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
<div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
<h2 className="text-2xl font-bold text-blue-600 text-center">
📝 新規登録
</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            📧 メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="your@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            🔑 パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="6文字以上"
          />
        </div>

        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <button
          onClick={handleRegister}
          className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          登録する
        </button>
      </div>
    </div>

);
};

export default RegisterPage;
