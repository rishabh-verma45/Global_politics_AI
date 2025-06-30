import React, { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, AlertCircle, Globe, RefreshCw, Search, Rss, CheckCircle, Clock } from 'lucide-react';
import { useNewsUpdates } from '../hooks/useRealTimeData';
import api from '../services/api';

const NewsAnalysis = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'conflicts', label: 'Conflicts' },
    { id: 'economy', label: 'Economy' },
    { id: 'diplomacy', label: 'Diplomacy' },
    { id: 'technology', label: 'Technology' },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log(`Fetching ${forceRefresh ? 'fresh' : 'initial'} news for category: ${selectedCategory}`);
      
      let articles;
      if (searchQuery) {
        articles = await api.searchNews(searchQuery, forceRefresh);
      } else {
        // Always fetch fresh news from Google News
        articles = await api.fetchGeopoliticsNews(selectedCategory, forceRefresh);
      }
      
      // Enhance articles with AI analysis
      const enhancedArticles = await Promise.all(
        articles.map(async (article: any) => {
          const analysis = await api.analyzeNewsWithAI(article);
          return {
            ...article,
            analysis,
            category: categorizeArticle(article.title + ' ' + article.description),
            timestamp: new Date(article.publishedAt).toLocaleString(),
            isGoogleNews: article.isGoogleNews || false,
            isFresh: article.isFresh || forceRefresh
          };
        })
      );

      setNews(enhancedArticles);
      setLastUpdated(new Date());
      
      if (forceRefresh) {
        setRefreshCount(prev => prev + 1);
        console.log(`Refresh #${refreshCount + 1} completed with ${enhancedArticles.length} fresh articles`);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeArticle = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('war') || lowerText.includes('conflict') || lowerText.includes('military')) return 'conflicts';
    if (lowerText.includes('economy') || lowerText.includes('trade') || lowerText.includes('market')) return 'economy';
    if (lowerText.includes('diplomacy') || lowerText.includes('treaty') || lowerText.includes('negotiation')) return 'diplomacy';
    if (lowerText.includes('technology') || lowerText.includes('cyber') || lowerText.includes('digital')) return 'technology';
    return 'general';
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(true); // Force refresh when searching
  };

  const handleRefresh = () => {
    fetchNews(true); // Always force refresh to get new headlines
  };

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Global Politics News Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Globe className="h-4 w-4" />
            <span>Last updated: {getTimeSinceUpdate()}</span>
            {refreshCount > 0 && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                Refresh #{refreshCount}
              </span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2 group"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            <span>Fresh Headlines</span>
          </button>
        </div>
      </div>

      {/* News Source Indicator */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Rss className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">
                Live Google News Integration
              </div>
              <div className="text-xs text-gray-400">
                Fresh headlines fetched directly from Google News RSS feeds
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              LIVE FEED
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search latest global politics news from Google..."
              className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search Fresh</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Fetching fresh headlines from Google News...</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Getting the latest global political developments</p>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNews.map((article, index) => (
          <div
            key={article.id || index}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all group"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${getImpactColor(article.analysis?.impact || 'low')}`} />
                <span className="text-xs text-gray-400 uppercase font-medium">
                  {article.source?.name} • {article.timestamp}
                </span>
                {article.isGoogleNews && (
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Rss className="h-3 w-3" />
                    <span>Google News</span>
                  </span>
                )}
                {article.isFresh && (
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Fresh</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {article.analysis?.sentiment === 'positive' && <TrendingUp className="h-4 w-4 text-green-400" />}
                {article.analysis?.sentiment === 'negative' && <TrendingDown className="h-4 w-4 text-red-400" />}
                {article.analysis?.sentiment === 'neutral' && <AlertCircle className="h-4 w-4 text-yellow-400" />}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {article.description}
            </p>

            {article.analysis && (
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">AI ANALYSIS</span>
                  <span className="text-xs text-gray-400">
                    Confidence: {(article.analysis.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {article.analysis.prediction}
                </p>
                {article.analysis.keyTopics?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.analysis.keyTopics.map((topic: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`text-xs font-medium ${getSentimentColor(article.analysis?.sentiment || 'neutral')}`}>
                  {(article.analysis?.sentiment || 'neutral').toUpperCase()}
                </span>
                {article.analysis?.riskScore && (
                  <span className="text-xs text-gray-400">
                    Risk: {article.analysis.riskScore.toFixed(1)}/10
                  </span>
                )}
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <span>Read more</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No news articles found for the selected category.</p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
          >
            Try Refreshing for New Headlines
          </button>
        </div>
      )}

      {/* Refresh Statistics */}
      {refreshCount > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-sm font-medium text-white">
                  Fresh Headlines Loaded
                </div>
                <div className="text-xs text-gray-400">
                  {refreshCount} refresh{refreshCount > 1 ? 'es' : ''} completed • {filteredNews.length} articles loaded
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-400">Live Feed Active</div>
              <div className="text-xs text-gray-400">Google News Integration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAnalysis;