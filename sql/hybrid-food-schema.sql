-- Hybrid Food Database Schema for Stoma Tracker
-- This schema supports the hybrid approach: Open Food Facts + specialized stoma data

-- Table for storing specialized stoma-specific food data
CREATE TABLE IF NOT EXISTS stoma_food_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Food identification (can link to Open Food Facts or be standalone)
    food_id VARCHAR(255), -- Open Food Facts product code or our internal ID
    food_name VARCHAR(255) NOT NULL,
    food_category VARCHAR(255),
    
    -- Stoma-specific data
    fodmap_level VARCHAR(10) CHECK (fodmap_level IN ('low', 'medium', 'high')),
    fiber_content VARCHAR(10) CHECK (fiber_content IN ('low', 'medium', 'high')),
    spice_level VARCHAR(10) CHECK (spice_level IN ('none', 'mild', 'medium', 'hot')),
    processing_level VARCHAR(20) CHECK (processing_level IN ('whole', 'minimally-processed', 'processed', 'ultra-processed')),
    
    -- Stoma safety assessment
    stoma_friendliness VARCHAR(15) CHECK (stoma_friendliness IN ('excellent', 'good', 'moderate', 'caution', 'avoid')),
    digestibility_score INTEGER CHECK (digestibility_score >= 1 AND digestibility_score <= 10),
    gas_production VARCHAR(10) CHECK (gas_production IN ('low', 'medium', 'high')),
    irrigation_impact VARCHAR(15) CHECK (irrigation_impact IN ('none', 'slight', 'moderate', 'significant')),
    
    -- Practical guidance
    recommended_portion_size TEXT,
    preparation_tips TEXT[], -- Array of tips
    alternative_suggestions TEXT[], -- Array of alternative foods
    common_triggers TEXT[], -- Array of trigger ingredients/components
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_verified BOOLEAN DEFAULT FALSE, -- For community/expert verification
    
    -- Indexes for efficient searching
    UNIQUE(food_id, food_name)
);

-- Index for fast food lookups
CREATE INDEX IF NOT EXISTS idx_stoma_food_data_name ON stoma_food_data USING GIN (to_tsvector('english', food_name));
CREATE INDEX IF NOT EXISTS idx_stoma_food_data_category ON stoma_food_data(food_category);
CREATE INDEX IF NOT EXISTS idx_stoma_food_data_friendliness ON stoma_food_data(stoma_friendliness);

-- Table for storing user experiences with specific foods
CREATE TABLE IF NOT EXISTS user_food_experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relationships
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    food_id VARCHAR(255) NOT NULL, -- Links to Open Food Facts or stoma_food_data
    food_name VARCHAR(255) NOT NULL,
    
    -- User experience data
    rating INTEGER CHECK (rating >= 1 AND rating <= 10), -- 1=terrible, 10=excellent
    effects TEXT[], -- Array of effects experienced
    notes TEXT,
    
    -- Context
    portion_consumed VARCHAR(255),
    preparation_method VARCHAR(255),
    time_of_consumption TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate experiences on same day
    UNIQUE(user_id, food_id, DATE(created_at))
);

-- Index for user experience queries
CREATE INDEX IF NOT EXISTS idx_user_food_experiences_user ON user_food_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_food_experiences_food ON user_food_experiences(food_id);
CREATE INDEX IF NOT EXISTS idx_user_food_experiences_rating ON user_food_experiences(rating);

-- Table for community food recommendations and warnings
CREATE TABLE IF NOT EXISTS community_food_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Food identification
    food_id VARCHAR(255) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    
    -- Community insights
    total_ratings INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    total_experiences INTEGER DEFAULT 0,
    
    -- Common effects reported by community
    common_positive_effects TEXT[],
    common_negative_effects TEXT[],
    most_helpful_tips TEXT[],
    
    -- Safety flags
    has_safety_warnings BOOLEAN DEFAULT FALSE,
    warning_count INTEGER DEFAULT 0,
    
    -- Metadata
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(food_id)
);

-- Function to update community insights when user experiences are added
CREATE OR REPLACE FUNCTION update_community_insights()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert community insights
    INSERT INTO community_food_insights (
        food_id, 
        food_name, 
        total_ratings, 
        average_rating, 
        total_experiences,
        last_calculated
    )
    SELECT 
        NEW.food_id,
        NEW.food_name,
        COUNT(*) as total_ratings,
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(*) as total_experiences,
        NOW()
    FROM user_food_experiences 
    WHERE food_id = NEW.food_id
    ON CONFLICT (food_id) 
    DO UPDATE SET
        total_ratings = EXCLUDED.total_ratings,
        average_rating = EXCLUDED.average_rating,
        total_experiences = EXCLUDED.total_experiences,
        last_calculated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update community insights
CREATE TRIGGER update_community_insights_trigger
    AFTER INSERT OR UPDATE ON user_food_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_community_insights();

-- Row Level Security (RLS) policies
ALTER TABLE stoma_food_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_food_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_food_insights ENABLE ROW LEVEL SECURITY;

-- Policy for stoma_food_data: Read access for all authenticated users, write for verified users
CREATE POLICY "stoma_food_data_read" ON stoma_food_data
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "stoma_food_data_write" ON stoma_food_data
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policy for user_food_experiences: Users can only access their own experiences
CREATE POLICY "user_food_experiences_own" ON user_food_experiences
    FOR ALL USING (auth.uid() = user_id);

-- Policy for community_food_insights: Read access for all authenticated users
CREATE POLICY "community_food_insights_read" ON community_food_insights
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert some initial stoma-specific data for common foods
INSERT INTO stoma_food_data (
    food_name, food_category, fodmap_level, fiber_content, spice_level, processing_level,
    stoma_friendliness, digestibility_score, gas_production, irrigation_impact,
    recommended_portion_size, preparation_tips, alternative_suggestions, common_triggers,
    is_verified
) VALUES 
-- Stoma-friendly proteins
('Chicken Breast', 'Protein', 'low', 'low', 'none', 'minimally-processed', 'excellent', 9, 'low', 'none', '100-150g', 
 ARRAY['Cook thoroughly', 'Remove skin', 'Cut into small pieces'], 
 ARRAY['Fish', 'Tofu', 'Eggs'], 
 ARRAY[], TRUE),

('White Fish', 'Protein', 'low', 'low', 'none', 'minimally-processed', 'excellent', 9, 'low', 'none', '120-150g',
 ARRAY['Steam or bake', 'Remove bones carefully', 'Fresh is better than frozen'],
 ARRAY['Chicken', 'Tofu', 'Eggs'],
 ARRAY[], TRUE),

-- Easy carbohydrates
('White Rice', 'Grains', 'low', 'low', 'none', 'processed', 'excellent', 9, 'low', 'none', '3/4 cup cooked',
 ARRAY['Cook until soft', 'Can eat regularly', 'Good base for meals'],
 ARRAY['Pasta', 'White bread', 'Potatoes'],
 ARRAY[], TRUE),

('White Bread', 'Grains', 'low', 'low', 'none', 'processed', 'good', 8, 'low', 'slight', '2 slices',
 ARRAY['Choose fresh bread', 'Toast lightly if preferred', 'Remove crusts if needed'],
 ARRAY['Rice', 'Pasta', 'Crackers'],
 ARRAY['Gluten'], TRUE),

-- Problematic high-fiber foods  
('Brown Rice', 'Grains', 'low', 'high', 'none', 'minimally-processed', 'moderate', 6, 'medium', 'moderate', '1/2 cup cooked',
 ARRAY['Cook until very soft', 'Chew thoroughly', 'Introduce gradually'],
 ARRAY['White rice', 'Quinoa', 'Pasta'],
 ARRAY['High fiber'], TRUE),

-- Dairy products
('Milk', 'Dairy', 'high', 'low', 'none', 'minimally-processed', 'caution', 5, 'high', 'moderate', '1/2 cup',
 ARRAY['Try lactose-free alternatives', 'Monitor for gas/bloating'],
 ARRAY['Almond milk', 'Oat milk', 'Lactose-free milk'],
 ARRAY['Lactose'], TRUE),

-- Vegetables (mixed friendliness)
('Carrots (cooked)', 'Vegetables', 'low', 'medium', 'none', 'minimally-processed', 'good', 8, 'low', 'slight', '1/2 cup',
 ARRAY['Cook until soft', 'Peel before cooking', 'Mash if needed'],
 ARRAY['Sweet potato', 'Squash', 'Parsnips'],
 ARRAY[], TRUE),

('Cabbage', 'Vegetables', 'low', 'high', 'none', 'whole', 'avoid', 4, 'high', 'moderate', 'Avoid or very small amounts',
 ARRAY['Cook thoroughly if consuming', 'Start with tiny amounts', 'Monitor gas production'],
 ARRAY['Lettuce', 'Spinach', 'Cucumber'],
 ARRAY['Sulfur compounds', 'High fiber'], TRUE),

-- Indian staples
('Chapati', 'Indian Bread', 'medium', 'medium', 'none', 'minimally-processed', 'good', 7, 'medium', 'slight', '1 small chapati',
 ARRAY['Make thin', 'Chew well', 'Fresh is better'],
 ARRAY['White bread', 'Rice', 'Idli'],
 ARRAY['Gluten', 'Fiber'], TRUE),

('Dal (Lentils)', 'Indian Curry', 'medium', 'high', 'mild', 'minimally-processed', 'moderate', 6, 'high', 'moderate', '1/4 cup',
 ARRAY['Cook until very soft', 'Remove skin if possible', 'Start with small amounts', 'Use less spice initially'],
 ARRAY['Chicken broth', 'Fish curry', 'Paneer'],
 ARRAY['Oligosaccharides', 'Fiber', 'Spices'], TRUE),

('Basmati Rice', 'Indian Grains', 'low', 'low', 'none', 'minimally-processed', 'excellent', 9, 'low', 'none', '3/4 cup cooked',
 ARRAY['Rinse before cooking', 'Cook until soft', 'Excellent daily staple'],
 ARRAY['Jeera rice', 'Plain rice', 'Biryani rice'],
 ARRAY[], TRUE)

ON CONFLICT (food_id, food_name) DO NOTHING;

-- Create a view for easy querying of enhanced food data
CREATE OR REPLACE VIEW enhanced_food_view AS
SELECT 
    sfd.*,
    cfi.average_rating as community_rating,
    cfi.total_experiences,
    cfi.common_positive_effects,
    cfi.common_negative_effects,
    cfi.has_safety_warnings
FROM stoma_food_data sfd
LEFT JOIN community_food_insights cfi ON sfd.food_id = cfi.food_id;

-- Function to search foods with stoma data
CREATE OR REPLACE FUNCTION search_foods_with_stoma_data(search_term TEXT)
RETURNS TABLE (
    food_name TEXT,
    food_category TEXT,
    stoma_friendliness TEXT,
    digestibility_score INTEGER,
    community_rating DECIMAL,
    total_experiences INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        efv.food_name::TEXT,
        efv.food_category::TEXT,
        efv.stoma_friendliness::TEXT,
        efv.digestibility_score,
        efv.community_rating,
        efv.total_experiences
    FROM enhanced_food_view efv
    WHERE 
        efv.food_name ILIKE '%' || search_term || '%'
        OR efv.food_category ILIKE '%' || search_term || '%'
    ORDER BY 
        efv.stoma_friendliness DESC,
        efv.digestibility_score DESC,
        efv.community_rating DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;
