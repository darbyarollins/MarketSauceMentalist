"""
MarketSauce Agent Backend API
Main FastAPI application entry point
"""

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.diagnostic import router as diagnostic_router
from api.chat import router as chat_router
from api.documents import router as documents_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    print("MarketSauce Agent API starting...")
    yield
    print("MarketSauce Agent API shutting down...")

app = FastAPI(
    title="MarketSauce Agent API",
    description="AI-powered market intelligence platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.environ.get("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(diagnostic_router, prefix="/api/diagnostic", tags=["Diagnostic"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(documents_router, prefix="/api/documents", tags=["Documents"])

@app.get("/")
async def root():
    return {"message": "MarketSauce Agent API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
