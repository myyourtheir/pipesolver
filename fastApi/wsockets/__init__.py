from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket, reason: str, code=1000):
        await websocket.close(code=code, reason=reason)
        self.active_connections.remove(websocket)

    async def send_json(self, message: dict, websocket: WebSocket):
        await websocket.send_json({"status": "OK", "data": message})

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
