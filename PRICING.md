# MarketSauce Agent: Pricing and Monetization

## Pricing Philosophy

Your retention data shows the $100-149 monthly price point has the highest retention rates. Premium tiers retain 3.4x better than low-cost options. This informs our structure.

The goal: Make it easy for people to pay you while delivering outsized value.

---

## Tier Structure

### Express ($29 one-time)

**What They Get:**
- Foundation Analysis (Phase 1)
- Deep Persona Profile (Phase 2)
- Executive Summary
- Basic System Prompt
- PDF download of report

**What They Do NOT Get:**
- Competitive intelligence
- Implementation roadmap
- Conversation mode
- Research refresh

**Conversion Path:**
After download, show "Upgrade to Strategic for ongoing strategy support and competitive updates"

**Cost to Serve:**
- Firecrawl: ~$0.50 (website scrape only)
- Claude: ~$1.20 (shorter output)
- Total: ~$1.70
- Margin: 94%

---

### Strategic ($79/month)

**What They Get:**
- Full 5-Phase Diagnostic (Foundation through Golden Opportunities)
- Executive Summary
- Complete System Prompt
- 10 Follow-up Prompts
- Conversation mode (50 messages/month)
- Monthly research refresh
- DOCX download

**What They Do NOT Get:**
- Implementation roadmap (Phase 7)
- Unlimited conversation
- Weekly refresh

**Conversion Path:**
After hitting 40 messages, show "Running low on strategy chat. Upgrade to PRIME for unlimited access."

**Cost to Serve:**
- Firecrawl: ~$2.50 (website + 5 competitors + trends)
- Claude: ~$3.50 (full strategic output)
- Refresh: ~$1.00/month
- Total: ~$7.00 first month, ~$4.00 ongoing
- Margin: 91-95%

---

### PRIME ($149/month)

**What They Get:**
- Full 10-Phase Diagnostic
- Complete Implementation Roadmap
- Campaign Development Kit
- 15 Follow-up Prompts
- Unlimited conversation mode
- Weekly research refresh
- Priority processing
- DOCX + PDF downloads

**What They Do NOT Get:**
- Multiple business profiles
- White-label outputs
- Dedicated support

**Conversion Path:**
After 3 months, offer annual at $1,199 ($100/month effective). Position Enterprise for agencies.

**Cost to Serve:**
- Firecrawl: ~$5.00 (comprehensive research)
- Claude: ~$8.00 (full diagnostic)
- Refresh: ~$3.00/month (weekly)
- Conversation: ~$5.00/month average
- Total: ~$21.00/month ongoing
- Margin: 86%

---

### Enterprise ($499/month)

**What They Get:**
- Everything in PRIME
- Up to 5 business profiles
- White-label outputs (your branding removed)
- Dedicated Slack channel support
- Custom integrations (Zapier, Make)
- API access for automation

**Who This Is For:**
- Agencies running diagnostics for clients
- Consultants building client deliverables
- Coaches with multiple business lines

**Cost to Serve:**
- 5x PRIME research: ~$105/month
- Support time: ~$50/month
- Total: ~$155/month
- Margin: 69%

---

## Revenue Projections

### Conservative Scenario (Year 1)

| Tier | Users | MRR |
|------|-------|-----|
| Express | 50/month | $1,450 |
| Strategic | 100 | $7,900 |
| PRIME | 40 | $5,960 |
| Enterprise | 5 | $2,495 |
| **Total** | **195** | **$17,805** |

Annual: ~$213,660

### Aggressive Scenario (Year 1)

| Tier | Users | MRR |
|------|-------|-----|
| Express | 150/month | $4,350 |
| Strategic | 300 | $23,700 |
| PRIME | 100 | $14,900 |
| Enterprise | 15 | $7,485 |
| **Total** | **565** | **$50,435** |

Annual: ~$605,220

---

## Launch Strategy

### Phase 1: Gen AI University Members (Weeks 1-4)

- Offer Strategic tier at $49/month (founding member rate)
- Lock in annual at $399 (saves $180)
- Goal: 50 founding members
- Revenue: $2,450 MRR or $19,950 annual

### Phase 2: Public Launch (Weeks 5-8)

- Full pricing active
- Affiliate program: 40% lifetime commission
- Partner with complementary tools (Jasper, Copy.ai replacements)
- Content marketing: Case studies from founding members

### Phase 3: Scale (Months 3-6)

- Launch Enterprise tier
- Build integrations (Zapier, Make)
- Develop workshop curriculum around outputs
- White-label licensing for consultants

---

## Upsell Mechanics

### Express to Strategic
- Trigger: Download complete
- Message: "Get competitive intelligence and ongoing strategy support. Upgrade to Strategic."
- Incentive: First month 50% off

### Strategic to PRIME
- Trigger: 40+ messages used OR 3 months retention
- Message: "You are getting serious value. Unlock unlimited chat and implementation roadmaps with PRIME."
- Incentive: Lock in current rate for 12 months

### PRIME to Enterprise
- Trigger: User asks about multiple businesses OR white-label
- Message: "Manage all your clients from one dashboard. Enterprise gives you 5 profiles and white-label outputs."
- Incentive: Two weeks free trial

### Annual Conversion
- Trigger: 3 months active subscription
- Message: "Lock in your rate and save 2 months. Annual billing saves you $158."
- Incentive: Exclusive annual-only bonus content

---

## Payment Integration

### Stripe Products

```javascript
// Product definitions for Stripe
const products = {
  express: {
    price_id: "price_express_29",
    mode: "payment", // one-time
    amount: 2900
  },
  strategic_monthly: {
    price_id: "price_strategic_79",
    mode: "subscription",
    amount: 7900,
    interval: "month"
  },
  strategic_annual: {
    price_id: "price_strategic_790",
    mode: "subscription",
    amount: 79000,
    interval: "year"
  },
  prime_monthly: {
    price_id: "price_prime_149",
    mode: "subscription",
    amount: 14900,
    interval: "month"
  },
  prime_annual: {
    price_id: "price_prime_1199",
    mode: "subscription",
    amount: 119900,
    interval: "year"
  },
  enterprise: {
    price_id: "price_enterprise_499",
    mode: "subscription",
    amount: 49900,
    interval: "month"
  }
};
```

### Webhook Handlers

- `checkout.session.completed`: Create user, generate first diagnostic
- `invoice.paid`: Trigger research refresh
- `customer.subscription.updated`: Adjust access level
- `customer.subscription.deleted`: Revoke access, send win-back email

---

## Usage Metering

Track these metrics per user:

- Diagnostics generated (count)
- Conversation messages used (count)
- Research refreshes consumed (count)
- Documents downloaded (count)
- API calls (for Enterprise)

Alert when approaching limits. Suggest upgrade before hard cutoff.

---

## Affiliate Program

### Structure
- 40% lifetime commission (matches your current Gen AI U model)
- Cookie duration: 90 days
- Payout: Monthly, $50 minimum

### Materials
- Swipe copy for email/social
- Demo account access
- Custom landing pages with tracking

### Top Affiliate Incentives
- $5k+ monthly: 50% commission
- $10k+ monthly: 60% commission + featured partner status

---

## Key Metrics to Track

- CAC by channel (paid, organic, affiliate)
- LTV by tier
- Churn rate by tier and by month
- Upgrade rate (Express to paid, Strategic to PRIME)
- Usage patterns (messages, refreshes, downloads)
- NPS after first diagnostic delivery

---

## Competitive Positioning

### What You Are NOT
- Another AI writing tool
- A prompt library
- Generic business consultant

### What You ARE
- Market intelligence on demand
- Deep buyer psychology you can act on
- Ongoing strategic partner (not one-off deliverable)

### Price Anchoring
- Hiring a marketing consultant: $5,000-15,000 per project
- Market research reports: $2,000-10,000
- AI implementation coaching: $500-2,000/month
- MarketSauce Agent PRIME: $149/month (less than 3% of consultant cost)
