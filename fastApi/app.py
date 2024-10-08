from fastapi import FastAPI
from wsockets.unsteady_flow_ws import router as unsteady_flow_ws_router
import uvicorn


app = FastAPI(
    openapi_url="/core/openapi.json", docs_url="/core/docs", debug=True, version="0.0.1"
)

app.include_router(unsteady_flow_ws_router)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
