import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle, Zap, Clock, Database, Wifi } from 'lucide-react';

interface DataPoint {
  id: string;
  type: 'news' | 'economic' | 'conflict' | 'diplomatic';
  title: string;
  value?: number;
  change?: number;
  timestamp: Date;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const LiveDataFeed: React.FC = () => {
  const [dataFeed, setDataFeed] = useState<DataPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live data feed
    const generateDataPoint = (): DataPoint => {
      const types: DataPoint['type'][] = ['news', 'economic', 'conflict', 'diplomatic'];
      const priorities: DataPoint['priority'][] = ['low', 'medium', 'high', 'critical'];
      
      const mockData = [
        {
          type: 'economic' as const,
          title: 'USD/EUR Rate Update',
          value: 0.85 + (Math.random() - 0.5) * 0.02,
          change: (Math.random() - 0.5) * 2
        },
        {
          type: 'news' as const,
          title: 'Breaking Diplomatic News',
          value: undefined,
          change: undefined
        },
        {
          type: 'conflict' as const,
          title: 'Conflict Status Update',
          value: Math.random() * 10,
          change: (Math.random() - 0.5) * 2
        },
        {
          type: 'economic' as const,
          title: 'Oil Price Movement',
          value: 78 + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 5
        },
        {
          type: 'diplomatic' as const,
          title: 'Summit Announcement',
          value: undefined,
          change: undefined
        },
        {
          type: 'news' as const,
          title: 'Trade Agreement Update',
          value: undefined,
          change: undefined
        }
      ];

      const randomData = mockData[Math.floor(Math.random() * mockData.length)];
      
      return {
        id: Date.now().toString() + Math.random(),
        ...randomData,
        timestamp: new Date(),
        source: ['Reuters', 'Bloomberg', 'AP News', 'Financial Times', 'BBC'][Math.floor(Math.random() * 5)],
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
    };

    const interval = setInterval(() => {
      if (isLive) {
        const newDataPoint = generateDataPoint();
        setDataFeed(prev => [newDataPoint, ...prev.slice(0, 14)]); // Keep last 15 items
      }
    }, 4000); // New data every 4 seconds

    // Initial data
    const initialData = Array.from({ length: 8 }, generateDataPoint);
    setDataFeed(initialData);

    return () => clearInterval(interval);
  }, [isLive]);

  const getTypeIcon = (type: DataPoint['type']) => {
    switch (type) {
      case 'news': return AlertCircle;
      case 'economic': return TrendingUp;
      case 'conflict': return Activity;
      case 'diplomatic': return Zap;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: DataPoint['type']) => {
    switch (type) {
      case 'news': return 'text-blue-400';
      case 'economic': return 'text-green-400';
      case 'conflict': return 'text-red-400';
      case 'diplomatic': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: DataPoint['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'high': return 'border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getPriorityDot = (priority: DataPoint['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatValue = (value: number | undefined, change: number | undefined) => {
    if (value === undefined) return null;
    
    return (
      <div className="flex items-center justify-between mt-1">
        <span className="text-white font-medium text-sm">
          {value.toFixed(2)}
        </span>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="text-xs">{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    );
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="h-fit max-h-[calc(100vh-200px)] bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Live Feed</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Feed Counter */}
      <div className="px-4 py-2 bg-black/20 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Wifi className="h-3 w-3" />
            <span>{dataFeed.length} updates</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Real-time</span>
          </div>
        </div>
      </div>

      {/* Data Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {dataFeed.map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all hover:bg-white/5 ${getPriorityColor(item.priority)}`}
            >
              <div className="flex items-start space-x-2">
                <Icon className={`h-3 w-3 mt-0.5 flex-shrink-0 ${getTypeColor(item.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white mb-1 leading-tight">
                    {item.title}
                  </div>
                  
                  {formatValue(item.value, item.change)}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span className="truncate max-w-16">{item.source}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(item.priority)}`} />
                      <span className="text-xs text-gray-400">{getTimeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/20 bg-black/20 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="flex flex-col items-center space-y-1">
            <Activity className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-gray-400">Live Data</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
        </div>
      </div>

      {dataFeed.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8 text-gray-400">
          <div className="text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for live data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDataFeed;