# MarketSauce Agent: System Architecture

## Overview

MarketSauce Agent is a self-service market intelligence platform that transforms simple business inputs into comprehensive buyer psychology analysis, competitive intelligence, and actionable implementation roadmaps. The system combines web research (Firecrawl), AI processing (Claude API), and persistent context to deliver ongoing strategic value.

---

## Core Value Proposition

**For Subscribers:**
- Submit minimal inputs (business name, URL, target market)
- Receive comprehensive market diagnostic within minutes
- Continue refining strategy through ongoing AI conversations
- Access research-backed insights without hiring consultants

**For You (Darby):**
- Recurring revenue from subscriptions
- Automated delivery (no manual work per client)
- Scalable architecture (same cost at 10 or 10,000 users)
- Premium upsell path to VIP intensives

---

## System Components

### 1. Intake Layer
Simple form collecting:
```
Required:
- Business/Product Name
- Website URL (Firecrawl extracts context)
- Primary Target Market (1 sentence)
- What They Sell (1 sentence)

Optional (improves output):
- Known Competitors (comma-separated)
- Current Marketing Challenges
- 12-Month Goals
- Additional Context
```

### 2. Research Engine (Firecrawl)
Automatic data gathering:
- Website content extraction
- Competitor website analysis
- Industry trend research
- Social proof gathering (reviews, mentions)
- Pricing intelligence

### 3. Intelligence Processor (Claude API)
Executes MarketSauce methodology:
- PRIME Diagnostic (10 phases)
- Blueprint Generation (5 sections)
- System Prompt Creation (for ongoing use)
- Follow-up Prompt Library

### 4. Output Delivery
Generated deliverables:
- Executive Summary (always visible)
- Full Diagnostic Report (.docx download)
- System Prompt (.md download)
- Follow-up Prompts (copy-paste ready)

### 5. Conversation Mode
Post-delivery engagement:
- Strategy refinement chat
- Campaign development
- Content generation
- Ongoing research updates

---

## Product Tiers

### Express ($29/one-time)
- Foundation Analysis (Phase 1)
- Deep Persona Analysis (Phase 2)
- Executive Summary
- Basic System Prompt
- No conversation mode
- Delivered in under 5 minutes

### Strategic ($79/month)
- Phases 1-5 (Foundation through Golden Opportunities)
- Executive Summary
- Full System Prompt
- 10 Follow-up Prompts
- Conversation mode (50 messages/month)
- Monthly research refresh

### PRIME ($149/month)
- Full 10-Phase Diagnostic
- Complete System Prompt
- 15 Follow-up Prompts
- Unlimited conversation mode
- Weekly research refresh
- Priority processing

### Enterprise ($499/month)
- Everything in PRIME
- Multiple business profiles (up to 5)
- Custom integrations
- Dedicated support channel
- White-label outputs

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Intake  │  │ Progress │  │  Output  │  │   Chat   │    │
│  │   Form   │  │  Viewer  │  │ Delivery │  │  Mode    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (API Layer)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Orchestrator                       │  │
│  │  - Validates inputs                                   │  │
│  │  - Queues research tasks                              │  │
│  │  - Manages processing pipeline                        │  │
│  │  - Delivers outputs                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│    Firecrawl     │ │    Claude API    │ │   Document Gen   │
│    Research      │ │   Intelligence   │ │   (python-docx)  │
│  - Web scraping  │ │  - Analysis      │ │  - DOCX export   │
│  - URL fetching  │ │  - Generation    │ │  - PDF export    │
│  - Search        │ │  - Conversation  │ │  - MD export     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Storage                            │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  User Profiles   │  │  Research Cache  │                 │
│  │  - Subscription  │  │  - Firecrawl     │                 │
│  │  - Usage         │  │  - Generated     │                 │
│  │  - Diagnostics   │  │  - Context       │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Processing Pipeline

### Phase 1: Input Collection (User Action)
1. User submits intake form
2. Frontend validates required fields
3. Backend creates diagnostic job

### Phase 2: Research Gathering (Firecrawl)
1. Extract content from provided URL
2. Identify and research competitors
3. Gather industry trends and data
4. Cache results for processing

### Phase 3: Intelligence Generation (Claude API)
1. Construct prompt with inputs + research
2. Execute PRIME/Blueprint methodology
3. Generate outputs section by section
4. Create system prompt and follow-ups

### Phase 4: Output Delivery
1. Generate downloadable documents
2. Display executive summary
3. Enable conversation mode
4. Queue refresh tasks (for subscribers)

---

## API Integration Specs

### Firecrawl Integration

```javascript
// Web scraping for business context
const scrapeWebsite = async (url) => {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${FIRECRAWL_API_KEY}`
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true
    })
  });
  return response.json();
};

// Competitive research
const researchCompetitors = async (competitors, industry) => {
  const results = [];
  for (const competitor of competitors) {
    const search = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        query: `${competitor} ${industry} reviews pricing features`,
        limit: 5
      })
    });
    results.push(await search.json());
  }
  return results;
};
```

### Claude API Integration

```javascript
// Main diagnostic generation
const generateDiagnostic = async (inputs, research) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2024-01-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: MARKETSAUCE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildDiagnosticPrompt(inputs, research)
        }
      ]
    })
  });
  return response.json();
};
```

---

## Monetization Engine

### Payment Integration (Stripe)
- One-time payments for Express
- Monthly subscriptions for Strategic/PRIME/Enterprise
- Usage-based billing for API overages
- Affiliate tracking for referrals

### Value Metrics
- Diagnostics generated per month
- Conversation messages used
- Research refreshes consumed
- Documents downloaded

### Upsell Triggers
- Express users see "Upgrade for conversation mode"
- Strategic users see competitor count limits
- High-usage Strategic users see PRIME benefits
- PRIME users see Enterprise for multiple profiles

---

## File Structure

```
marketsauce-agent/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IntakeForm.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── OutputViewer.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   └── PricingCards.jsx
│   │   ├── hooks/
│   │   │   ├── useDiagnostic.js
│   │   │   └── useSubscription.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── api/
│   │   ├── diagnostic.py
│   │   ├── research.py
│   │   └── documents.py
│   ├── prompts/
│   │   ├── prime.md
│   │   ├── blueprint.md
│   │   └── system.md
│   └── requirements.txt
└── ARCHITECTURE.md
```

---

## Next Steps

1. Build working prototype (React frontend)
2. Test Firecrawl integration for research
3. Refine Claude prompts for output quality
4. Add Stripe for payment processing
5. Deploy to production (Vercel/Railway)
6. Launch to Gen AI University members first
