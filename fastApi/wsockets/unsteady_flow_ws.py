from fastapi import APIRouter, WebSocket
from schemas.unsteady_flow_ws_scheme import Unsteady_data
from services.unsteady_flow_calculation import calculate
from pprint import pprint
from wsockets import ConnectionManager

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
    generator = calculate(valid_data)
    while True:
        try:
            await manager.send_json(next(generator), websocket)
        except Exception as e:
            print(e)
            manager.disconnect(websocket)
            return


# {
#     "cond_params": {
#         "time_to_iter": 20,
#         "density": 200,
#         "viscosity": 200
#     },
#     "pipeline": [
#         {
#             "type": "pipe",
#             "diameter": 20,
#             "length": 20
#         },
#         {
#             "type": "pipe",
#             "diameter": 20,
#             "length": 20
#         }
#     ],
#     "boundary_params": {
#         "left": {"type": "speed", "value": 10},
#         "right": {"type": "speed", "value": 10}
#     }
# }
