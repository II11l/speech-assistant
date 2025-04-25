-- Wedding Speech Assistant Database Schema
-- This file defines the database schema for the Supabase project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  payment_status TEXT NOT NULL DEFAULT 'free',
  CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Set up speech_projects table
CREATE TABLE IF NOT EXISTS speech_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generation_complete BOOLEAN NOT NULL DEFAULT FALSE
);

-- Set up speech_requirements table
CREATE TABLE IF NOT EXISTS speech_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES speech_projects(id) ON DELETE CASCADE,
  role TEXT,
  relationship_length TEXT,
  tone_preference TEXT,
  desired_length INTEGER,
  key_anecdotes JSONB,
  who_to_mention JSONB,
  additional_context TEXT
);

-- Set up speech_drafts table
CREATE TABLE IF NOT EXISTS speech_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES speech_projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_edited BOOLEAN NOT NULL DEFAULT FALSE
);

-- Set up payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stripe_payment_id TEXT
);

-- Create updated_at function for timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for speech_projects
CREATE TRIGGER update_speech_projects_updated_at
BEFORE UPDATE ON speech_projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_users_can_read_own ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_users_can_update_own ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Speech projects policies
CREATE POLICY speech_projects_users_can_read_own ON speech_projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY speech_projects_users_can_insert_own ON speech_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY speech_projects_users_can_update_own ON speech_projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY speech_projects_users_can_delete_own ON speech_projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Speech requirements policies
CREATE POLICY speech_requirements_users_can_read_own ON speech_requirements
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY speech_requirements_users_can_insert_own ON speech_requirements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY speech_requirements_users_can_update_own ON speech_requirements
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

-- Speech drafts policies
CREATE POLICY speech_drafts_users_can_read_own ON speech_drafts
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY speech_drafts_users_can_insert_own ON speech_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY speech_drafts_users_can_update_own ON speech_drafts
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM speech_projects WHERE user_id = auth.uid()
    )
  );

-- Payment records policies
CREATE POLICY payment_records_users_can_read_own ON payment_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY payment_records_users_can_insert_own ON payment_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()); 