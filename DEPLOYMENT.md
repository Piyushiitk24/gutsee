# 🚀 GutSee Deployment Guide

This guide walks you through deploying GutSee to Vercel and configuring all necessary services.

## 📋 Prerequisites

Before starting, ensure you have:
- A Vercel account
- A Supabase account 
- A Google Cloud Platform account (for OAuth and AI)
- Git repository access

## 🔧 Setup Steps

### 1. Database Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for the database to initialize

2. **Run Database Setup**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the contents of `database_setup.sql`
   - This creates the `health_entries` table with proper RLS policies

### 2. Google Services Configuration

1. **Enable Google AI API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable the Generative AI API
   - Create an API key

2. **Setup Google OAuth**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Set authorized origins and redirect URIs (add your Vercel domain later)

### 3. Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your Git repository
   - Select the project

2. **Configure Environment Variables**
   
   Add these environment variables in Vercel:

   #### Supabase Configuration
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

   #### Google AI Configuration
   ```
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   GEMINI_API_KEY=your_google_ai_api_key_here
   ```

   #### OAuth Configuration
   ```
   GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id_here
   GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret_here
   ```

3. **Deploy**
   - Vercel will automatically deploy from your main branch
   - Build should complete successfully

## 🔧 Post-Deployment Configuration

### 1. Update Supabase OAuth URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update "Site URL" to your Vercel deployment URL
3. Add your Vercel URL to "Redirect URLs"

### 2. Update Google OAuth URLs
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel domain to "Authorized JavaScript origins"
4. Add your Vercel callback URL to "Authorized redirect URIs"

### 3. Test Authentication
- Visit your deployed site
- Test Google OAuth login
- Verify database entries are being created

## 🎯 Key Features

- **AI-Powered Food Analysis**: Gemini AI categorizes meals and provides insights
- **Smart Entry Logging**: Multi-modal input with image analysis
- **Real-time Health Tracking**: Instant dashboard updates
- **Secure Authentication**: Google OAuth with Supabase
- **Responsive Design**: Works on all devices

## 🔍 Troubleshooting

### Database Issues
- Ensure `health_entries` table exists and has proper RLS policies
- Check Supabase logs for authentication errors

### Authentication Issues
- Verify OAuth redirect URLs match your deployment domain
- Check browser console for CORS errors

### AI Analysis Issues
- Confirm Google AI API is enabled and API key is valid
- Check API quota limits

## 📱 Features Overview

GutSee provides:
- Intelligent meal logging with AI categorization
- Stoma output tracking and pattern analysis
- Symptom monitoring with correlation insights
- Irrigation scheduling and reminders
- Comprehensive health analytics dashboard

## 🔐 Security

- All credentials are stored as environment variables
- Database access is controlled by Row Level Security (RLS)
- OAuth provides secure authentication
- API keys are server-side only

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test each service independently
4. Check browser console for client-side errors

---

**Note**: Replace all placeholder values with your actual credentials. Never commit actual credentials to version control.
