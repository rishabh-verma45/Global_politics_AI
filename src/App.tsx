import React, { useState } from 'react';
import { Globe, Newspaper, TrendingUp, Clock, Gamepad2, Bot, BarChart3, AlertTriangle, Map, Activity, Zap } from 'lucide-react';
import NewsAnalysis from './components/NewsAnalysis';
import WarTracker from './components/WarTracker';
import EconomyDashboard from './components/EconomyDashboard';
import TimeTravel from './components/TimeTravel';
import FutureGame from './components/FutureGame';
import AIAssistant from './components/AIAssistant';
import RealTimeMap from './components/RealTimeMap';
import LiveDataFeed from './components/LiveDataFeed';
import AdvancedAnalytics from './components/AdvancedAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState('news');
  const [showAssistant, setShowAssistant] = useState(false);

  const tabs = [
    { id: 'news', label: 'News Analysis', icon: Newspaper },
    { id: 'wars', label: 'Conflict Tracker', icon: AlertTriangle },
    { id: 'economy', label: 'Economy', icon: BarChart3 },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'analytics', label: 'AI Analytics', icon: Activity },
    { id: 'timetravel', label: 'Time Travel', icon: Clock },
    { id: 'game', label: 'Strategic Game', icon: Gamepad2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsAnalysis />;
      case 'wars':
        return <WarTracker />;
      case 'economy':
        return <EconomyDashboard />;
      case 'map':
        return <RealTimeMap />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'timetravel':
        return <TimeTravel />;
      case 'game':
        return <FutureGame />;
      default:
        return <NewsAnalysis />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Global PoliticsAI</h1>
                <div className="text-xs text-gray-400">Deep Analysis AI</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">LIVE</span>
              </div>
              
              {/* Bolt.new Badge */}
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 hover:from-orange-500/30 hover:to-yellow-500/30 border border-orange-500/30 px-3 py-2 rounded-lg transition-all duration-300 group"
                title="Built with Bolt.new"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-orange-400 font-bold text-xs leading-none group-hover:text-orange-300">
                    bolt.new
                  </span>
                  <span className="text-yellow-400 text-xs leading-none opacity-80">
                    AI-powered
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Data Feed Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {renderContent()}
          </div>
          <div className="xl:col-span-1">
            <LiveDataFeed />
          </div>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg shadow-blue-600/25 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
        title="AI Assistant"
      >
        <Bot className="h-8 w-8 text-white group-hover:animate-pulse" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </button>

      {/* AI Assistant Modal */}
      {showAssistant && (
        <AIAssistant onClose={() => setShowAssistant(false)} />
      )}
    </div>
  );
}

export default App;