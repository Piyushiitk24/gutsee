-- Add health_entries table for flexible logging system
-- This table will store all types of health-related entries (food, symptoms, etc.)

CREATE TYPE entry_type AS ENUM (
  'breakfast', 'lunch', 'dinner', 'snack', 'drinks', 
  'medication', 'supplements', 'bowel', 'gas', 'mood', 
  'symptoms', 'energy', 'sleep', 'stress', 'exercise', 
  'irrigation', 'first_gas', 'first_motion', 'motion_feeling', 
  'constipation', 'diarrhea'
);

CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

CREATE TABLE health_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type entry_type NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  ai_flags TEXT[] DEFAULT '{}',
  risk_level risk_level DEFAULT 'low',
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  insights TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_health_entries_user_id ON health_entries(user_id);
CREATE INDEX idx_health_entries_timestamp ON health_entries(timestamp);
CREATE INDEX idx_health_entries_type ON health_entries(type);
CREATE INDEX idx_health_entries_risk_level ON health_entries(risk_level);

-- Create trigger for updated_at
CREATE TRIGGER update_health_entries_updated_at 
  BEFORE UPDATE ON health_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own health entries" ON health_entries 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health entries" ON health_entries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health entries" ON health_entries 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health entries" ON health_entries 
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to analyze patterns in health entries
CREATE OR REPLACE FUNCTION analyze_health_patterns(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  pattern_type TEXT,
  correlation_score DECIMAL(3,2),
  description TEXT,
  confidence DECIMAL(3,2)
) AS $$
BEGIN
  -- This function will analyze patterns in health entries
  -- Implementation would include correlation analysis between food entries and symptoms
  RETURN QUERY
  SELECT 
    'food_symptom_correlation'::TEXT as pattern_type,
    0.75::DECIMAL(3,2) as correlation_score,
    'High correlation between dairy intake and gas production'::TEXT as description,
    0.85::DECIMAL(3,2) as confidence
  WHERE user_uuid IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get AI insights for a user
CREATE OR REPLACE FUNCTION get_user_ai_insights(user_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  insight_type TEXT,
  message TEXT,
  priority INTEGER,
  related_entries_count INTEGER
) AS $$
BEGIN
  -- This function will provide AI-generated insights based on user's health entries
  RETURN QUERY
  SELECT 
    'gas_pattern'::TEXT as insight_type,
    'You tend to experience more gas after consuming dairy products'::TEXT as message,
    2::INTEGER as priority,
    5::INTEGER as related_entries_count
  WHERE user_uuid IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
