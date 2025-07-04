# Supabase Integration Guide for Stoma Tracker

This guide will help you integrate Supabase authentication and database into your Stoma Tracker project.

## 🚀 Quick Start

### 1. Environment Setup

First, make sure you have the following environment variables in your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Copy your project URL and keys** from the project settings
3. **Run the database schema**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase-schema.sql` into the editor
   - Click "Run" to create all tables, types, and policies

### 3. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and test the authentication flow.

## 📋 What's Included

### Authentication
- ✅ Sign up / Sign in / Sign out
- ✅ Password reset functionality
- ✅ Protected routes with middleware
- ✅ User context throughout the app

### Database Schema
- ✅ Users table with health profile data
- ✅ Foods table with nutritional information
- ✅ Meals table with meal logging
- ✅ Stoma outputs tracking
- ✅ Gas sessions monitoring
- ✅ Irrigation quality tracking
- ✅ Ingredients database
- ✅ Row Level Security (RLS) policies

### API Routes
- ✅ `/api/dashboard/stats` - Dashboard statistics
- ✅ `/api/dashboard/activity` - Recent activity
- ✅ `/api/meals` - Meal CRUD operations
- ✅ `/api/outputs` - Stoma output tracking
- ✅ `/api/gas` - Gas session logging
- ✅ `/api/irrigations` - Irrigation tracking

### Features
- ✅ Real-time dashboard with statistics
- ✅ Beautiful glass morphism UI
- ✅ Responsive design
- ✅ Type-safe database operations
- ✅ Automatic user creation on signup

## 🛠️ Technical Details

### Database Service
The `DatabaseService` class in `src/lib/database.ts` provides:
- Type-safe database operations
- Error handling
- Consistent API across all data types
- Analytics and dashboard statistics

### Authentication Context
The `AuthContext` in `src/context/AuthContext.tsx` provides:
- User state management
- Sign in/up/out functions
- Session management
- Loading states

### Middleware
The `middleware.ts` file handles:
- Route protection
- Authentication redirects
- Session refresh
- Cookie management

## 🔄 Migration from Prisma

If you're migrating from Prisma:

1. **Export existing data** (if any):
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

2. **Run the Supabase schema** (as described above)

3. **Import data** to Supabase tables using the dashboard or SQL commands

4. **Update environment variables** to use Supabase

5. **Remove Prisma files** after testing:
   ```bash
   rm -rf prisma/
   npm uninstall prisma @prisma/client
   ```

## 🧪 Testing

### Test Authentication
1. Visit `/auth/signup` to create an account
2. Check your email for confirmation (if email confirmation is enabled)
3. Sign in at `/auth/login`
4. Visit `/dashboard` to see your dashboard

### Test Data Operations
1. Use the API routes to test CRUD operations
2. Check the Supabase dashboard to verify data is being stored
3. Test the dashboard statistics and recent activity

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Make sure all Supabase environment variables are properly set
   - Restart your development server after adding environment variables

2. **Database Schema Not Applied**
   - Verify that the SQL from `supabase-schema.sql` has been run
   - Check the Supabase dashboard for tables and policies

3. **Authentication Errors**
   - Check that your Supabase project URL and keys are correct
   - Verify that authentication is enabled in your Supabase project

4. **RLS Policy Issues**
   - Ensure Row Level Security policies are properly configured
   - Check that users can only access their own data

### Debug Steps

1. **Check Console Logs**
   - Look for error messages in the browser console
   - Check the Next.js server logs

2. **Verify Database Connection**
   - Test API routes directly using tools like Postman
   - Check the Supabase dashboard for connection status

3. **Test Authentication Flow**
   - Try signing up with a new account
   - Test sign in/out functionality
   - Verify protected routes are working

## 📈 Performance Considerations

- Database queries are optimized with proper indexes
- API routes include pagination and limits
- Row Level Security ensures data isolation
- Efficient caching strategies for static data

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- Authentication middleware for protected routes
- Secure cookie handling for sessions
- Input validation and sanitization
- HTTPS enforcement in production

## 🌟 Future Enhancements

- Real-time subscriptions for live updates
- Advanced analytics and pattern recognition
- Data export functionality
- Enhanced search and filtering
- Mobile app integration

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the project's GitHub issues
4. Contact the development team
