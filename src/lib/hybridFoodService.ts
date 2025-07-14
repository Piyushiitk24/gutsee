/**
 * Hybrid Food Database System
 * Combines Open Food Facts API with specialized gut-tracking data
 */

export interface BaseFoodData {
  id: string;
  name: string;
  brand?: string;
  ingredients: string[];
  allergens: string[];
  nutrition: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  categories: string[];
  barcode?: string;
  image?: string;
  source: 'openfoodfacts' | 'usda' | 'local';
}

export interface GutSpecificData {
  fodmapLevel: 'low' | 'medium' | 'high';
  fiberContent: 'low' | 'medium' | 'high';
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot';
  processingLevel: 'whole' | 'minimally-processed' | 'processed' | 'ultra-processed';
  commonTriggers: string[];
  gutFriendliness: 'excellent' | 'good' | 'moderate' | 'caution' | 'avoid';
  digestibilityScore: number; // 1-10 scale
  gasProduction: 'low' | 'medium' | 'high';
  irrigationImpact: 'none' | 'slight' | 'moderate' | 'significant';
  recommendedPortionSize?: string;
  preparationTips?: string[];
  alternativeSuggestions?: string[];
}

export interface EnhancedFoodItem extends BaseFoodData {
  gutData?: GutSpecificData;
  userExperiences?: {
    avgRating: number;
    totalReviews: number;
    commonEffects: string[];
  };
  lastUpdated: Date;
}

// Open Food Facts API Service
class OpenFoodFactsService {
  private baseUrl = 'https://world.openfoodfacts.org/api/v2';

  async searchProducts(query: string, limit = 20): Promise<BaseFoodData[]> {
    try {
      const url = `${this.baseUrl}/search?search_terms=${encodeURIComponent(query)}&page_size=${limit}&fields=product_name,brands,ingredients_text,allergens,nutriments,categories,code,image_url`;
      
      const response = await fetch(url);
      const data = await response.json();

      return data.products?.map((product: any) => ({
        id: product.code || `off_${Date.now()}_${Math.random()}`,
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        ingredients: this.parseIngredients(product.ingredients_text),
        allergens: this.parseAllergens(product.allergens),
        nutrition: {
          calories: product.nutriments?.['energy-kcal_100g'],
          protein: product.nutriments?.['proteins_100g'],
          carbs: product.nutriments?.['carbohydrates_100g'],
          fat: product.nutriments?.['fat_100g'],
          fiber: product.nutriments?.['fiber_100g'],
          sugar: product.nutriments?.['sugars_100g'],
          sodium: product.nutriments?.['sodium_100g'],
        },
        categories: product.categories?.split(',').map((c: string) => c.trim()) || [],
        source: 'openfoodfacts' as const,
        barcode: product.code,
        image: product.image_url,
      })) || [];
    } catch (error) {
      console.error('Open Food Facts API error:', error);
      return [];
    }
  }

  async getProductByBarcode(barcode: string): Promise<BaseFoodData | null> {
    try {
      const url = `${this.baseUrl}/product/${barcode}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        return {
          id: product.code,
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          ingredients: this.parseIngredients(product.ingredients_text),
          allergens: this.parseAllergens(product.allergens),
          nutrition: {
            calories: product.nutriments?.['energy-kcal_100g'],
            protein: product.nutriments?.['proteins_100g'],
            carbs: product.nutriments?.['carbohydrates_100g'],
            fat: product.nutriments?.['fat_100g'],
            fiber: product.nutriments?.['fiber_100g'],
            sugar: product.nutriments?.['sugars_100g'],
            sodium: product.nutriments?.['sodium_100g'],
          },
          categories: product.categories?.split(',').map((c: string) => c.trim()) || [],
          source: 'openfoodfacts',
          barcode: product.code,
          image: product.image_url,
        };
      }
    } catch (error) {
      console.error('Barcode lookup error:', error);
    }
    
    return null;
  }

  private parseIngredients(ingredientsText: string): string[] {
    if (!ingredientsText) return [];
    return ingredientsText
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
  }

  private parseAllergens(allergensText: string): string[] {
    if (!allergensText) return [];
    return allergensText
      .split(',')
      .map(allergen => allergen.replace('en:', '').trim())
      .filter(allergen => allergen.length > 0);
  }
}

// Specialized Gut Data Service
class GutDataService {
  private supabase: any; // Initialize with your Supabase client

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  // Get stoma-specific data for a food item
  async getGutData(foodId: string, foodName: string): Promise<GutSpecificData | null> {
    try {
      // First, try to get from Supabase database
      const { data: gutData, error } = await this.supabase
        .from('stoma_food_data')
        .select('*')
        .or(`food_id.eq.${foodId},food_name.ilike.%${foodName}%`)
        .single();

      if (gutData && !error) {
        return gutData;
      }

      // Fallback to local curated data
      return this.getLocalGutData(foodName);
    } catch (error) {
      console.error('Error fetching gut data:', error);
      return this.getLocalGutData(foodName);
    }
  }

  // Local curated stoma data for common foods
  private getLocalGutData(foodName: string): GutSpecificData | null {
    const localGutDatabase: { [key: string]: GutSpecificData } = {
      // High-fiber foods (generally require caution)
      'brown rice': {
        fodmapLevel: 'low',
        fiberContent: 'high',
        spiceLevel: 'none',
        processingLevel: 'minimally-processed',
        commonTriggers: ['high fiber'],
        gutFriendliness: 'moderate',
        digestibilityScore: 6,
        gasProduction: 'medium',
        irrigationImpact: 'moderate',
        recommendedPortionSize: '1/2 cup cooked',
        preparationTips: ['Cook until very soft', 'Chew thoroughly'],
        alternativeSuggestions: ['white rice', 'quinoa']
      },

      // Dairy products (lactose considerations)
      'milk': {
        fodmapLevel: 'high',
        fiberContent: 'low',
        spiceLevel: 'none',
        processingLevel: 'minimally-processed',
        commonTriggers: ['lactose'],
        gutFriendliness: 'caution',
        digestibilityScore: 5,
        gasProduction: 'high',
        irrigationImpact: 'moderate',
        recommendedPortionSize: '1/2 cup',
        preparationTips: ['Try lactose-free alternatives'],
        alternativeSuggestions: ['almond milk', 'oat milk', 'lactose-free milk']
      },

      // Spicy foods
      'chili': {
        fodmapLevel: 'low',
        fiberContent: 'medium',
        spiceLevel: 'hot',
        processingLevel: 'whole',
        commonTriggers: ['capsaicin', 'spice'],
        gutFriendliness: 'avoid',
        digestibilityScore: 3,
        gasProduction: 'low',
        irrigationImpact: 'significant',
        recommendedPortionSize: 'very small amounts only',
        preparationTips: ['Remove seeds', 'Use sparingly'],
        alternativeSuggestions: ['bell pepper', 'mild paprika']
      },

      // Stoma-friendly proteins
      'chicken breast': {
        fodmapLevel: 'low',
        fiberContent: 'low',
        spiceLevel: 'none',
        processingLevel: 'minimally-processed',
        commonTriggers: [],
        gutFriendliness: 'excellent',
        digestibilityScore: 9,
        gasProduction: 'low',
        irrigationImpact: 'none',
        recommendedPortionSize: '100-150g',
        preparationTips: ['Cook thoroughly', 'Remove skin', 'Cut into small pieces'],
        alternativeSuggestions: ['fish', 'tofu', 'eggs']
      },

      // Easy carbohydrates
      'white rice': {
        fodmapLevel: 'low',
        fiberContent: 'low',
        spiceLevel: 'none',
        processingLevel: 'processed',
        commonTriggers: [],
        gutFriendliness: 'excellent',
        digestibilityScore: 9,
        gasProduction: 'low',
        irrigationImpact: 'none',
        recommendedPortionSize: '3/4 cup cooked',
        preparationTips: ['Cook until soft', 'Can eat regularly'],
        alternativeSuggestions: ['pasta', 'bread', 'potatoes']
      },

      // Problematic vegetables
      'cabbage': {
        fodmapLevel: 'low',
        fiberContent: 'high',
        spiceLevel: 'none',
        processingLevel: 'whole',
        commonTriggers: ['sulfur compounds', 'high fiber'],
        gutFriendliness: 'avoid',
        digestibilityScore: 4,
        gasProduction: 'high',
        irrigationImpact: 'moderate',
        recommendedPortionSize: 'avoid or very small amounts',
        preparationTips: ['Cook thoroughly if consuming', 'Start with tiny amounts'],
        alternativeSuggestions: ['lettuce', 'spinach', 'cucumber']
      },

      // Indian staples
      'chapati': {
        fodmapLevel: 'medium',
        fiberContent: 'medium',
        spiceLevel: 'none',
        processingLevel: 'minimally-processed',
        commonTriggers: ['gluten', 'fiber'],
        gutFriendliness: 'good',
        digestibilityScore: 7,
        gasProduction: 'medium',
        irrigationImpact: 'slight',
        recommendedPortionSize: '1 small chapati',
        preparationTips: ['Make thin', 'Chew well'],
        alternativeSuggestions: ['white bread', 'rice', 'idli']
      },

      'dal': {
        fodmapLevel: 'medium',
        fiberContent: 'high',
        spiceLevel: 'mild',
        processingLevel: 'minimally-processed',
        commonTriggers: ['oligosaccharides', 'fiber'],
        gutFriendliness: 'moderate',
        digestibilityScore: 6,
        gasProduction: 'high',
        irrigationImpact: 'moderate',
        recommendedPortionSize: '1/4 cup',
        preparationTips: ['Cook until very soft', 'Remove skin if possible', 'Start with small amounts'],
        alternativeSuggestions: ['chicken broth', 'fish', 'tofu']
      }
    };

    // Fuzzy matching for food names
    const normalizedName = foodName.toLowerCase().trim();
    
    // Direct match
    if (localGutDatabase[normalizedName]) {
      return localGutDatabase[normalizedName];
    }

    // Partial matching
    for (const [key, value] of Object.entries(localGutDatabase)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return value;
      }
    }

    // Category-based inference for unknown foods
    return this.inferGutData(foodName);
  }

  // Intelligent inference for unknown foods based on categories/ingredients
  private inferGutData(foodName: string): GutSpecificData {
    const name = foodName.toLowerCase();
    
    // Spicy food patterns
    if (name.includes('spicy') || name.includes('hot') || name.includes('chili') || name.includes('pepper')) {
      return {
        fodmapLevel: 'medium',
        fiberContent: 'medium',
        spiceLevel: 'hot',
        processingLevel: 'minimally-processed',
        commonTriggers: ['spice', 'capsaicin'],
        gutFriendliness: 'caution',
        digestibilityScore: 4,
        gasProduction: 'medium',
        irrigationImpact: 'moderate',
        recommendedPortionSize: 'small amounts',
        preparationTips: ['Use sparingly', 'Build tolerance gradually']
      };
    }

    // High-fiber patterns
    if (name.includes('whole') || name.includes('bran') || name.includes('fiber')) {
      return {
        fodmapLevel: 'medium',
        fiberContent: 'high',
        spiceLevel: 'none',
        processingLevel: 'minimally-processed',
        commonTriggers: ['high fiber'],
        gutFriendliness: 'moderate',
        digestibilityScore: 5,
        gasProduction: 'medium',
        irrigationImpact: 'moderate',
        recommendedPortionSize: 'small portions',
        preparationTips: ['Introduce gradually', 'Drink plenty of water']
      };
    }

    // Processed food patterns
    if (name.includes('fried') || name.includes('processed') || name.includes('fast food')) {
      return {
        fodmapLevel: 'medium',
        fiberContent: 'low',
        spiceLevel: 'mild',
        processingLevel: 'ultra-processed',
        commonTriggers: ['high fat', 'additives'],
        gutFriendliness: 'caution',
        digestibilityScore: 4,
        gasProduction: 'medium',
        irrigationImpact: 'moderate',
        recommendedPortionSize: 'limit consumption',
        preparationTips: ['Choose healthier alternatives when possible']
      };
    }

    // Default safe assumption
    return {
      fodmapLevel: 'low',
      fiberContent: 'low',
      spiceLevel: 'none',
      processingLevel: 'minimally-processed',
      commonTriggers: [],
      gutFriendliness: 'good',
      digestibilityScore: 7,
      gasProduction: 'low',
      irrigationImpact: 'slight',
      recommendedPortionSize: 'normal portion',
      preparationTips: ['Monitor your individual response']
    };
  }

  // Save user experience data
  async saveUserExperience(foodId: string, userId: string, experience: {
    rating: number;
    effects: string[];
    notes?: string;
  }): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_food_experiences')
        .insert({
          food_id: foodId,
          user_id: userId,
          rating: experience.rating,
          effects: experience.effects,
          notes: experience.notes,
          created_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error saving user experience:', error);
      return false;
    }
  }
}

// Main Hybrid Food Service
export class HybridFoodService {
  private openFoodFacts: OpenFoodFactsService;
  private gutData: GutDataService;

  constructor(supabaseClient: any) {
    this.openFoodFacts = new OpenFoodFactsService();
    this.gutData = new GutDataService(supabaseClient);
  }

  async searchFoods(query: string, limit = 20): Promise<EnhancedFoodItem[]> {
    // Get base food data from Open Food Facts
    const baseFoods = await this.openFoodFacts.searchProducts(query, limit);
    
    // Enhance each food item with stoma-specific data
    const enhancedFoods = await Promise.all(
      baseFoods.map(async (food) => {
        const gutData = await this.gutData.getGutData(food.id, food.name);
        
        return {
          ...food,
          gutData: gutData || undefined,
          lastUpdated: new Date()
        } as EnhancedFoodItem;
      })
    );

    // Sort by stoma-friendliness
    return enhancedFoods.sort((a, b) => {
      const scoreA = this.getGutFriendlinessScore(a.gutData);
      const scoreB = this.getGutFriendlinessScore(b.gutData);
      return scoreB - scoreA;
    });
  }

  async getFoodByBarcode(barcode: string): Promise<EnhancedFoodItem | null> {
    const baseFood = await this.openFoodFacts.getProductByBarcode(barcode);
    if (!baseFood) return null;

    const gutData = await this.gutData.getGutData(baseFood.id, baseFood.name);
    
    return {
      ...baseFood,
      gutData: gutData || undefined,
      lastUpdated: new Date()
    };
  }

  private getGutFriendlinessScore(gutData?: GutSpecificData): number {
    if (!gutData) return 5;
    
    const friendlinessScores = {
      'excellent': 10,
      'good': 8,
      'moderate': 6,
      'caution': 4,
      'avoid': 2
    };
    
    return friendlinessScores[gutData.gutFriendliness] || 5;
  }
}

// Export for easy usage
export const createHybridFoodService = (supabaseClient: any) => {
  return new HybridFoodService(supabaseClient);
};

// Create a default instance for immediate use
import { createClient } from './supabase';

export const hybridFoodService = createHybridFoodService(createClient());
export default hybridFoodService;
