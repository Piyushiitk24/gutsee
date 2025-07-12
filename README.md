# 🩺 Gut Tracker

A comprehensive health tracking application for gut health management, featuring intelligent food logging, AI-powered analysis, and professional medical insights.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-orange?style=flat-square&logo=google)](https://ai.google.dev/)

## 🌟 Key Features

- **🤖 AI-Powered Food Logging**: Advanced natural language processing for easy meal entry
- **🍽️ Professional Food Database**: Access to 3+ million foods via Open Food Facts API
- **📊 Health Analytics**: Comprehensive tracking of outputs, meals, and symptoms
- **🔍 Smart Correlations**: AI-driven insights into food-symptom relationships
- **📱 Modern UI**: Clean, responsive interface with real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account for database
- Google AI API key for intelligent features

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gut-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
gut-tracker/
├── docs/                          # Documentation files
│   ├── SETUP_INSTRUCTIONS.md     # Detailed setup guide
│   ├── GEMINI_AI_INTEGRATION.md  # AI integration details
│   ├── SUPABASE_SETUP.md         # Database setup
│   └── ...
├── sql/                          # Database schemas and migrations
│   ├── schema.sql               # Main database schema
│   ├── health_entries_migration.sql
│   └── ...
├── scripts/                     # Utility scripts
│   ├── check-database.js       # Database health check
│   └── setup-supabase.sh       # Supabase setup script
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── intelligent/       # AI-powered components
│   │   ├── dashboard/         # Dashboard components
│   │   └── ui/               # UI components
│   ├── lib/                   # Utility libraries
│   │   ├── supabase.ts       # Supabase client
│   │   ├── gemini.ts         # Google AI integration
│   │   └── hybridFoodService.ts # Food database service
│   ├── context/              # React contexts
│   └── types/                # TypeScript type definitions
└── public/                   # Static assets
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Optional: USDA Food Database
NEXT_PUBLIC_USDA_API_KEY=your_usda_api_key
```

### Database Setup

1. Create a Supabase project
2. Run the SQL migrations from the `sql/` directory
3. Configure authentication settings

See `docs/SUPABASE_SETUP.md` for detailed instructions.

## 🎯 Core Components

### Enhanced Smart Entry Logger
- **Location**: `src/components/intelligent/EnhancedSmartEntryLogger.tsx`
- **Features**: AI-powered food recognition, professional food database integration
- **Usage**: Primary food logging interface

### Hybrid Food Service
- **Location**: `src/lib/hybridFoodService.ts`  
- **Features**: Combines Open Food Facts API with gut-specific data
- **Coverage**: 3+ million foods with medical insights

### Dashboard Overview
- **Location**: `src/components/dashboard/DashboardOverview.tsx`
- **Features**: Real-time health metrics, trend analysis, quick actions

## 🧪 Testing

Access the test page at `http://localhost:3000/test` to:
- Test authentication flow
- Verify database connections
- Try AI-powered food logging
- Check API integrations

## 🔒 Authentication

The app uses Supabase Auth with support for:
- Google OAuth
- Email/password authentication  
- Session management
- Protected routes

## 🍽️ Food Database Integration

### Primary Sources
1. **Open Food Facts API** (3+ million foods)
2. **USDA FoodData Central** (600,000+ foods)
3. **Local curated database** (gut-specific foods)

### Features
- Real-time food search
- Complete ingredient lists
- Nutritional data
- Allergen information
- Barcode lookup
- Gut-specific safety ratings

## 📊 Analytics & Insights

- **Correlation Analysis**: Food-symptom relationships
- **Trend Tracking**: Long-term health patterns
- **AI Recommendations**: Personalized dietary suggestions
- **Export Options**: Data export for medical consultations

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db-check` - Database health check
- `npm run setup` - Install dependencies and verify setup

### Key Commands
```bash
# Database health check
node scripts/check-database.js

# Setup Supabase (if needed)
bash scripts/setup-supabase.sh
```

## 📚 Documentation

- **Setup Guide**: `docs/SETUP_INSTRUCTIONS.md`
- **AI Integration**: `docs/GEMINI_AI_INTEGRATION.md`
- **Database Setup**: `docs/SUPABASE_SETUP.md`
- **Food API Guide**: `docs/FOOD_API_SETUP.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

See `docs/CONTRIBUTING.md` for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation in the `docs/` directory
2. Run the database health check: `npm run db-check`
3. Verify your environment variables in `.env` are set correctly
4. Check the console for any error messages

## 🔮 Recent Updates

- ✅ Fixed authentication flow and entry logging
- ✅ Integrated professional food database (3M+ foods)
- ✅ Enhanced AI-powered food analysis
- ✅ Organized repository structure
- ✅ Comprehensive documentation

---

**Built with ❤️ for the gut health community**
