from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.gpt_utils import call_gpt_compose_assist

router = APIRouter(prefix="/gpt", tags=["gpt"])

class ComposeAssistRequest(BaseModel):
    text: str
    instruction: str

class ComposeAssistResponse(BaseModel):
    result: str

@router.post("/compose_assist", response_model=ComposeAssistResponse)
def compose_assist(req: ComposeAssistRequest):
    try:
        result = call_gpt_compose_assist(req.text, req.instruction)
        return ComposeAssistResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
