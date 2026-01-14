"""
Chat API endpoints
Handles ongoing conversation with diagnostic context
"""

import os
from typing import Optional, List
from datetime import datetime

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1"

# In-memory chat storage (replace with database in production)
chat_sessions: dict = {}


class ChatMessage(BaseModel):
    """A single chat message"""
    role: str  # user or assistant
    content: str


class ChatRequest(BaseModel):
    """Request to send a chat message"""
    session_id: str
    message: str
    diagnostic_context: Optional[str] = None


class ChatResponse(BaseModel):
    """Response from chat"""
    session_id: str
    response: str
    messages: List[ChatMessage]


class ChatSession(BaseModel):
    """Chat session initialization"""
    diagnostic_id: Optional[str] = None
    diagnostic_context: Optional[str] = None
    system_prompt: Optional[str] = None


def get_chat_system_prompt(diagnostic_context: str = None) -> str:
    """Build system prompt for chat mode"""
    base_prompt = """You are MarketSauce Agent in conversation mode. You have deep context on the user's market, persona, and competitive landscape from their diagnostic.

Your role is to:
- Help refine strategy based on specific questions
- Develop campaigns in detail
- Generate content aligned with persona insights
- Research new competitors or trends
- Build implementation plans
- Create sales materials and messaging

Be direct and actionable. Reference the diagnostic context when providing recommendations. Make connections between persona needs and strategic opportunities.

Voice guidelines:
- Clear, simple language
- Short, impactful sentences
- Active voice
- Practical, actionable insights
- Avoid fluff, clichés, and filler words"""

    if diagnostic_context:
        return f"{base_prompt}\n\n## Diagnostic Context\n\n{diagnostic_context[:8000]}"
    return base_prompt


@router.post("/session")
async def create_chat_session(session: ChatSession):
    """Create a new chat session"""
    import uuid
    session_id = str(uuid.uuid4())

    chat_sessions[session_id] = {
        "session_id": session_id,
        "diagnostic_id": session.diagnostic_id,
        "diagnostic_context": session.diagnostic_context,
        "system_prompt": session.system_prompt or get_chat_system_prompt(session.diagnostic_context),
        "messages": [],
        "created_at": datetime.utcnow().isoformat()
    }

    return {"session_id": session_id}


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message and get a response"""
    session_id = request.session_id

    # Create session if it doesn't exist
    if session_id not in chat_sessions:
        chat_sessions[session_id] = {
            "session_id": session_id,
            "diagnostic_context": request.diagnostic_context,
            "system_prompt": get_chat_system_prompt(request.diagnostic_context),
            "messages": [],
            "created_at": datetime.utcnow().isoformat()
        }

    session = chat_sessions[session_id]

    # Add user message
    session["messages"].append({
        "role": "user",
        "content": request.message
    })

    # Generate response with Claude
    if not ANTHROPIC_API_KEY:
        # Demo response if no API key
        response_text = f"Based on your diagnostic context, here's my recommendation for: '{request.message[:50]}...'\n\nThis is a placeholder response. Configure your ANTHROPIC_API_KEY to get real AI responses."
    else:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ANTHROPIC_BASE_URL}/messages",
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2024-01-01"
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 2000,
                    "system": session["system_prompt"],
                    "messages": session["messages"]
                },
                timeout=60.0
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Chat API error")

            result = response.json()
            response_text = result["content"][0]["text"]

    # Add assistant message
    session["messages"].append({
        "role": "assistant",
        "content": response_text
    })

    return ChatResponse(
        session_id=session_id,
        response=response_text,
        messages=[ChatMessage(**m) for m in session["messages"]]
    )


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get chat session history"""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    return chat_sessions[session_id]


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session"""
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return {"status": "deleted"}
