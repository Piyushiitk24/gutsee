// Gemini AI service for ingredient analysis and gut health insights

import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if we have a valid API key (not the demo key)
const apiKey = process.env.GOOGLE_AI_API_KEY;
const isValidApiKey = apiKey && apiKey !== 'DEMO_KEY_PLACEHOLDER' && apiKey.startsWith('AIzaSy');

// Initialize Gemini AI only if we have a valid key
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;
let visionModel: any = null;

if (isValidApiKey) {
  genAI = new GoogleGenerativeAI(apiKey!);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

export interface IngredientAnalysis {
  ingredient: string;
  category: string;
  gutBehavior: 'gas-producing' | 'metabolism-boosting' | 'gut-friendly' | 'potentially-problematic';
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  alternatives?: string[];
}

export interface MealAnalysis {
  ingredients: IngredientAnalysis[];
  overallRisk: 'low' | 'medium' | 'high';
  gasProducingScore: number; // 0-10
  metabolismScore: number; // 0-10
  recommendations: string[];
  timingAdvice: string;
  portionAdvice: string;
  summary: string;
}

export interface FoodImageAnalysis {
  detectedFoods: string[];
  confidence: number;
  ingredients: IngredientAnalysis[];
  suggestions: string[];
}

// Helper function to check if AI is available
export function isAIAvailable(): boolean {
  return Boolean(isValidApiKey && model !== null);
}

/**
 * Analyze ingredients for gut health impact
 */
export async function analyzeIngredients(ingredients: string[]): Promise<MealAnalysis> {
  try {
    const prompt = `
As a specialized gut health and gut management AI, analyze these food ingredients for someone with a gut condition:

Ingredients: ${ingredients.join(', ')}

For each ingredient, provide:
1. Gut behavior classification (gas-producing, metabolism-boosting, gut-friendly, potentially-problematic)
2. Risk level for gut patients (low, medium, high)
3. Specific effects on gas production
4. Impact on metabolism
5. Detailed recommendations for gut patients
6. Safe alternatives if problematic

Then provide an overall meal analysis including:
- Overall risk assessment
- Gas production score (0-10)
- Metabolism impact score (0-10)
- Timing recommendations
- Portion size advice
- General summary

Format your response as JSON matching this structure:
{
  "ingredients": [
    {
      "ingredient": "ingredient name",
      "category": "food category",
      "gutBehavior": "gas-producing|metabolism-boosting|gut-friendly|potentially-problematic",
      "riskLevel": "low|medium|high",
      "description": "detailed description of effects",
      "recommendations": ["recommendation 1", "recommendation 2"],
      "alternatives": ["alternative 1", "alternative 2"]
    }
  ],
  "overallRisk": "low|medium|high",
  "gasProducingScore": 0-10,
  "metabolismScore": 0-10,
  "recommendations": ["overall recommendation 1", "overall recommendation 2"],
  "timingAdvice": "when to eat this meal",
  "portionAdvice": "portion size recommendations",
  "summary": "brief summary of the meal analysis"
}

Focus specifically on gut care, gas management, and digestive comfort.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const analysis = JSON.parse(text) as MealAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error analyzing ingredients:', error);
    throw new Error('Failed to analyze ingredients');
  }
}

/**
 * Analyze food image to identify ingredients
 */
export async function analyzeFoodImage(imageBase64: string): Promise<FoodImageAnalysis> {
  try {
    const prompt = `
Analyze this food image for someone with a gut condition. Identify:

1. All visible foods and ingredients
2. Potential hidden ingredients based on food type
3. Confidence level in identification (0-1)
4. Gut health assessment for each ingredient
5. Specific suggestions for gut patients

Focus on identifying ingredients that might affect:
- Gas production
- Digestive comfort
- Gut output consistency
- Metabolic impact

Format response as JSON:
{
  "detectedFoods": ["food1", "food2"],
  "confidence": 0.85,
  "ingredients": [ingredient analysis array],
  "suggestions": ["suggestion1", "suggestion2"]
}
    `;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text) as FoodImageAnalysis;
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
}

/**
 * Get personalized meal recommendations based on user history
 */
export async function getPersonalizedRecommendations(
  userHistory: any,
  currentTime: Date,
  preferences: any
): Promise<string[]> {
  try {
    const prompt = `
Based on this gut patient's history and current time, provide personalized meal recommendations:

User History: ${JSON.stringify(userHistory)}
Current Time: ${currentTime.toISOString()}
Preferences: ${JSON.stringify(preferences)}

Consider:
- Recent gas episodes
- Successful meals
- Time of day
- Previous reactions
- Irrigation schedule
- Lifestyle patterns

Provide 5-7 specific, actionable meal recommendations as a JSON array of strings.
Focus on reducing gas, improving comfort, and supporting healthy digestion.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [
      'Consider a light meal with easily digestible proteins',
      'Include well-cooked vegetables to minimize fiber',
      'Stay hydrated with water or herbal teas',
      'Avoid carbonated beverages that may increase gas',
      'Eat slowly and chew thoroughly'
    ];
  }
}

/**
 * Analyze symptoms and provide insights
 */
export async function analyzeSymptoms(
  symptoms: string[],
  recentMeals: any[],
  outputs: any[]
): Promise<{
  analysis: string;
  possibleCauses: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}> {
  try {
    const prompt = `
Analyze these symptoms for a gut patient:

Symptoms: ${symptoms.join(', ')}
Recent Meals: ${JSON.stringify(recentMeals)}
Recent Outputs: ${JSON.stringify(outputs)}

Provide analysis including:
1. Detailed symptom analysis
2. Possible food-related causes
3. Actionable recommendations
4. Severity assessment

Format as JSON:
{
  "analysis": "detailed analysis",
  "possibleCauses": ["cause1", "cause2"],
  "recommendations": ["rec1", "rec2"],
  "severity": "low|medium|high"
}

Focus on gut-specific considerations and practical advice.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return {
      analysis: 'Unable to analyze symptoms at this time',
      possibleCauses: ['Various dietary factors may contribute'],
      recommendations: ['Consult with your healthcare provider'],
      severity: 'medium' as const
    };
  }
}

/**
 * Generate meal plan suggestions
 */
export async function generateMealPlan(
  duration: number,
  dietaryRestrictions: string[],
  goals: string[],
  userHistory: any
): Promise<{
  days: {
    date: string;
    meals: {
      type: string;
      name: string;
      ingredients: string[];
      benefits: string[];
      riskLevel: 'low' | 'medium' | 'high';
    }[];
    notes: string[];
  }[];
  tips: string[];
}> {
  try {
    const prompt = `
Create a ${duration}-day meal plan for a gut patient with these requirements:

Dietary Restrictions: ${dietaryRestrictions.join(', ')}
Goals: ${goals.join(', ')}
User History: ${JSON.stringify(userHistory)}

For each day, provide:
- 3-4 meals with specific ingredients
- Benefits of each meal
- Risk assessment
- Daily notes and tips

Focus on:
- Minimizing gas production
- Supporting healthy digestion
- Providing balanced nutrition
- Accommodating restrictions
- Practical meal preparation

Format as JSON with the structure provided above.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}

/**
 * Analyze a food entry description for gut health impact
 */
export async function analyzeFoodEntry(description: string): Promise<{
  flags: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  insights: string[];
}> {
  try {
    const prompt = `
Analyze this food entry for a gut patient:

Food Description: "${description}"

Provide analysis including:
1. Potential warning flags (e.g., "gas-producing", "high-fiber", "spicy")
2. Risk level assessment for gut patients
3. Confidence in assessment (0-1)
4. Specific insights and recommendations

Format as JSON:
{
  "flags": ["flag1", "flag2"],
  "riskLevel": "low|medium|high",
  "confidence": 0.85,
  "insights": ["insight1", "insight2"]
}

Focus on gut-specific considerations like gas production, digestive comfort, and gut output.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing food entry:', error);
    return {
      flags: [],
      riskLevel: 'low' as const,
      confidence: 0.5,
      insights: []
    };
  }
}

/**
 * Analyze a symptom entry description
 */
export async function analyzeSymptomEntry(description: string): Promise<{
  flags: string[];
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  insights: string[];
}> {
  try {
    const prompt = `
Analyze this symptom entry for a gut patient:

Symptom Description: "${description}"

Provide analysis including:
1. Symptom classification flags
2. Severity assessment
3. Confidence in assessment (0-1)
4. Insights and recommendations

Format as JSON:
{
  "flags": ["flag1", "flag2"],
  "severity": "low|medium|high",
  "confidence": 0.85,
  "insights": ["insight1", "insight2"]
}

Focus on gut-specific symptoms and their potential causes.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing symptom entry:', error);
    return {
      flags: [],
      severity: 'low' as const,
      confidence: 0.5,
      insights: []
    };
  }
}

/**
 * Parse natural language text into multiple health entries
 * This is the killer feature that auto-categorizes complex descriptions
 */
export async function parseMultiCategoryEntry(description: string, baseTimestamp: Date): Promise<{
  entries: Array<{
    type: string;
    description: string;
    timestamp: Date;
    confidence: number;
    details?: any;
  }>;
  summary: string;
  confidence: number;
}> {
  // If AI is not available, use enhanced local parsing
  if (!isAIAvailable()) {
    console.log('AI not available, using enhanced local parsing...');
    return enhancedLocalParsing(description, baseTimestamp);
  }

  try {
    const prompt = `
You are an expert gut management AI assistant. Parse this natural language description into separate, detailed health entries for a gut tracker app.

User Description: "${description}"
Base Timestamp: ${baseTimestamp.toISOString()}

CRITICAL INSTRUCTIONS:
1. SEPARATE FOOD FROM DRINKS - Always create separate entries for solid food and beverages
2. CATEGORIZE BY TIME OF DAY:
   - 5:00-10:00 AM = breakfast
   - 10:00-12:00 PM = snack
   - 12:00-4:00 PM = lunch  
   - 4:00-7:00 PM = snack (evening/tea time)
   - 7:00-10:00 PM = dinner
   - 10:00 PM+ = snack (late night)
3. Extract detailed information for each category
4. Be very specific with ingredients, quantities, and characteristics

SEPARATION EXAMPLES:
- "Bun Maska and Chai" = snack entry (Bun Maska) + drinks entry (Chai)
- "Coffee with toast" = drinks entry (Coffee) + breakfast/snack entry (Toast)
- "Lunch with juice" = lunch entry (food) + drinks entry (juice)

CATEGORIES TO DETECT:
- MEALS: breakfast, lunch, dinner, snack (extract ingredients, quantities, cooking methods)
- DRINKS: any beverages, tea, coffee, juice, water, milk (extract type, quantity, timing)
- IRRIGATION: gut irrigation (extract quality, difficulty, completion, water flow)
- GAS: gas production, flatulence (extract timing, intensity, triggers)
- BOWEL: bowel movements, output (extract consistency, volume, timing)
- MEDICATION: pills, supplements (extract names, dosages, timing)
- SYMPTOMS: pain, discomfort, energy (extract severity, location, timing)

For MEALS, extract:
- Exact ingredients with quantities
- Cooking method
- Meal timing
- Portion sizes

For IRRIGATION, extract:
- Water flow quality (smooth/difficult/blocked)
- Completion level (empty/partial/poor)
- Comfort level
- Duration if mentioned
- Any issues

For GAS/BOWEL, extract:
- Timing relative to meals
- Intensity/volume
- Characteristics
- Triggers

Response Format (JSON):
{
  "entries": [
    {
      "type": "snack",
      "description": "Bun Maska - buttered bun with spices",
      "timestamp": "2025-07-12T18:57:00.000Z",
      "confidence": 0.95,
      "details": {
        "mealType": "snack",
        "foodItem": "bun maska",
        "ingredients": [
          "bun (1 piece)",
          "butter (maska)",
          "spices"
        ],
        "quantity": "1 bun",
        "timing": "evening snack",
        "estimatedCalories": 200,
        "riskAssessment": "low"
      }
    },
    {
      "type": "drinks", 
      "description": "Chai - 1 cup Indian spiced tea",
      "timestamp": "2025-07-12T18:57:00.000Z",
      "confidence": 0.95,
      "details": {
        "beverage": "chai",
        "type": "spiced tea",
        "quantity": "1 cup",
        "timing": "with snack",
        "estimatedVolume": "200ml",
        "temperature": "hot",
        "ingredients": ["tea", "milk", "sugar", "spices"]
      }
    },
    {
      "type": "breakfast", 
      "description": "Scrambled eggs with 4 eggs, 2 green chilies, grated cheese, bell pepper, 2 black peppers, cooked in 1 spoon butter, served with 2 multigrain toasts",
      "timestamp": "2025-07-10T07:30:00.000Z",
      "confidence": 0.98,
      "details": {
        "mealType": "breakfast",
        "cookingMethod": "scrambled",
        "ingredients": [
          "eggs (4 pieces)",
          "green chilies (2 pieces)", 
          "grated cheese",
          "bell pepper (small amount)",
          "black pepper (2 pieces)",
          "butter (1 spoon)",
          "multigrain toast (2 slices)"
        ],
        "primaryProtein": "eggs",
        "estimatedCalories": 650,
        "riskAssessment": "low-medium"
      }
    },
    {
      "type": "irrigation",
      "description": "Morning irrigation at 8AM - water flow was difficult, not going inside easily, but achieved good emptying",
      "timestamp": "2025-07-10T08:00:00.000Z", 
      "confidence": 0.96,
      "details": {
        "timeOfDay": "morning",
        "waterFlow": "difficult",
        "waterFlowRating": "poor",
        "completion": "good",
        "completionRating": "high",
        "issues": ["water resistance", "flow problems"],
        "outcome": "successful emptying",
        "userFeeling": "satisfied with emptying"
      }
    }
  ],
  "summary": "Detected 3 distinct health activities: morning protein drink (7am), hearty breakfast meal (7:30am), and irrigation session (8am)",
  "confidence": 0.96
}

CRITICAL REQUIREMENTS:
- ALWAYS separate food from drinks into different entries
- For "Bun Maska and Chai" = 2 entries: food snack + drink
- Use timing-based meal categories (evening = snack, not general)
- Include specific ingredient breakdown for meals
- Provide detailed characteristics for irrigation and symptoms  
- Use high confidence (0.9+) only when details are very clear
- If timing is unclear, make reasonable assumptions based on typical daily patterns
- NEVER use "general" category - always specify the appropriate meal type

Analyze the description thoroughly and extract every possible health-related activity as separate entries.
    `;

    const result = await model!.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the JSON response (remove any markdown formatting)
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    const parsed = JSON.parse(cleanedText);
    
    // Convert timestamp strings back to Date objects
    if (parsed.entries) {
      parsed.entries = parsed.entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing with AI, falling back to local parsing:', error);
    return enhancedLocalParsing(description, baseTimestamp);
  }
}

/**
 * Enhanced local parsing function when AI is not available
 */
function enhancedLocalParsing(description: string, baseTimestamp: Date): Promise<{
  entries: Array<{
    type: string;
    description: string;
    timestamp: Date;
    confidence: number;
    details?: any;
  }>;
  summary: string;
  confidence: number;
}> {
  return new Promise((resolve) => {
    const desc = description.toLowerCase();
    const fallbackEntries = [];
    
    // Enhanced keyword detection with better categorization
    const keywordPatterns = [
      {
        keywords: ['egg', 'scrambled', 'omelet', 'breakfast', 'toast', 'cereal', 'oatmeal'],
        type: 'breakfast',
        confidence: 0.8
      },
      {
        keywords: ['lunch', 'sandwich', 'salad', 'soup', 'wrap'],
        type: 'lunch',
        confidence: 0.8
      },
      {
        keywords: ['dinner', 'evening', 'pasta', 'rice', 'chicken', 'beef'],
        type: 'dinner',
        confidence: 0.8
      },
      {
        keywords: ['protein shake', 'drink', 'coffee', 'tea', 'water', 'juice'],
        type: 'drinks',
        confidence: 0.7
      },
      {
        keywords: ['irrigation', 'flush', 'rinse', 'gut'],
        type: 'irrigation',
        confidence: 0.9
      },
      {
        keywords: ['gas', 'bloated', 'flatulence', 'wind'],
        type: 'gas',
        confidence: 0.8
      },
      {
        keywords: ['pain', 'discomfort', 'cramping', 'soreness'],
        type: 'symptoms',
        confidence: 0.7
      },
      {
        keywords: ['output', 'bowel', 'movement', 'consistency'],
        type: 'output',
        confidence: 0.8
      }
    ];

    // Extract time mentions
    const timePattern = /(\d{1,2}):?(\d{2})?\s*(am|pm)|(\d{1,2})\s*(am|pm)|(morning|afternoon|evening|night)/gi;
    const timeMatches = description.match(timePattern);
    
    let foundEntries = new Set();
    
    // Check for each pattern
    for (const pattern of keywordPatterns) {
      for (const keyword of pattern.keywords) {
        if (desc.includes(keyword) && !foundEntries.has(pattern.type)) {
          foundEntries.add(pattern.type);
          
          // Calculate timestamp based on timing or type
          let entryTimestamp = baseTimestamp;
          if (timeMatches && timeMatches.length > 0) {
            // Try to parse the first time mention
            const timeStr = timeMatches[0];
            entryTimestamp = parseTimeToDate(timeStr, baseTimestamp) || baseTimestamp;
          } else {
            // Default timing based on meal type
            if (pattern.type === 'breakfast') {
              entryTimestamp = new Date(baseTimestamp);
              entryTimestamp.setHours(8, 0, 0, 0);
            } else if (pattern.type === 'lunch') {
              entryTimestamp = new Date(baseTimestamp);
              entryTimestamp.setHours(12, 30, 0, 0);
            } else if (pattern.type === 'dinner') {
              entryTimestamp = new Date(baseTimestamp);
              entryTimestamp.setHours(19, 0, 0, 0);
            } else if (pattern.type === 'irrigation') {
              entryTimestamp = new Date(baseTimestamp);
              entryTimestamp.setHours(8, 0, 0, 0);
            }
          }
          
          fallbackEntries.push({
            type: pattern.type,
            description: extractRelevantPhrase(description, keyword),
            timestamp: entryTimestamp,
            confidence: pattern.confidence,
            details: {
              extractedFrom: keyword,
              method: 'local-parsing'
            }
          });
        }
      }
    }
    
    // If no specific patterns found, create a general entry
    if (fallbackEntries.length === 0) {
      fallbackEntries.push({
        type: 'general',
        description: description,
        timestamp: baseTimestamp,
        confidence: 0.5,
        details: {
          method: 'fallback'
        }
      });
    }
    
    resolve({
      entries: fallbackEntries,
      summary: `Local parsing detected ${fallbackEntries.length} entries from description`,
      confidence: Math.max(...fallbackEntries.map(e => e.confidence))
    });
  });
}

/**
 * Helper function to parse time string to Date
 */
function parseTimeToDate(timeStr: string, baseDate: Date): Date | null {
  try {
    const lowerTime = timeStr.toLowerCase();
    let hours = 12, minutes = 0;
    
    if (lowerTime.includes('morning')) hours = 8;
    else if (lowerTime.includes('afternoon')) hours = 14;
    else if (lowerTime.includes('evening')) hours = 19;
    else if (lowerTime.includes('night')) hours = 21;
    else {
      // Try to parse actual time
      const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        
        if (timeMatch[3] && timeMatch[3].toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (timeMatch[3] && timeMatch[3].toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
      }
    }
    
    const result = new Date(baseDate);
    result.setHours(hours, minutes, 0, 0);
    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Helper function to extract relevant phrase around a keyword
 */
function extractRelevantPhrase(text: string, keyword: string): string {
  const words = text.split(' ');
  const keywordIndex = words.findIndex(word => word.toLowerCase().includes(keyword.toLowerCase()));
  
  if (keywordIndex === -1) return text;
  
  const start = Math.max(0, keywordIndex - 3);
  const end = Math.min(words.length, keywordIndex + 4);
  
  return words.slice(start, end).join(' ');
}

// Export a default service object
export const GeminiService = {
  analyzeIngredients,
  analyzeFoodImage,
  getPersonalizedRecommendations,
  analyzeSymptoms,
  generateMealPlan,
  analyzeFoodEntry,
  analyzeSymptomEntry,
  parseMultiCategoryEntry, // New intelligent parsing function
  isAIAvailable,
};
