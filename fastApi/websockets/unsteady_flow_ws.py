from fastapi import APIRouter, WebSocket
from app import app

router = APIRouter()


@router.websocket("/unsteady_flow", "unsteady_flow")
async def unsteady_flow_ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")
