# Global PoliticsAI - Hackathon Edition

A comprehensive global politics analysis platform powered by AI, featuring real-time data feeds, interactive visualizations, and predictive analytics.

## 🚀 Features

### Core Functionality
- **Real-time News Analysis** - Live global politics news with AI-powered sentiment analysis
- **Conflict Tracker** - Global conflict monitoring with threat level assessments
- **Economic Dashboard** - Live economic indicators and market data
- **Interactive World Map** - Real-time conflict and event visualization
- **AI Analytics** - Advanced predictive analytics and trend analysis
- **Time Travel Predictions** - Future scenario modeling for countries
- **Strategic Game** - Interactive global political decision-making scenarios
- **AI Assistant** - Intelligent chatbot for global political insights

### Technical Features
- **Live Data Integration** - Multiple API sources for real-time updates
- **WebSocket Support** - Real-time data streaming
- **Responsive Design** - Mobile-first, production-ready interface
- **Advanced Analytics** - Machine learning-powered insights
- **Interactive Charts** - Dynamic data visualization
- **Search & Filtering** - Advanced content discovery

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js, React-ChartJS-2
- **Maps**: Leaflet, React-Leaflet
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.IO
- **Build Tool**: Vite

## 📊 Data Sources

- **News API** - Global news aggregation
- **World Bank API** - Economic indicators
- **REST Countries API** - Country information
- **Exchange Rates API** - Currency data
- **ACLED** - Conflict data (simulated)
- **Custom AI Models** - Sentiment analysis and predictions

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd global-politics-ai-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your API keys to .env file
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔑 API Keys Setup

### Required APIs
1. **News API** (newsapi.org)
   - Sign up for free API key
   - Add to `.env` as `VITE_NEWS_API_KEY`

### Optional APIs (for enhanced features)
- OpenAI API for advanced AI analysis
- Google Maps API for enhanced mapping
- Custom conflict data APIs

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── NewsAnalysis.tsx
│   ├── WarTracker.tsx
│   ├── EconomyDashboard.tsx
│   ├── RealTimeMap.tsx
│   ├── LiveDataFeed.tsx
│   ├── AdvancedAnalytics.tsx
│   ├── TimeTravel.tsx
│   ├── FutureGame.tsx
│   └── AIAssistant.tsx
├── services/            # API services
│   └── api.ts
├── hooks/              # Custom React hooks
│   └── useRealTimeData.ts
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🎯 Hackathon Features

### Real-time Capabilities
- Live news feed updates every 30 seconds
- Real-time conflict status monitoring
- Live economic indicator tracking
- WebSocket-based data streaming

### AI-Powered Analysis
- Sentiment analysis of news articles
- Risk assessment algorithms
- Predictive modeling for future scenarios
- Automated trend detection

### Interactive Elements
- Clickable world map with conflict markers
- Dynamic charts and graphs
- Search and filtering capabilities
- Real-time data feed sidebar

### Gamification
- Strategic decision-making game
- Scenario-based challenges
- Performance scoring system
- Future prediction accuracy tracking

## 📈 Performance Optimizations

- Lazy loading of components
- Efficient data caching
- Optimized API calls
- Responsive image loading
- Code splitting

## 🔒 Security Features

- API key protection
- CORS handling
- Input sanitization
- Error boundary implementation

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to platforms
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Submission

This project demonstrates:
- **Innovation**: AI-powered global political analysis
- **Technical Excellence**: Modern React architecture with real-time capabilities
- **User Experience**: Intuitive, responsive design
- **Scalability**: Modular architecture for easy expansion
- **Real-world Impact**: Practical tool for understanding global events

## 📞 Support

For questions or support, please open an issue or contact the development team.

---

Built with ❤️ for the hackathon community