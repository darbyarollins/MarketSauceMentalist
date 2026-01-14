import React, { useState, useRef, useEffect } from 'react';

const colors = {
  lime: '#dcff50',
  black: '#000000',
  darkGray: '#212121',
  lightGray: '#e5e0df',
  white: '#ffffff'
};

const IntakeForm = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    targetMarket: '',
    whatTheySell: '',
    competitors: '',
    challenges: '',
    goals: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: `2px solid ${colors.darkGray}`,
    borderRadius: '0',
    backgroundColor: colors.white,
    color: colors.black,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle}>Business Name *</label>
        <input
          type="text"
          required
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          placeholder="Acme Consulting"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Website URL *</label>
        <input
          type="url"
          required
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          placeholder="https://yoursite.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Target Market *</label>
        <input
          type="text"
          required
          value={formData.targetMarket}
          onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
          placeholder="B2B SaaS founders with 10-50 employees"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>What You Sell *</label>
        <textarea
          required
          value={formData.whatTheySell}
          onChange={(e) => setFormData({ ...formData, whatTheySell: e.target.value })}
          placeholder="Describe your product or service"
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ borderTop: `1px solid ${colors.lightGray}`, paddingTop: '16px' }}>
        <p style={{ fontSize: '11px', color: colors.darkGray, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Optional
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            value={formData.competitors}
            onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
            placeholder="Known Competitors (comma-separated)"
            style={inputStyle}
          />
          <input
            type="text"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            placeholder="Marketing Challenges"
            style={inputStyle}
          />
          <input
            type="text"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="12-Month Goals"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        style={{
          padding: '16px 32px',
          fontSize: '14px',
          fontWeight: '700',
          backgroundColor: isProcessing ? colors.darkGray : colors.lime,
          color: colors.black,
          border: 'none',
          cursor: isProcessing ? 'wait' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginTop: '8px'
        }}
      >
        {isProcessing ? 'Processing...' : 'Generate Diagnostic'}
      </button>
    </form>
  );
};

const ProgressTracker = ({ currentPhase, phases }) => {
  return (
    <div style={{ padding: '24px', backgroundColor: colors.darkGray, color: colors.white }}>
      <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px', color: colors.lime }}>
        Processing
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {phases.map((phase, index) => {
          const isComplete = index < currentPhase;
          const isCurrent = index === currentPhase;
          
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isComplete || isCurrent ? 1 : 0.4 }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isComplete ? colors.lime : isCurrent ? colors.white : 'transparent',
                border: `2px solid ${isComplete ? colors.lime : isCurrent ? colors.white : colors.lightGray}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: isComplete || isCurrent ? colors.black : colors.lightGray,
                flexShrink: 0
              }}>
                {isComplete ? '✓' : index + 1}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isCurrent ? '600' : '400' }}>{phase}</span>
              {isCurrent && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.lime,
                  animation: 'pulse 1s infinite'
                }} />
              )}
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

const OutputSection = ({ title, content, isExpanded, onToggle }) => {
  return (
    <div style={{ borderBottom: `1px solid ${colors.lightGray}` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: '600', color: colors.black }}>{title}</span>
        <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '16px' }}>▼</span>
      </button>
      
      {isExpanded && (
        <div style={{ padding: '0 16px 16px', fontSize: '14px', lineHeight: '1.6', color: colors.darkGray }}>
          {content}
        </div>
      )}
    </div>
  );
};

const ChatInterface = ({ diagnosticContext }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Your diagnostic is complete. Ask me anything to refine strategy, develop campaigns, or generate content.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        `Based on your diagnostic: Your persona struggles with ${diagnosticContext?.primaryComplaint || 'clarity'}. Here is my recommendation...`,
        `Looking at competitive positioning, the biggest gap is ${diagnosticContext?.marketGap || 'implementation support'}. Let me show you how to exploit that...`,
        `For ${diagnosticContext?.targetMarket || 'your target market'}, the emotional trigger that resonates most is fear of ${diagnosticContext?.ultimateFear || 'falling behind'}.`
      ];
      setMessages(prev => [...prev, { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '320px', border: `2px solid ${colors.darkGray}`, backgroundColor: colors.white }}>
      <div style={{ padding: '14px', borderBottom: `2px solid ${colors.darkGray}`, backgroundColor: colors.lime }}>
        <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Strategy Chat</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            backgroundColor: msg.role === 'user' ? colors.darkGray : colors.lightGray,
            color: msg.role === 'user' ? colors.white : colors.black,
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div style={{ padding: '12px 14px', backgroundColor: colors.lightGray, alignSelf: 'flex-start', fontSize: '13px' }}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ padding: '12px', borderTop: `2px solid ${colors.darkGray}`, display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your market or strategy..."
          style={{ flex: 1, padding: '10px 14px', fontSize: '13px', border: `2px solid ${colors.darkGray}`, outline: 'none' }}
        />
        <button onClick={handleSend} disabled={isLoading} style={{
          padding: '10px 20px',
          backgroundColor: colors.lime,
          border: 'none',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

const PricingCard = ({ tier, price, period, features, isPopular, onSelect }) => {
  return (
    <div style={{
      border: isPopular ? `3px solid ${colors.lime}` : `2px solid ${colors.darkGray}`,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: colors.white
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.lime,
          padding: '5px 14px',
          fontSize: '10px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Most Popular
        </div>
      )}
      
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', color: colors.black }}>{tier}</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '36px', fontWeight: '700' }}>${price}</span>
        <span style={{ fontSize: '14px', color: colors.darkGray }}>/{period}</span>
      </div>
      
      <div style={{ flex: 1, marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {features.map((feature, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', lineHeight: '1.4' }}>
            <span style={{ color: colors.lime, fontWeight: '700' }}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      <button onClick={onSelect} style={{
        padding: '14px',
        backgroundColor: isPopular ? colors.lime : colors.darkGray,
        color: isPopular ? colors.black : colors.white,
        border: 'none',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        fontSize: '12px'
      }}>
        Get Started
      </button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('pricing');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ executive: true });

  const phases = [
    'Gathering website intelligence',
    'Researching competitors',
    'Analyzing market trends',
    'Building persona profile',
    'Identifying opportunities',
    'Generating strategic brief',
    'Creating implementation plan',
    'Compiling final report'
  ];

  const handleSelectTier = () => setView('intake');

  const handleSubmitIntake = async (formData) => {
    setView('processing');
    setCurrentPhase(0);
    
    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentPhase(i + 1);
    }
    
    setDiagnosticData({
      businessName: formData.businessName,
      targetMarket: formData.targetMarket,
      primaryComplaint: 'overwhelm from too many options without clear direction',
      ultimateFear: 'wasting months on strategies that never produce results',
      marketGap: 'implementation support with personalized guidance',
      topOpportunities: [
        'Workshop-led community building for high-touch engagement',
        'Productized service packages with clear transformation outcomes',
        'Content strategy leveraging buyer psychology insights'
      ],
      executiveSummary: `${formData.businessName} operates in a market hungry for clarity and implementation support. Your target audience of ${formData.targetMarket} drowns in information but starves for direction. The competitive landscape shows most players offering either high-theory consulting or low-touch digital products. The gap is clear: hands-on implementation with systematic methodology.`
    });
    
    setView('results');
  };

  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.lightGray, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <header style={{ padding: '16px 24px', backgroundColor: colors.black, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: colors.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px' }}>M</div>
          <span style={{ color: colors.white, fontSize: '18px', fontWeight: '700' }}>MarketSauce</span>
        </div>
        
        {view !== 'pricing' && (
          <button onClick={() => setView('pricing')} style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: `2px solid ${colors.lime}`,
            color: colors.lime,
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer'
          }}>
            Plans
          </button>
        )}
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        
        {view === 'pricing' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', color: colors.black }}>Market Intelligence on Demand</h1>
              <p style={{ fontSize: '15px', color: colors.darkGray, maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
                Deep buyer psychology, competitive analysis, and implementation roadmaps. Submit your info. Get strategy in minutes.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <PricingCard
                tier="Express"
                price="29"
                period="one-time"
                features={['Foundation Analysis', 'Deep Persona Profile', 'Executive Summary', 'Basic System Prompt', 'Delivered in 5 minutes']}
                onSelect={handleSelectTier}
              />
              
              <PricingCard
                tier="Strategic"
                price="79"
                period="month"
                isPopular={true}
                features={['Full 5-Phase Diagnostic', 'Competitive Intelligence', 'Golden Opportunities Report', 'Complete System Prompt', '50 Strategy Chat messages/month', 'Monthly research refresh']}
                onSelect={handleSelectTier}
              />
              
              <PricingCard
                tier="PRIME"
                price="149"
                period="month"
                features={['Full 10-Phase Diagnostic', 'Implementation Roadmap', 'Campaign Development Kit', 'Unlimited Strategy Chat', 'Weekly research refresh', 'Priority processing']}
                onSelect={handleSelectTier}
              />
            </div>
          </div>
        )}

        {view === 'intake' && (
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: colors.black }}>Tell Us About Your Business</h2>
              <p style={{ fontSize: '14px', color: colors.darkGray, lineHeight: '1.5' }}>
                The more context you provide, the sharper your diagnostic. We research your website and competitors automatically.
              </p>
            </div>
            
            <div style={{ backgroundColor: colors.white, padding: '24px', border: `2px solid ${colors.darkGray}` }}>
              <IntakeForm onSubmit={handleSubmitIntake} />
            </div>
          </div>
        )}

        {view === 'processing' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: colors.black }}>Generating Your Diagnostic</h2>
              <p style={{ fontSize: '14px', color: colors.darkGray }}>Our AI is researching your market and building your strategic brief.</p>
            </div>
            <ProgressTracker currentPhase={currentPhase} phases={phases} />
          </div>
        )}

        {view === 'results' && diagnosticData && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: colors.black }}>{diagnosticData.businessName} Diagnostic Complete</h2>
              <p style={{ fontSize: '14px', color: colors.darkGray }}>Download the full report or continue refining your strategy below.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <button style={{ padding: '16px', backgroundColor: colors.lime, border: 'none', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>↓</span> Download Report (.docx)
              </button>
              <button style={{ padding: '16px', backgroundColor: colors.darkGray, color: colors.white, border: 'none', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>↓</span> Download System Prompt
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: colors.white, border: `2px solid ${colors.darkGray}` }}>
                <div style={{ padding: '14px', borderBottom: `2px solid ${colors.darkGray}`, backgroundColor: colors.lime }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Key Findings</h3>
                </div>
                
                <OutputSection
                  title="Executive Summary"
                  content={diagnosticData.executiveSummary}
                  isExpanded={expandedSections.executive}
                  onToggle={() => toggleSection('executive')}
                />
                
                <OutputSection
                  title="Primary Complaint"
                  content={`Your target market struggles with: ${diagnosticData.primaryComplaint}. This creates opportunity for positioning that addresses this pain directly.`}
                  isExpanded={expandedSections.complaint}
                  onToggle={() => toggleSection('complaint')}
                />
                
                <OutputSection
                  title="Ultimate Fear"
                  content={`The nightmare keeping your buyers awake: ${diagnosticData.ultimateFear}. Your messaging should acknowledge this fear and show the path to safety.`}
                  isExpanded={expandedSections.fear}
                  onToggle={() => toggleSection('fear')}
                />
                
                <OutputSection
                  title="Top 3 Opportunities"
                  content={
                    <ol style={{ margin: 0, paddingLeft: '18px' }}>
                      {diagnosticData.topOpportunities.map((opp, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>{opp}</li>
                      ))}
                    </ol>
                  }
                  isExpanded={expandedSections.opportunities}
                  onToggle={() => toggleSection('opportunities')}
                />
              </div>
              
              <ChatInterface diagnosticContext={diagnosticData} />
            </div>
          </div>
        )}
      </main>

      <footer style={{ padding: '24px', backgroundColor: colors.black, color: colors.white, textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>MarketSauce® is a registered trademark of Gen AI University.</p>
      </footer>
    </div>
  );
}
