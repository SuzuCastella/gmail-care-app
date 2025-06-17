from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.gpt_utils import compose_ai_assist_v2

router = APIRouter(prefix="/gpt", tags=["GPT"])

class ComposeRequest(BaseModel):
    original_text: str
    instruction: str

@router.post("/assist")
def gpt_compose_assist(req: ComposeRequest):
    try:
        result = compose_ai_assist_v2(req.original_text, req.instruction)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
