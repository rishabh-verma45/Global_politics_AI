import React, { useState } from 'react';
import { AlertTriangle, MapPin, Users, Calendar, TrendingUp, Shield } from 'lucide-react';

const WarTracker = () => {
  const [selectedConflict, setSelectedConflict] = useState(null);

  const conflicts = [
    {
      id: 1,
      name: 'Eastern European Conflict',
      location: 'Ukraine',
      status: 'Active',
      threatLevel: 'High',
      duration: '2+ years',
      casualties: '500,000+',
      parties: ['Ukraine', 'Russia', 'NATO Support'],
      lastUpdate: '2 hours ago',
      description: 'Ongoing military conflict with significant international implications.',
      riskFactors: ['Nuclear escalation', 'Energy crisis', 'Food security', 'Refugee crisis'],
      economicImpact: 'Global commodity prices affected, energy markets disrupted',
      aiRating: 9.2
    },
    {
      id: 2,
      name: 'Middle East Tensions',
      location: 'Gaza Strip',
      status: 'Escalating',
      threatLevel: 'High',
      duration: '6+ months',
      casualties: '50,000+',
      parties: ['Israel', 'Hamas', 'Regional Powers'],
      lastUpdate: '1 hour ago',
      description: 'Regional conflict with potential for wider escalation.',
      riskFactors: ['Regional war', 'Oil supply disruption', 'Civilian casualties'],
      economicImpact: 'Regional trade disruption, oil price volatility',
      aiRating: 8.7
    },
    {
      id: 3,
      name: 'South China Sea Dispute',
      location: 'South China Sea',
      status: 'Tense',
      threatLevel: 'Medium',
      duration: 'Ongoing',
      casualties: 'Minimal',
      parties: ['China', 'Philippines', 'Vietnam', 'USA'],
      lastUpdate: '6 hours ago',
      description: 'Territorial disputes over strategic waterways.',
      riskFactors: ['Naval confrontation', 'Trade route disruption', 'Alliance tensions'],
      economicImpact: 'Shipping lane concerns, trade uncertainty',
      aiRating: 6.8
    },
    {
      id: 4,
      name: 'African Sahel Crisis',
      location: 'Mali, Niger, Burkina Faso',
      status: 'Ongoing',
      threatLevel: 'Medium',
      duration: '5+ years',
      casualties: '10,000+',
      parties: ['Government Forces', 'Militant Groups', 'International Forces'],
      lastUpdate: '12 hours ago',
      description: 'Insurgency and instability affecting regional security.',
      riskFactors: ['Terrorism spread', 'Migration crisis', 'Resource conflicts'],
      economicImpact: 'Mining operations affected, agricultural disruption',
      aiRating: 7.1
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-black';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-red-400';
      case 'Escalating': return 'text-orange-400';
      case 'Tense': return 'text-yellow-400';
      case 'Ongoing': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Global Conflict Tracker</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Real-time Monitoring</span>
        </div>
      </div>

      {/* Threat Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">Critical</span>
          </div>
          <div className="text-2xl font-bold text-white">2</div>
          <div className="text-sm text-gray-400">Active Conflicts</div>
        </div>
        
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Elevated</span>
          </div>
          <div className="text-2xl font-bold text-white">2</div>
          <div className="text-sm text-gray-400">Tensions</div>
        </div>
        
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Casualties</span>
          </div>
          <div className="text-2xl font-bold text-white">560K+</div>
          <div className="text-sm text-gray-400">Estimated</div>
        </div>
        
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <span className="text-purple-400 font-medium">AI Risk Score</span>
          </div>
          <div className="text-2xl font-bold text-white">7.9</div>
          <div className="text-sm text-gray-400">Global Average</div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conflicts.map(conflict => (
          <div
            key={conflict.id}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            onClick={() => setSelectedConflict(conflict)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {conflict.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{conflict.location}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatColor(conflict.threatLevel)}`}>
                  {conflict.threatLevel}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">AI Rating:</span>
                  <span className="text-sm font-medium text-white">{conflict.aiRating}/10</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <div className={`text-sm font-medium ${getStatusColor(conflict.status)}`}>
                  {conflict.status}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Duration</div>
                <div className="text-sm text-white">{conflict.duration}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Casualties</div>
                <div className="text-sm text-white">{conflict.casualties}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Last Update</div>
                <div className="text-sm text-white">{conflict.lastUpdate}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Parties Involved</div>
              <div className="flex flex-wrap gap-1">
                {conflict.parties.map((party, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                  >
                    {party}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              {conflict.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                <Calendar className="h-3 w-3 inline mr-1" />
                Updated {conflict.lastUpdate}
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{selectedConflict.name}</h3>
              <button
                onClick={() => setSelectedConflict(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Risk Factors</h4>
                <div className="space-y-2">
                  {selectedConflict.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Economic Impact</h4>
                <p className="text-sm text-gray-300">{selectedConflict.economicImpact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarTracker;