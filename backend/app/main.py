import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .utils.cleanup import cleanup_loop
from .routers import organize, compress, convert, edit, security

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start cleanup task
    cleanup_task = asyncio.create_task(cleanup_loop())
    yield
    cleanup_task.cancel()

app = FastAPI(
    title="OpenPDF API",
    description="Backend REST API for OpenPDF - All-in-One Free PDF Processing Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "Content-Disposition", 
        "X-Original-Size", 
        "X-Final-Size", 
        "X-Savings-Percent", 
        "X-Target-Met"
    ]
)

app.include_router(organize.router)
app.include_router(compress.router)
app.include_router(convert.router)
app.include_router(edit.router)
app.include_router(security.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "OpenPDF API",
        "version": "1.0.0",
        "tools_count": 30
    }

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your document."}
    )
