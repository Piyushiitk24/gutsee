-- Create health_entries table for the flexible health diary
-- Run this SQL in your Supabase dashboard SQL editor

-- First, create the required enum types if they don't exist
DO $$ BEGIN
  CREATE TYPE entry_type AS ENUM (
    'breakfast', 'lunch', 'dinner', 'snack', 'drinks', 
    'medication', 'supplements', 'bowel', 'gas', 'mood', 
    'symptoms', 'energy', 'sleep', 'stress', 'exercise', 
    'irrigation', 'first_gas', 'first_motion', 'motion_feeling', 
    'constipation', 'diarrhea'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the health_entries table
CREATE TABLE IF NOT EXISTS health_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_health_entries_user_id ON health_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_health_entries_timestamp ON health_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_health_entries_type ON health_entries(type);
CREATE INDEX IF NOT EXISTS idx_health_entries_risk_level ON health_entries(risk_level);

-- Enable Row Level Security
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own health entries" ON health_entries;
DROP POLICY IF EXISTS "Users can insert their own health entries" ON health_entries;
DROP POLICY IF EXISTS "Users can update their own health entries" ON health_entries;
DROP POLICY IF EXISTS "Users can delete their own health entries" ON health_entries;

-- Create RLS policies
CREATE POLICY "Users can view their own health entries" ON health_entries 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own health entries" ON health_entries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health entries" ON health_entries 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health entries" ON health_entries 
  FOR DELETE USING (auth.uid() = user_id);

-- Create update trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_health_entries_updated_at ON health_entries;
CREATE TRIGGER update_health_entries_updated_at 
  BEFORE UPDATE ON health_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 'health_entries table created successfully' AS status;
