import os
import uuid
import re
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from gtts import gTTS
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/voice", tags=["voice"])

# 音声ファイルの保存先
AUDIO_DIR = os.getenv("VOICE_OUTPUT_DIR", "frontend/static/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

def remove_html_tags(text: str) -> str:
    """
    入力テキストからすべてのHTMLタグを除去する
    """
    return re.sub(r"<[^>]+>", "", text)


@router.post("/speak")
async def text_to_speech(request: Request):
    """
    入力されたテキストをTTSで音声ファイルに変換し、ファイル名を返す
    """
    try:
        data = await request.json()
        text = data.get("text", "")
        if not text:
            raise ValueError("textフィールドが空です")

        # HTMLタグを除去
        clean_text = remove_html_tags(text)

        filename = f"{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)

        tts = gTTS(text=clean_text, lang='ja')
        tts.save(filepath)

        return {"status": "success", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"音声生成エラー: {e}")


@router.get("/audio/{filename}")
async def get_audio(filename: str):
    """
    保存された音声ファイル（mp3）を返す
    """
    filepath = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="音声ファイルが見つかりません")

    return FileResponse(filepath, media_type="audio/mpeg")
