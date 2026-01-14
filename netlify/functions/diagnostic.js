// MarketSauce Research - Pure Firecrawl

async function scrape(url) {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true })
  });

  return res.ok ? (await res.json()).data : null;
}

async function search(query) {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return [];

  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ query, limit: 5 })
  });

  const data = res.ok ? await res.json() : {};
  return data.data || data.results || [];
}

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };

  try {
    const input = JSON.parse(event.body);

    // Research
    const website = await scrape(input.website_url);
    const competitors = input.competitors ? await Promise.all(
      input.competitors.split(',').slice(0, 3).map(c => search(c.trim()))
    ) : [];
    const trends = await search(`${input.target_market} trends 2025`);

    // Build report
    const report = `# ${input.business_name} Market Research

## Your Website
${website?.markdown?.substring(0, 2000) || 'Could not scrape'}

## Competitors
${input.competitors?.split(',').map((c, i) => `### ${c.trim()}
${competitors[i]?.map(r => `- [${r.title}](${r.url})`).join('\n') || 'No data'}`).join('\n\n') || 'None specified'}

## Market Trends
${trends.map(t => `- **${t.title}**: ${t.description || ''}`).join('\n') || 'No trends found'}

---
*Pure Firecrawl research - no AI*`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'complete',
        diagnostic: report,
        executive_summary: `Research for ${input.business_name}`,
        inputs: { business_name: input.business_name, target_market: input.target_market }
      })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ status: 'error', error: e.message }) };
  }
}
