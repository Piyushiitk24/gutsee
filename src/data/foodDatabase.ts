// Comprehensive food database for accurate tracking and analysis
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  commonNames: string[]; // Alternative names users might use
  ingredients: string[];
  allergens: string[];
  fodmapLevel: 'low' | 'medium' | 'high';
  fiberContent: 'low' | 'medium' | 'high';
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot';
  processingLevel: 'whole' | 'minimally-processed' | 'processed' | 'ultra-processed';
  commonTriggers: string[]; // Known trigger ingredients for stoma patients
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

export const FOOD_DATABASE: FoodItem[] = [
  // DAIRY & CHEESE
  {
    id: 'cheese-cheddar',
    name: 'Cheddar Cheese',
    category: 'Dairy',
    subcategory: 'Hard Cheese',
    commonNames: ['cheddar', 'aged cheddar', 'sharp cheddar'],
    ingredients: ['milk', 'salt', 'cultures', 'enzymes'],
    allergens: ['milk'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'processed',
    commonTriggers: ['lactose'],
    nutritionPer100g: { calories: 403, protein: 25, carbs: 1, fat: 33, fiber: 0, sugar: 0 }
  },
  {
    id: 'cheese-mozzarella',
    name: 'Mozzarella Cheese',
    category: 'Dairy',
    subcategory: 'Soft Cheese',
    commonNames: ['mozzarella', 'mozz', 'fresh mozzarella'],
    ingredients: ['milk', 'salt', 'cultures', 'enzymes'],
    allergens: ['milk'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['lactose'],
    nutritionPer100g: { calories: 280, protein: 28, carbs: 3, fat: 17, fiber: 0, sugar: 1 }
  },
  {
    id: 'cheese-slice-processed',
    name: 'Processed Cheese Slice',
    category: 'Dairy',
    subcategory: 'Processed Cheese',
    commonNames: ['cheese slice', 'american cheese', 'burger cheese'],
    ingredients: ['milk', 'whey', 'emulsifiers', 'preservatives'],
    allergens: ['milk'],
    fodmapLevel: 'medium',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'ultra-processed',
    commonTriggers: ['lactose', 'additives', 'preservatives'],
    nutritionPer100g: { calories: 337, protein: 16, carbs: 9, fat: 27, fiber: 0, sugar: 9 }
  },

  // EGGS
  {
    id: 'eggs-scrambled',
    name: 'Scrambled Eggs',
    category: 'Protein',
    subcategory: 'Eggs',
    commonNames: ['scrambled eggs', 'eggs', 'scrambled', 'egg'],
    ingredients: ['eggs', 'butter', 'salt'],
    allergens: ['eggs'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 149, protein: 10, carbs: 1, fat: 11, fiber: 0, sugar: 1 }
  },
  {
    id: 'eggs-boiled',
    name: 'Boiled Eggs',
    category: 'Protein',
    subcategory: 'Eggs',
    commonNames: ['boiled eggs', 'hard boiled eggs', 'soft boiled eggs'],
    ingredients: ['eggs'],
    allergens: ['eggs'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 }
  },

  // RICE & GRAINS
  {
    id: 'rice-white',
    name: 'White Rice',
    category: 'Grains',
    subcategory: 'Rice',
    commonNames: ['rice', 'white rice', 'steamed rice', 'basmati rice'],
    ingredients: ['rice'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'processed',
    commonTriggers: [],
    nutritionPer100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 }
  },
  {
    id: 'rice-brown',
    name: 'Brown Rice',
    category: 'Grains',
    subcategory: 'Rice',
    commonNames: ['brown rice', 'whole grain rice'],
    ingredients: ['brown rice'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'high',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['high fiber'],
    nutritionPer100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0.4 }
  },

  // VEGETABLES  
  {
    id: 'onion-white',
    name: 'White Onion',
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    commonNames: ['onion', 'white onion', 'onions'],
    ingredients: ['onion'],
    allergens: [],
    fodmapLevel: 'high',
    fiberContent: 'medium',
    spiceLevel: 'mild',
    processingLevel: 'whole',
    commonTriggers: ['FODMAP', 'gas-producing'],
    nutritionPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2 }
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'Vegetables',
    subcategory: 'Aromatic Vegetables',
    commonNames: ['garlic', 'garlic cloves'],
    ingredients: ['garlic'],
    allergens: [],
    fodmapLevel: 'high',
    fiberContent: 'low',
    spiceLevel: 'medium',
    processingLevel: 'whole',
    commonTriggers: ['FODMAP', 'gas-producing', 'strong flavor'],
    nutritionPer100g: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1 }
  },

  // SPICES & SEASONINGS
  {
    id: 'salt',
    name: 'Salt',
    category: 'Seasonings',
    subcategory: 'Basic Seasonings',
    commonNames: ['salt', 'table salt', 'sea salt'],
    ingredients: ['sodium chloride'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'processed',
    commonTriggers: ['high sodium'],
    nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  },
  {
    id: 'black-pepper',
    name: 'Black Pepper',
    category: 'Seasonings',
    subcategory: 'Spices',
    commonNames: ['black pepper', 'pepper', 'ground pepper'],
    ingredients: ['black pepper'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'medium',
    spiceLevel: 'medium',
    processingLevel: 'minimally-processed',
    commonTriggers: ['spice'],
    nutritionPer100g: { calories: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25, sugar: 0.6 }
  },

  // OILS & FATS
  {
    id: 'butter',
    name: 'Butter',
    category: 'Fats',
    subcategory: 'Dairy Fats',
    commonNames: ['butter', 'unsalted butter', 'salted butter'],
    ingredients: ['cream', 'salt'],
    allergens: ['milk'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['high fat', 'lactose'],
    nutritionPer100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1 }
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    category: 'Fats',
    subcategory: 'Plant Oils',
    commonNames: ['olive oil', 'extra virgin olive oil', 'EVOO'],
    ingredients: ['olives'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['high fat'],
    nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 }
  },

  // MEAT & POULTRY
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    category: 'Protein',
    subcategory: 'Poultry',
    commonNames: ['chicken', 'chicken breast', 'grilled chicken'],
    ingredients: ['chicken'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 }
  },
  {
    id: 'chicken-spelled-wrong',
    name: 'Chicken Breast',
    category: 'Protein',
    subcategory: 'Poultry',
    commonNames: ['chiken', 'chikn', 'chicken', 'chcken', 'checken'], // Common misspellings
    ingredients: ['chicken'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 }
  },

  // BREAD & GRAINS
  {
    id: 'bread-white',
    name: 'White Bread',
    category: 'Grains',
    subcategory: 'Bread',
    commonNames: ['white bread', 'sandwich bread', 'sliced bread'],
    ingredients: ['wheat flour', 'water', 'yeast', 'salt', 'sugar'],
    allergens: ['gluten', 'wheat'],
    fodmapLevel: 'high',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'processed',
    commonTriggers: ['gluten', 'yeast'],
    nutritionPer100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5.7 }
  },
  {
    id: 'bread-whole-wheat',
    name: 'Whole Wheat Bread',
    category: 'Grains',
    subcategory: 'Bread',
    commonNames: ['whole wheat bread', 'brown bread', 'wheat bread'],
    ingredients: ['whole wheat flour', 'water', 'yeast', 'salt'],
    allergens: ['gluten', 'wheat'],
    fodmapLevel: 'high',
    fiberContent: 'high',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['gluten', 'high fiber'],
    nutritionPer100g: { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7, sugar: 5.7 }
  },

  // VEGETABLES
  {
    id: 'lettuce-iceberg',
    name: 'Iceberg Lettuce',
    category: 'Vegetables',
    subcategory: 'Leafy Greens',
    commonNames: ['lettuce', 'iceberg', 'salad lettuce'],
    ingredients: ['lettuce'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 14, protein: 0.9, carbs: 3, fat: 0.1, fiber: 1.2, sugar: 2 }
  },
  {
    id: 'tomato-fresh',
    name: 'Fresh Tomato',
    category: 'Vegetables',
    subcategory: 'Fruit Vegetables',
    commonNames: ['tomato', 'fresh tomato', 'ripe tomato'],
    ingredients: ['tomato'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: ['acidity'],
    nutritionPer100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 }
  },

  // FRUITS
  {
    id: 'banana-ripe',
    name: 'Ripe Banana',
    category: 'Fruits',
    subcategory: 'Tropical Fruits',
    commonNames: ['banana', 'ripe banana', 'yellow banana'],
    ingredients: ['banana'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'medium',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 }
  },

  // CONDIMENTS & SAUCES
  {
    id: 'mayo-regular',
    name: 'Mayonnaise',
    category: 'Condiments',
    subcategory: 'Creamy Sauces',
    commonNames: ['mayo', 'mayonnaise', 'sandwich spread'],
    ingredients: ['eggs', 'oil', 'vinegar', 'salt'],
    allergens: ['eggs'],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'processed',
    commonTriggers: ['high fat'],
    nutritionPer100g: { calories: 680, protein: 1.5, carbs: 0.6, fat: 75, fiber: 0, sugar: 0.4 }
  },

  // BEVERAGES
  {
    id: 'coffee-black',
    name: 'Black Coffee',
    category: 'Beverages',
    subcategory: 'Hot Beverages',
    commonNames: ['coffee', 'black coffee', 'americano'],
    ingredients: ['coffee beans', 'water'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['caffeine', 'acidity'],
    nutritionPer100g: { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  },
  {
    id: 'chai-tea',
    name: 'Chai Tea',
    category: 'Beverages',
    subcategory: 'Hot Beverages',
    commonNames: ['chai', 'chai tea', 'masala chai', 'spiced tea'],
    ingredients: ['black tea', 'milk', 'sugar', 'spices', 'cardamom', 'cinnamon', 'ginger'],
    allergens: ['milk'],
    fodmapLevel: 'medium',
    fiberContent: 'low',
    spiceLevel: 'mild',
    processingLevel: 'minimally-processed',
    commonTriggers: ['caffeine', 'lactose', 'spices'],
    nutritionPer100g: { calories: 42, protein: 1.6, carbs: 7, fat: 1.5, fiber: 0, sugar: 6 }
  },
  {
    id: 'green-tea',
    name: 'Green Tea',
    category: 'Beverages',
    subcategory: 'Hot Beverages',
    commonNames: ['green tea', 'matcha', 'sencha'],
    ingredients: ['green tea leaves', 'water'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['caffeine'],
    nutritionPer100g: { calories: 1, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  },
  {
    id: 'water-plain',
    name: 'Water',
    category: 'Beverages',
    subcategory: 'Water',
    commonNames: ['water', 'plain water', 'drinking water'],
    ingredients: ['water'],
    allergens: [],
    fodmapLevel: 'low',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'whole',
    commonTriggers: [],
    nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  },
  {
    id: 'milk-whole',
    name: 'Whole Milk',
    category: 'Dairy',
    subcategory: 'Milk',
    commonNames: ['milk', 'whole milk', 'full fat milk'],
    ingredients: ['milk'],
    allergens: ['milk'],
    fodmapLevel: 'high',
    fiberContent: 'low',
    spiceLevel: 'none',
    processingLevel: 'minimally-processed',
    commonTriggers: ['lactose'],
    nutritionPer100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1 }
  }
];

// Helper functions for food matching
export function searchFoodItems(query: string): FoodItem[] {
  const searchTerm = query.toLowerCase().trim();
  
  return FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(searchTerm) ||
    food.commonNames.some(name => name.toLowerCase().includes(searchTerm)) ||
    food.category.toLowerCase().includes(searchTerm) ||
    food.subcategory?.toLowerCase().includes(searchTerm)
  );
}

export function findExactMatch(query: string): FoodItem | null {
  const searchTerm = query.toLowerCase().trim();
  
  return FOOD_DATABASE.find(food => 
    food.name.toLowerCase() === searchTerm ||
    food.commonNames.some(name => name.toLowerCase() === searchTerm)
  ) || null;
}

// Fuzzy matching for typos and variations
export function fuzzySearchFood(query: string, threshold: number = 0.7): FoodItem[] {
  const searchTerm = query.toLowerCase().trim();
  
  return FOOD_DATABASE.filter(food => {
    const allNames = [food.name, ...food.commonNames];
    return allNames.some(name => {
      const similarity = calculateSimilarity(searchTerm, name.toLowerCase());
      return similarity >= threshold;
    });
  });
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Meal timing and categories
export const MEAL_CATEGORIES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  BEVERAGE: 'beverage'
} as const;

export type MealCategory = typeof MEAL_CATEGORIES[keyof typeof MEAL_CATEGORIES];

// Default meal times for suggestions
export const DEFAULT_MEAL_TIMES = {
  breakfast: { start: '06:00', end: '10:00' },
  lunch: { start: '11:00', end: '15:00' },
  dinner: { start: '17:00', end: '22:00' },
  snack: { start: '00:00', end: '23:59' },
  beverage: { start: '00:00', end: '23:59' }
};

// Suggest meal category based on time
export function suggestMealCategory(time: string): MealCategory {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour >= 6 && hour < 10) return MEAL_CATEGORIES.BREAKFAST;
  if (hour >= 11 && hour < 15) return MEAL_CATEGORIES.LUNCH;
  if (hour >= 17 && hour < 22) return MEAL_CATEGORIES.DINNER;
  return MEAL_CATEGORIES.SNACK;
}
