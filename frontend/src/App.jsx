import React, { useState, useRef, useEffect } from 'react';

// MarketSauce Brand Colors
const colors = {
  lime: '#dcff50',
  black: '#000000',
  darkGray: '#212121',
  lightGray: '#e5e0df',
  white: '#ffffff',
  error: '#ff4444',
  warning: '#ffaa00'
};

// API Configuration
const API_BASE = '/api';

// No demo mode check needed - Firecrawl function handles everything

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? colors.error :
                  type === 'warning' ? colors.warning :
                  colors.lime;
  const textColor = type === 'error' ? colors.white : colors.black;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      backgroundColor: bgColor,
      color: textColor,
      fontWeight: '600',
      fontSize: '14px',
      zIndex: 1000,
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          lineHeight: 1
        }}
      >
        x
      </button>
    </div>
  );
};

// Demo Mode Banner Component
const DemoModeBanner = () => (
  <div style={{
    backgroundColor: colors.warning,
    color: colors.black,
    padding: '10px 20px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600'
  }}>
    Demo Mode - Running without backend API. Results are simulated examples.
  </div>
);

// Intake Form Component
const IntakeForm = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    targetMarket: '',
    whatTheySell: '',
    competitors: '',
    challenges: '',
    goals: '',
    context: ''
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
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

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
          placeholder="Describe your product or service in 1-2 sentences"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ borderTop: `1px solid ${colors.lightGray}`, paddingTop: '20px' }}>
        <p style={{ fontSize: '12px', color: colors.darkGray, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Optional (improves output quality)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ ...labelStyle, fontWeight: '400' }}>Known Competitors</label>
            <input
              type="text"
              value={formData.competitors}
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              placeholder="Competitor A, Competitor B, Competitor C"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, fontWeight: '400' }}>Marketing Challenges</label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              placeholder="What marketing questions need answers?"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, fontWeight: '400' }}>12-Month Goals</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="What do you want to achieve?"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        style={{
          padding: '18px 32px',
          fontSize: '16px',
          fontWeight: '700',
          backgroundColor: isProcessing ? colors.darkGray : colors.lime,
          color: colors.black,
          border: 'none',
          cursor: isProcessing ? 'wait' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginTop: '10px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
      >
        {isProcessing ? 'Researching...' : 'Generate Research'}
      </button>
    </form>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ currentPhase, phases, phaseName }) => {
  return (
    <div style={{ padding: '24px', backgroundColor: colors.darkGray, color: colors.white }}>
      <h3 style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginBottom: '20px',
        color: colors.lime
      }}>
        Researching: {phaseName}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {phases.map((phase, index) => {
          const isComplete = index < currentPhase;
          const isCurrent = index === currentPhase;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: isComplete || isCurrent ? 1 : 0.4
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isComplete ? colors.lime : isCurrent ? colors.white : 'transparent',
                border: `2px solid ${isComplete ? colors.lime : isCurrent ? colors.white : colors.lightGray}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: isComplete || isCurrent ? colors.black : colors.lightGray,
                flexShrink: 0
              }}>
                {isComplete ? '✓' : index + 1}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: isCurrent ? '600' : '400'
              }}>
                {phase}
              </span>
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

// Output Section Component
const OutputSection = ({ title, content, isExpanded, onToggle }) => {
  return (
    <div style={{ borderBottom: `1px solid ${colors.lightGray}` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{
          fontSize: '16px',
          fontWeight: '600',
          color: colors.black
        }}>
          {title}
        </span>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          fontSize: '20px'
        }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div style={{
          padding: '0 20px 20px',
          fontSize: '15px',
          lineHeight: '1.7',
          color: colors.darkGray,
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

// Chat Interface Component
const ChatInterface = ({ diagnosticContext }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Your research is complete! Review the findings above. Chat feature coming soon with AI integration.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Demo responses for when backend is not available
  const demoResponses = [
    `Based on your diagnostic, here's my recommendation: Your primary persona is struggling with clarity on their path forward. Consider creating a "quick win" resource that demonstrates your methodology in action.`,
    `Looking at your competitive positioning, the biggest gap I see is in personalized implementation support. You could differentiate by offering a "done-with-you" service tier.`,
    `For your target market, the emotional trigger that resonates most is the fear of wasting time on strategies that don't work. Your messaging should lead with transformation outcomes, not features.`,
    `Your market research shows three key opportunities: 1) Community-led growth through workshops, 2) Productized services with clear outcomes, 3) Content that addresses specific pain points rather than general advice.`,
    `The competitive analysis reveals that most players focus on theory over implementation. Position yourself as the "implementation partner" - the one who helps them actually execute, not just plan.`
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    // Simple response - chat feature coming soon
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Chat feature coming soon! For now, review the research report above and download it for your records.'
    }]);
    setIsLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '400px',
      border: `2px solid ${colors.darkGray}`,
      backgroundColor: colors.white
    }}>
      <div style={{
        padding: '16px',
        borderBottom: `2px solid ${colors.darkGray}`,
        backgroundColor: colors.lime
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: 0
        }}>
          Strategy Chat
        </h3>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: '14px 18px',
              backgroundColor: msg.role === 'user' ? colors.darkGray : colors.lightGray,
              color: msg.role === 'user' ? colors.white : colors.black,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              fontSize: '15px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: colors.lightGray,
            alignSelf: 'flex-start',
            fontSize: '15px'
          }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: '16px',
        borderTop: `2px solid ${colors.darkGray}`,
        display: 'flex',
        gap: '12px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your market, persona, or strategy..."
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '15px',
            border: `2px solid ${colors.darkGray}`,
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: colors.lime,
            border: 'none',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ tier, price, period, features, isPopular, onSelect }) => {
  return (
    <div style={{
      border: isPopular ? `3px solid ${colors.lime}` : `2px solid ${colors.darkGray}`,
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: colors.white
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.lime,
          padding: '6px 16px',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Most Popular
        </div>
      )}

      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px',
        color: colors.black
      }}>
        {tier}
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '48px', fontWeight: '700' }}>${price}</span>
        <span style={{ fontSize: '16px', color: colors.darkGray }}>/{period}</span>
      </div>

      <div style={{
        flex: 1,
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {features.map((feature, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <span style={{ color: colors.lime, fontWeight: '700' }}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        style={{
          padding: '16px',
          backgroundColor: isPopular ? colors.lime : colors.darkGray,
          color: isPopular ? colors.black : colors.white,
          border: 'none',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer'
        }}
      >
        Get Started
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [view, setView] = useState('pricing');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseName, setPhaseName] = useState('');
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ executive: true });
  const [selectedTier, setSelectedTier] = useState('strategic');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

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


  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setView('intake');
  };

  const pollJobStatus = async (id) => {
    const maxAttempts = 120;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        showToast('Diagnostic generation timed out. Please try again.', 'error');
        setView('pricing');
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE}/diagnostic/status/${id}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        setCurrentPhase(data.current_phase);
        setPhaseName(data.phase_name);

        if (data.status === 'complete') {
          setDiagnosticData({
            businessName: data.inputs?.business_name || 'Your Business',
            targetMarket: data.inputs?.target_market || '',
            diagnostic: data.diagnostic,
            executiveSummary: data.executive_summary,
            systemPrompt: data.system_prompt,
            followUpPrompts: data.follow_up_prompts
          });
          setView('results');
          showToast('Diagnostic complete!', 'success');
        } else if (data.status === 'error') {
          showToast(`Error: ${data.error}`, 'error');
          setView('pricing');
        } else {
          attempts++;
          setTimeout(poll, 2000);
        }
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          showToast('Lost connection to server. Please try again.', 'error');
          setView('pricing');
        }
      }
    };

    poll();
  };

  // Generate demo diagnostic data
  const generateDemoDiagnostic = async (formData) => {
    // Simulate processing phases
    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentPhase(i + 1);
      setPhaseName(phases[i]);
    }

    return {
      businessName: formData.businessName,
      targetMarket: formData.targetMarket,
      diagnostic: `# ${formData.businessName} Market Diagnostic

## Executive Summary

${formData.businessName} operates in a market hungry for clarity and implementation support. Your target audience of ${formData.targetMarket} is drowning in information but starving for direction.

The competitive landscape shows most players offering either high-theory consulting or low-touch digital products. The gap is clear: hands-on implementation with systematic methodology. Your biggest opportunity lies in positioning as the "implementation partner" rather than another information source.

## Primary Persona Analysis

**Who They Are:** ${formData.targetMarket}

**Core Struggle:** They have consumed countless courses, books, and podcasts but still feel stuck. The problem isn't lack of information—it's lack of clarity on what to do NEXT.

**Primary Complaint:** Overwhelm from too many options without clear direction

**Ultimate Fear:** Wasting months (or years) on strategies that never produce results

**Dream Outcome:** A clear, personalized roadmap that actually works for their specific situation

## Competitive Landscape

Your market contains three main competitor types:

1. **High-Ticket Consultants** - Offer personalized guidance but at premium prices ($5K-$25K+)
2. **Digital Course Creators** - Scalable but generic, one-size-fits-all approaches
3. **Free Content Creators** - Build audiences but monetize through volume, not depth

**The Gap:** No one is offering personalized implementation support at an accessible price point with systematic methodology.

## Top 3 Golden Opportunities

1. **Workshop-Led Community Building**
   Create intimate group experiences where participants implement alongside peers. This provides the accountability and personalization of consulting at a fraction of the cost.

2. **Productized Service Packages**
   Develop clear, outcome-focused service tiers with defined deliverables. "In 30 days, you'll have X, Y, Z" beats vague promises every time.

3. **Buyer Psychology Content Strategy**
   Lead with the pain points and fears identified above. Your content should mirror back their exact thoughts before offering solutions.

## 30-Day Quick Wins

- Create a "diagnostic" lead magnet that helps prospects self-identify their biggest gap
- Develop 3 case studies showcasing transformation (even beta clients count)
- Build a simple nurture sequence addressing the top 5 objections
- Launch a pilot workshop with 10 founding members

## 90-Day Strategic Priorities

- Establish signature methodology with memorable framework name
- Create testimonial generation system
- Build referral program with existing clients
- Develop content calendar around buyer psychology insights

---

*This diagnostic was generated using the MarketSauce PRIME methodology. For AI-powered analysis with live web research, configure your API keys and backend server.*`,
      executiveSummary: `${formData.businessName} operates in a market hungry for clarity and implementation support. Your target audience of ${formData.targetMarket} is drowning in information but starving for direction. The biggest opportunity lies in positioning as the "implementation partner" rather than another information source.`,
      primaryComplaint: 'overwhelm from too many options without clear direction',
      ultimateFear: 'wasting months on strategies that never produce results',
      marketGap: 'implementation support with personalized guidance',
      topOpportunities: [
        'Workshop-led community building for high-touch engagement',
        'Productized service packages with clear transformation outcomes',
        'Content strategy leveraging buyer psychology insights'
      ]
    };
  };

  const handleSubmitIntake = async (formData) => {
    setView('processing');
    setCurrentPhase(0);
    setPhaseName('Researching...');
    setIsLoading(true);

    try {
      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setCurrentPhase(prev => Math.min(prev + 1, phases.length - 1));
        setPhaseName(phases[Math.min(currentPhase + 1, phases.length - 1)]);
      }, 2000);

      const response = await fetch(`${API_BASE}/diagnostic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          target_market: formData.targetMarket,
          what_they_sell: formData.whatTheySell,
          competitors: formData.competitors || '',
          challenges: formData.challenges || '',
          goals: formData.goals || ''
        })
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const data = await response.json();
        setDiagnosticData({
          businessName: data.inputs?.business_name || formData.businessName,
          targetMarket: data.inputs?.target_market || formData.targetMarket,
          diagnostic: data.diagnostic,
          executiveSummary: data.executive_summary
        });
        setView('results');
        showToast('Research complete!', 'success');
      } else {
        throw new Error('Research failed');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
      setView('intake');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (type) => {
    if (!diagnosticData) return;

    try {
      if (type === 'report') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${API_BASE}/documents/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diagnostic: diagnosticData.diagnostic,
            business_name: diagnosticData.businessName,
            format: 'docx'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${diagnosticData.businessName.replace(/\s+/g, '_')}_Diagnostic.docx`;
          a.click();
          window.URL.revokeObjectURL(url);
          showToast('Report downloaded!', 'success');
          return;
        }
      }

      // Fallback: download as markdown
      const content = type === 'report' ? diagnosticData.diagnostic : (diagnosticData.systemPrompt || diagnosticData.diagnostic);
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${diagnosticData.businessName.replace(/\s+/g, '_')}_${type === 'report' ? 'Diagnostic' : 'System_Prompt'}.md`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('File downloaded as Markdown!', 'success');
    } catch (error) {
      // Fallback: download as text
      const content = type === 'report' ? diagnosticData.diagnostic : (diagnosticData.systemPrompt || diagnosticData.diagnostic);
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${diagnosticData.businessName.replace(/\s+/g, '_')}_${type === 'report' ? 'Diagnostic' : 'System_Prompt'}.md`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('Downloaded as Markdown (server unavailable)', 'warning');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.lightGray,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


      {/* Header */}
      <header style={{
        padding: '20px 40px',
        backgroundColor: colors.black,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: colors.lime,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '20px'
          }}>
            M
          </div>
          <span style={{
            color: colors.white,
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            MarketSauce
          </span>
        </div>

        {view !== 'pricing' && (
          <button
            onClick={() => setView('pricing')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: `2px solid ${colors.lime}`,
              color: colors.lime,
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            Plans
          </button>
        )}
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Pricing View */}
        {view === 'pricing' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '16px',
                color: colors.black,
                letterSpacing: '-0.02em'
              }}>
                Market Intelligence on Demand
              </h1>
              <p style={{
                fontSize: '18px',
                color: colors.darkGray,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Deep buyer psychology, competitive analysis, and implementation roadmaps.
                Submit your business info. Get actionable strategy in minutes.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>
              <PricingCard
                tier="Express"
                price="29"
                period="one-time"
                features={[
                  'Foundation Analysis',
                  'Deep Persona Profile',
                  'Executive Summary',
                  'Basic System Prompt',
                  'Delivered in under 5 minutes'
                ]}
                onSelect={() => handleSelectTier('express')}
              />

              <PricingCard
                tier="Strategic"
                price="79"
                period="month"
                isPopular={true}
                features={[
                  'Full 5-Phase Diagnostic',
                  'Competitive Intelligence',
                  'Golden Opportunities Report',
                  'Complete System Prompt',
                  '10 Follow-up Prompts',
                  '50 Strategy Chat messages/month',
                  'Monthly research refresh'
                ]}
                onSelect={() => handleSelectTier('strategic')}
                              />

              <PricingCard
                tier="PRIME"
                price="149"
                period="month"
                features={[
                  'Full 10-Phase Diagnostic',
                  'Implementation Roadmap',
                  'Campaign Development Kit',
                  '15 Follow-up Prompts',
                  'Unlimited Strategy Chat',
                  'Weekly research refresh',
                  'Priority processing'
                ]}
                onSelect={() => handleSelectTier('prime')}
                              />
            </div>
          </div>
        )}

        {/* Intake View */}
        {view === 'intake' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
                color: colors.black
              }}>
                Tell Us About Your Business
              </h2>
              <p style={{
                fontSize: '16px',
                color: colors.darkGray,
                lineHeight: '1.6'
              }}>
The more context you provide, the sharper your research. We will analyze your website and competitors automatically.
              </p>
            </div>

            <div style={{
              backgroundColor: colors.white,
              padding: '32px',
              border: `2px solid ${colors.darkGray}`
            }}>
              <IntakeForm onSubmit={handleSubmitIntake} />
            </div>
          </div>
        )}

        {/* Processing View */}
        {view === 'processing' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
                color: colors.black
              }}>
                Researching Your Market
              </h2>
              <p style={{
                fontSize: '16px',
                color: colors.darkGray
              }}>
                Firecrawl is researching your website, competitors, and market trends...
              </p>
            </div>

            <ProgressTracker
              currentPhase={currentPhase}
              phases={phases}
              phaseName={phaseName}
                          />
          </div>
        )}

        {/* Results View */}
        {view === 'results' && diagnosticData && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
                color: colors.black
              }}>
                {diagnosticData.businessName} Diagnostic Complete
              </h2>
              <p style={{
                fontSize: '16px',
                color: colors.darkGray
              }}>
                Your market research is ready. Download the report below.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <button
                onClick={() => handleDownload('report')}
                style={{
                  padding: '20px',
                  backgroundColor: colors.lime,
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span>↓</span> Download Full Report
              </button>

              <button
                onClick={() => handleDownload('prompt')}
                style={{
                  padding: '20px',
                  backgroundColor: colors.darkGray,
                  color: colors.white,
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span>↓</span> Download System Prompt
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: colors.white,
                border: `2px solid ${colors.darkGray}`
              }}>
                <div style={{
                  padding: '20px',
                  borderBottom: `2px solid ${colors.darkGray}`,
                  backgroundColor: colors.lime
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    margin: 0
                  }}>
                    Key Findings
                  </h3>
                </div>

                <OutputSection
                  title="Executive Summary"
                  content={diagnosticData.executiveSummary || diagnosticData.diagnostic?.substring(0, 1500)}
                  isExpanded={expandedSections.executive}
                  onToggle={() => toggleSection('executive')}
                />

                <OutputSection
                  title="Full Diagnostic"
                  content={diagnosticData.diagnostic}
                  isExpanded={expandedSections.full}
                  onToggle={() => toggleSection('full')}
                />

                {diagnosticData.followUpPrompts && (
                  <OutputSection
                    title="Follow-up Prompts"
                    content={diagnosticData.followUpPrompts.join('\n\n')}
                    isExpanded={expandedSections.prompts}
                    onToggle={() => toggleSection('prompts')}
                  />
                )}
              </div>

              <ChatInterface
                diagnosticContext={diagnosticData.diagnostic}
                              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 40px',
        backgroundColor: colors.black,
        color: colors.white,
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>
          MarketSauce is a product of Gen AI University. Built with the MarketSauce PRIME methodology.
        </p>
      </footer>
    </div>
  );
};

export default App;
