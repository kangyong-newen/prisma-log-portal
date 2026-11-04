from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import (
    router as auth_router
)

from app.routers.logs import (
    router as logs_router
)

app = FastAPI(
    title="Prisma Log Portal"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.55.110:30000",
        "http://localhost:30000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api"
)

app.include_router(
    logs_router,
    prefix="/api/logs"
)

@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }
