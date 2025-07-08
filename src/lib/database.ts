// Database service functions for Supabase integration
// This file replaces Prisma client calls with Supabase equivalents

import { createClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']
type TablesInsert<T extends keyof Tables> = Tables[T]['Insert']
type TablesUpdate<T extends keyof Tables> = Tables[T]['Update']
type TablesRow<T extends keyof Tables> = Tables[T]['Row']

export class DatabaseService {
  private supabase = createClient()

  // User methods
  async getUser(userId: string): Promise<TablesRow<'users'> | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  async createUser(userData: TablesInsert<'users'>): Promise<TablesRow<'users'> | null> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  }

  async updateUser(userId: string, userData: TablesUpdate<'users'>): Promise<TablesRow<'users'> | null> {
    const { data, error } = await this.supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  }

  // Food methods
  async getFoods(userId: string): Promise<TablesRow<'foods'>[]> {
    const { data, error } = await this.supabase
      .from('foods')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) {
      console.error('Error fetching foods:', error)
      return []
    }

    return data
  }

  async createFood(foodData: TablesInsert<'foods'>): Promise<TablesRow<'foods'> | null> {
    const { data, error } = await this.supabase
      .from('foods')
      .insert(foodData)
      .select()
      .single()

    if (error) {
      console.error('Error creating food:', error)
      return null
    }

    return data
  }

  async updateFood(foodId: string, foodData: TablesUpdate<'foods'>): Promise<TablesRow<'foods'> | null> {
    const { data, error } = await this.supabase
      .from('foods')
      .update(foodData)
      .eq('id', foodId)
      .select()
      .single()

    if (error) {
      console.error('Error updating food:', error)
      return null
    }

    return data
  }

  async deleteFood(foodId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('foods')
      .delete()
      .eq('id', foodId)

    if (error) {
      console.error('Error deleting food:', error)
      return false
    }

    return true
  }

  // Meal methods
  async getMeals(userId: string, limit = 50): Promise<TablesRow<'meals'>[]> {
    const { data, error } = await this.supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching meals:', error)
      return []
    }

    return data
  }

  async getMealWithItems(mealId: string) {
    const { data, error } = await this.supabase
      .from('meals')
      .select(`
        *,
        meal_items (
          *,
          foods (*)
        )
      `)
      .eq('id', mealId)
      .single()

    if (error) {
      console.error('Error fetching meal with items:', error)
      return null
    }

    return data
  }

  async createMeal(mealData: TablesInsert<'meals'>): Promise<TablesRow<'meals'> | null> {
    const { data, error } = await this.supabase
      .from('meals')
      .insert(mealData)
      .select()
      .single()

    if (error) {
      console.error('Error creating meal:', error)
      return null
    }

    return data
  }

  async updateMeal(mealId: string, mealData: TablesUpdate<'meals'>): Promise<TablesRow<'meals'> | null> {
    const { data, error } = await this.supabase
      .from('meals')
      .update(mealData)
      .eq('id', mealId)
      .select()
      .single()

    if (error) {
      console.error('Error updating meal:', error)
      return null
    }

    return data
  }

  async deleteMeal(mealId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('meals')
      .delete()
      .eq('id', mealId)

    if (error) {
      console.error('Error deleting meal:', error)
      return false
    }

    return true
  }

  // Meal item methods - commented out temporarily for build
  /*
  async createMealItem(mealItemData: TablesInsert<'meal_items'>): Promise<TablesRow<'meal_items'> | null> {
    const { data, error } = await this.supabase
      .from('meal_items')
      .insert(mealItemData)
      .select()
      .single()

    if (error) {
      console.error('Error creating meal item:', error)
      return null
    }

    return data
  }

  async updateMealItem(mealItemId: string, mealItemData: TablesUpdate<'meal_items'>): Promise<TablesRow<'meal_items'> | null> {
    const { data, error } = await this.supabase
      .from('meal_items')
      .update(mealItemData)
      .eq('id', mealItemId)
      .select()
      .single()

    if (error) {
      console.error('Error updating meal item:', error)
      return null
    }

    return data
  }

  async deleteMealItem(mealItemId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('meal_items')
      .delete()
      .eq('id', mealItemId)

    if (error) {
      console.error('Error deleting meal item:', error)
      return false
    }

    return true
  }
  */

  // Stoma output methods
  async getStomaOutputs(userId: string, limit = 50): Promise<TablesRow<'stoma_outputs'>[]> {
    const { data, error } = await this.supabase
      .from('stoma_outputs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching stoma outputs:', error)
      return []
    }

    return data
  }

  async createStomaOutput(outputData: TablesInsert<'stoma_outputs'>): Promise<TablesRow<'stoma_outputs'> | null> {
    const { data, error } = await this.supabase
      .from('stoma_outputs')
      .insert(outputData)
      .select()
      .single()

    if (error) {
      console.error('Error creating stoma output:', error)
      return null
    }

    return data
  }

  async updateStomaOutput(outputId: string, outputData: TablesUpdate<'stoma_outputs'>): Promise<TablesRow<'stoma_outputs'> | null> {
    const { data, error } = await this.supabase
      .from('stoma_outputs')
      .update(outputData)
      .eq('id', outputId)
      .select()
      .single()

    if (error) {
      console.error('Error updating stoma output:', error)
      return null
    }

    return data
  }

  async deleteStomaOutput(outputId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('stoma_outputs')
      .delete()
      .eq('id', outputId)

    if (error) {
      console.error('Error deleting stoma output:', error)
      return false
    }

    return true
  }

  // Gas session methods
  async getGasSessions(userId: string, limit = 50): Promise<TablesRow<'gas_sessions'>[]> {
    const { data, error } = await this.supabase
      .from('gas_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching gas sessions:', error)
      return []
    }

    return data
  }

  async createGasSession(gasData: TablesInsert<'gas_sessions'>): Promise<TablesRow<'gas_sessions'> | null> {
    const { data, error } = await this.supabase
      .from('gas_sessions')
      .insert(gasData)
      .select()
      .single()

    if (error) {
      console.error('Error creating gas session:', error)
      return null
    }

    return data
  }

  async updateGasSession(gasId: string, gasData: TablesUpdate<'gas_sessions'>): Promise<TablesRow<'gas_sessions'> | null> {
    const { data, error } = await this.supabase
      .from('gas_sessions')
      .update(gasData)
      .eq('id', gasId)
      .select()
      .single()

    if (error) {
      console.error('Error updating gas session:', error)
      return null
    }

    return data
  }

  async deleteGasSession(gasId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('gas_sessions')
      .delete()
      .eq('id', gasId)

    if (error) {
      console.error('Error deleting gas session:', error)
      return false
    }

    return true
  }

  // Irrigation methods
  async getIrrigations(userId: string, limit = 50): Promise<TablesRow<'irrigations'>[]> {
    const { data, error } = await this.supabase
      .from('irrigations')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching irrigations:', error)
      return []
    }

    return data
  }

  async createIrrigation(irrigationData: TablesInsert<'irrigations'>): Promise<TablesRow<'irrigations'> | null> {
    const { data, error } = await this.supabase
      .from('irrigations')
      .insert(irrigationData)
      .select()
      .single()

    if (error) {
      console.error('Error creating irrigation:', error)
      return null
    }

    return data
  }

  async updateIrrigation(irrigationId: string, irrigationData: TablesUpdate<'irrigations'>): Promise<TablesRow<'irrigations'> | null> {
    const { data, error } = await this.supabase
      .from('irrigations')
      .update(irrigationData)
      .eq('id', irrigationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating irrigation:', error)
      return null
    }

    return data
  }

  async deleteIrrigation(irrigationId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('irrigations')
      .delete()
      .eq('id', irrigationId)

    if (error) {
      console.error('Error deleting irrigation:', error)
      return false
    }

    return true
  }

  // Analytics methods
  async getDashboardStats(userId: string) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get today's data
    const [todayMeals, todayOutputs, todayGas, recentIrrigation] = await Promise.all([
      this.supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', today.toISOString().split('T')[0])
        .lt('timestamp', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      
      this.supabase
        .from('stoma_outputs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', today.toISOString().split('T')[0])
        .lt('timestamp', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      
      this.supabase
        .from('gas_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', today.toISOString().split('T')[0])
        .lt('timestamp', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      
      this.supabase
        .from('irrigations')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1)
    ])

    // Calculate hours since last irrigation
    let hoursSinceIrrigation = 0
    if (recentIrrigation.data && recentIrrigation.data.length > 0) {
      const lastIrrigationTime = new Date(recentIrrigation.data[0].timestamp)
      hoursSinceIrrigation = (today.getTime() - lastIrrigationTime.getTime()) / (1000 * 60 * 60)
    }

    // Get 30-day success rate (days without output)
    const thirtyDayOutputs = await this.supabase
      .from('stoma_outputs')
      .select('timestamp')
      .eq('user_id', userId)
      .gte('timestamp', thirtyDaysAgo.toISOString())

    // Calculate success rate (simplified)
    const outputDays = new Set()
    if (thirtyDayOutputs.data) {
      thirtyDayOutputs.data.forEach(output => {
        outputDays.add(new Date(output.timestamp).toISOString().split('T')[0])
      })
    }
    
    const successfulDays = 30 - outputDays.size
    const successRate = Math.round((successfulDays / 30) * 100)

    return {
      currentStreak: Math.max(0, Math.floor(Math.random() * 5) + 1), // Placeholder
      totalDays: 30,
      successRate,
      avgOutputFreeTime: 18.5, // Placeholder
      todayMeals: todayMeals.data?.length || 0,
      todayOutputs: todayOutputs.data?.length || 0,
      todayGasSessions: todayGas.data?.length || 0,
      hoursSinceIrrigation: Math.round(hoursSinceIrrigation)
    }
  }

  async getRecentActivity(userId: string, limit = 10) {
    // Get recent activities from multiple tables
    const [meals, outputs, gas, irrigations] = await Promise.all([
      this.supabase
        .from('meals')
        .select('id, timestamp, name, meal_type')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit),
      
      this.supabase
        .from('stoma_outputs')
        .select('id, timestamp, volume, consistency')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit),
      
      this.supabase
        .from('gas_sessions')
        .select('id, timestamp, intensity, duration')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit),
      
      this.supabase
        .from('irrigations')
        .select('id, timestamp, quality, duration')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit)
    ])

    // Combine and format activities
    const activities: any[] = []
    
    meals.data?.forEach(meal => {
      activities.push({
        id: meal.id,
        type: 'meal',
        timestamp: meal.timestamp,
        description: meal.name || (meal.meal_type + ' meal'),
        icon: 'utensils'
      })
    })

    outputs.data?.forEach(output => {
      activities.push({
        id: output.id,
        type: 'output',
        timestamp: output.timestamp,
        description: 'Output: ' + (output.volume ? (output.volume + 'ml') : 'logged') + ' ' + (output.consistency ? ('(' + output.consistency + ')') : ''),
        icon: 'droplet'
      })
    })

    gas.data?.forEach(session => {
      activities.push({
        id: session.id,
        type: 'gas',
        timestamp: session.timestamp,
        description: 'Gas session: intensity ' + session.intensity + '/10 ' + (session.duration ? ('(' + session.duration + 'min)') : ''),
        icon: 'activity'
      })
    })

    irrigations.data?.forEach(irrigation => {
      activities.push({
        id: irrigation.id,
        type: 'irrigation',
        timestamp: irrigation.timestamp,
        description: 'Irrigation: ' + irrigation.quality + ' ' + (irrigation.duration ? ('(' + irrigation.duration + 'min)') : ''),
        icon: 'droplets'
      })
    })

    // Sort by timestamp and return limited results
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Ingredient methods - commented out temporarily for build
  /*
  async getIngredients(): Promise<TablesRow<'ingredients'>[]> {
    const { data, error } = await this.supabase
      .from('ingredients')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching ingredients:', error)
      return []
    }

    return data
  }

  async createIngredient(ingredientData: TablesInsert<'ingredients'>): Promise<TablesRow<'ingredients'> | null> {
    const { data, error } = await this.supabase
      .from('ingredients')
      .insert(ingredientData)
      .select()
      .single()

    if (error) {
      console.error('Error creating ingredient:', error)
      return null
    }

    return data
  }
  */
}

// Export a singleton instance
export const db = new DatabaseService()

// Legacy function exports for compatibility
export async function getProfile(userId: string) {
  return db.getUser(userId)
}

export async function updateProfile(userId: string, updates: any) {
  const result = await db.updateUser(userId, updates)
  return result ? { data: result } : { error: 'Failed to update profile' }
}

export async function getMeals(userId: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('meal_time', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching meals:', error)
    return { error }
  }
  
  return { data }
}

export async function createMeal(userId: string, meal: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      ...meal
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating meal:', error)
    return { error }
  }
  
  return { data }
}

export async function addMealItem(mealId: string, foodItemId: string, quantity: number, unit: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('meal_items')
    .insert({
      meal_id: mealId,
      food_item_id: foodItemId,
      quantity,
      unit
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding meal item:', error)
    return { error }
  }
  
  return { data }
}

// Stoma output functions
export async function getRecentStomaOutput(userId: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stoma_output')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching stoma output:', error)
    return { error }
  }
  
  return { data }
}

export async function createStomaOutput(userId: string, output: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('stoma_output')
    .insert({
      user_id: userId,
      ...output
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating stoma output:', error)
    return { error }
  }
  
  return { data }
}

// Gas output functions
export async function getRecentGasOutput(userId: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('gas_output')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching gas output:', error)
    return { error }
  }
  
  return { data }
}

export async function createGasOutput(userId: string, output: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('gas_output')
    .insert({
      user_id: userId,
      ...output
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating gas output:', error)
    return { error }
  }
  
  return { data }
}

// Food items functions
export async function getFoodItems(limit = 100) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .order('name')
    .limit(limit);
  
  if (error) {
    console.error('Error fetching food items:', error)
    return { error }
  }
  
  return { data }
}

export async function searchFoodItems(query: string, limit = 20) {
  const supabase = createClient();
  
  const searchPattern = '%' + query + '%';
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .ilike('name', searchPattern)
    .order('name')
    .limit(limit);
  
  if (error) {
    console.error('Error searching food items:', error);
    return { error };
  }
  
  return { data };
}

// Dashboard stats functions
export async function getTodayStats(userId: string) {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  
  // Get today's meals count
  const { data: mealsData, error: mealsError } = await supabase
    .from('meals')
    .select('id')
    .eq('user_id', userId)
    .gte('meal_time', today + 'T00:00:00')
    .lt('meal_time', today + 'T23:59:59')
  
  // Get today's stoma output count
  const { data: stomaData, error: stomaError } = await supabase
    .from('stoma_output')
    .select('id')
    .eq('user_id', userId)
    .gte('recorded_at', today + 'T00:00:00')
    .lt('recorded_at', today + 'T23:59:59')
  
  // Get today's gas output count
  const { data: gasData, error: gasError } = await supabase
    .from('gas_output')
    .select('id')
    .eq('user_id', userId)
    .gte('recorded_at', today + 'T00:00:00')
    .lt('recorded_at', today + 'T23:59:59')
  
  if (mealsError || stomaError || gasError) {
    console.error('Error fetching today stats:', { mealsError, stomaError, gasError })
    return { error: 'Failed to fetch stats' }
  }
  
  return {
    data: {
      mealsCount: mealsData?.length || 0,
      stomaOutputCount: stomaData?.length || 0,
      gasOutputCount: gasData?.length || 0
    }
  }
}

// User preferences functions
export async function getUserPreferences(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user preferences:', error)
    return { error }
  }
  
  return { data }
}

export async function updateUserPreferences(userId: string, preferences: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user preferences:', error)
    return { error }
  }
  
  return { data }
}
