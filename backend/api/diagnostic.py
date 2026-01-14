"""
Diagnostic API endpoints
Handles diagnostic generation pipeline
"""

import os
import json
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime
from pathlib import Path

import httpx
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, HttpUrl

router = APIRouter()

# Configuration
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")
ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1"
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"

# In-memory storage (replace with database in production)
diagnostics_store: Dict[str, Dict] = {}


class DiagnosticInput(BaseModel):
    """Input data for diagnostic generation"""
    business_name: str
    website_url: str
    target_market: str
    what_they_sell: str
    competitors: Optional[str] = None
    challenges: Optional[str] = None
    goals: Optional[str] = None
    context: Optional[str] = None
    mode: str = "strategic"  # express, strategic, full


class DiagnosticResponse(BaseModel):
    """Response for diagnostic request"""
    job_id: str
    status: str
    message: str


class DiagnosticStatus(BaseModel):
    """Status of a diagnostic job"""
    job_id: str
    status: str
    current_phase: int
    total_phases: int
    phase_name: str
    diagnostic: Optional[str] = None
    executive_summary: Optional[str] = None
    system_prompt: Optional[str] = None
    follow_up_prompts: Optional[List[str]] = None
    error: Optional[str] = None


def get_system_prompt() -> str:
    """Load the MarketSauce system prompt"""
    prompt_path = Path(__file__).parent.parent / "prompts" / "system.md"
    if prompt_path.exists():
        return prompt_path.read_text()
    return "You are MarketSauce Agent, an AI market intelligence assistant."


async def scrape_website(url: str) -> Dict:
    """Scrape website content using Firecrawl"""
    if not FIRECRAWL_API_KEY:
        return {"markdown": f"[Website content for {url} - API key not configured]"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{FIRECRAWL_BASE_URL}/scrape",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {FIRECRAWL_API_KEY}"
                },
                json={
                    "url": url,
                    "formats": ["markdown"],
                    "onlyMainContent": True
                },
                timeout=60.0
            )
            if response.status_code == 200:
                return response.json()
            return {"markdown": f"[Could not fetch {url}]"}
        except Exception as e:
            return {"markdown": f"[Error fetching {url}: {str(e)}]"}


async def search_web(query: str, limit: int = 5) -> Dict:
    """Search the web using Firecrawl"""
    if not FIRECRAWL_API_KEY:
        return {"results": []}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{FIRECRAWL_BASE_URL}/search",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {FIRECRAWL_API_KEY}"
                },
                json={
                    "query": query,
                    "limit": limit
                },
                timeout=60.0
            )
            if response.status_code == 200:
                return response.json()
            return {"results": []}
        except Exception:
            return {"results": []}


async def generate_with_claude(
    user_prompt: str,
    system_prompt: str,
    max_tokens: int = 16000
) -> str:
    """Generate content using Claude API"""
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")

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
                "max_tokens": max_tokens,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}]
            },
            timeout=300.0
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Claude API error")

        result = response.json()
        return result["content"][0]["text"]


def build_diagnostic_prompt(inputs: DiagnosticInput, research: Dict) -> str:
    """Build the prompt for diagnostic generation"""
    mode_instruction = {
        "express": "Execute EXPRESS MODE: Phases 1-2 + abbreviated Executive Summary.",
        "strategic": "Execute STRATEGIC MODE: Phases 1-5, 8-9 with full detail.",
        "full": "Execute FULL DIAGNOSTIC: All 10 phases with complete analysis."
    }.get(inputs.mode, "Execute STRATEGIC MODE")

    return f"""
{mode_instruction}

## Business Information

**Business Name:** {inputs.business_name}
**Website URL:** {inputs.website_url}
**Target Market:** {inputs.target_market}
**What They Sell:** {inputs.what_they_sell}
**Known Competitors:** {inputs.competitors or "Not provided"}
**Marketing Challenges:** {inputs.challenges or "Not provided"}
**12-Month Goals:** {inputs.goals or "Not provided"}
**Additional Context:** {inputs.context or "Not provided"}

## Research Data

### Website Content
{research.get('website_content', '')[:5000]}

### Competitor Intelligence
{json.dumps(research.get('competitor_data', []), indent=2)[:3000]}

### Market Trends
{json.dumps(research.get('market_trends', []), indent=2)[:2000]}

---

Generate the complete MarketSauce diagnostic based on this information. Follow the methodology precisely. Include all required sections for the selected mode. Use visceral emotional language for persona sections. Cite sources with links where applicable.
"""


def extract_executive_summary(diagnostic: str) -> str:
    """Extract executive summary from diagnostic"""
    if "## PHASE 8" in diagnostic or "## Executive Summary" in diagnostic:
        markers = ["## PHASE 8", "## Executive Summary", "### Executive Summary"]
        for marker in markers:
            if marker in diagnostic:
                start = diagnostic.find(marker)
                end = diagnostic.find("## PHASE 9", start)
                if end == -1:
                    end = diagnostic.find("## PHASE 10", start)
                if end == -1:
                    end = min(start + 3000, len(diagnostic))
                return diagnostic[start:end].strip()
    return diagnostic[:2000]


def extract_system_prompt(diagnostic: str) -> Optional[str]:
    """Extract system prompt from diagnostic"""
    if "### 9.2" in diagnostic or "## System Prompt" in diagnostic:
        markers = ["### 9.2 System Prompt", "## System Prompt", "### System Prompt"]
        for marker in markers:
            if marker in diagnostic:
                start = diagnostic.find(marker)
                end = diagnostic.find("## PHASE 10", start)
                if end == -1:
                    end = min(start + 5000, len(diagnostic))
                return diagnostic[start:end].strip()
    return None


def extract_follow_up_prompts(diagnostic: str) -> Optional[List[str]]:
    """Extract follow-up prompts from diagnostic"""
    if "## PHASE 10" in diagnostic:
        start = diagnostic.find("## PHASE 10")
        section = diagnostic[start:]
        prompts = []
        for i in range(1, 16):
            patterns = [f"**{i}.", f"{i}.", f"**{i})**", f"{i})"]
            for pattern in patterns:
                if pattern in section:
                    prompt_start = section.find(pattern)
                    next_markers = [f"**{i+1}.", f"{i+1}.", f"**{i+1})**", f"{i+1})"]
                    prompt_end = len(section)
                    for nm in next_markers:
                        if nm in section[prompt_start+len(pattern):]:
                            prompt_end = section.find(nm, prompt_start+len(pattern))
                            break
                    prompts.append(section[prompt_start:prompt_end].strip())
                    break
        return prompts if prompts else None
    return None


async def run_diagnostic_pipeline(job_id: str, inputs: DiagnosticInput):
    """Run the full diagnostic generation pipeline"""
    job = diagnostics_store[job_id]

    try:
        # Phase 1: Website scraping
        job["current_phase"] = 1
        job["phase_name"] = "Gathering website intelligence"
        website_data = await scrape_website(inputs.website_url)

        # Phase 2: Competitor research
        job["current_phase"] = 2
        job["phase_name"] = "Researching competitors"
        competitor_data = []
        if inputs.competitors:
            competitors = [c.strip() for c in inputs.competitors.split(",")][:5]
            for comp in competitors:
                comp_research = await search_web(f"{comp} company reviews pricing", 3)
                competitor_data.append({"name": comp, "data": comp_research})

        # Phase 3: Market trends
        job["current_phase"] = 3
        job["phase_name"] = "Analyzing market trends"
        market_trends = await search_web(f"{inputs.target_market} industry trends 2025 2026", 5)

        # Phase 4: Build persona
        job["current_phase"] = 4
        job["phase_name"] = "Building persona profile"

        # Phase 5: Identify opportunities
        job["current_phase"] = 5
        job["phase_name"] = "Identifying opportunities"

        # Phase 6: Generate diagnostic
        job["current_phase"] = 6
        job["phase_name"] = "Generating strategic brief"

        research = {
            "website_content": website_data.get("data", {}).get("markdown", website_data.get("markdown", "")),
            "competitor_data": competitor_data,
            "market_trends": market_trends.get("data", market_trends.get("results", []))
        }

        user_prompt = build_diagnostic_prompt(inputs, research)
        system_prompt = get_system_prompt()

        diagnostic = await generate_with_claude(user_prompt, system_prompt)

        # Phase 7: Create implementation plan
        job["current_phase"] = 7
        job["phase_name"] = "Creating implementation plan"

        # Phase 8: Compile report
        job["current_phase"] = 8
        job["phase_name"] = "Compiling final report"

        # Extract sections
        executive_summary = extract_executive_summary(diagnostic)
        system_prompt_output = extract_system_prompt(diagnostic)
        follow_up_prompts = extract_follow_up_prompts(diagnostic)

        # Update job with results
        job["status"] = "complete"
        job["diagnostic"] = diagnostic
        job["executive_summary"] = executive_summary
        job["system_prompt"] = system_prompt_output
        job["follow_up_prompts"] = follow_up_prompts
        job["completed_at"] = datetime.utcnow().isoformat()

    except Exception as e:
        job["status"] = "error"
        job["error"] = str(e)


@router.post("/create", response_model=DiagnosticResponse)
async def create_diagnostic(
    inputs: DiagnosticInput,
    background_tasks: BackgroundTasks
):
    """Create a new diagnostic job"""
    job_id = str(uuid.uuid4())

    # Initialize job
    diagnostics_store[job_id] = {
        "job_id": job_id,
        "status": "processing",
        "current_phase": 0,
        "total_phases": 8,
        "phase_name": "Initializing",
        "inputs": inputs.model_dump(),
        "created_at": datetime.utcnow().isoformat()
    }

    # Start background processing
    background_tasks.add_task(run_diagnostic_pipeline, job_id, inputs)

    return DiagnosticResponse(
        job_id=job_id,
        status="processing",
        message="Diagnostic generation started"
    )


@router.get("/status/{job_id}", response_model=DiagnosticStatus)
async def get_diagnostic_status(job_id: str):
    """Get the status of a diagnostic job"""
    if job_id not in diagnostics_store:
        raise HTTPException(status_code=404, detail="Job not found")

    job = diagnostics_store[job_id]

    return DiagnosticStatus(
        job_id=job_id,
        status=job["status"],
        current_phase=job["current_phase"],
        total_phases=job["total_phases"],
        phase_name=job["phase_name"],
        diagnostic=job.get("diagnostic"),
        executive_summary=job.get("executive_summary"),
        system_prompt=job.get("system_prompt"),
        follow_up_prompts=job.get("follow_up_prompts"),
        error=job.get("error")
    )


@router.get("/{job_id}")
async def get_diagnostic(job_id: str):
    """Get the full diagnostic results"""
    if job_id not in diagnostics_store:
        raise HTTPException(status_code=404, detail="Job not found")

    return diagnostics_store[job_id]
