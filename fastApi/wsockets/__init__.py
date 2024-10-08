from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_json(self, message: dict, websocket: WebSocket):
        await websocket.send_json({"status": "OK", "data": message})

    async def send_error(self, message: str, websocket: WebSocket):
        await websocket.send_json({"status": "ERROR", "message": message})

    async def send_info(self, message: str, websocket: WebSocket):
        await websocket.send_json({"status": "INFO", "message": message})

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
