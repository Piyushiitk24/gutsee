# Stoma Tracker - Supabase Setup Guide

This guide will help you set up Supabase for the Stoma Tracker application.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "stoma-tracker")
5. Enter a database password (save this securely)
6. Choose your region
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (from Project URL section)
   - **anon public** key (from Project API keys section)
   - **service_role** key (from Project API keys section - keep this secret!)

## Step 3: Configure Environment Variables

1. In your project root, update the `.env` file with your Supabase credentials:

```env
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `database/schema.sql` from this project
3. Paste it into a new query in the SQL Editor
4. Run the query to create all tables, policies, and functions

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under "Site URL", add your development URL: `http://localhost:3000`
3. Under "Redirect URLs", add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Configure your preferred authentication providers (Email is enabled by default)

## Step 6: Test the Setup

1. Run your Next.js application:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Try signing up for a new account
4. Check your Supabase dashboard to see if the user was created
5. Check the profiles table to ensure the trigger created a profile

## Features Included

### Authentication
- Email/password authentication
- User registration and login
- Password reset functionality
- Protected routes with middleware

### Database Schema
- **profiles**: User profile information
- **food_items**: Catalog of food items with risk levels
- **meals**: User meal records
- **meal_items**: Food items in each meal
- **stoma_output**: Stoma output tracking
- **gas_output**: Gas production tracking
- **irrigation_records**: Irrigation session records
- **symptoms**: Symptom tracking
- **user_preferences**: User settings and preferences

### Security
- Row Level Security (RLS) enabled on all user tables
- Users can only access their own data
- Automatic profile creation on user signup
- Secure API endpoints with authentication

## Database Functions

The application includes helper functions in `src/lib/database.ts` for:
- Profile management
- Meal tracking
- Stoma and gas output recording
- Food item search
- Dashboard statistics
- User preferences

## Troubleshooting

### Common Issues

1. **Environment variables not working**: Make sure to restart your Next.js dev server after updating `.env`

2. **Database connection errors**: Verify your Supabase URL and keys are correct

3. **Authentication not working**: Check that your Site URL and Redirect URLs are configured correctly in Supabase

4. **RLS policies blocking access**: Ensure the user is properly authenticated and the policies are set up correctly

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## Next Steps

Once you have Supabase set up:

1. Customize the database schema as needed
2. Add more food items to the food_items table
3. Implement additional features like data visualization
4. Set up email templates for authentication
5. Configure production environment variables for deployment

## Production Deployment

For production deployment:

1. Update your Supabase project settings with your production domain
2. Add production redirect URLs
3. Update environment variables in your deployment platform
4. Consider upgrading to Supabase Pro for production workloads
