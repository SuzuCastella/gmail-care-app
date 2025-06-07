import openai
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

CATEGORIES = [
    "感謝", "励まし", "祝福", "悲しみ", "心配", "お願い", "通知", "雑談", "その他"
]

def analyze_emotion(text: str) -> str:
    """
    GPTを使って、メール本文から感情カテゴリを1つ分類して返す
    """
    prompt = (
        "以下の文章から、主な感情カテゴリを1つ選んでください：\n"
        f"{', '.join(CATEGORIES)}\n\n"
        "文章:\n"
        f"{text}\n\n"
        "分類:"
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        category = response.choices[0].message["content"].strip()
        if category not in CATEGORIES:
            return "その他"
        return category
    except Exception as e:
        return f"【エラー】感情分類失敗: {e}"


def tag_emotion_entries(emails: List[dict]) -> List[dict]:
    """
    複数メールに対して感情タグを付加
    各メールは dict: { "id": ..., "from": ..., "subject": ..., "snippet": ... }
    """
    tagged = []
    for email in emails:
        text = email.get("snippet", "")
        emotion = analyze_emotion(text)
        tagged.append({
            **email,
            "emotion": emotion
        })
    return tagged
