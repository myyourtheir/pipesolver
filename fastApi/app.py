from fastapi import FastAPI
from websockets.unsteady_flow_ws import router as unsteady_flow_ws_router

app = FastAPI(openapi_url="/core/openapi.json", docs_url="/core/docs")

app.include_router(unsteady_flow_ws_router)
