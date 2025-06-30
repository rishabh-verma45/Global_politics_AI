import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, TrendingUp, Activity, Eye, Maximize, RotateCcw, Zap, Globe as GlobeIcon, VolumeX, Volume2, Layers, Filter } from 'lucide-react';

interface ConflictMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  type: 'conflict' | 'tension' | 'economic' | 'diplomatic';
  lastUpdate: string;
  description: string;
  casualties?: number;
  economicImpact?: string;
}

// Helper Functions
const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    default: return '#6b7280';
  }
};

const getIntensityBadgeColor = (intensity: string) => {
  switch (intensity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'conflict': return AlertTriangle;
    case 'tension': return Activity;
    case 'economic': return TrendingUp;
    case 'diplomatic': return MapPin;
    default: return MapPin;
  }
};

// Convert lat/lng to map coordinates (using Mercator projection)
const latLngToMapCoords = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
  const x = ((lng + 180) / 360) * mapWidth;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (mapHeight / 2) - (mapWidth * mercN / (2 * Math.PI));
  
  return { x, y };
};

// Conflict Marker Component
const ConflictMarker: React.FC<{
  marker: ConflictMarker;
  onClick: () => void;
  isSelected: boolean;
  mapWidth: number;
  mapHeight: number;
}> = ({ marker, onClick, isSelected, mapWidth, mapHeight }) => {
  const { x, y } = latLngToMapCoords(marker.lat, marker.lng, mapWidth, mapHeight);
  const Icon = getTypeIcon(marker.type);
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={onClick}
    >
      {/* Pulsing Ring */}
      <div 
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{ 
          backgroundColor: getIntensityColor(marker.intensity),
          width: '24px',
          height: '24px',
          left: '-12px',
          top: '-12px'
        }}
      />
      
      {/* Main Marker */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isSelected ? 'scale-125 ring-4 ring-white/50' : 'hover:scale-110'
        }`}
        style={{ backgroundColor: getIntensityColor(marker.intensity) }}
      >
        <Icon className="h-3 w-3 text-white" />
      </div>
      
      {/* Tooltip */}
      {isSelected && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none z-20">
          <div className="font-semibold">{marker.name}</div>
          <div className="text-xs text-gray-300">{marker.type} • {marker.intensity}</div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
        </div>
      )}
    </div>
  );
};

// Map Overlay Component
const MapOverlay: React.FC<{
  selectedMarker: ConflictMarker | null;
  onClose: () => void;
}> = ({ selectedMarker, onClose }) => {
  if (!selectedMarker) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-lg border border-cyan-500/50 rounded-xl p-6 max-w-md shadow-2xl z-30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{selectedMarker.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Threat Level</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIntensityBadgeColor(selectedMarker.intensity)}`}>
            {selectedMarker.intensity.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Type</span>
          <span className="text-white capitalize">{selectedMarker.type}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Last Update</span>
          <span className="text-white">{selectedMarker.lastUpdate}</span>
        </div>
        
        {selectedMarker.casualties && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Casualties</span>
            <span className="text-red-400 font-medium">{selectedMarker.casualties.toLocaleString()}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-700">
          <p className="text-gray-300 text-sm">{selectedMarker.description}</p>
        </div>
        
        {selectedMarker.economicImpact && (
          <div className="pt-2">
            <span className="text-gray-400 text-sm">Economic Impact:</span>
            <p className="text-yellow-400 text-sm mt-1">{selectedMarker.economicImpact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const RealTimeMap: React.FC = () => {
  const [conflicts, setConflicts] = useState<ConflictMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<ConflictMarker | null>(null);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mapDimensions, setMapDimensions] = useState({ width: 1200, height: 600 });

  useEffect(() => {
    // Enhanced mock conflict data
    const mockConflicts: ConflictMarker[] = [
      {
        id: 1,
        name: "Eastern European Conflict",
        lat: 50.4501,
        lng: 30.5234,
        intensity: 'critical',
        type: 'conflict',
        lastUpdate: '2 minutes ago',
        description: 'Major military operations ongoing with significant international implications and humanitarian concerns.',
        casualties: 500000,
        economicImpact: 'Global energy markets disrupted, grain exports halted'
      },
      {
        id: 2,
        name: "Middle East Crisis",
        lat: 31.3547,
        lng: 34.3088,
        intensity: 'high',
        type: 'conflict',
        lastUpdate: '15 minutes ago',
        description: 'Regional conflict with potential for wider escalation affecting multiple neighboring countries.',
        casualties: 50000,
        economicImpact: 'Oil prices volatile, regional trade disrupted'
      },
      {
        id: 3,
        name: "South China Sea Tensions",
        lat: 16.0,
        lng: 114.0,
        intensity: 'medium',
        type: 'tension',
        lastUpdate: '1 hour ago',
        description: 'Territorial disputes over strategic waterways with multiple nations asserting claims.',
        economicImpact: 'Shipping routes uncertain, trade tensions rising'
      },
      {
        id: 4,
        name: "Arctic Territorial Dispute",
        lat: 75.0,
        lng: -90.0,
        intensity: 'low',
        type: 'diplomatic',
        lastUpdate: '3 hours ago',
        description: 'Climate change opening new territories and resources, leading to competing national claims.',
        economicImpact: 'Future resource extraction rights at stake'
      },
      {
        id: 5,
        name: "Cyber Warfare Hub",
        lat: 39.9042,
        lng: 116.4074,
        intensity: 'medium',
        type: 'tension',
        lastUpdate: '45 minutes ago',
        description: 'Increased cyber attacks targeting critical infrastructure and government systems.',
        economicImpact: 'Digital security investments surge, tech sector volatility'
      },
      {
        id: 6,
        name: "Trade War Epicenter",
        lat: 40.7128,
        lng: -74.0060,
        intensity: 'medium',
        type: 'economic',
        lastUpdate: '2 hours ago',
        description: 'Economic tensions affecting global supply chains and international trade relationships.',
        economicImpact: 'Tariffs affecting consumer prices, supply chain disruptions'
      },
      {
        id: 7,
        name: "Sahel Security Crisis",
        lat: 14.0,
        lng: 2.0,
        intensity: 'high',
        type: 'conflict',
        lastUpdate: '30 minutes ago',
        description: 'Regional instability affecting multiple West African nations with humanitarian implications.',
        casualties: 15000,
        economicImpact: 'Mining operations disrupted, migration pressures'
      },
      {
        id: 8,
        name: "Kashmir Border Tensions",
        lat: 34.0,
        lng: 76.0,
        intensity: 'medium',
        type: 'tension',
        lastUpdate: '2 hours ago',
        description: 'Long-standing territorial dispute with periodic escalations between nuclear powers.',
        economicImpact: 'Regional trade affected, defense spending increased'
      }
    ];

    setConflicts(mockConflicts);

    // Update map dimensions based on container
    const updateDimensions = () => {
      const container = document.getElementById('map-container');
      if (container) {
        setMapDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setConflicts(prev => prev.map(conflict => ({
        ...conflict,
        lastUpdate: `${Math.floor(Math.random() * 60)} minutes ago`,
        intensity: Math.random() > 0.95 ? 
          (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)] : 
          conflict.intensity
      })));
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleMarkerClick = (marker: ConflictMarker) => {
    setSelectedMarker(marker);
    if (soundEnabled) {
      console.log('🔊 Conflict marker selected:', marker.name);
    }
  };

  const filteredConflicts = filterType === 'all' 
    ? conflicts 
    : conflicts.filter(conflict => conflict.type === filterType);

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg';
      case 'political':
        return 'https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg';
      case 'terrain':
        return 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg';
      default:
        return 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg';
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GlobeIcon className="h-8 w-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Global Conflict Monitor</h2>
              <div className="text-cyan-400 text-sm">Real-time World Map Visualization</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">LIVE</span>
            </div>
            <div className="text-white text-sm">
              {filteredConflicts.length} Active Situations
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        id="map-container"
        className="absolute inset-0 pt-24 pb-20"
        style={{ 
          backgroundImage: `url(${getMapBackground()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Map Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Heatmap Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent" />
        )}
        
        {/* World Map SVG Overlay for better geography */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified world map paths */}
          <path
            d="M200,200 L400,180 L600,220 L800,200 L1000,180 L1000,400 L800,420 L600,380 L400,400 L200,420 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Add more continent outlines as needed */}
        </svg>

        {/* Conflict Markers */}
        {filteredConflicts.map((marker) => (
          <ConflictMarker
            key={marker.id}
            marker={marker}
            onClick={() => handleMarkerClick(marker)}
            isSelected={selectedMarker?.id === marker.id}
            mapWidth={mapDimensions.width}
            mapHeight={mapDimensions.height}
          />
        ))}

        {/* Connection Lines for High-Intensity Conflicts */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {filteredConflicts
            .filter(c => c.intensity === 'critical' || c.intensity === 'high')
            .map((marker, index) => {
              const { x, y } = latLngToMapCoords(marker.lat, marker.lng, mapDimensions.width, mapDimensions.height);
              const centerX = mapDimensions.width / 2;
              const centerY = mapDimensions.height / 2;
              
              return (
                <line
                  key={`line-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={getIntensityColor(marker.intensity)}
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="5,5"
                />
              );
            })}
        </svg>
      </div>

      {/* Map Overlay */}
      <MapOverlay
        selectedMarker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
      />

      {/* Control Panel */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="satellite">Satellite View</option>
                <option value="political">Political Map</option>
                <option value="terrain">Terrain View</option>
              </select>
              
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`p-2 rounded-lg transition-colors ${showHeatmap ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
                title="Toggle Heatmap"
              >
                <Layers className="h-4 w-4" />
              </button>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="conflict">Conflicts</option>
                <option value="tension">Tensions</option>
                <option value="economic">Economic</option>
                <option value="diplomatic">Diplomatic</option>
              </select>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'}`}
                title="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>

            {/* Center Info */}
            <div className="text-center">
              <div className="text-white font-medium">Global Threat Level</div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-bold">HIGH</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                title="Clear Selection"
              >
                <Eye className="h-4 w-4" />
              </button>
              
              <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 font-medium rounded-lg border border-cyan-500/30">
                2D World Map
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Level Legend */}
      <div className="absolute top-24 right-6 z-20 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Threat Levels</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white text-sm">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-white text-sm">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-white text-sm">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-white text-sm">Low</span>
          </div>
        </div>
      </div>

      {/* Active Conflicts Sidebar */}
      <div className="absolute top-24 left-6 z-20 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-4 max-w-xs">
        <h3 className="text-white font-semibold mb-3">Active Situations</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredConflicts.map((conflict) => {
            const Icon = getTypeIcon(conflict.type);
            return (
              <button
                key={conflict.id}
                onClick={() => handleMarkerClick(conflict)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedMarker?.id === conflict.id 
                    ? 'bg-cyan-500/20 border border-cyan-500/50' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getIntensityColor(conflict.intensity) }} 
                  />
                  <Icon className="h-3 w-3 text-gray-400" />
                  <span className="text-white text-sm font-medium truncate">{conflict.name}</span>
                </div>
                <div className="text-xs text-gray-400">{conflict.lastUpdate}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="absolute bottom-24 right-6 z-20 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Statistics</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Critical:</span>
            <span className="text-red-400 font-medium">
              {filteredConflicts.filter(c => c.intensity === 'critical').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">High:</span>
            <span className="text-orange-400 font-medium">
              {filteredConflicts.filter(c => c.intensity === 'high').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Medium:</span>
            <span className="text-yellow-400 font-medium">
              {filteredConflicts.filter(c => c.intensity === 'medium').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Low:</span>
            <span className="text-green-400 font-medium">
              {filteredConflicts.filter(c => c.intensity === 'low').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMap;