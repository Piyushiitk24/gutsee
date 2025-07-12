# Setup Instructions for Gut Tracker

## Current Issues and Solutions

### 1. Database Setup
Your `health_entries` table is missing. Follow these steps:

1. **Go to your Supabase dashboard** at [supabase.com](https://supabase.com)
2. **Open the SQL Editor**
3. **Copy and paste** the contents of `create-health-entries-table.sql` into the SQL editor
4. **Run the SQL** to create the table

### 2. Environment Variables Check
Your `.env` file looks correct, but verify these values:

```bash
# These should match your Supabase project
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# This should be your Gemini API key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 3. Test the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the test page:**
   ```
   http://localhost:3000/test
   ```

3. **Login and run tests** to verify everything works

### 4. Features Available

Once setup is complete, your app includes:

#### Core Features:
- **Flexible Health Diary**: Log meals, symptoms, medications, mood, etc.
- **AI-Powered Analysis**: Gemini API analyzes entries for risk levels
- **Pattern Recognition**: Identifies correlations between food and symptoms
- **Real-time Insights**: Immediate feedback on food choices

#### Entry Types Available:
- 🍳 **Breakfast, Lunch, Dinner, Snacks**
- 🥤 **Drinks**
- 💊 **Medications**
- 🌿 **Supplements**
- 🚽 **Bowel movements**
- 💨 **Gas episodes**
- 😊 **Mood tracking**
- ⚠️ **Symptoms**
- ⚡ **Energy levels**
- 😴 **Sleep quality**
- 😰 **Stress levels**
- 🏃 **Exercise**
- 💧 **Irrigation**
- And more...

#### User-Friendly Features:
- **Natural Language Input**: "I had a bowl of rice with some vegetables"
- **Flexible Timing**: Set custom date/time for entries
- **AI Risk Assessment**: Automatic flagging of potentially problematic foods
- **Pattern Analysis**: Track correlations over time
- **Personalized Insights**: AI learns your specific triggers

### 5. How to Use

1. **Login** to your account
2. **Click "Log Something"** on the dashboard
3. **Choose entry type** (breakfast, symptoms, etc.)
4. **Describe naturally**: "I had scrambled eggs with toast"
5. **Set date/time** if different from now
6. **Save entry** and get AI analysis
7. **View analytics** to see patterns and insights

## 6. AI Analysis Features

The Gemini API provides:
- **Risk Assessment**: Low/Medium/High risk for gut patients
- **Gas Production Flags**: Identifies potentially gas-producing foods
- **Personalized Recommendations**: Based on your history
- **Symptom Correlation**: Links food to symptoms over time
- **Timing Advice**: Best times to eat certain foods

### 7. Troubleshooting

If you encounter issues:

1. **Check Database**: Ensure `health_entries` table exists
2. **Verify Environment**: All API keys are set correctly
3. **Test Connection**: Use `/test` page to verify all systems
4. **Check Console**: Look for error messages in browser console
5. **Restart Server**: After making changes, restart `npm run dev`

## Next Steps

1. **Complete the database setup** (most important)
2. **Test the application** using the test page
3. **Start logging entries** to build your health diary
4. **Review analytics** to understand patterns
5. **Use AI insights** to improve your diet and health

The app is designed to be extremely user-friendly and flexible, allowing you to track your health in natural language while providing AI-powered insights to help manage your gut effectively.
