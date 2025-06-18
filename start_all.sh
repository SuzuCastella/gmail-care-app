#!/bin/bash

echo "=== Gmail Care App 起動 ==="

# フロントエンド依存関係チェック
if [ ! -d "frontend/node_modules" ]; then
  echo "frontend/node_modules が見つかりません。npm install を実行します..."
  (cd frontend && npm install)
fi

# フロントエンド起動（バックグラウンド）
echo "Frontend 起動中..."
(cd frontend && npm run dev) &

# 少し待機してからブラウザを開く
sleep 3
echo "ブラウザで http://localhost:3000 を開きます..."

if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000/
elif command -v open > /dev/null; then
  open http://localhost:3000/
else
  echo "自動でブラウザを開けませんでした。手動で http://localhost:3000 を開いてください。"
fi

# バックエンド起動（フォアグラウンド）
echo "Backend 起動中..."
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
