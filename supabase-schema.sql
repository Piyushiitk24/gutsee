-- Supabase Database Schema for Stoma Tracker
-- This file contains the complete database schema migration from Prisma to Supabase

-- Enable Row Level Security (RLS) for all tables
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE meal_type AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER');
CREATE TYPE output_consistency AS ENUM ('LIQUID', 'SOFT', 'FORMED', 'HARD');
CREATE TYPE irrigation_quality AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');
CREATE TYPE symptom_type AS ENUM ('CRAMPING', 'BLOATING', 'NAUSEA', 'FATIGUE', 'PAIN', 'OTHER');
CREATE TYPE pattern_type AS ENUM ('FOOD_OUTPUT', 'FOOD_GAS', 'TIMING', 'IRRIGATION', 'SYMPTOM');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  colostomy_date DATE,
  medical_notes TEXT
);

-- Create foods table
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  barcode VARCHAR(255),
  category VARCHAR(255),
  description TEXT,
  calories DECIMAL(8,2),
  protein DECIMAL(8,2),
  fat DECIMAL(8,2),
  carbs DECIMAL(8,2),
  fiber DECIMAL(8,2),
  sugar DECIMAL(8,2),
  sodium DECIMAL(8,2),
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  description TEXT,
  risk_score DECIMAL(3,2) DEFAULT 0,
  gas_risk DECIMAL(3,2) DEFAULT 0,
  output_risk DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_ingredients junction table
CREATE TABLE food_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  percentage DECIMAL(5,2),
  UNIQUE(food_id, ingredient_id)
);

-- Create meals table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  meal_type meal_type DEFAULT 'OTHER',
  is_planned BOOLEAN DEFAULT FALSE,
  confidence DECIMAL(3,2) DEFAULT 1.0,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_items table
CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'g',
  notes TEXT
);

-- Create stoma_outputs table
CREATE TABLE stoma_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  volume DECIMAL(8,2),
  consistency output_consistency,
  color VARCHAR(100),
  notes TEXT,
  is_first_after_irrigation BOOLEAN DEFAULT FALSE,
  hours_since_irrigation DECIMAL(4,2),
  hours_since_last_meal DECIMAL(4,2),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gas_sessions table
CREATE TABLE gas_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- minutes
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  frequency INTEGER,
  notes TEXT,
  is_nighttime BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create irrigations table
CREATE TABLE irrigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  quality irrigation_quality NOT NULL,
  duration INTEGER, -- minutes
  volume DECIMAL(8,2), -- ml
  notes TEXT,
  completeness INTEGER NOT NULL CHECK (completeness >= 1 AND completeness <= 10),
  comfort INTEGER NOT NULL CHECK (comfort >= 1 AND comfort <= 10),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptoms table
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  type symptom_type NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  description TEXT,
  notes TEXT,
  possible_triggers TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patterns table
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type pattern_type NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  strength DECIMAL(3,2) NOT NULL,
  frequency INTEGER,
  conditions JSONB NOT NULL,
  predictions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_foods_user_id ON foods(user_id);
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_category ON foods(category);

CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_timestamp ON meals(timestamp);
CREATE INDEX idx_meals_meal_type ON meals(meal_type);

CREATE INDEX idx_meal_items_meal_id ON meal_items(meal_id);
CREATE INDEX idx_meal_items_food_id ON meal_items(food_id);

CREATE INDEX idx_stoma_outputs_user_id ON stoma_outputs(user_id);
CREATE INDEX idx_stoma_outputs_timestamp ON stoma_outputs(timestamp);

CREATE INDEX idx_gas_sessions_user_id ON gas_sessions(user_id);
CREATE INDEX idx_gas_sessions_timestamp ON gas_sessions(timestamp);

CREATE INDEX idx_irrigations_user_id ON irrigations(user_id);
CREATE INDEX idx_irrigations_timestamp ON irrigations(timestamp);

CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_symptoms_timestamp ON symptoms(timestamp);

CREATE INDEX idx_patterns_user_id ON patterns(user_id);
CREATE INDEX idx_patterns_type ON patterns(type);
CREATE INDEX idx_patterns_is_active ON patterns(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stoma_outputs_updated_at BEFORE UPDATE ON stoma_outputs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gas_sessions_updated_at BEFORE UPDATE ON gas_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_irrigations_updated_at BEFORE UPDATE ON irrigations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stoma_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gas_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Foods policies
CREATE POLICY "Users can view their own foods" ON foods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own foods" ON foods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own foods" ON foods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own foods" ON foods FOR DELETE USING (auth.uid() = user_id);

-- Ingredients are public (shared across all users)
CREATE POLICY "Anyone can view ingredients" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert ingredients" ON ingredients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Food ingredients policies
CREATE POLICY "Users can view food ingredients for their foods" ON food_ingredients FOR SELECT 
  USING (EXISTS (SELECT 1 FROM foods WHERE foods.id = food_ingredients.food_id AND foods.user_id = auth.uid()));
CREATE POLICY "Users can insert food ingredients for their foods" ON food_ingredients FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM foods WHERE foods.id = food_ingredients.food_id AND foods.user_id = auth.uid()));
CREATE POLICY "Users can update food ingredients for their foods" ON food_ingredients FOR UPDATE
  USING (EXISTS (SELECT 1 FROM foods WHERE foods.id = food_ingredients.food_id AND foods.user_id = auth.uid()));
CREATE POLICY "Users can delete food ingredients for their foods" ON food_ingredients FOR DELETE
  USING (EXISTS (SELECT 1 FROM foods WHERE foods.id = food_ingredients.food_id AND foods.user_id = auth.uid()));

-- Meals policies
CREATE POLICY "Users can view their own meals" ON meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meals" ON meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meals" ON meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meals" ON meals FOR DELETE USING (auth.uid() = user_id);

-- Meal items policies
CREATE POLICY "Users can view meal items for their meals" ON meal_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()));
CREATE POLICY "Users can insert meal items for their meals" ON meal_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()));
CREATE POLICY "Users can update meal items for their meals" ON meal_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()));
CREATE POLICY "Users can delete meal items for their meals" ON meal_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()));

-- Stoma outputs policies
CREATE POLICY "Users can view their own stoma outputs" ON stoma_outputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stoma outputs" ON stoma_outputs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stoma outputs" ON stoma_outputs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stoma outputs" ON stoma_outputs FOR DELETE USING (auth.uid() = user_id);

-- Gas sessions policies
CREATE POLICY "Users can view their own gas sessions" ON gas_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own gas sessions" ON gas_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gas sessions" ON gas_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gas sessions" ON gas_sessions FOR DELETE USING (auth.uid() = user_id);

-- Irrigations policies
CREATE POLICY "Users can view their own irrigations" ON irrigations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own irrigations" ON irrigations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own irrigations" ON irrigations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own irrigations" ON irrigations FOR DELETE USING (auth.uid() = user_id);

-- Symptoms policies
CREATE POLICY "Users can view their own symptoms" ON symptoms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own symptoms" ON symptoms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own symptoms" ON symptoms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own symptoms" ON symptoms FOR DELETE USING (auth.uid() = user_id);

-- Patterns policies
CREATE POLICY "Users can view their own patterns" ON patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own patterns" ON patterns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own patterns" ON patterns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own patterns" ON patterns FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default ingredients
INSERT INTO ingredients (name, category, description, risk_score, gas_risk, output_risk) VALUES
  ('Wheat', 'Grains', 'Common wheat flour and products', 0.6, 0.4, 0.3),
  ('Corn', 'Grains', 'Corn and corn products', 0.5, 0.6, 0.4),
  ('Rice', 'Grains', 'Rice and rice products', 0.2, 0.1, 0.1),
  ('Beans', 'Legumes', 'Various bean types', 0.8, 0.9, 0.6),
  ('Lentils', 'Legumes', 'Lentil varieties', 0.7, 0.8, 0.5),
  ('Broccoli', 'Vegetables', 'Cruciferous vegetable', 0.7, 0.8, 0.4),
  ('Cabbage', 'Vegetables', 'Cruciferous vegetable', 0.8, 0.9, 0.5),
  ('Onions', 'Vegetables', 'Allium family', 0.6, 0.7, 0.3),
  ('Garlic', 'Vegetables', 'Allium family', 0.5, 0.6, 0.2),
  ('Chicken', 'Protein', 'Lean protein source', 0.1, 0.1, 0.0),
  ('Beef', 'Protein', 'Red meat protein', 0.3, 0.2, 0.1),
  ('Fish', 'Protein', 'Seafood protein', 0.1, 0.1, 0.0),
  ('Eggs', 'Protein', 'Egg protein', 0.2, 0.1, 0.0),
  ('Milk', 'Dairy', 'Cow milk and products', 0.4, 0.3, 0.2),
  ('Cheese', 'Dairy', 'Aged cheese products', 0.5, 0.4, 0.3),
  ('Yogurt', 'Dairy', 'Fermented dairy', 0.3, 0.2, 0.1),
  ('Apples', 'Fruits', 'Common fruit', 0.3, 0.2, 0.4),
  ('Bananas', 'Fruits', 'Tropical fruit', 0.2, 0.1, 0.2),
  ('Oranges', 'Fruits', 'Citrus fruit', 0.4, 0.3, 0.5),
  ('Tomatoes', 'Vegetables', 'Nightshade family', 0.4, 0.3, 0.6),
  ('Potatoes', 'Vegetables', 'Starchy vegetable', 0.3, 0.2, 0.2),
  ('Carrots', 'Vegetables', 'Root vegetable', 0.2, 0.1, 0.1),
  ('Spinach', 'Vegetables', 'Leafy green', 0.3, 0.2, 0.2),
  ('Lettuce', 'Vegetables', 'Leafy green', 0.2, 0.1, 0.1),
  ('Nuts', 'Nuts/Seeds', 'Tree nuts', 0.4, 0.3, 0.2),
  ('Almonds', 'Nuts/Seeds', 'Tree nuts', 0.3, 0.2, 0.1),
  ('Peanuts', 'Nuts/Seeds', 'Legume nuts', 0.5, 0.4, 0.3),
  ('Spicy Peppers', 'Spices', 'Hot peppers', 0.9, 0.7, 0.8),
  ('Black Pepper', 'Spices', 'Common spice', 0.4, 0.3, 0.2),
  ('Cumin', 'Spices', 'Aromatic spice', 0.3, 0.4, 0.2),
  ('Artificial Sweeteners', 'Additives', 'Sugar substitutes', 0.6, 0.5, 0.7),
  ('High Fructose Corn Syrup', 'Additives', 'Sweetener', 0.5, 0.4, 0.6),
  ('Preservatives', 'Additives', 'Food preservatives', 0.4, 0.3, 0.3),
  ('Food Coloring', 'Additives', 'Artificial colors', 0.3, 0.2, 0.2)
ON CONFLICT (name) DO NOTHING;
