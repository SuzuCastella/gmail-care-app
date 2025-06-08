import os
from openai import OpenAI
from dotenv import load_dotenv

# .envからAPIキーを読み込み
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# OpenAIクライアントの初期化
client = OpenAI(api_key=api_key)


def summarize_and_simplify(text: str) -> str:
    """
    メール本文をやさしい日本語で要約・言い換え
    """
    prompt = (
        "以下のメール本文を、200文字以内でやさしい日本語に言い換えてください。\n"
        "難しい言葉や漢字は使わず、高齢者にもわかりやすく説明してください。\n\n"
        f"メール本文:\n{text}\n\nやさしい要約:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】要約に失敗しました: {e}"


def generate_polite_reply(text: str) -> str:
    """
    メール本文に対する丁寧で思いやりのある返信文を生成
    """
    prompt = (
        "以下のメールに対して、敬語を使った丁寧な返信文を考えてください。\n"
        "やさしいトーンで、相手に安心感を与えるような文にしてください。\n\n"
        f"メール本文:\n{text}\n\n丁寧な返信文:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】返信文生成に失敗しました: {e}"


def refine_reply(original: str, instruction: str) -> str:
    """
    元の返信文に対して指示に従って改善した返信文を生成
    """
    prompt = (
        "以下の返信文を、追加の指示に従ってより良く改善してください。\n"
        "指示は内容や文体の変更などが含まれます。\n\n"
        f"【返信文】\n{original}\n\n【指示】\n{instruction}\n\n改善後の返信文："
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.65,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】再生成に失敗しました: {e}"

def call_gpt_api(prompt: str) -> str:
    from openai import OpenAI
    import os

    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()