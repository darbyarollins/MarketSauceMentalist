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


def generate_demo_diagnostic(inputs: "DiagnosticInput") -> str:
    """Generate a demo diagnostic when API keys aren't configured"""
    return f"""# {inputs.business_name} Market Diagnostic

## PHASE 1: FOUNDATION AND CONTEXT ANALYSIS

### 1.1 Product/Market Clarity

**Positioning Statement:** {inputs.business_name} provides {inputs.what_they_sell} for {inputs.target_market}. The core value lies in delivering clarity and actionable direction to customers who feel overwhelmed by options.

**Core Value (Emotional Terms):** Relief from decision paralysis. Confidence in their path forward. The feeling of having an expert guide who "gets it."

**Job to Be Done:**
- Functional: Get expert guidance on marketing strategy
- Emotional: Feel confident and clear about next steps
- Social: Be seen as strategic and well-informed by peers

### 1.2 Market Segment Identification

**PRIMARY SEGMENT:** {inputs.target_market}
These are typically professionals aged 30-55 with established businesses seeking growth. They have revenue but lack time and clarity. They value expertise and are willing to invest in solutions that save them time. Estimated segment size: 500,000+ in North America alone.

**SECONDARY SEGMENT A:** Early-stage entrepreneurs seeking foundational guidance
**SECONDARY SEGMENT B:** Marketing teams at growing companies needing strategic direction
**SECONDARY SEGMENT C:** Coaches and consultants looking to systematize their own offerings

---

## PHASE 2: DEEP PERSONA ANALYSIS

### 2.1 Psychosocial Deep-Dive

**Geographic Context:** Primarily urban and suburban areas with strong entrepreneurial ecosystems. Active in online communities, LinkedIn, and industry-specific forums.

**Demographic Profile:** Age 35-50, income $75K-250K+, college-educated, typically founders, executives, or senior marketers.

**Psychographic Profile:**

**Identity and Self-Perception:** They see themselves as builders, problem-solvers, and leaders. They take pride in their work but secretly worry they're falling behind.

**Core Values:** Efficiency, authenticity, growth, family/lifestyle balance, making an impact.

**Deepest Desires:** To build something meaningful that provides financial freedom and recognition. To stop feeling like they're constantly behind.

**Status and Belonging:** They want to be seen as successful by peers but avoid appearing desperate or struggling.

**Control and Autonomy:** High need for control. They resist solutions that feel prescriptive or remove their agency.

**Time Pressure:** Severe. Every hour counts. They resent activities that feel like wasted time.

**Information Overwhelm:** Drowning in content, courses, and advice. Paralyzed by too many options.

**Risk Tolerance:** Moderate. Will invest in proven solutions but cautious about "shiny objects."

**Trust Patterns:** Skeptical of hype. Trust peer recommendations and demonstrated expertise.

**Change Readiness:** Ready to change but need clear, actionable steps. Resistant to vague advice.

### 2.2 Goals Framework

**PRIMARY GOAL:** Build a predictable, scalable marketing system that generates consistent leads and revenue.

**Primary Goal Topic:** Marketing Clarity

**Top 5 Secondary Goals:**
1. Reduce time spent on marketing decisions
2. Increase conversion rates on existing traffic
3. Develop messaging that resonates with ideal customers
4. Build authority and visibility in their market
5. Create systems that work without constant attention

### 2.3 Complaints and Pain Points

**Top 5 Primary Complaints:**
1. "I've tried everything but nothing seems to stick" - The frustration of scattered efforts with no cohesive strategy
2. "I don't know what I don't know" - The anxiety of potentially missing obvious opportunities
3. "Everyone has different advice" - The paralysis of conflicting expert opinions
4. "I don't have time to figure this out" - The resentment of marketing stealing time from core work
5. "I'm not sure if I'm reaching the right people" - The doubt about whether their message lands

**Primary Complaint Topic:** Scattered Efforts

### 2.4 Emotional Landscape

**Positive Feelings (when goals achieved):**
Confident, Clear, Energized, Relieved, Proud, Focused, Optimistic, Accomplished, Strategic, In Control

**Negative Feelings (current state):**
Overwhelmed, Frustrated, Anxious, Scattered, Doubtful, Behind, Exhausted, Confused, Stuck, Invisible

**Ultimate Fear:** Waking up in 2 years having spent countless hours and thousands of dollars on marketing that never worked. Watching competitors pass them by. Facing the possibility that their business might not survive because they couldn't figure out how to reach the right people with the right message. The quiet dread that maybe they're just not cut out for this.

---

## PHASE 8: EXECUTIVE SUMMARY

### TL;DR Key Findings

**PRIMARY SEGMENT:** {inputs.target_market} - established professionals seeking marketing clarity and systematic growth strategies.

**CORE INSIGHT:** Your market is drowning in information but starving for direction. They don't need more tactics - they need a trusted guide who can cut through the noise and show them exactly what to do next. The gap in the market is not more information but better implementation support.

**TOP 3 OPPORTUNITIES:**

1. **Implementation-Focused Positioning** - Position as the "implementation partner" rather than another information source. Expected impact: 40-60% increase in conversion by addressing the real pain point.

2. **Systematized Onboarding** - Create a clear, step-by-step intake process that immediately demonstrates value and builds trust. Expected impact: Higher retention and referrals from day one clarity.

3. **Persona-Driven Content Strategy** - Develop content that speaks directly to the emotional journey of your buyer, acknowledging their frustrations before presenting solutions. Expected impact: 2-3x engagement on content.

**BIGGEST COMPETITIVE ADVANTAGE:** You understand that your customers don't just need information - they need clarity, direction, and implementation support. Most competitors sell knowledge; you can sell transformation.

**RECOMMENDED FIRST ACTION:** Audit your current messaging for "information-speak" vs "transformation-speak." Rewrite your homepage headline to address the emotional pain point (overwhelm, scattered efforts) rather than listing features.

**PROJECTED 12-MONTH IMPACT:** By focusing on implementation support and emotional resonance in messaging, expect 30-50% increase in qualified leads and significantly higher customer lifetime value through reduced churn.

---

## PHASE 9: SYSTEM PROMPT

### 9.2 System Prompt

You are a strategic marketing advisor for {inputs.business_name}. Your role is to help develop marketing strategies, content, and campaigns for {inputs.target_market}.

**Target Persona:**
- {inputs.target_market}
- Core struggle: Overwhelm and scattered marketing efforts
- Deepest desire: Clarity and predictable growth
- Ultimate fear: Wasting time and money on strategies that don't work

**Voice Guidelines:**
- Direct and actionable (no fluff)
- Empathetic but not patronizing
- Focus on implementation, not theory
- Acknowledge their expertise while providing guidance

**Key Messaging Themes:**
- From scattered to strategic
- From overwhelmed to clear
- From guessing to knowing

When providing recommendations, always connect back to the persona's emotional state and practical constraints. Focus on quick wins that build momentum.

---

## PHASE 10: FOLLOW-UP PROMPTS

**1.** "Based on this diagnostic, write 5 LinkedIn post ideas that address my persona's primary complaints without being salesy."

**2.** "Create a homepage headline and subheadline that speaks to my persona's ultimate fear and positions my offer as the solution."

**3.** "Develop a 3-email welcome sequence for new subscribers that builds trust and moves them toward a discovery call."

**4.** "Write a case study outline that demonstrates transformation rather than just listing features."

**5.** "Create 10 content topics for blog posts or videos that address my persona's secondary goals."

**6.** "Develop a competitor differentiation statement that positions us as the implementation-focused alternative."

**7.** "Write an objection-handling guide for the top 5 reasons prospects don't buy."

**8.** "Create a referral request script that feels natural and leverages our persona's desire for peer recognition."

**9.** "Develop a 30-day content calendar aligned with our persona's emotional journey."

**10.** "Write ad copy for a retargeting campaign that speaks to people who visited but didn't convert."

---

*This diagnostic was generated in DEMO MODE. For full AI-powered analysis with live market research, configure your API keys in the .env file.*
"""


async def generate_with_claude(
    user_prompt: str,
    system_prompt: str,
    max_tokens: int = 16000,
    inputs: "DiagnosticInput" = None
) -> str:
    """Generate content using Claude API"""
    if not ANTHROPIC_API_KEY:
        # Return demo diagnostic when API key not configured
        if inputs:
            return generate_demo_diagnostic(inputs)
        return "API key not configured. Please set ANTHROPIC_API_KEY in your .env file."

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

        diagnostic = await generate_with_claude(user_prompt, system_prompt, inputs=inputs)

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
