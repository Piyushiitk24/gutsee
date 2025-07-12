# Food Database APIs Setup Guide

This guide will help you set up professional food database APIs to replace the manual foodDatabase.ts file with comprehensive, maintained food databases.

## 🎯 Recommended Setup (All Free)

### 1. Open Food Facts (FREE - Recommended)
- **Database Size**: 3+ million products worldwide
- **Indian Food Coverage**: Excellent
- **Features**: Ingredients, allergens, nutrition, barcodes, images
- **Setup**: No API key required!

```bash
# No setup needed - works out of the box
```

### 2. USDA FoodData Central (FREE - Government Data)
- **Database Size**: 600,000+ foods
- **Features**: Research-grade nutritional data
- **Setup**: Get free API key from data.gov

```bash
# 1. Visit: https://fdc.nal.usda.gov/api-key-signup
# 2. Sign up for free API key
# 3. Add to your .env file:
NEXT_PUBLIC_USDA_API_KEY=your_usda_api_key_here
```

### 3. Local Database (Your existing curated foods)
- **Features**: Quick access to common Indian foods
- **Setup**: Already configured

## 🚀 Optional Premium APIs

### Spoonacular (PREMIUM - $0-999/month)
- **Database Size**: 600K+ products + 5K+ recipes
- **Features**: Advanced food ontology, allergen detection
- **Free Tier**: 150 calls/day

```bash
# 1. Visit: https://spoonacular.com/food-api
# 2. Sign up for free or paid plan
# 3. Add to your .env file:
NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_key_here
```

## 📱 Implementation

### Replace your current food search with the new API service:

```typescript
// OLD: Manual database search
import { searchFoodItems } from '../data/foodDatabase';

// NEW: Professional API search
import { foodSearchService } from '../lib/foodAPIs';

// Search multiple databases at once
const { combined } = await foodSearchService.searchFood('paneer butter masala', {
  sources: ['openfoodfacts', 'usda', 'local'],
  limit: 20
});
```

### Use the new component:

```tsx
import FoodAPILogger from '../components/intelligent/FoodAPILogger';

function MyApp() {
  return (
    <FoodAPILogger 
      onEntryCreated={(entry) => {
        console.log('New entry:', entry);
        // Save to your database
      }}
    />
  );
}
```

## 🌟 Benefits Over Manual Database

### Data Quality
- ✅ **3+ million foods** vs 50 manual entries
- ✅ **Professional maintenance** vs manual updates
- ✅ **Accurate nutrition data** vs estimated values
- ✅ **Real ingredient lists** vs simplified lists
- ✅ **Verified allergen info** vs manual tagging

### Indian Food Coverage
- ✅ **Extensive Indian brands**: Amul, Britannia, Parle, MTR, etc.
- ✅ **Regional dishes**: Authentic recipes and preparations
- ✅ **Ingredient breakdowns**: Complete ingredient analysis
- ✅ **Local products**: Products sold in Indian markets

### Maintenance
- ✅ **Zero maintenance** for you
- ✅ **Daily updates** from community
- ✅ **Quality validation** by experts
- ✅ **Barcode lookup** for packaged foods

## 🔄 Migration Strategy

### Phase 1: Add API Integration (Immediate)
```bash
# Copy the new files to your project
cp foodAPIs.ts src/lib/
cp FoodAPILogger.tsx src/components/intelligent/
```

### Phase 2: Update Environment (5 minutes)
```bash
# Add free API keys to .env
echo "NEXT_PUBLIC_USDA_API_KEY=DEMO_KEY" >> .env
# Get real key from: https://fdc.nal.usda.gov/api-key-signup
```

### Phase 3: Replace Manual Database (Gradual)
```typescript
// Keep your existing foodDatabase.ts as fallback
// The new system uses it automatically for local searches
// Gradually remove manual entries as API coverage improves
```

### Phase 4: Monitor and Optimize
- Track API response times
- Monitor data quality
- Add caching for better performance
- Consider premium APIs if needed

## 🎯 Why This Approach is Perfect for Stoma Tracker

### Medical Accuracy
- **Precise ingredient lists**: Critical for identifying triggers
- **Allergen information**: Essential for safety
- **Nutritional accuracy**: Important for health monitoring
- **Processing levels**: Helps identify problematic foods

### User Experience  
- **Real-time search**: Instant results as user types
- **Multiple sources**: Finds foods even with partial names
- **Barcode scanning**: Quick logging of packaged foods
- **Image support**: Visual confirmation of foods

### Scalability
- **No database size limits**: Grows with user needs
- **Global food coverage**: Works for international users
- **Future-proof**: APIs continuously improve
- **Cost-effective**: Free tiers cover most usage

## 🔧 Quick Start Commands

```bash
# 1. Install the new API service
cp foodAPIs.ts src/lib/

# 2. Try the new component
cp FoodAPILogger.tsx src/components/intelligent/

# 3. Get USDA API key (free)
# Visit: https://fdc.nal.usda.gov/api-key-signup

# 4. Add to your test page
# Import and use FoodAPILogger instead of manual search

# 5. Test with real foods
# Search for: "paneer butter masala", "quinoa salad", "chai"
```

You'll immediately see the difference in food coverage and data quality! 🚀
