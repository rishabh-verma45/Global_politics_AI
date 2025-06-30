import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Fuel, RefreshCw, Calendar, Activity, Target, Zap, Database, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../services/api';

const EconomyDashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [economicData, setEconomicData] = useState<any>(null);
  const [globalIndices, setGlobalIndices] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [economicCalendar, setEconomicCalendar] = useState<any[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState('all');

  const countries = [
    'United States', 'China', 'Germany', 'Japan', 'United Kingdom', 
    'France', 'India', 'Russia', 'Brazil', 'Canada'
  ];

  const countryCodeMap: { [key: string]: string } = {
    'United States': 'US',
    'China': 'CN',
    'Germany': 'DE',
    'Japan': 'JP',
    'United Kingdom': 'GB',
    'France': 'FR',
    'India': 'IN',
    'Russia': 'RU',
    'Brazil': 'BR',
    'Canada': 'CA'
  };

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'North America', label: 'North America' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia', label: 'Asia' },
    { id: 'South America', label: 'South America' }
  ];

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [selectedCountry]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchEconomicData(),
        fetchMarketData(),
        fetchCalendarData()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEconomicData = async () => {
    try {
      const countryCode = countryCodeMap[selectedCountry];
      console.log(`Fetching economic data for ${selectedCountry} (${countryCode})`);
      const data = await api.fetchEconomicData(countryCode);
      console.log('Economic data received:', data);
      setEconomicData(data);
    } catch (error) {
      console.error('Failed to fetch economic data:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const [indices, commoditiesData, rates, sentiment] = await Promise.all([
        api.fetchGlobalIndices(),
        api.fetchCommoditiesData(),
        api.fetchExchangeRates(),
        api.fetchMarketSentiment()
      ]);
      
      setGlobalIndices(indices);
      setCommodities(commoditiesData);
      setExchangeRates(rates);
      setMarketSentiment(sentiment);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  const fetchCalendarData = async () => {
    try {
      const calendar = await api.fetchEconomicCalendar();
      setEconomicCalendar(calendar);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-400" /> : 
      <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatGDP = (gdp: number) => {
    if (gdp >= 1000000000000) {
      return `$${(gdp / 1000000000000).toFixed(2)}T`;
    } else if (gdp >= 1000000000) {
      return `$${(gdp / 1000000000).toFixed(2)}B`;
    } else if (gdp >= 1000000) {
      return `$${(gdp / 1000000).toFixed(2)}M`;
    }
    return `$${gdp.toFixed(0)}`;
  };

  const formatPopulation = (population: number) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(2)}B`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toString();
  };

  const filteredIndices = selectedRegion === 'all' 
    ? globalIndices 
    : globalIndices.filter(index => index.region === selectedRegion);

  // Generate mock chart data
  const generateChartData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: 4000 + Math.random() * 500 + i * 10
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading real economic data from World Bank API...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching GDP, growth rates, and economic indicators</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Global Economy Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {countries.map(country => (
              <option key={country} value={country} className="bg-slate-800 text-white">
                {country}
              </option>
            ))}
          </select>
          
          {/* Data Source Indicator */}
          <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
            {economicData?.isRealData ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Real Data</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Demo Data</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="h-4 w-4" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={fetchAllData}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-white transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real Data Indicator */}
      {economicData && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">
                  {economicData.isRealData ? 'Real Economic Data' : 'Demo Economic Data'}
                </div>
                <div className="text-xs text-gray-400">
                  {economicData.isRealData 
                    ? `Source: World Bank API • Data Year: ${economicData.dataYear || 'Latest Available'}`
                    : 'Using realistic mock data for demonstration purposes'
                  }
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">{selectedCountry}</div>
              <div className="text-xs text-gray-400">
                Population: {formatPopulation(economicData.population || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Sentiment */}
      {marketSentiment && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Market Sentiment</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${marketSentiment.overall === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>
                {marketSentiment.overall.toUpperCase()}
              </div>
              <div className="text-sm text-gray-400">Overall Sentiment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{marketSentiment.fearGreedIndex}</div>
              <div className="text-sm text-gray-400">Fear & Greed Index</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${marketSentiment.fearGreedIndex}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{marketSentiment.volatilityIndex.toFixed(1)}</div>
              <div className="text-sm text-gray-400">Volatility Index</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Sector Performance</div>
              <div className="space-y-1">
                {Object.entries(marketSentiment.sectors).map(([sector, sentiment]) => (
                  <div key={sector} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{sector}</span>
                    <span className={`${sentiment === 'positive' ? 'text-green-400' : sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Economic Metrics - REAL GDP DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1">
              {economicData?.isRealData && (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )}
              {getTrendIcon(economicData?.gdpGrowth || 0)}
              <span className={`text-sm font-medium ${getTrendColor(economicData?.gdpGrowth || 0)}`}>
                {economicData?.gdpGrowth > 0 ? '+' : ''}{economicData?.gdpGrowth?.toFixed(1) || 0}%
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatGDP(economicData?.gdp || 0)}
          </div>
          <div className="text-sm text-gray-400">
            GDP {economicData?.isRealData ? `(${economicData.dataYear})` : '(Demo)'}
          </div>
          {economicData?.gdpPerCapita && (
            <div className="text-xs text-gray-500 mt-1">
              Per Capita: ${economicData.gdpPerCapita.toLocaleString()}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex items-center space-x-1">
              {economicData?.isRealData && (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )}
              {getTrendIcon(economicData?.gdpGrowth || 0)}
              <span className="text-sm font-medium text-green-400">Annual</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {economicData?.gdpGrowth?.toFixed(1) || 0}%
          </div>
          <div className="text-sm text-gray-400">
            GDP Growth Rate {economicData?.isRealData ? '(Real)' : '(Demo)'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${economicData?.gdpGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(economicData?.gdpGrowth || 0) * 10, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex items-center space-x-1">
              {economicData?.isRealData && (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )}
              {getTrendIcon(-(economicData?.inflation || 0))}
              <span className={`text-sm font-medium ${economicData?.inflation > 2 ? 'text-red-400' : 'text-green-400'}`}>
                {economicData?.inflation > 2 ? 'High' : 'Low'}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {economicData?.inflation?.toFixed(1) || 0}%
          </div>
          <div className="text-sm text-gray-400">
            Inflation Rate {economicData?.isRealData ? '(Real)' : '(Demo)'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${economicData?.inflation > 2 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((economicData?.inflation || 0) * 10, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-1">
              {economicData?.isRealData && (
                <CheckCircle className="h-3 w-3 text-green-400" />
              )}
              {getTrendIcon(-(economicData?.unemployment || 0))}
              <span className="text-sm font-medium text-purple-400">Rate</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {economicData?.unemployment?.toFixed(1) || 0}%
          </div>
          <div className="text-sm text-gray-400">
            Unemployment {economicData?.isRealData ? '(Real)' : '(Demo)'}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${economicData?.unemployment > 5 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((economicData?.unemployment || 0) * 5, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Additional Economic Indicators */}
      {economicData && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Economic Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Population</span>
                {economicData?.isRealData && (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                )}
              </div>
              <div className="text-xl font-bold text-white">
                {formatPopulation(economicData.population || 0)}
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Literacy Rate</span>
                {economicData?.isRealData && (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                )}
              </div>
              <div className="text-xl font-bold text-white">
                {economicData.literacyRate?.toFixed(1) || 0}%
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Data Source</span>
                <Database className="h-3 w-3 text-blue-400" />
              </div>
              <div className="text-sm font-medium text-white">
                {economicData.isRealData ? 'World Bank API' : 'Demo Data'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Market Indices */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Global Market Indices</h3>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-black/20 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {regions.map(region => (
              <option key={region.id} value={region.id} className="bg-slate-800">
                {region.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredIndices.map((index, i) => (
            <div key={i} className="p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-white">{index.name}</div>
                  <div className="text-xs text-gray-400">{index.country}</div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(index.changePercent)}
                </div>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                {index.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={getTrendColor(index.changePercent)}>
                  {index.change > 0 ? '+' : ''}{index.change?.toFixed(2)}
                </span>
                <span className={getTrendColor(index.changePercent)}>
                  {index.changePercent > 0 ? '+' : ''}{index.changePercent?.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Market Trend (30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="url(#colorGradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commodities and Economic Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commodities */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Commodities</h3>
          <div className="space-y-3">
            {commodities.map((commodity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">{commodity.name}</div>
                  <div className="text-xs text-gray-400">{commodity.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    ${commodity.price?.toFixed(2)}
                  </div>
                  <div className={`text-xs flex items-center space-x-1 ${getTrendColor(commodity.changePercent)}`}>
                    {getTrendIcon(commodity.changePercent)}
                    <span>{commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent?.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Economic Calendar</span>
          </h3>
          <div className="space-y-3">
            {economicCalendar.map((event, index) => (
              <div key={index} className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">{event.event}</div>
                  <div className={`w-2 h-2 rounded-full ${getImportanceColor(event.importance)}`} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{event.date} at {event.time}</span>
                  <div className="flex space-x-2">
                    <span>Forecast: {event.forecast}</span>
                    <span>Previous: {event.previous}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Rates */}
      {exchangeRates && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Live Exchange Rates (USD Base)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(exchangeRates).slice(0, 8).map(([currency, rate]) => (
              <div key={currency} className="p-3 bg-black/20 rounded-lg text-center">
                <div className="text-sm text-gray-400">{currency}</div>
                <div className="text-lg font-bold text-white">{(rate as number).toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomyDashboard;