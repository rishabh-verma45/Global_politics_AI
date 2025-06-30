import React, { useState } from 'react';
import { Gamepad2, Target, Award, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const FutureGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [playerChoices, setPlayerChoices] = useState<number[]>([]);

  const scenarios = [
    {
      id: 1,
      title: "The Arctic Dispute",
      year: 2028,
      context: "Climate change has opened new Arctic shipping routes. Multiple nations claim territorial rights.",
      situation: "As the leader of a major power, how do you respond to competing claims over Arctic resources?",
      choices: [
        { text: "Negotiate multilateral agreement", impact: "Diplomatic solution, moderate resource access", points: 15 },
        { text: "Assert military presence", impact: "High tension, potential conflict", points: 5 },
        { text: "Focus on environmental protection", impact: "International goodwill, limited resources", points: 10 },
        { text: "Form strategic alliance", impact: "Shared benefits, opposition from others", points: 12 }
      ]
    },
    {
      id: 2,
      title: "The Quantum Breakthrough",
      year: 2032,
      context: "Your nation achieves quantum computing supremacy, giving unprecedented capabilities.",
      situation: "How do you leverage this technological advantage on the global stage?",
      choices: [
        { text: "Share technology for global benefit", impact: "Peaceful cooperation, shared leadership", points: 18 },
        { text: "Maintain technological monopoly", impact: "Economic advantage, international isolation", points: 8 },
        { text: "Selectively share with allies", impact: "Strengthened alliances, rival bloc formation", points: 14 },
        { text: "Commercialize for profit", impact: "Economic growth, technology proliferation", points: 11 }
      ]
    },
    {
      id: 3,
      title: "The Climate Refugee Crisis",
      year: 2035,
      context: "Rising sea levels force mass migration from island nations and coastal regions.",
      situation: "Your country faces pressure to accept climate refugees. What's your response?",
      choices: [
        { text: "Open borders with integration support", impact: "Humanitarian leadership, internal challenges", points: 16 },
        { text: "Strict border controls", impact: "Domestic stability, international criticism", points: 6 },
        { text: "Fund overseas resettlement", impact: "Diplomatic solution, high costs", points: 13 },
        { text: "Create temporary protected status", impact: "Balanced approach, ongoing uncertainty", points: 12 }
      ]
    },
    {
      id: 4,
      title: "The Space Race 2.0",
      year: 2038,
      context: "Asteroid mining becomes commercially viable. Nations compete for celestial resources.",
      situation: "How do you position your nation in the new space economy?",
      choices: [
        { text: "Massive space program investment", impact: "Technological leadership, economic risk", points: 15 },
        { text: "International space consortium", impact: "Shared costs and benefits, reduced control", points: 14 },
        { text: "Regulatory and legal framework", impact: "Soft power influence, slower development", points: 12 },
        { text: "Private sector partnerships", impact: "Innovation boost, less government control", points: 13 }
      ]
    },
    {
      id: 5,
      title: "The AI Governance Crisis",
      year: 2041,
      context: "Advanced AI systems begin making autonomous decisions affecting millions of lives.",
      situation: "How do you regulate AI while maintaining competitive advantage?",
      choices: [
        { text: "Strict international AI treaty", impact: "Global safety, innovation constraints", points: 17 },
        { text: "National AI sovereignty", impact: "Competitive advantage, safety risks", points: 9 },
        { text: "AI ethics board oversight", impact: "Balanced approach, slow adaptation", points: 13 },
        { text: "Market-driven regulation", impact: "Innovation freedom, accountability gaps", points: 10 }
      ]
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setPlayerChoices([]);
  };

  const makeChoice = (choiceIndex: number) => {
    const choice = scenarios[currentScenario].choices[choiceIndex];
    const newScore = score + choice.points;
    const newChoices = [...playerChoices, choiceIndex];
    
    setScore(newScore);
    setPlayerChoices(newChoices);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setGameState('results');
    }
  };

  const getScoreRating = (finalScore: number) => {
    if (finalScore >= 70) return { rating: 'Master Diplomat', color: 'text-green-400', description: 'Outstanding leadership that balances multiple global interests' };
    if (finalScore >= 55) return { rating: 'Skilled Strategist', color: 'text-blue-400', description: 'Good decision-making with minor missteps' };
    if (finalScore >= 40) return { rating: 'Competent Leader', color: 'text-yellow-400', description: 'Adequate leadership with room for improvement' };
    return { rating: 'Developing Diplomat', color: 'text-red-400', description: 'Significant challenges in global leadership' };
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentScenario(0);
    setScore(0);
    setPlayerChoices([]);
  };

  if (gameState === 'menu') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Strategic Geopolitics Game</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Gamepad2 className="h-4 w-4" />
            <span>Interactive Scenarios</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Target className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Future Scenarios Challenge</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Navigate complex geopolitical scenarios from 2028 to 2041. Make strategic decisions that will shape the future of international relations. Your choices will be evaluated based on their impact on global stability, economic growth, and diplomatic relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">5</div>
              <div className="text-sm text-gray-300">Scenarios</div>
            </div>
            <div className="p-4 bg-green-500/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">13</div>
              <div className="text-sm text-gray-300">Years Span</div>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">85</div>
              <div className="text-sm text-gray-300">Max Score</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Zap className="h-5 w-5" />
            <span>Start Game</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                <div>
                  <div className="text-sm font-medium text-white">Read the Scenario</div>
                  <div className="text-sm text-gray-400">Understand the context and situation</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                <div>
                  <div className="text-sm font-medium text-white">Analyze Options</div>
                  <div className="text-sm text-gray-400">Consider the implications of each choice</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                <div>
                  <div className="text-sm font-medium text-white">Make Decisions</div>
                  <div className="text-sm text-gray-400">Choose the best strategic option</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</div>
                <div>
                  <div className="text-sm font-medium text-white">See Results</div>
                  <div className="text-sm text-gray-400">Review your diplomatic performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const scenario = scenarios[currentScenario];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Strategic Geopolitics Game</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Scenario {currentScenario + 1} of {scenarios.length}
            </div>
            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-medium">{score} points</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{scenario.title}</h3>
            <span className="text-sm text-blue-400 font-medium">{scenario.year}</span>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-blue-400 mb-2">CONTEXT</div>
              <p className="text-sm text-gray-300">{scenario.context}</p>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-sm font-medium text-yellow-400 mb-2">SITUATION</div>
              <p className="text-sm text-gray-300">{scenario.situation}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-white mb-3">Choose your response:</div>
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => makeChoice(index)}
                className="w-full text-left p-4 bg-black/20 hover:bg-black/30 border border-white/20 hover:border-white/30 rounded-lg transition-all group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-600 group-hover:bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white transition-colors">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">{choice.text}</div>
                    <div className="text-xs text-gray-400">{choice.impact}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-sm text-gray-400">{currentScenario + 1}/{scenarios.length}</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const scoreRating = getScoreRating(score);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Game Results</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Award className="h-4 w-4" />
            <span>Performance Analysis</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4">
              <Award className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className={`text-2xl font-bold ${scoreRating.color} mb-2`}>{scoreRating.rating}</h3>
            <p className="text-gray-300 mb-4">{scoreRating.description}</p>
            <div className="text-4xl font-bold text-white mb-2">{score}</div>
            <div className="text-sm text-gray-400">out of 85 points</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-500/20 rounded-lg">
              <div className="text-lg font-bold text-green-400 mb-1">{Math.round((score / 85) * 100)}%</div>
              <div className="text-sm text-gray-300">Overall Score</div>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <div className="text-lg font-bold text-blue-400 mb-1">{scenarios.length}</div>
              <div className="text-sm text-gray-300">Scenarios Completed</div>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-lg">
              <div className="text-lg font-bold text-purple-400 mb-1">2041</div>
              <div className="text-sm text-gray-300">Final Year</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => setGameState('analysis')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
            >
              View Analysis
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Decision Summary</h3>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={scenario.id} className="p-4 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">{scenario.title}</div>
                  <div className="text-sm text-blue-400">{scenario.year}</div>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  Your choice: {scenario.choices[playerChoices[index]].text}
                </div>
                <div className="text-xs text-gray-400">
                  Impact: {scenario.choices[playerChoices[index]].impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FutureGame;