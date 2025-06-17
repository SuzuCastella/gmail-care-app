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
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】要約に失敗しました: {e}"

def detect_spam_score(text: str) -> int:
    system_prompt = (
        "あなたは迷惑メール判定の専門家です。\n"
        "以下のメール本文について迷惑メール危険度を100点満点で数値評価してください。\n"
        "0は全く安全、100は極めて危険です。数値のみ出力してください（単位・コメントは不要）。"
    )

    user_prompt = f"メール本文:\n{text}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=10,
        temperature=0,
    )

    content = response.choices[0].message.content.strip()
    try:
        score = int(content)
        score = max(0, min(score, 100))  # 念の為クリップ
    except:
        score = 0  # パース失敗時は安全寄りに
    return score


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
            model="gpt-3.5-turbo",
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
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.65,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】再生成に失敗しました: {e}"


def call_gpt_compose_assist(text: str, instruction: str) -> str:
    """
    ✨新規Compose用のAI補助API（今回追加部分）
    """
    prompt = (
        "あなたは文章作成をお手伝いするAIアシスタントです。\n"
        "以下の既存のメール本文を参考にして、指示に従って文章を改善または追記してください。\n"
        "やさしく読みやすい表現を心がけてください。\n\n"
        f"【現状の本文】\n{text}\n\n【指示】\n{instruction}\n\n改善後の本文:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.65,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"【エラー】Compose補助に失敗しました: {e}"


def call_gpt_api(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

def compose_ai_assist_v2(current_text: str, instruction: str) -> str:
    """
    簡易AI補助：Compose用の本文生成
    """
    prompt = (
        "あなたはメール文章の編集を手伝います。\n"
        "以下の既存本文と指示に従って、より良い文章にしてください。\n\n"
        f"【本文】\n{current_text}\n\n【指示】\n{instruction}\n\n改善後:"
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()
