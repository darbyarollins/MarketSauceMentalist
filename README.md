# MarketSauce Agent

AI-powered market intelligence platform that transforms simple business inputs into comprehensive buyer psychology analysis, competitive intelligence, and actionable implementation roadmaps.

## Features

- **Buyer Psychology Analysis**: Deep persona profiling with emotional landscape mapping
- **Competitive Intelligence**: Automated competitor research and positioning analysis
- **Implementation Roadmaps**: 30/90/365 day action plans
- **Strategy Chat**: Ongoing AI conversations with diagnostic context
- **Document Export**: Download diagnostics as DOCX or Markdown

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) Anthropic API key for AI-powered diagnostics
- (Optional) Firecrawl API key for live web research

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example ../.env
# Edit .env with your API keys

# Run server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:3000

## Demo Mode

The app works without API keys in demo mode, generating sample diagnostics to preview the output format. Configure your API keys in `.env` for full AI-powered analysis.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/diagnostic/create` | POST | Start a new diagnostic |
| `/api/diagnostic/status/{id}` | GET | Check diagnostic progress |
| `/api/chat/message` | POST | Send a chat message |
| `/api/documents/generate` | POST | Generate downloadable document |

## Product Tiers

- **Express** ($29 one-time): Foundation + Persona analysis
- **Strategic** ($79/month): 5-phase diagnostic + chat
- **PRIME** ($149/month): Full 10-phase + unlimited chat

## Project Structure

```
marketsauce-agent/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx    # Main application
│   │   └── styles/    # Global styles
│   └── package.json
├── backend/            # FastAPI backend
│   ├── api/
│   │   ├── diagnostic.py  # Diagnostic generation
│   │   ├── chat.py        # Chat endpoints
│   │   └── documents.py   # Document export
│   ├── prompts/
│   │   └── system.md      # PRIME methodology prompt
│   └── requirements.txt
├── .env.example        # Environment template
└── .gitignore
```

## Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: FastAPI, Python 3.10+
- **AI**: Claude API (Anthropic)
- **Research**: Firecrawl API
- **Documents**: python-docx

## License

Proprietary - Gen AI University
