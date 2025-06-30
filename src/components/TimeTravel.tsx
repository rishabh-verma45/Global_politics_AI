import React, { useState, useEffect } from 'react';
import { Clock, Calendar, TrendingUp, AlertTriangle, Globe, Zap, Database, CheckCircle, BarChart3, Users, DollarSign, Target } from 'lucide-react';
import api from '../services/api';

interface CountryData {
  currentData: {
    gdp: number;
    gdpGrowth: number;
    population: number;
    gdpPerCapita: number;
    inflation: number;
    unemployment: number;
    literacyRate: number;
    isRealData: boolean;
    dataYear: number;
  };
  predictions: {
    [year: number]: {
      gdp: number;
      population: number;
      dominantTech: string;
      majorChallenges: string[];
      geopoliticalStatus: string;
      economicScore: number;
      stabilityScore: number;
      innovationScore: number;
      keyEvents: string[];
      gdpPerCapita: number;
      climateImpact: string;
      energyTransition: string;
      demographicTrend: string;
    };
  };
}

const TimeTravel = () => {
  const [selectedYear, setSelectedYear] = useState(2030);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isGenerating, setIsGenerating] = useState(false);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCountryData();
  }, [selectedCountry]);

  const fetchCountryData = async () => {
    setLoading(true);
    try {
      const countryCode = countryCodeMap[selectedCountry];
      console.log(`Fetching real data for ${selectedCountry} (${countryCode})`);
      
      // Fetch real current economic data
      const currentData = await api.fetchEconomicData(countryCode);
      console.log('Current data received:', currentData);
      
      // Generate predictions based on real data
      const predictions = generatePredictionsFromRealData(currentData, selectedCountry);
      
      setCountryData({
        currentData,
        predictions
      });
    } catch (error) {
      console.error('Failed to fetch country data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePredictionsFromRealData = (currentData: any, country: string) => {
    const baseYear = currentData.dataYear || new Date().getFullYear() - 1;
    const currentGDP = currentData.gdp || 0;
    const currentPopulation = currentData.population || 0;
    const currentGDPGrowth = currentData.gdpGrowth || 2.0;
    const currentGDPPerCapita = currentData.gdpPerCapita || 0;

    // Country-specific factors for predictions
    const countryFactors = getCountrySpecificFactors(country);
    
    return {
      2030: generateYearPrediction(2030, baseYear, currentData, countryFactors, country),
      2040: generateYearPrediction(2040, baseYear, currentData, countryFactors, country),
      2050: generateYearPrediction(2050, baseYear, currentData, countryFactors, country)
    };
  };

  const getCountrySpecificFactors = (country: string) => {
    const factors: { [key: string]: any } = {
      'United States': {
        techLeadership: 0.9,
        demographicChallenge: 0.6,
        climateVulnerability: 0.5,
        geopoliticalInfluence: 0.9,
        innovationCapacity: 0.95,
        energyTransition: 0.7,
        avgGrowthRate: 2.2,
        populationGrowthRate: 0.4
      },
      'China': {
        techLeadership: 0.85,
        demographicChallenge: 0.8,
        climateVulnerability: 0.7,
        geopoliticalInfluence: 0.85,
        innovationCapacity: 0.8,
        energyTransition: 0.8,
        avgGrowthRate: 4.5,
        populationGrowthRate: -0.1
      },
      'Germany': {
        techLeadership: 0.8,
        demographicChallenge: 0.7,
        climateVulnerability: 0.4,
        geopoliticalInfluence: 0.7,
        innovationCapacity: 0.85,
        energyTransition: 0.9,
        avgGrowthRate: 1.5,
        populationGrowthRate: 0.1
      },
      'Japan': {
        techLeadership: 0.85,
        demographicChallenge: 0.9,
        climateVulnerability: 0.6,
        geopoliticalInfluence: 0.6,
        innovationCapacity: 0.9,
        energyTransition: 0.7,
        avgGrowthRate: 1.0,
        populationGrowthRate: -0.3
      },
      'United Kingdom': {
        techLeadership: 0.75,
        demographicChallenge: 0.5,
        climateVulnerability: 0.4,
        geopoliticalInfluence: 0.7,
        innovationCapacity: 0.8,
        energyTransition: 0.8,
        avgGrowthRate: 1.8,
        populationGrowthRate: 0.3
      },
      'France': {
        techLeadership: 0.7,
        demographicChallenge: 0.6,
        climateVulnerability: 0.4,
        geopoliticalInfluence: 0.7,
        innovationCapacity: 0.75,
        energyTransition: 0.85,
        avgGrowthRate: 1.6,
        populationGrowthRate: 0.2
      },
      'India': {
        techLeadership: 0.6,
        demographicChallenge: 0.3,
        climateVulnerability: 0.8,
        geopoliticalInfluence: 0.7,
        innovationCapacity: 0.7,
        energyTransition: 0.6,
        avgGrowthRate: 6.5,
        populationGrowthRate: 0.8
      },
      'Russia': {
        techLeadership: 0.5,
        demographicChallenge: 0.8,
        climateVulnerability: 0.6,
        geopoliticalInfluence: 0.6,
        innovationCapacity: 0.5,
        energyTransition: 0.4,
        avgGrowthRate: 1.5,
        populationGrowthRate: -0.2
      },
      'Brazil': {
        techLeadership: 0.4,
        demographicChallenge: 0.4,
        climateVulnerability: 0.7,
        geopoliticalInfluence: 0.5,
        innovationCapacity: 0.5,
        energyTransition: 0.6,
        avgGrowthRate: 2.5,
        populationGrowthRate: 0.5
      },
      'Canada': {
        techLeadership: 0.7,
        demographicChallenge: 0.5,
        climateVulnerability: 0.5,
        geopoliticalInfluence: 0.6,
        innovationCapacity: 0.8,
        energyTransition: 0.8,
        avgGrowthRate: 2.0,
        populationGrowthRate: 0.9
      }
    };

    return factors[country] || factors['United States'];
  };

  const generateYearPrediction = (targetYear: number, baseYear: number, currentData: any, factors: any, country: string) => {
    const yearsAhead = targetYear - baseYear;
    const currentGDP = currentData.gdp || 0;
    const currentPopulation = currentData.population || 0;
    const currentGDPPerCapita = currentData.gdpPerCapita || 0;

    // Calculate compound growth with realistic adjustments
    const adjustedGrowthRate = factors.avgGrowthRate * (1 - (yearsAhead * 0.01)); // Slight decline over time
    const projectedGDP = currentGDP * Math.pow(1 + adjustedGrowthRate / 100, yearsAhead);
    
    const projectedPopulation = currentPopulation * Math.pow(1 + factors.populationGrowthRate / 100, yearsAhead);
    const projectedGDPPerCapita = projectedGDP / projectedPopulation;

    // Technology progression based on innovation capacity
    const techProgression = {
      2030: factors.innovationCapacity > 0.8 ? 'AI Integration & Automation' : 'Digital Transformation',
      2040: factors.innovationCapacity > 0.8 ? 'Quantum-AI Hybrid Systems' : 'Advanced AI Systems',
      2050: factors.innovationCapacity > 0.8 ? 'Consciousness-Machine Interface' : 'Quantum Computing'
    };

    // Generate challenges based on country factors
    const challenges = generateChallenges(factors, targetYear, country);
    const keyEvents = generateKeyEvents(factors, targetYear, country);
    const geopoliticalStatus = generateGeopoliticalStatus(factors, targetYear, country);

    // Calculate scores based on real data and projections
    const economicScore = Math.min(10, 5 + (adjustedGrowthRate / 2) + (factors.innovationCapacity * 3));
    const stabilityScore = Math.min(10, 7 - (factors.demographicChallenge * 2) - (factors.climateVulnerability * 1.5));
    const innovationScore = Math.min(10, factors.innovationCapacity * 10);

    return {
      gdp: projectedGDP,
      population: projectedPopulation,
      gdpPerCapita: projectedGDPPerCapita,
      dominantTech: techProgression[targetYear as keyof typeof techProgression],
      majorChallenges: challenges,
      geopoliticalStatus,
      economicScore,
      stabilityScore,
      innovationScore,
      keyEvents,
      climateImpact: generateClimateImpact(factors, targetYear),
      energyTransition: generateEnergyTransition(factors, targetYear),
      demographicTrend: generateDemographicTrend(factors, targetYear)
    };
  };

  const generateChallenges = (factors: any, year: number, country: string) => {
    const challenges = [];
    
    if (factors.demographicChallenge > 0.6) {
      challenges.push(year <= 2030 ? 'Aging population pressures' : 'Severe demographic transition');
    }
    
    if (factors.climateVulnerability > 0.6) {
      challenges.push(year <= 2030 ? 'Climate adaptation costs' : 'Climate refugee management');
    }
    
    if (factors.energyTransition < 0.7) {
      challenges.push(year <= 2030 ? 'Energy transition delays' : 'Stranded fossil fuel assets');
    }
    
    // Add year-specific challenges
    if (year >= 2040) {
      challenges.push('AI governance and ethics');
      if (factors.geopoliticalInfluence < 0.7) {
        challenges.push('Multipolar world adaptation');
      }
    }
    
    if (year >= 2050) {
      challenges.push('Space resource competition');
      challenges.push('Consciousness technology ethics');
    }

    return challenges.slice(0, 4); // Limit to 4 challenges
  };

  const generateKeyEvents = (factors: any, year: number, country: string) => {
    const events = [];
    
    if (year === 2030) {
      if (factors.energyTransition > 0.7) {
        events.push('Renewable energy dominance achieved');
      }
      if (factors.innovationCapacity > 0.8) {
        events.push('AI integration in all major sectors');
      }
      events.push('Climate adaptation infrastructure complete');
    }
    
    if (year === 2040) {
      if (factors.techLeadership > 0.8) {
        events.push('Quantum computing commercialization');
      }
      events.push('First generation climate refugees integrated');
      if (factors.geopoliticalInfluence > 0.8) {
        events.push('Space resource extraction begins');
      }
    }
    
    if (year === 2050) {
      events.push('Carbon neutrality achieved');
      if (factors.innovationCapacity > 0.8) {
        events.push('Consciousness transfer technology');
      }
      events.push('Interplanetary economic activities');
    }

    return events.slice(0, 3); // Limit to 3 events
  };

  const generateGeopoliticalStatus = (factors: any, year: number, country: string) => {
    if (factors.geopoliticalInfluence > 0.8) {
      if (year <= 2030) return 'Global superpower maintaining influence';
      if (year <= 2040) return 'Leading space-faring nation';
      return 'Interplanetary governance leader';
    } else if (factors.geopoliticalInfluence > 0.6) {
      if (year <= 2030) return 'Major regional power with global reach';
      if (year <= 2040) return 'Key player in multipolar world';
      return 'Solar system co-governance participant';
    } else {
      if (year <= 2030) return 'Regional power with specialized influence';
      if (year <= 2040) return 'Niche global influence in specific sectors';
      return 'Specialized interplanetary role';
    }
  };

  const generateClimateImpact = (factors: any, year: number) => {
    if (factors.climateVulnerability > 0.7) {
      return year <= 2030 ? 'High adaptation costs' : 'Major infrastructure transformation';
    } else if (factors.climateVulnerability > 0.4) {
      return year <= 2030 ? 'Moderate adaptation needs' : 'Managed transition to resilience';
    } else {
      return year <= 2030 ? 'Low climate vulnerability' : 'Climate adaptation leader';
    }
  };

  const generateEnergyTransition = (factors: any, year: number) => {
    if (factors.energyTransition > 0.8) {
      return year <= 2030 ? 'Renewable energy leader' : 'Post-carbon economy achieved';
    } else if (factors.energyTransition > 0.6) {
      return year <= 2030 ? 'Rapid transition underway' : 'Clean energy majority';
    } else {
      return year <= 2030 ? 'Slow energy transition' : 'Fossil fuel dependency remains';
    }
  };

  const generateDemographicTrend = (factors: any, year: number) => {
    if (factors.demographicChallenge > 0.7) {
      return year <= 2030 ? 'Rapid aging population' : 'Severe demographic inversion';
    } else if (factors.populationGrowthRate > 0.5) {
      return year <= 2030 ? 'Young, growing population' : 'Demographic dividend realized';
    } else {
      return year <= 2030 ? 'Stable demographics' : 'Managed demographic transition';
    }
  };

  const generatePrediction = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetchCountryData(); // Refresh data
    setIsGenerating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-yellow-400';
    if (score >= 5.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-500';
    if (score >= 7.0) return 'bg-yellow-500';
    if (score >= 5.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatGDP = (gdp: number) => {
    if (gdp >= 1000000000000) {
      return `$${(gdp / 1000000000000).toFixed(2)}T`;
    } else if (gdp >= 1000000000) {
      return `$${(gdp / 1000000000).toFixed(2)}B`;
    }
    return `$${gdp.toFixed(0)}`;
  };

  const formatPopulation = (population: number) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(2)}B`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    }
    return population.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Database className="h-8 w-8 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Loading real economic data for {selectedCountry}...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching current GDP, demographics, and economic indicators</p>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Zap className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generating AI Predictions</h3>
            <p className="text-gray-400 mb-4">Analyzing real economic data and geopolitical trends for {selectedCountry}...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!countryData) return null;

  const currentPrediction = countryData.predictions[selectedYear];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Time Travel Predictions</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Based on Real Economic Data</span>
        </div>
      </div>

      {/* Real Data Indicator */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">
                {countryData.currentData.isRealData ? 'Real Economic Data Source' : 'Demo Data Source'}
              </div>
              <div className="text-xs text-gray-400">
                {countryData.currentData.isRealData 
                  ? `World Bank API • Base Year: ${countryData.currentData.dataYear}`
                  : 'Using realistic mock data for demonstration'
                }
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {countryData.currentData.isRealData && (
              <CheckCircle className="h-4 w-4 text-green-400" />
            )}
            <span className={`text-sm font-medium ${countryData.currentData.isRealData ? 'text-green-400' : 'text-blue-400'}`}>
              {countryData.currentData.isRealData ? 'VERIFIED' : 'DEMO'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Economic Baseline */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Current Economic Baseline ({countryData.currentData.dataYear})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">GDP</span>
              {countryData.currentData.isRealData && <CheckCircle className="h-3 w-3 text-green-400" />}
            </div>
            <div className="text-xl font-bold text-white">{formatGDP(countryData.currentData.gdp)}</div>
            <div className="text-xs text-gray-500">Growth: {countryData.currentData.gdpGrowth?.toFixed(1)}%</div>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Population</span>
              {countryData.currentData.isRealData && <CheckCircle className="h-3 w-3 text-green-400" />}
            </div>
            <div className="text-xl font-bold text-white">{formatPopulation(countryData.currentData.population)}</div>
            <div className="text-xs text-gray-500">Per Capita: ${countryData.currentData.gdpPerCapita?.toLocaleString()}</div>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Inflation</span>
              {countryData.currentData.isRealData && <CheckCircle className="h-3 w-3 text-green-400" />}
            </div>
            <div className="text-xl font-bold text-white">{countryData.currentData.inflation?.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Unemployment: {countryData.currentData.unemployment?.toFixed(1)}%</div>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">Literacy</span>
              {countryData.currentData.isRealData && <CheckCircle className="h-3 w-3 text-green-400" />}
            </div>
            <div className="text-xl font-bold text-white">{countryData.currentData.literacyRate?.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Education Level</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Target Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2030} className="bg-slate-800">2030 (5-6 years ahead)</option>
              <option value={2040} className="bg-slate-800">2040 (15-16 years ahead)</option>
              <option value={2050} className="bg-slate-800">2050 (25-26 years ahead)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map(country => (
                <option key={country} value={country} className="bg-slate-800">
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generatePrediction}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Regenerate Prediction</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
            <Calendar className="h-4 w-4" />
            <span>AI Prediction for {selectedCountry} in {selectedYear}</span>
          </div>
        </div>
      </div>

      {/* Prediction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Projected Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400">Projected GDP</span>
              <span className="text-lg font-bold text-green-400">{formatGDP(currentPrediction.gdp)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400">Population</span>
              <span className="text-lg font-bold text-white">{formatPopulation(currentPrediction.population)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400">GDP Per Capita</span>
              <span className="text-lg font-bold text-blue-400">${currentPrediction.gdpPerCapita?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400">Dominant Technology</span>
              <span className="text-sm font-medium text-purple-400">{currentPrediction.dominantTech}</span>
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-gray-400 block mb-2">Geopolitical Status</span>
              <span className="text-sm text-white">{currentPrediction.geopoliticalStatus}</span>
            </div>
          </div>
        </div>

        {/* Scores Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">AI Prediction Scores</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Economic Strength</span>
                <span className={`text-sm font-bold ${getScoreColor(currentPrediction.economicScore)}`}>
                  {currentPrediction.economicScore.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(currentPrediction.economicScore)}`}
                  style={{ width: `${currentPrediction.economicScore * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Political Stability</span>
                <span className={`text-sm font-bold ${getScoreColor(currentPrediction.stabilityScore)}`}>
                  {currentPrediction.stabilityScore.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(currentPrediction.stabilityScore)}`}
                  style={{ width: `${currentPrediction.stabilityScore * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Innovation Index</span>
                <span className={`text-sm font-bold ${getScoreColor(currentPrediction.innovationScore)}`}>
                  {currentPrediction.innovationScore.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBarColor(currentPrediction.innovationScore)}`}
                  style={{ width: `${currentPrediction.innovationScore * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span>Major Challenges</span>
          </h3>
          <div className="space-y-3">
            {currentPrediction.majorChallenges.map((challenge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-sm text-gray-300">{challenge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span>Key Events</span>
          </h3>
          <div className="space-y-3">
            {currentPrediction.keyEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-gray-300">{event}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <span>Trend Analysis</span>
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-xs font-medium text-blue-400 mb-1">Climate Impact</div>
              <div className="text-sm text-gray-300">{currentPrediction.climateImpact}</div>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-xs font-medium text-green-400 mb-1">Energy Transition</div>
              <div className="text-sm text-gray-300">{currentPrediction.energyTransition}</div>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-xs font-medium text-purple-400 mb-1">Demographics</div>
              <div className="text-sm text-gray-300">{currentPrediction.demographicTrend}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Prediction Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-2">Data Sources</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• World Bank Economic Indicators (Real GDP, Growth, Demographics)</li>
              <li>• Current inflation and unemployment rates</li>
              <li>• Geopolitical influence assessments</li>
              <li>• Technology innovation capacity metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">AI Analysis Factors</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Compound economic growth projections</li>
              <li>• Demographic transition modeling</li>
              <li>• Climate vulnerability assessments</li>
              <li>• Technology adoption curves</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTravel;