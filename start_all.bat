@echo off
echo === Gmail Care App 起動 ===

REM フロントエンド依存関係チェック
IF NOT EXIST frontend\node_modules (
  echo frontend/node_modules が見つかりません。npm install を実行します...
  cd frontend
  npm install
  cd ..
)

REM フロントエンド起動
echo Frontend 起動中...
start cmd /k "cd frontend && npm run dev"

REM 少し待機（ポート起動準備）
timeout /t 3 /nobreak >nul

REM 自動でブラウザを開く
start http://localhost:3000/

REM バックエンド起動
echo Backend 起動中...
start cmd /k "uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

echo 全てのプロセスが起動しました！
