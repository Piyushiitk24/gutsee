# 🌟 Stoma Tracker

A comprehensive, AI-powered colostomy management application that helps users track food intake, monitor stoma output, and identify patterns through advanced analytics and intelligent insights.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-orange?style=flat-square&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Project Overview

This application addresses the challenge of managing a colostomy by providing systematic tracking and pattern recognition capabilities. The primary goal is to achieve predictable 24-hour output-free periods through data-driven insights and AI-powered recommendations.

## ✨ Key Features

### 🍽️ Smart Food Tracking
- **AI-Powered Analysis**: Ingredient breakdown using Google Gemini AI
- **Quick Logging**: Voice input and barcode scanning capabilities
- **Nutritional Intelligence**: Automatic categorization and risk assessment
- **Pattern Recognition**: Food trigger identification and safe combinations

### 📊 Advanced Output Monitoring
- **Comprehensive Tracking**: Volume, consistency, timing, and correlations
- **Gas Production Analysis**: Intensity, frequency, and trigger identification
- **Irrigation Quality**: Effectiveness monitoring and timing optimization
- **Predictive Analytics**: 24-hour success rate predictions

### 🤖 Intelligent Assistant
- **Personalized Insights**: AI-driven recommendations and meal planning
- **Risk Assessment**: Real-time meal risk scoring and warnings
- **Pattern Analysis**: Automated correlation detection and trend analysis
- **Goal Tracking**: Progress monitoring with visual dashboards

### 🎨 Modern User Experience
- **Glass Morphism Design**: Beautiful, modern interface with subtle animations
- **Mobile-First**: Responsive design optimized for smartphones
- **PWA Capabilities**: Offline functionality and app-like experience
- **Accessibility**: WCAG compliant with high contrast and screen reader support

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom component system
- **UI Components**: Headless UI with Lucide React icons
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization

### Backend & Database
- **Database**: PostgreSQL with Supabase (fully migrated from Prisma)
- **Authentication**: Supabase Auth with social login support
- **API**: Next.js API routes with TypeScript
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage for images and documents

### AI & Intelligence
- **AI Provider**: Google Gemini AI integration
- **Capabilities**: Food analysis, pattern recognition, meal recommendations
- **Data Processing**: Advanced correlation analysis and predictive modeling
- **Natural Language**: Intelligent query processing and insights generation

### Developer Experience
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with Zod validation
- **Error Handling**: Comprehensive error boundaries and logging
- **Testing**: Component and integration testing setup
- **Linting**: ESLint with Next.js configuration

## 📋 Documentation

- **[🤖 Intelligent Assistant Design](./INTELLIGENT_ASSISTANT_DESIGN.md)** - AI features and capabilities
- **[🧠 Gemini AI Integration](./GEMINI_AI_INTEGRATION.md)** - AI setup and configuration
- **[🗃️ Supabase Integration](./SUPABASE_INTEGRATION.md)** - Database and authentication setup
- **[📖 Supabase Setup Guide](./SUPABASE_SETUP.md)** - Step-by-step installation guide

## 📊 Data Models & Architecture

### Core Entities
- **Users**: Profile and health information with Supabase authentication
- **Foods**: Nutritional data with AI-powered ingredient breakdown
- **Meals**: Timestamped food consumption with portion tracking
- **Outputs**: Comprehensive stoma output monitoring with context
- **Gas Sessions**: Frequency and intensity tracking with correlations
- **Irrigations**: Quality and effectiveness monitoring
- **Symptoms**: Detailed correlation tracking with food triggers
- **AI Insights**: Machine-generated patterns and predictions

### Database Schema
The application uses PostgreSQL with Supabase, featuring:
- Row Level Security (RLS) for data privacy
- Real-time subscriptions for live updates
- Optimized indexes for fast queries
- Foreign key relationships for data integrity

## 🎯 Success Metrics

### Primary Objectives
- **24-Hour Success Rate**: Achieve output-free periods 70%+ of the time
- **Gas Reduction**: Decrease problematic episodes by 30% during target hours
- **Pattern Recognition**: Identify 10-15 safe meal combinations
- **Routine Establishment**: Consistent, predictable daily management

### Key Performance Indicators
- **Prediction Accuracy**: AI correlation vs. actual outcome success rate
- **User Engagement**: Daily logging compliance and feature adoption
- **Health Outcomes**: Improvement in quality of life metrics
- **App Performance**: Response times and offline capability effectiveness

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier available)
- Google AI Studio API key for Gemini integration

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/stoma-tracker.git
cd stoma-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase and Gemini AI credentials
```

4. **Set up Supabase database**
```bash
# Run the setup script or follow SUPABASE_SETUP.md
./setup-supabase.sh
```

5. **Initialize the database schema**
```bash
# Upload schema.sql to your Supabase SQL editor
# Or use the provided setup script
```

6. **Run the development server**
```bash
npm run dev
```

7. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Daily Workflow
1. **Morning Setup**: Log irrigation quality and set 24-hour goals
2. **Meal Logging**: Quick food entry with AI-powered analysis
3. **Continuous Monitoring**: Track gas levels and output events
4. **Evening Review**: Analyze patterns and plan next day's meals
5. **AI Insights**: Review intelligent recommendations and predictions

### Key Features Access
- **📊 Dashboard**: Real-time progress tracking and comprehensive statistics
- **⚡ Quick Actions**: One-tap logging for common activities and foods
- **🧠 AI Assistant**: Intelligent meal planning and risk assessment
- **📈 Analytics**: Advanced pattern recognition and trend analysis
- **🎯 Goals**: Personalized targets and achievement tracking

## 🔧 Development

### Project Structure
```
stoma-tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Main application dashboard
│   │   ├── api/               # API routes for data operations
│   │   └── auth/              # Authentication pages
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── intelligent/       # AI-powered components
│   │   └── dashboard/         # Dashboard-specific components
│   ├── lib/                   # Core utilities and configurations
│   │   ├── supabase.ts        # Supabase client setup
│   │   ├── gemini.ts          # Gemini AI integration
│   │   └── database.ts        # Database operations
│   ├── context/               # React context providers
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── public/                    # Static assets
├── docs/                      # Documentation files
└── scripts/                   # Setup and deployment scripts
```

### Available Scripts
```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build optimized production bundle
npm run start       # Start production server
npm run lint        # Run ESLint with Next.js configuration
npm run type-check  # Run TypeScript type checking
```

### Database Operations
```bash
# Supabase CLI commands (if installed)
supabase start      # Start local Supabase instance
supabase db reset   # Reset database with fresh schema
supabase gen types  # Generate TypeScript types

# Direct SQL operations via Supabase dashboard
# Use schema.sql for initial setup
# Use supabase-schema.sql for complete reference
```

## 🔧 Configuration

### Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini AI Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deployment Options
- **Vercel**: Optimized for Next.js with automatic deployments
- **Netlify**: Static site generation with serverless functions
- **Railway**: Full-stack deployment with database hosting
- **Self-hosted**: Docker container with environment configuration

## �️ Implementation Roadmap

### ✅ Phase 1: Foundation (Completed)
- Core tracking system with comprehensive data models
- Supabase integration with authentication and RLS
- Modern UI framework with glass morphism design
- Basic dashboard with real-time updates

### ✅ Phase 2: Intelligence (Completed)
- Google Gemini AI integration for food analysis
- Intelligent assistant with natural language processing
- Advanced pattern recognition algorithms
- Predictive analytics and meal risk scoring

### 🔄 Phase 3: Optimization (In Progress)
- Enhanced meal recommendation engine
- Advanced correlation analysis
- Social features and community insights
- Export capabilities and data portability

### 🔮 Phase 4: Advanced Features (Planned)
- Machine learning model optimization
- Healthcare provider integration
- Wearable device connectivity
- Advanced analytics and reporting

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started
1. **Fork the repository** and create your feature branch
2. **Set up the development environment** following the Quick Start guide
3. **Read the documentation** to understand the architecture
4. **Check existing issues** or create a new one for discussion

### Development Process
```bash
# 1. Create a feature branch
git checkout -b feature/amazing-feature

# 2. Make your changes with proper testing
npm run dev
npm run lint
npm run type-check

# 3. Commit with conventional commit messages
git commit -m 'feat: add amazing feature'

# 4. Push and create a Pull Request
git push origin feature/amazing-feature
```

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the project's linting rules
- **Prettier**: Code formatting consistency
- **Testing**: Include tests for new features
- **Documentation**: Update relevant documentation

### Areas for Contribution
- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Enhance existing functionality
- 📚 **Documentation**: Improve guides and examples
- 🎨 **UI/UX**: Design improvements and accessibility
- 🧪 **Testing**: Add test coverage
- 🌐 **Internationalization**: Multi-language support

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Permissions
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

### Limitations
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

### Technologies
- **[Next.js](https://nextjs.org/)** - React framework for production
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[Google Gemini AI](https://ai.google.dev/)** - Advanced AI capabilities
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience

### Community
- Built with ❤️ for the colostomy management community
- Designed with accessibility and user experience in mind
- Focused on practical, real-world healthcare needs
- Open source to enable collaboration and improvement

## 📞 Support & Resources

### Getting Help
- 📖 **Documentation**: Check the `/docs` folder and linked guides
- 🐛 **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- 💡 **Feature Requests**: Create an issue with the `enhancement` label
- 💬 **Questions**: Start a GitHub Discussion for general questions

### Useful Links
- [📋 Project Board](https://github.com/your-username/stoma-tracker/projects) - Development progress
- [🔄 Changelog](https://github.com/your-username/stoma-tracker/releases) - Version history
- [🏗️ Architecture Decisions](./docs/architecture/) - Technical decisions and rationale
- [🎨 Design System](./docs/design/) - UI/UX guidelines and components

### Medical Disclaimer
⚠️ **Important**: This application is designed to assist with colostomy management but should **not replace professional medical advice**. Always consult with healthcare providers for medical decisions and treatment plans.

---

<div align="center">

**Stoma Tracker** - Empowering colostomy management through technology

[![GitHub stars](https://img.shields.io/github/stars/your-username/stoma-tracker?style=social)](https://github.com/your-username/stoma-tracker/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/stoma-tracker?style=social)](https://github.com/your-username/stoma-tracker/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-username/stoma-tracker)](https://github.com/your-username/stoma-tracker/issues)

Made with ❤️ for better health outcomes

</div>
