// Gemini AI service for ingredient analysis and gut health insights

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Get the Gemini 1.5 Flash model (current model)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Get the Gemini 1.5 Flash model for image analysis (vision capabilities included)
const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

/**
 * Analyze ingredients for gut health impact
 */
export async function analyzeIngredients(ingredients: string[]): Promise<MealAnalysis> {
  try {
    const prompt = `
As a specialized gut health and colostomy management AI, analyze these food ingredients for someone with a colostomy:

Ingredients: ${ingredients.join(', ')}

For each ingredient, provide:
1. Gut behavior classification (gas-producing, metabolism-boosting, gut-friendly, potentially-problematic)
2. Risk level for colostomy patients (low, medium, high)
3. Specific effects on gas production
4. Impact on metabolism
5. Detailed recommendations for colostomy patients
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

Focus specifically on colostomy care, gas management, and digestive comfort.
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
Analyze this food image for someone with a colostomy. Identify:

1. All visible foods and ingredients
2. Potential hidden ingredients based on food type
3. Confidence level in identification (0-1)
4. Gut health assessment for each ingredient
5. Specific suggestions for colostomy patients

Focus on identifying ingredients that might affect:
- Gas production
- Digestive comfort
- Stoma output consistency
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
Based on this colostomy patient's history and current time, provide personalized meal recommendations:

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
Analyze these symptoms for a colostomy patient:

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

Focus on colostomy-specific considerations and practical advice.
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
Create a ${duration}-day meal plan for a colostomy patient with these requirements:

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
Analyze this food entry for a colostomy patient:

Food Description: "${description}"

Provide analysis including:
1. Potential warning flags (e.g., "gas-producing", "high-fiber", "spicy")
2. Risk level assessment for colostomy patients
3. Confidence in assessment (0-1)
4. Specific insights and recommendations

Format as JSON:
{
  "flags": ["flag1", "flag2"],
  "riskLevel": "low|medium|high",
  "confidence": 0.85,
  "insights": ["insight1", "insight2"]
}

Focus on colostomy-specific considerations like gas production, digestive comfort, and stoma output.
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
Analyze this symptom entry for a colostomy patient:

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

Focus on colostomy-specific symptoms and their potential causes.
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

// Export a default service object
export const GeminiService = {
  analyzeIngredients,
  analyzeFoodImage,
  getPersonalizedRecommendations,
  analyzeSymptoms,
  generateMealPlan,
  analyzeFoodEntry,
  analyzeSymptomEntry,
};
