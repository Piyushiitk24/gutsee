// Types for the Gut Tracker application
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  gutDate?: Date;
  medicalNotes?: string;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  category?: string;
  description?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  isCustom: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  description?: string;
  riskScore?: number;
  gasRisk?: number;
  outputRisk?: number;
  createdAt: Date;
}

export interface Meal {
  id: string;
  name?: string;
  notes?: string;
  timestamp: Date;
  location?: string;
  mealType: MealType;
  isPlanned: boolean;
  confidence?: number;
  userId: string;
  items: MealItem[];
}

export interface MealItem {
  id: string;
  mealId: string;
  foodId: string;
  quantity: number;
  unit: string;
  notes?: string;
  food?: Food;
}

export interface GutOutput {
  id: string;
  timestamp: Date;
  volume?: number;
  consistency?: OutputConsistency;
  color?: string;
  notes?: string;
  isFirstAfterIrrigation: boolean;
  hoursSinceIrrigation?: number;
  hoursSinceLastMeal?: number;
  userId: string;
}

export interface GasSession {
  id: string;
  timestamp: Date;
  duration?: number; // minutes
  intensity: number; // 1-10 scale
  frequency?: number; // episodes in session
  notes?: string;
  isNighttime: boolean;
  isPublic: boolean;
  userId: string;
}

export interface Irrigation {
  id: string;
  timestamp: Date;
  quality: IrrigationQuality;
  duration?: number; // minutes
  volume?: number; // ml
  notes?: string;
  completeness: number; // 1-10 scale
  comfort: number; // 1-10 scale
  userId: string;
}

export interface Symptom {
  id: string;
  timestamp: Date;
  type: SymptomType;
  severity: number; // 1-10 scale
  description?: string;
  notes?: string;
  possibleTriggers?: string;
  userId: string;
}

export interface Pattern {
  id: string;
  name: string;
  description?: string;
  type: PatternType;
  confidence: number;
  strength: number;
  frequency?: number;
  conditions: Record<string, unknown>; // JSON
  predictions?: Record<string, unknown>; // JSON
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  OTHER = 'OTHER'
}

export enum OutputConsistency {
  LIQUID = 'LIQUID',
  SOFT = 'SOFT',
  FORMED = 'FORMED',
  HARD = 'HARD'
}

export enum IrrigationQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum SymptomType {
  CRAMPING = 'CRAMPING',
  BLOATING = 'BLOATING',
  NAUSEA = 'NAUSEA',
  FATIGUE = 'FATIGUE',
  PAIN = 'PAIN',
  OTHER = 'OTHER'
}

export enum PatternType {
  FOOD_OUTPUT = 'FOOD_OUTPUT',
  FOOD_GAS = 'FOOD_GAS',
  TIMING = 'TIMING',
  IRRIGATION = 'IRRIGATION',
  SYMPTOM = 'SYMPTOM'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Types
export interface DashboardStats {
  currentStreak: number;
  totalDays: number;
  successRate: number;
  avgOutputFreeTime: number;
  todayMeals: number;
  todayOutputs: number;
  todayGasSessions: number;
  hoursSinceIrrigation: number;
}

// Form Types
export interface MealFormData {
  name?: string;
  mealType: MealType;
  timestamp: Date;
  location?: string;
  notes?: string;
  items: {
    foodId: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
}

export interface OutputFormData {
  timestamp: Date;
  volume?: number;
  consistency?: OutputConsistency;
  color?: string;
  notes?: string;
  isFirstAfterIrrigation: boolean;
}

export interface GasFormData {
  timestamp: Date;
  duration?: number;
  intensity: number;
  frequency?: number;
  notes?: string;
  isNighttime: boolean;
  isPublic: boolean;
}

export interface IrrigationFormData {
  timestamp: Date;
  quality: IrrigationQuality;
  duration?: number;
  volume?: number;
  notes?: string;
  completeness: number;
  comfort: number;
}
