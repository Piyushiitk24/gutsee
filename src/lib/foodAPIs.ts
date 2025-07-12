/**
 * Food Database APIs Integration
 * Combines multiple food databases for comprehensive coverage
 */

export interface FoodItem {
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
  source: 'openfoodfacts' | 'usda' | 'spoonacular' | 'local';
  barcode?: string;
  image?: string;
}

export interface SearchResult {
  items: FoodItem[];
  totalResults: number;
  source: string;
}

// Open Food Facts API
class OpenFoodFactsAPI {
  private baseUrl = 'https://world.openfoodfacts.org/api/v2';

  async searchProducts(query: string, limit = 20): Promise<SearchResult> {
    try {
      const url = `${this.baseUrl}/search?search_terms=${encodeURIComponent(query)}&page_size=${limit}&fields=product_name,brands,ingredients_text,allergens,nutriments,categories,code,image_url`;
      
      const response = await fetch(url);
      const data = await response.json();

      const items: FoodItem[] = data.products?.map((product: any) => ({
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
        source: 'openfoodfacts',
        barcode: product.code,
        image: product.image_url,
      })) || [];

      return {
        items,
        totalResults: data.count || 0,
        source: 'Open Food Facts',
      };
    } catch (error) {
      console.error('Open Food Facts API error:', error);
      return { items: [], totalResults: 0, source: 'Open Food Facts' };
    }
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

// USDA FoodData Central API
class USDAFoodDataAPI {
  private baseUrl = 'https://api.nal.usda.gov/fdc/v1';
  private apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY || 'DEMO_KEY';

  async searchFoods(query: string, limit = 20): Promise<SearchResult> {
    try {
      const url = `${this.baseUrl}/foods/search?query=${encodeURIComponent(query)}&pageSize=${limit}&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const items: FoodItem[] = data.foods?.map((food: any) => ({
        id: food.fdcId.toString(),
        name: food.description,
        brand: food.brandOwner,
        ingredients: food.ingredients ? [food.ingredients] : [],
        allergens: [], // USDA doesn't provide structured allergen data
        nutrition: this.parseNutrition(food.foodNutrients),
        categories: [food.foodCategory || 'Unknown'],
        source: 'usda',
        barcode: food.gtinUpc,
      })) || [];

      return {
        items,
        totalResults: data.totalHits || 0,
        source: 'USDA FoodData Central',
      };
    } catch (error) {
      console.error('USDA FoodData API error:', error);
      return { items: [], totalResults: 0, source: 'USDA FoodData Central' };
    }
  }

  private parseNutrition(nutrients: any[]): FoodItem['nutrition'] {
    const nutritionMap: { [key: number]: keyof FoodItem['nutrition'] } = {
      1008: 'calories', // Energy
      1003: 'protein',  // Protein
      1005: 'carbs',    // Carbohydrate
      1004: 'fat',      // Total lipid (fat)
      1079: 'fiber',    // Fiber
      2000: 'sugar',    // Total sugars
      1093: 'sodium',   // Sodium
    };

    const nutrition: FoodItem['nutrition'] = {};
    
    nutrients?.forEach(nutrient => {
      const key = nutritionMap[nutrient.nutrientId];
      if (key && nutrient.value) {
        nutrition[key] = nutrient.value;
      }
    });

    return nutrition;
  }
}

// Spoonacular API (Premium)
class SpoonacularAPI {
  private baseUrl = 'https://api.spoonacular.com';
  private apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

  async searchIngredients(query: string, limit = 20): Promise<SearchResult> {
    if (!this.apiKey) {
      return { items: [], totalResults: 0, source: 'Spoonacular (No API Key)' };
    }

    try {
      const url = `${this.baseUrl}/food/ingredients/search?query=${encodeURIComponent(query)}&number=${limit}&apiKey=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const items: FoodItem[] = data.results?.map((ingredient: any) => ({
        id: ingredient.id.toString(),
        name: ingredient.name,
        ingredients: [ingredient.name],
        allergens: [], // Would need additional API calls for detailed allergen info
        nutrition: {}, // Would need additional API calls for nutrition
        categories: [ingredient.aisle || 'Unknown'],
        source: 'spoonacular',
        image: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`,
      })) || [];

      return {
        items,
        totalResults: data.totalResults || 0,
        source: 'Spoonacular',
      };
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return { items: [], totalResults: 0, source: 'Spoonacular' };
    }
  }
}

// Combined Food Search Service
export class FoodSearchService {
  private openFoodFacts = new OpenFoodFactsAPI();
  private usdaAPI = new USDAFoodDataAPI();
  private spoonacularAPI = new SpoonacularAPI();

  async searchFood(query: string, options: {
    includeLocal?: boolean;
    sources?: ('openfoodfacts' | 'usda' | 'spoonacular')[];
    limit?: number;
  } = {}): Promise<{
    results: SearchResult[];
    combined: FoodItem[];
  }> {
    const { 
      includeLocal = true, 
      sources = ['openfoodfacts', 'usda'], 
      limit = 20 
    } = options;

    const results: SearchResult[] = [];
    
    // Search multiple APIs in parallel
    const searchPromises: Promise<SearchResult>[] = [];

    if (sources.includes('openfoodfacts')) {
      searchPromises.push(this.openFoodFacts.searchProducts(query, limit));
    }

    if (sources.includes('usda')) {
      searchPromises.push(this.usdaAPI.searchFoods(query, limit));
    }

    if (sources.includes('spoonacular')) {
      searchPromises.push(this.spoonacularAPI.searchIngredients(query, limit));
    }

    // Add local database search if requested
    if (includeLocal) {
      searchPromises.push(this.searchLocalDatabase(query, limit));
    }

    const apiResults = await Promise.allSettled(searchPromises);
    
    apiResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });

    // Combine and deduplicate results
    const combined = this.combineAndDeduplicateResults(results);

    return { results, combined };
  }

  private async searchLocalDatabase(query: string, limit: number): Promise<SearchResult> {
    // Fallback to our local database for common Indian foods
    const { searchFoodItems } = await import('../data/foodDatabase');
    const localResults = searchFoodItems(query).slice(0, limit);
    
    const items: FoodItem[] = localResults.map(item => ({
      id: `local_${item.id}`,
      name: item.name,
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      nutrition: {
        calories: item.nutritionPer100g?.calories,
        protein: item.nutritionPer100g?.protein,
        carbs: item.nutritionPer100g?.carbs,
        fat: item.nutritionPer100g?.fat,
        fiber: item.nutritionPer100g?.fiber,
        sugar: item.nutritionPer100g?.sugar,
      },
      categories: item.category ? [item.category] : [],
      source: 'local',
    }));

    return {
      items,
      totalResults: localResults.length,
      source: 'Local Database',
    };
  }

  private combineAndDeduplicateResults(results: SearchResult[]): FoodItem[] {
    const allItems = results.flatMap(result => result.items);
    const seenNames = new Set<string>();
    const uniqueItems: FoodItem[] = [];

    // Prioritize results: Open Food Facts > Local > USDA > Spoonacular
    const priorityOrder = ['openfoodfacts', 'local', 'usda', 'spoonacular'];
    
    const sortedItems = allItems.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.source);
      const bPriority = priorityOrder.indexOf(b.source);
      return aPriority - bPriority;
    });

    for (const item of sortedItems) {
      const nameKey = item.name.toLowerCase().trim();
      if (!seenNames.has(nameKey)) {
        seenNames.add(nameKey);
        uniqueItems.push(item);
      }
    }

    return uniqueItems.slice(0, 50); // Limit to top 50 results
  }

  // Get detailed product information by barcode
  async getProductByBarcode(barcode: string): Promise<FoodItem | null> {
    try {
      const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        return {
          id: product.code,
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          ingredients: this.openFoodFacts['parseIngredients'](product.ingredients_text),
          allergens: this.openFoodFacts['parseAllergens'](product.allergens),
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
}

// Export singleton instance
export const foodSearchService = new FoodSearchService();
