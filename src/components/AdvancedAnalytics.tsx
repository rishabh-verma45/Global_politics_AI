import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, Target, Zap } from 'lucide-react';

interface AnalyticsData {
  riskScore: number;
  stabilityIndex: number;
  economicHealth: number;
  diplomaticRelations: number;
  predictions: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  trends: {
    name: string;
    value: number;
    change: number;
    prediction: number;
  }[];
}

const AdvancedAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateAnalytics();
  }, [selectedTimeframe]);

  const generateAnalytics = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalytics: AnalyticsData = {
      riskScore: Math.random() * 10,
      stabilityIndex: Math.random() * 100,
      economicHealth: Math.random() * 100,
      diplomaticRelations: Math.random() * 100,
      predictions: {
        shortTerm: "Moderate tensions expected in Eastern Europe with potential for diplomatic resolution",
        mediumTerm: "Economic recovery likely in Q3-Q4 with improved trade relations",
        longTerm: "Shift towards multipolar world order with increased regional cooperation"
      },
      trends: [
        {
          name: "Global Stability",
          value: 72,
          change: -5.2,
          prediction: 68
        },
        {
          name: "Economic Growth",
          value: 3.1,
          change: 0.8,
          prediction: 3.5
        },
        {
          name: "Trade Relations",
          value: 65,
          change: 2.1,
          prediction: 70
        },
        {
          name: "Conflict Risk",
          value: 35,
          change: 8.3,
          prediction: 30
        }
      ]
    };
    
    setAnalytics(mockAnalytics);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Analysis in Progress</h3>
          <p className="text-gray-400 mb-4">Processing global data and generating insights...</p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Advanced AI Analytics</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1W" className="bg-slate-800">1 Week</option>
            <option value="1M" className="bg-slate-800">1 Month</option>
            <option value="3M" className="bg-slate-800">3 Months</option>
            <option value="1Y" className="bg-slate-800">1 Year</option>
          </select>
          <button
            onClick={generateAnalytics}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-sm transition-colors flex items-center space-x-1"
          >
            <Zap className="h-3 w-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-red-400" />
            <span className={`text-lg font-bold ${getScoreColor(analytics.riskScore * 10)}`}>
              {analytics.riskScore.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-gray-300">Global Risk Score</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full ${getScoreBarColor(analytics.riskScore * 10)}`}
              style={{ width: `${analytics.riskScore * 10}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span className={`text-lg font-bold ${getScoreColor(analytics.stabilityIndex)}`}>
              {analytics.stabilityIndex.toFixed(0)}
            </span>
          </div>
          <div className="text-sm text-gray-300">Stability Index</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full ${getScoreBarColor(analytics.stabilityIndex)}`}
              style={{ width: `${analytics.stabilityIndex}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className={`text-lg font-bold ${getScoreColor(analytics.economicHealth)}`}>
              {analytics.economicHealth.toFixed(0)}
            </span>
          </div>
          <div className="text-sm text-gray-300">Economic Health</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full ${getScoreBarColor(analytics.economicHealth)}`}
              style={{ width: `${analytics.economicHealth}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className={`text-lg font-bold ${getScoreColor(analytics.diplomaticRelations)}`}>
              {analytics.diplomaticRelations.toFixed(0)}
            </span>
          </div>
          <div className="text-sm text-gray-300">Diplomatic Relations</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full ${getScoreBarColor(analytics.diplomaticRelations)}`}
              style={{ width: `${analytics.diplomaticRelations}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trends Analysis */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">Trend Analysis</h4>
        <div className="space-y-4">
          {analytics.trends.map((trend, index) => (
            <div key={index} className="p-4 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{trend.name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-white">{trend.value}</span>
                  <div className={`flex items-center space-x-1 ${trend.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className={`h-3 w-3 ${trend.change < 0 ? 'rotate-180' : ''}`} />
                    <span className="text-xs">{Math.abs(trend.change).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Current</span>
                <span>Predicted: {trend.prediction}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <div
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${(trend.value / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">AI Predictions</h4>
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-sm font-medium text-blue-400 mb-2">Short Term (1-3 months)</div>
            <p className="text-sm text-gray-300">{analytics.predictions.shortTerm}</p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="text-sm font-medium text-yellow-400 mb-2">Medium Term (3-12 months)</div>
            <p className="text-sm text-gray-300">{analytics.predictions.mediumTerm}</p>
          </div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="text-sm font-medium text-purple-400 mb-2">Long Term (1-5 years)</div>
            <p className="text-sm text-gray-300">{analytics.predictions.longTerm}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;