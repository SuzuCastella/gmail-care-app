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

# バックエンド起動（フォアグラウンド）
echo "Backend 起動中..."
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
