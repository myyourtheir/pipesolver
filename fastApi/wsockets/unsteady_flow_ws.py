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
        await manager.disconnect(websocket, "Неверный формат", 1007)
        return
    try:
        valid_data = Unsteady_data(**json_data)
    except Exception:
        await manager.disconnect(websocket, "Валидация данных не пройдена", 1007)
        return
    try:
        unstedy_flow_solver = Unsteady_flow_solver(valid_data)
        generator = unstedy_flow_solver.solve()
        max = valid_data.cond_params.time_to_iter
        current = 0
        while current < max:
            next_val = next(generator)
            await manager.send_json(next_val.model_dump(), websocket)
            current = next_val.t
        await manager.disconnect(websocket, "Расчет завершен")
    except Exception as e:
        logger.exception(e)
        await manager.disconnect(websocket, "Ошибка при расчете", 1011)
    return
