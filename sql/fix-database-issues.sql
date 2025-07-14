-- Fix 1: Function Search Path Mutable Issue
-- Update the function to have a stable search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public, pg_catalog
SECURITY DEFINER;

-- Fix 2: Auth RLS Initialization Plan Issue
-- Optimize RLS policies to use subqueries for better performance

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Users can view their own health entries" ON public.health_entries;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own meals" ON public.meals;
DROP POLICY IF EXISTS "Users can view own stoma output" ON public.stoma_output;
DROP POLICY IF EXISTS "Users can view own gas output" ON public.gas_output;
DROP POLICY IF EXISTS "Users can view own irrigation records" ON public.irrigation_records;
DROP POLICY IF EXISTS "Users can view own symptoms" ON public.symptoms;
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;

-- Create optimized policies using subqueries
-- Health entries (if this table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'health_entries' AND table_schema = 'public') THEN
        EXECUTE 'CREATE POLICY "Users can view their own health entries" ON public.health_entries FOR SELECT USING (user_id = (SELECT auth.uid()))';
        EXECUTE 'CREATE POLICY "Users can insert their own health entries" ON public.health_entries FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()))';
        EXECUTE 'CREATE POLICY "Users can update their own health entries" ON public.health_entries FOR UPDATE USING (user_id = (SELECT auth.uid()))';
        EXECUTE 'CREATE POLICY "Users can delete their own health entries" ON public.health_entries FOR DELETE USING (user_id = (SELECT auth.uid()))';
    END IF;
END
$$;

-- Profiles policies (optimized)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = (SELECT auth.uid()));

-- Meals policies (optimized)
CREATE POLICY "Users can view own meals" ON public.meals FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own meals" ON public.meals FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own meals" ON public.meals FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own meals" ON public.meals FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Stoma output policies (optimized)
CREATE POLICY "Users can view own stoma output" ON public.stoma_output FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own stoma output" ON public.stoma_output FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own stoma output" ON public.stoma_output FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own stoma output" ON public.stoma_output FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Gas output policies (optimized)
CREATE POLICY "Users can view own gas output" ON public.gas_output FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own gas output" ON public.gas_output FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own gas output" ON public.gas_output FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own gas output" ON public.gas_output FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Irrigation records policies (optimized)
CREATE POLICY "Users can view own irrigation records" ON public.irrigation_records FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own irrigation records" ON public.irrigation_records FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own irrigation records" ON public.irrigation_records FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own irrigation records" ON public.irrigation_records FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Symptoms policies (optimized)
CREATE POLICY "Users can view own symptoms" ON public.symptoms FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own symptoms" ON public.symptoms FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own symptoms" ON public.symptoms FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own symptoms" ON public.symptoms FOR DELETE USING (user_id = (SELECT auth.uid()));

-- User preferences policies (optimized)
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Optimize meal_items policies too
DROP POLICY IF EXISTS "Users can view own meal items" ON public.meal_items;
DROP POLICY IF EXISTS "Users can insert own meal items" ON public.meal_items;
DROP POLICY IF EXISTS "Users can update own meal items" ON public.meal_items;
DROP POLICY IF EXISTS "Users can delete own meal items" ON public.meal_items;

CREATE POLICY "Users can view own meal items" ON public.meal_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = (SELECT auth.uid()))
);
CREATE POLICY "Users can insert own meal items" ON public.meal_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = (SELECT auth.uid()))
);
CREATE POLICY "Users can update own meal items" ON public.meal_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = (SELECT auth.uid()))
);
CREATE POLICY "Users can delete own meal items" ON public.meal_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.meals WHERE meals.id = meal_items.meal_id AND meals.user_id = (SELECT auth.uid()))
);

-- Also update the updated_at function trigger to use the optimized function
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS set_updated_at_meals ON public.meals;
DROP TRIGGER IF EXISTS set_updated_at_stoma_output ON public.stoma_output;
DROP TRIGGER IF EXISTS set_updated_at_gas_output ON public.gas_output;
DROP TRIGGER IF EXISTS set_updated_at_irrigation_records ON public.irrigation_records;
DROP TRIGGER IF EXISTS set_updated_at_symptoms ON public.symptoms;
DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON public.user_preferences;

-- Recreate triggers with the optimized function
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_meals BEFORE UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_stoma_output BEFORE UPDATE ON public.stoma_output FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_gas_output BEFORE UPDATE ON public.gas_output FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_irrigation_records BEFORE UPDATE ON public.irrigation_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_symptoms BEFORE UPDATE ON public.symptoms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_user_preferences BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
