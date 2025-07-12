#!/bin/bash

# Supabase Integration Setup Script for Stoma Tracker
# This script helps set up the Supabase database and configuration

echo "🚀 Setting up Supabase for Stoma Tracker"
echo "========================================"

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set"
  echo "Please add your Supabase URL to .env file:"
  echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
  echo "Please add your Supabase anon key to .env file:"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set"
  echo "Please add your Supabase service role key to .env file:"
  echo "SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key"
  exit 1
fi

echo "✅ Environment variables configured"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI is not installed"
  echo "Please install it with: npm install -g supabase"
  echo "Or visit: https://supabase.com/docs/guides/cli"
  exit 1
fi

echo "✅ Supabase CLI is installed"

# Initialize Supabase if not already done
if [ ! -f "supabase/config.toml" ]; then
  echo "🔧 Initializing Supabase project..."
  supabase init
fi

# Instructions for manual setup
echo ""
echo "📋 Manual Setup Instructions:"
echo "=============================="
echo ""
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to the SQL Editor"
echo "3. Copy and paste the contents of 'supabase-schema.sql' into the editor"
echo "4. Run the SQL to create tables, types, and policies"
echo ""
echo "Or run this command to apply the schema:"
echo "supabase db push"
echo ""
echo "5. Verify the tables are created in the Table Editor"
echo "6. Test authentication by running the app: npm run dev"
echo ""

echo "🎯 Next Steps:"
echo "=============="
echo "1. Run the schema: Execute the SQL in supabase-schema.sql"
echo "2. Start the app: npm run dev"
echo "3. Test authentication: Visit /auth/signup to create an account"
echo "4. Test the dashboard: Navigate to /dashboard"
echo ""

echo "📁 Important Files:"
echo "==================="
echo "- supabase-schema.sql: Database schema to run in Supabase"
echo "- src/lib/supabase.ts: Supabase client configuration"
echo "- src/lib/database.ts: Database service functions"
echo "- middleware.ts: Authentication middleware"
echo "- src/context/AuthContext.tsx: Authentication context"
echo ""

echo "🔧 Database Migration from Prisma:"
echo "=================================="
echo "1. Export existing Prisma data (if any)"
echo "2. Run the Supabase schema"
echo "3. Import data to Supabase tables"
echo "4. Update environment variables"
echo "5. Remove Prisma files after testing"
echo ""

echo "✅ Setup complete! Follow the manual steps above to finish the integration."
