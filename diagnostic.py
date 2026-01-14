"""
MarketSauce Agent Backend API
Orchestrates Firecrawl research and Claude diagnostic generation
"""

import os
import json
import asyncio
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import httpx


# Configuration
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")
ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1"
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"


@dataclass
class DiagnosticInput:
    """Input data for diagnostic generation"""
    business_name: str
    website_url: str
    target_market: str
    what_they_sell: str
    competitors: Optional[str] = None
    challenges: Optional[str] = None
    goals: Optional[str] = None
    context: Optional[str] = None


@dataclass
class ResearchData:
    """Compiled research from Firecrawl"""
    website_content: str
    competitor_data: List[Dict]
    market_trends: List[Dict]
    industry_insights: str


class FirecrawlClient:
    """Client for Firecrawl web research"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
    
    async def scrape_website(self, url: str) -> Dict:
        """Scrape a single website for content"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{FIRECRAWL_BASE_URL}/scrape",
                headers=self.headers,
                json={
                    "url": url,
                    "formats": ["markdown"],
                    "onlyMainContent": True
                },
                timeout=60.0
            )
            return response.json()
    
    async def search_web(self, query: str, limit: int = 5) -> Dict:
        """Search the web for relevant information"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{FIRECRAWL_BASE_URL}/search",
                headers=self.headers,
                json={
                    "query": query,
                    "limit": limit,
                    "scrapeOptions": {
                        "formats": ["markdown"],
                        "onlyMainContent": True
                    }
                },
                timeout=60.0
            )
            return response.json()
    
    async def run_agent(self, prompt: str, urls: Optional[List[str]] = None) -> Dict:
        """Use Firecrawl agent for complex research tasks"""
        async with httpx.AsyncClient() as client:
            payload = {"prompt": prompt}
            if urls:
                payload["urls"] = urls
            
            response = await client.post(
                f"{FIRECRAWL_BASE_URL}/agent",
                headers=self.headers,
                json=payload,
                timeout=120.0
            )
            return response.json()


class ClaudeClient:
    """Client for Claude API interactions"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2024-01-01"
        }
    
    async def generate_diagnostic(
        self, 
        inputs: DiagnosticInput, 
        research: ResearchData,
        mode: str = "strategic",
        system_prompt: str = None
    ) -> str:
        """Generate MarketSauce diagnostic"""
        
        # Load system prompt if not provided
        if not system_prompt:
            with open("prompts/system.md", "r") as f:
                system_prompt = f.read()
        
        # Build the user prompt with inputs and research
        user_prompt = self._build_diagnostic_prompt(inputs, research, mode)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ANTHROPIC_BASE_URL}/messages",
                headers=self.headers,
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 16000,
                    "system": system_prompt,
                    "messages": [
                        {"role": "user", "content": user_prompt}
                    ]
                },
                timeout=300.0
            )
            
            result = response.json()
            return result["content"][0]["text"]
    
    def _build_diagnostic_prompt(
        self, 
        inputs: DiagnosticInput, 
        research: ResearchData,
        mode: str
    ) -> str:
        """Build the prompt for diagnostic generation"""
        
        mode_instruction = {
            "express": "Execute EXPRESS MODE: Phases 1-2 + abbreviated Executive Summary.",
            "strategic": "Execute STRATEGIC MODE: Phases 1-5, 8-9 with full detail.",
            "full": "Execute FULL DIAGNOSTIC: All 10 phases with complete analysis."
        }.get(mode, "Execute STRATEGIC MODE")
        
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
{research.website_content[:5000]}

### Competitor Intelligence
{json.dumps(research.competitor_data, indent=2)[:3000]}

### Market Trends
{json.dumps(research.market_trends, indent=2)[:2000]}

### Industry Insights
{research.industry_insights[:2000]}

---

Generate the complete MarketSauce diagnostic based on this information. Follow the methodology precisely. Include all required sections for the selected mode. Use visceral emotional language for persona sections. Cite sources with links where applicable.
"""


class DiagnosticOrchestrator:
    """Orchestrates the full diagnostic generation pipeline"""
    
    def __init__(self):
        self.firecrawl = FirecrawlClient(FIRECRAWL_API_KEY)
        self.claude = ClaudeClient(ANTHROPIC_API_KEY)
    
    async def generate(
        self, 
        inputs: DiagnosticInput,
        mode: str = "strategic",
        progress_callback=None
    ) -> Dict:
        """Run the full diagnostic generation pipeline"""
        
        results = {
            "status": "processing",
            "phases": [],
            "diagnostic": None,
            "system_prompt": None,
            "follow_up_prompts": None
        }
        
        # Phase 1: Website scraping
        if progress_callback:
            await progress_callback("Gathering website intelligence")
        
        website_data = await self.firecrawl.scrape_website(inputs.website_url)
        results["phases"].append({
            "name": "Website scraping",
            "status": "complete"
        })
        
        # Phase 2: Competitor research
        if progress_callback:
            await progress_callback("Researching competitors")
        
        competitor_data = []
        if inputs.competitors:
            competitors = [c.strip() for c in inputs.competitors.split(",")]
            for comp in competitors[:5]:
                comp_research = await self.firecrawl.search_web(
                    f"{comp} company reviews pricing features",
                    limit=3
                )
                competitor_data.append({
                    "name": comp,
                    "data": comp_research
                })
        
        results["phases"].append({
            "name": "Competitor research",
            "status": "complete"
        })
        
        # Phase 3: Market trends
        if progress_callback:
            await progress_callback("Analyzing market trends")
        
        industry_query = f"{inputs.target_market} industry trends 2025 2026"
        market_trends = await self.firecrawl.search_web(industry_query, limit=5)
        
        results["phases"].append({
            "name": "Market trends",
            "status": "complete"
        })
        
        # Phase 4: Industry insights
        if progress_callback:
            await progress_callback("Gathering industry insights")
        
        insights_result = await self.firecrawl.run_agent(
            f"Find key statistics, trends, and insights about {inputs.target_market} "
            f"including market size, growth rates, and emerging opportunities"
        )
        
        results["phases"].append({
            "name": "Industry insights",
            "status": "complete"
        })
        
        # Compile research
        research = ResearchData(
            website_content=website_data.get("markdown", ""),
            competitor_data=competitor_data,
            market_trends=market_trends.get("results", []),
            industry_insights=json.dumps(insights_result.get("data", {}))
        )
        
        # Phase 5: Generate diagnostic
        if progress_callback:
            await progress_callback("Generating strategic diagnostic")
        
        diagnostic = await self.claude.generate_diagnostic(inputs, research, mode)
        
        results["phases"].append({
            "name": "Diagnostic generation",
            "status": "complete"
        })
        
        # Extract system prompt from diagnostic
        system_prompt = self._extract_system_prompt(diagnostic)
        follow_up_prompts = self._extract_follow_up_prompts(diagnostic)
        
        results["status"] = "complete"
        results["diagnostic"] = diagnostic
        results["system_prompt"] = system_prompt
        results["follow_up_prompts"] = follow_up_prompts
        results["completed_at"] = datetime.utcnow().isoformat()
        
        return results
    
    def _extract_system_prompt(self, diagnostic: str) -> Optional[str]:
        """Extract the system prompt section from diagnostic"""
        if "## PHASE 9" in diagnostic:
            start = diagnostic.find("### 9.2 System Prompt")
            if start != -1:
                end = diagnostic.find("## PHASE 10", start)
                if end != -1:
                    return diagnostic[start:end].strip()
        return None
    
    def _extract_follow_up_prompts(self, diagnostic: str) -> Optional[List[str]]:
        """Extract follow-up prompts from diagnostic"""
        if "## PHASE 10" in diagnostic:
            start = diagnostic.find("## PHASE 10")
            if start != -1:
                section = diagnostic[start:]
                prompts = []
                for i in range(1, 16):
                    marker = f"**{i}."
                    if marker in section:
                        prompt_start = section.find(marker)
                        next_marker = f"**{i+1}."
                        prompt_end = section.find(next_marker, prompt_start)
                        if prompt_end == -1:
                            prompt_end = len(section)
                        prompts.append(section[prompt_start:prompt_end].strip())
                return prompts if prompts else None
        return None


# FastAPI Application (example endpoints)
"""
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MarketSauce Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/diagnostic")
async def create_diagnostic(inputs: DiagnosticInput, mode: str = "strategic"):
    orchestrator = DiagnosticOrchestrator()
    results = await orchestrator.generate(inputs, mode)
    return results

@app.get("/api/diagnostic/{job_id}")
async def get_diagnostic(job_id: str):
    # Retrieve from database
    pass

@app.post("/api/chat")
async def chat_with_context(message: str, diagnostic_id: str):
    # Load diagnostic context and continue conversation
    pass
"""


# Example usage
async def main():
    """Example diagnostic generation"""
    
    inputs = DiagnosticInput(
        business_name="Gen AI University",
        website_url="https://genaiuniversity.com",
        target_market="Entrepreneurs and coaches who want to implement AI systems",
        what_they_sell="AI implementation community with workshops and mastermind",
        competitors="Copy.ai, Jasper, AI Business School",
        challenges="Converting free members to paid, retention beyond first month",
        goals="500 paid members by end of 2026, $50k MRR",
        context="Anti-overwhelm philosophy, monthly tool mastery approach"
    )
    
    orchestrator = DiagnosticOrchestrator()
    
    async def progress(message):
        print(f"Progress: {message}")
    
    results = await orchestrator.generate(inputs, "strategic", progress)
    
    print("\n" + "="*60)
    print("DIAGNOSTIC COMPLETE")
    print("="*60)
    print(f"\nStatus: {results['status']}")
    print(f"Completed: {results['completed_at']}")
    print(f"\nDiagnostic Length: {len(results['diagnostic'])} characters")
    
    if results['system_prompt']:
        print(f"System Prompt: Generated ({len(results['system_prompt'])} chars)")
    
    if results['follow_up_prompts']:
        print(f"Follow-up Prompts: {len(results['follow_up_prompts'])} prompts")


if __name__ == "__main__":
    asyncio.run(main())
