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
