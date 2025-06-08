from backend.db import Base, engine
from backend.models import user  # 必須：Userモデルをインポート

# テーブルを作成
Base.metadata.create_all(bind=engine)
print("✅ All tables created successfully.")