-- Enable RLS (Row Level Security) on all tables
-- This ensures users can only access their own data

-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create food_items table
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    nutritional_info JSONB,
    risk_level INTEGER DEFAULT 1 CHECK (risk_level >= 1 AND risk_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    meal_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create meal_items table (junction table for meals and food_items)
CREATE TABLE IF NOT EXISTS public.meal_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.0,
    unit TEXT NOT NULL DEFAULT 'serving',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stoma_output table
CREATE TABLE IF NOT EXISTS public.stoma_output (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    volume_ml INTEGER,
    consistency TEXT CHECK (consistency IN ('liquid', 'loose', 'soft', 'formed', 'hard')),
    color TEXT,
    blood_present BOOLEAN DEFAULT FALSE,
    mucus_present BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gas_output table
CREATE TABLE IF NOT EXISTS public.gas_output (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) NOT NULL,
    duration_minutes INTEGER,
    odor_level INTEGER CHECK (odor_level >= 1 AND odor_level <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create irrigation_records table
CREATE TABLE IF NOT EXISTS public.irrigation_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    irrigation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    water_volume_ml INTEGER,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    complications TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS public.symptoms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    symptom_type TEXT NOT NULL,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10) NOT NULL,
    description TEXT,
    triggers TEXT,
    relief_methods TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    notification_settings JSONB DEFAULT '{}',
    dietary_restrictions TEXT[],
    irrigation_schedule JSONB,
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stoma_output ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gas_output ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Meals policies
CREATE POLICY "Users can view own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Meal items policies
CREATE POLICY "Users can view own meal items" ON public.meal_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can insert own meal items" ON public.meal_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can update own meal items" ON public.meal_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);
CREATE POLICY "Users can delete own meal items" ON public.meal_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);

-- Stoma output policies
CREATE POLICY "Users can view own stoma output" ON public.stoma_output FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stoma output" ON public.stoma_output FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stoma output" ON public.stoma_output FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stoma output" ON public.stoma_output FOR DELETE USING (auth.uid() = user_id);

-- Gas output policies
CREATE POLICY "Users can view own gas output" ON public.gas_output FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gas output" ON public.gas_output FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gas output" ON public.gas_output FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gas output" ON public.gas_output FOR DELETE USING (auth.uid() = user_id);

-- Irrigation records policies
CREATE POLICY "Users can view own irrigation records" ON public.irrigation_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own irrigation records" ON public.irrigation_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own irrigation records" ON public.irrigation_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own irrigation records" ON public.irrigation_records FOR DELETE USING (auth.uid() = user_id);

-- Symptoms policies
CREATE POLICY "Users can view own symptoms" ON public.symptoms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptoms" ON public.symptoms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own symptoms" ON public.symptoms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own symptoms" ON public.symptoms FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Food items is public (no RLS needed as it's reference data)
-- But we can add policies if needed later

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_meal_time ON public.meals(meal_time);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_items_food_item_id ON public.meal_items(food_item_id);
CREATE INDEX IF NOT EXISTS idx_stoma_output_user_id ON public.stoma_output(user_id);
CREATE INDEX IF NOT EXISTS idx_stoma_output_recorded_at ON public.stoma_output(recorded_at);
CREATE INDEX IF NOT EXISTS idx_gas_output_user_id ON public.gas_output(user_id);
CREATE INDEX IF NOT EXISTS idx_gas_output_recorded_at ON public.gas_output(recorded_at);
CREATE INDEX IF NOT EXISTS idx_irrigation_records_user_id ON public.irrigation_records(user_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_records_date ON public.irrigation_records(irrigation_date);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_id ON public.symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_recorded_at ON public.symptoms(recorded_at);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_meals BEFORE UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_stoma_output BEFORE UPDATE ON public.stoma_output FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_gas_output BEFORE UPDATE ON public.gas_output FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_irrigation_records BEFORE UPDATE ON public.irrigation_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_symptoms BEFORE UPDATE ON public.symptoms FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_user_preferences BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample food items
INSERT INTO public.food_items (name, category, description, risk_level) VALUES
    ('White Rice', 'Grains', 'Easy to digest, low fiber', 1),
    ('Brown Rice', 'Grains', 'High fiber, may cause more output', 3),
    ('Chicken Breast', 'Protein', 'Lean protein, easy to digest', 1),
    ('Spinach', 'Vegetables', 'Leafy green, high fiber', 4),
    ('Banana', 'Fruits', 'Easy to digest, helps with consistency', 1),
    ('Apple', 'Fruits', 'High fiber, may cause gas', 3),
    ('Beans', 'Protein', 'High fiber, may cause gas and output', 4),
    ('White Bread', 'Grains', 'Low fiber, easy to digest', 1),
    ('Whole Wheat Bread', 'Grains', 'High fiber, may increase output', 3),
    ('Yogurt', 'Dairy', 'Probiotics, may help with digestion', 2)
ON CONFLICT DO NOTHING;
