from fastapi import APIRouter, WebSocket
from schemas.unsteady_flow_ws_scheme import Unsteady_data

# from services.unsteady_flow_calculation import calculate
from services.calculation_V2.unsteady_flow_solver import Unsteady_flow_solver
from pprint import pprint
from wsockets import ConnectionManager
from logger_config import logger

router = APIRouter()


manager = ConnectionManager()


@router.websocket("/unsteady_flow")
async def unsteady_flow_ws(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        json_data = await websocket.receive_json()
    except:
        await manager.send_json({"message": "Неверный формат json"}, websocket)
        manager.disconnect(websocket)
        return
    try:
        valid_data = Unsteady_data(**json_data)
    except Exception:
        await manager.send_json({"message": "Валидация данных не пройдена"}, websocket)
        manager.disconnect(websocket)
        return
    unstedy_flow_solver = Unsteady_flow_solver(valid_data)
    generator = unstedy_flow_solver.solve()
    while True:
        try:
            await manager.send_json(next(generator).model_dump_json(), websocket)
        except Exception as e:
            logger.error(e)
            manager.disconnect(websocket)
            return
