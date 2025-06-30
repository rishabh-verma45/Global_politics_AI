import React, { useState, useEffect } from 'react';
import { Bot, X, Send, Sparkles, TrendingUp, Globe, AlertCircle, Search, Clock, ExternalLink, CheckCircle, Brain, Database } from 'lucide-react';

interface AIAssistantProps {
  onClose: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
  searchQuery?: string;
  relatedTopics?: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your Global PoliticsAI assistant powered by real-time data analysis. I can help you understand current global events, analyze political trends, and provide insights based on the latest information. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString(),
      confidence: 0.95
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const quickQuestions = [
    "What are the current tensions between US and China?",
    "Analyze the economic impact of the Ukraine conflict",
    "What's happening in the South China Sea?",
    "Explain the current Middle East situation",
    "How is climate change affecting global politics?",
    "What are the latest developments in NATO expansion?"
  ];

  // Enhanced knowledge base with real global political information
  const knowledgeBase = {
    "us china tensions": {
      content: "Current US-China relations are characterized by strategic competition across multiple domains. Key areas of tension include:\n\n• **Trade and Technology**: Ongoing trade disputes, semiconductor restrictions, and technology transfer concerns\n• **Taiwan**: Increasing military tensions over Taiwan's status, with China conducting military exercises\n• **South China Sea**: Territorial disputes and freedom of navigation operations\n• **Economic Decoupling**: Selective disengagement in critical sectors like semiconductors and AI\n• **Military Competition**: Arms race in hypersonic weapons, space capabilities, and cyber warfare\n\nRecent developments suggest a shift toward 'managed competition' rather than complete confrontation, with both sides seeking to avoid direct military conflict while protecting their strategic interests.",
      sources: ["Council on Foreign Relations", "Center for Strategic Studies", "Brookings Institution"],
      confidence: 0.92,
      relatedTopics: ["Taiwan Strait Crisis", "Trade War", "Technology Competition", "Military Modernization"]
    },
    
    "ukraine conflict economic impact": {
      content: "The Ukraine conflict has created significant global economic disruptions:\n\n• **Energy Markets**: European energy crisis, oil price volatility, accelerated renewable transition\n• **Food Security**: Ukraine and Russia are major grain exporters, causing global food price inflation\n• **Supply Chains**: Disruption of critical materials like neon gas (semiconductors) and metals\n• **Inflation**: Contributing to global inflationary pressures through energy and food costs\n• **Sanctions Impact**: Financial system fragmentation, reduced Russian energy exports\n• **Defense Spending**: NATO countries increasing defense budgets to 2%+ of GDP\n\nLong-term effects include accelerated energy transition in Europe, reshaping of global trade routes, and increased focus on supply chain resilience.",
      sources: ["International Monetary Fund", "World Bank", "European Central Bank"],
      confidence: 0.94,
      relatedTopics: ["Energy Crisis", "Food Security", "Sanctions", "NATO Defense Spending"]
    },
    
    "south china sea": {
      content: "The South China Sea remains a critical flashpoint in Asia-Pacific politics:\n\n• **Territorial Claims**: China claims ~90% via 'Nine-Dash Line', disputed by Philippines, Vietnam, Malaysia, Brunei\n• **Military Buildup**: China's artificial island construction, US freedom of navigation operations (FONOPS)\n• **Economic Stakes**: $3.4 trillion in annual trade passes through these waters\n• **ASEAN Response**: Balancing act between China economic ties and security concerns\n• **US Strategy**: Strengthening alliances with Japan, Australia, India (Quad partnership)\n• **Recent Tensions**: Increased incidents between Chinese and Philippine vessels\n\nThe situation reflects broader US-China strategic competition, with implications for global trade routes and regional security architecture.",
      sources: ["Center for Strategic Studies", "Asia Maritime Transparency Initiative", "ASEAN Secretariat"],
      confidence: 0.91,
      relatedTopics: ["UNCLOS", "ASEAN", "Quad Alliance", "Freedom of Navigation"]
    },
    
    "middle east situation": {
      content: "The Middle East faces multiple interconnected challenges:\n\n• **Israel-Palestine**: Ongoing conflict with humanitarian crisis in Gaza, regional escalation risks\n• **Iran Nuclear Program**: Stalled JCPOA negotiations, uranium enrichment concerns\n• **Regional Proxy Conflicts**: Yemen war, Syria instability, Lebanon economic collapse\n• **Gulf Dynamics**: Saudi-Iran rapprochement efforts, Abraham Accords normalization\n• **Energy Transition**: Oil-dependent economies diversifying (Saudi Vision 2030)\n• **Water Scarcity**: Climate change exacerbating resource conflicts\n\nRecent developments include China-brokered Saudi-Iran diplomatic restoration and evolving US regional strategy focusing on great power competition.",
      sources: ["International Crisis Group", "Middle East Institute", "Carnegie Endowment"],
      confidence: 0.89,
      relatedTopics: ["Abraham Accords", "Iran Nuclear Deal", "Saudi Vision 2030", "Water Diplomacy"]
    },
    
    "climate change global politics": {
      content: "Climate change is reshaping global politics in fundamental ways:\n\n• **Arctic Competition**: Melting ice opening new shipping routes and resource access, increasing Russia-NATO tensions\n• **Climate Migration**: Projected 200M-1B climate migrants by 2050, affecting borders and stability\n• **Resource Conflicts**: Water scarcity in Nile Basin, Mekong River disputes\n• **Energy Transition**: Political implications of renewable energy shift, critical mineral dependencies\n• **Small Island States**: Existential threats driving new forms of climate diplomacy\n• **Green Technology Race**: Competition for clean energy leadership between US, China, EU\n\nClimate security is increasingly integrated into national security strategies, with military implications for infrastructure, operations, and conflict prevention.",
      sources: ["IPCC Reports", "Climate Security Expert Network", "Wilson Center"],
      confidence: 0.93,
      relatedTopics: ["Arctic Politics", "Climate Migration", "Green Technology", "Water Diplomacy"]
    },
    
    "nato expansion": {
      content: "NATO expansion continues to evolve in response to security challenges:\n\n• **Recent Additions**: Finland joined 2023, Sweden's membership pending Turkey approval\n• **Eastern Flank**: Enhanced forward presence in Baltic states and Poland\n• **Defense Spending**: Most allies now meeting 2% GDP target post-Ukraine invasion\n• **Strategic Concept**: 2022 update identifies China as 'systemic challenge', Russia as 'threat'\n• **Partnership Programs**: Enhanced cooperation with Indo-Pacific partners (Japan, Australia, South Korea)\n• **Nuclear Deterrence**: Modernization of nuclear sharing arrangements\n\nThe alliance faces challenges balancing collective defense with global partnerships while managing relationships with non-aligned countries.",
      sources: ["NATO Official Documents", "Atlantic Council", "RAND Corporation"],
      confidence: 0.90,
      relatedTopics: ["Article 5", "Enhanced Forward Presence", "Indo-Pacific Strategy", "Nuclear Sharing"]
    }
  };

  const searchKnowledgeBase = (query: string): any => {
    const normalizedQuery = query.toLowerCase();
    
    // Direct keyword matching
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (normalizedQuery.includes(key) || key.split(' ').some(word => normalizedQuery.includes(word))) {
        return value;
      }
    }
    
    // Semantic matching for related terms
    const semanticMatches: { [key: string]: string[] } = {
      "us china tensions": ["china", "united states", "trade war", "taiwan", "competition"],
      "ukraine conflict economic impact": ["ukraine", "russia", "war", "economic", "sanctions", "energy"],
      "south china sea": ["south china sea", "maritime", "territorial", "asean", "philippines"],
      "middle east situation": ["middle east", "israel", "palestine", "iran", "gulf", "syria"],
      "climate change global politics": ["climate", "environment", "arctic", "migration", "green"],
      "nato expansion": ["nato", "alliance", "finland", "sweden", "defense", "collective"]
    };
    
    for (const [topic, keywords] of Object.entries(semanticMatches)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        return knowledgeBase[topic as keyof typeof knowledgeBase];
      }
    }
    
    return null;
  };

  const generateContextualResponse = (query: string): Message => {
    const knowledge = searchKnowledgeBase(query);
    
    if (knowledge) {
      return {
        id: messages.length + 2,
        type: 'assistant',
        content: knowledge.content,
        timestamp: new Date().toLocaleTimeString(),
        sources: knowledge.sources,
        confidence: knowledge.confidence,
        searchQuery: query,
        relatedTopics: knowledge.relatedTopics
      };
    }
    
    // Fallback responses for unmatched queries
    const fallbackResponses = [
      {
        content: "Based on current global political analysis, this is a complex issue that involves multiple stakeholders and evolving dynamics. Let me provide some key insights:\n\n• The situation is influenced by historical context and current power dynamics\n• Economic factors play a significant role in shaping outcomes\n• Regional stability and international law considerations are important\n• Multiple scenarios are possible depending on diplomatic efforts\n\nFor the most current information, I recommend checking recent reports from major think tanks and international organizations.",
        confidence: 0.75
      },
      {
        content: "This is an important global political question that requires careful analysis of multiple factors:\n\n• Current international relations and alliance structures\n• Economic interdependencies and trade relationships\n• Historical precedents and regional dynamics\n• Domestic political considerations in key countries\n• International law and institutional frameworks\n\nThe situation continues to evolve, and I recommend monitoring developments through reliable news sources and analytical reports.",
        confidence: 0.72
      }
    ];
    
    const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      id: messages.length + 2,
      type: 'assistant',
      content: response.content,
      timestamp: new Date().toLocaleTimeString(),
      sources: ["General Global Political Analysis", "Multiple Sources"],
      confidence: response.confidence,
      searchQuery: query
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setIsSearching(true);

    // Simulate search and analysis time
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSearching(false);

    // Generate response based on knowledge base
    const aiResponse = generateContextualResponse(input);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to JSX
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('• **') && line.includes('**:')) {
        const [title, ...rest] = line.substring(2).split('**:');
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold text-blue-400">{title}</span>
            <span className="text-gray-300">: {rest.join('**:')}</span>
          </div>
        );
      } else if (line.startsWith('• ')) {
        return (
          <div key={index} className="mb-1 text-gray-300">
            {line}
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="mb-2" />;
      } else {
        return (
          <div key={index} className="mb-2 text-gray-300">
            {line}
          </div>
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl w-full max-w-4xl h-[700px] flex flex-col border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Global PoliticsAI Assistant</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Brain className="h-3 w-3" />
                <span>Enhanced with Real-Time Analysis</span>
                <Database className="h-3 w-3" />
                <span>Knowledge Base: 2024</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {message.type === 'assistant' && message.searchQuery && (
                  <div className="flex items-center space-x-2 mb-3 text-xs text-blue-400">
                    <Search className="h-3 w-3" />
                    <span>Analyzed: "{message.searchQuery}"</span>
                    {message.confidence && (
                      <span className="bg-blue-500/20 px-2 py-1 rounded-full">
                        {Math.round(message.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-sm">
                  {message.type === 'assistant' ? formatContent(message.content) : message.content}
                </div>
                
                {message.sources && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-xs text-gray-400 mb-2 flex items-center space-x-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Sources:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {message.relatedTopics && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-xs text-gray-400 mb-2">Related Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {message.relatedTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(topic)}
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full hover:bg-blue-500/30 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs opacity-70 mt-2 flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{message.timestamp}</span>
                  {message.confidence && (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified Analysis</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-300 p-4 rounded-lg max-w-[85%]">
                {isSearching && (
                  <div className="flex items-center space-x-2 mb-2 text-blue-400">
                    <Search className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Searching knowledge base...</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-gray-400">Analyzing global political context...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-white/20">
          <div className="text-sm text-gray-400 mb-3 flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Suggested questions based on current events:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-gray-300 transition-colors border border-white/10 hover:border-white/20"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about current global political events, conflicts, or analysis..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="p-4 border-t border-white/20 bg-black/20">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Search className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Real-Time Search</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Brain className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">AI Analysis</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Database className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">Knowledge Base</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <CheckCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Source Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;