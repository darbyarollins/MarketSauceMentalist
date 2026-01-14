import React, { useState, useRef, useEffect } from 'react';

// MarketSauce Brand Colors
const colors = {
  lime: '#dcff50',
  black: '#000000',
  darkGray: '#212121',
  lightGray: '#e5e0df',
  white: '#ffffff'
};

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
    fontFamily: 'inherit'
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
        {isProcessing ? 'Processing...' : 'Generate Diagnostic'}
      </button>
    </form>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ currentPhase, phases }) => {
  return (
    <div style={{ padding: '24px', backgroundColor: colors.darkGray, color: colors.white }}>
      <h3 style={{ 
        fontSize: '12px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.15em', 
        marginBottom: '20px',
        color: colors.lime 
      }}>
        Processing
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
          color: colors.darkGray
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
      content: 'Your MarketSauce diagnostic is complete. I have deep context on your market, persona, and competitive landscape. Ask me anything to refine your strategy, develop campaigns, or generate content.'
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

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this calls Claude API with diagnostic context)
    setTimeout(() => {
      const responses = [
        `Based on your diagnostic, here's my recommendation: Your primary persona is struggling with ${diagnosticContext?.primaryComplaint || 'clarity on their path forward'}. Let me develop a targeted approach...`,
        `Looking at your competitive positioning, the biggest gap I see is in ${diagnosticContext?.marketGap || 'personalized implementation support'}. Here's how to exploit that...`,
        `For your target market of ${diagnosticContext?.targetMarket || 'your ideal customers'}, the emotional trigger that resonates most is the fear of ${diagnosticContext?.ultimateFear || 'falling behind'}. Let me craft messaging around that...`
      ];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setIsLoading(false);
    }, 1500);
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
              lineHeight: '1.6'
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
  const [view, setView] = useState('pricing'); // 'pricing', 'intake', 'processing', 'results'
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

  const handleSelectTier = (tier) => {
    setView('intake');
  };

  const handleSubmitIntake = async (formData) => {
    setView('processing');
    
    // Simulate processing phases
    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setCurrentPhase(i + 1);
    }
    
    // Simulate diagnostic results
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
      executiveSummary: `${formData.businessName} operates in a market hungry for clarity and implementation support. Your target audience of ${formData.targetMarket} is drowning in information but starving for direction. The competitive landscape shows most players offering either high-theory consulting or low-touch digital products. The gap is clear: hands-on implementation with systematic methodology. Your biggest opportunity lies in positioning as the "implementation partner" rather than another information source.`
    });
    
    setView('results');
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
                The more context you provide, the sharper your diagnostic. 
                We will research your website and competitors automatically.
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
                Generating Your Diagnostic
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: colors.darkGray
              }}>
                Our AI is researching your market and building your strategic brief.
              </p>
            </div>
            
            <ProgressTracker currentPhase={currentPhase} phases={phases} />
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
                Your market intelligence is ready. Download the full report or continue refining your strategy below.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <button style={{
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
              }}>
                <span>↓</span> Download Full Report (.docx)
              </button>
              
              <button style={{
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
              }}>
                <span>↓</span> Download System Prompt (.md)
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
                  content={`The nightmare scenario keeping your buyers awake: ${diagnosticData.ultimateFear}. Your messaging should acknowledge this fear and show the path to safety.`}
                  isExpanded={expandedSections.fear}
                  onToggle={() => toggleSection('fear')}
                />
                
                <OutputSection
                  title="Top 3 Opportunities"
                  content={
                    <ol style={{ margin: 0, paddingLeft: '20px' }}>
                      {diagnosticData.topOpportunities.map((opp, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{opp}</li>
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

      {/* Footer */}
      <footer style={{
        padding: '32px 40px',
        backgroundColor: colors.black,
        color: colors.white,
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>
          MarketSauce® is a registered trademark of Gen AI University. Built with the MarketSauce PRIME methodology.
        </p>
      </footer>
    </div>
  );
};

export default App;
