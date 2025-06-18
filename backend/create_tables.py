from backend.db import Base, engine
from backend.models import user  # 既存のUserモデル
from backend.models import draft  # （もし他にDraftモデルも使っていればこれも）
from backend.models import kotori_diary  # ここを新たに追加

# テーブルを作成（既存は維持、未作成テーブルのみ追加）
Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully.")


# -------------------------------
# この処理はmain.pyに移動しました。デバッグ用に残しています。
# -------------------------------