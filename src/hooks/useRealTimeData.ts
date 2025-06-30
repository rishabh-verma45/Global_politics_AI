import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface RealTimeData {
  news: any[];
  conflicts: any[];
  economicIndicators: any;
  lastUpdated: Date;
}

export const useRealTimeData = () => {
  const [data, setData] = useState<RealTimeData>({
    news: [],
    conflicts: [],
    economicIndicators: {},
    lastUpdated: new Date()
  });
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Simulate real-time connection
    const mockSocket = {
      connected: true,
      on: (event: string, callback: Function) => {
        if (event === 'connect') {
          setTimeout(() => callback(), 1000);
        } else if (event === 'news_update') {
          setInterval(() => {
            callback({
              type: 'breaking',
              title: 'Breaking: New Geopolitical Development',
              timestamp: new Date()
            });
          }, 30000); // Every 30 seconds
        } else if (event === 'conflict_update') {
          setInterval(() => {
            callback({
              conflictId: 1,
              status: 'updated',
              timestamp: new Date()
            });
          }, 60000); // Every minute
        }
      },
      disconnect: () => setIsConnected(false)
    } as any;

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const updateData = (newData: Partial<RealTimeData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
      lastUpdated: new Date()
    }));
  };

  return {
    data,
    isConnected,
    updateData
  };
};

export const useNewsUpdates = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockNews = [
          {
            id: 1,
            title: "Global Economic Summit Addresses Trade Tensions",
            summary: "World leaders gather to discuss international trade policies and economic cooperation.",
            category: "economy",
            sentiment: "positive",
            impact: "high",
            region: "Global",
            timestamp: new Date().toISOString(),
            source: "Reuters",
            confidence: 0.89
          },
          {
            id: 2,
            title: "Cybersecurity Threats Rise Amid Geopolitical Tensions",
            summary: "Experts warn of increased cyber attacks targeting critical infrastructure.",
            category: "technology",
            sentiment: "negative",
            impact: "high",
            region: "Global",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            source: "TechNews",
            confidence: 0.92
          }
        ];
        
        setNews(mockNews);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Set up polling for new news
    const interval = setInterval(fetchNews, 300000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return { news, loading };
};

export const useEconomicData = (country: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          gdp: 25.46,
          gdpGrowth: 2.1,
          inflation: 3.2,
          unemployment: 3.7,
          oilPrice: 78.5,
          stockIndex: 4150.2,
          currency: 'USD',
          lastUpdated: new Date()
        };
        
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch economic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country]);

  return { data, loading };
};