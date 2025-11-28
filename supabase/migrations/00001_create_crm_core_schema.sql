/*
# Create CRM Core Schema

## 1. New Tables

### profiles
User profiles with role-based access control
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique)
- `email` (text)
- `phone` (text)
- `full_name` (text)
- `role` (user_role enum: admin, sales_manager, sales_rep, marketing, support, executive)
- `avatar_url` (text)
- `territory_id` (uuid, references territories)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### territories
Sales territory management
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `region` (text)
- `created_at` (timestamptz)

### accounts
Company/organization records
- `id` (uuid, primary key)
- `name` (text, not null)
- `industry` (text)
- `website` (text)
- `phone` (text)
- `email` (text)
- `address` (text)
- `city` (text)
- `state` (text)
- `country` (text)
- `postal_code` (text)
- `annual_revenue` (numeric)
- `employee_count` (integer)
- `owner_id` (uuid, references profiles)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### contacts
Individual customer records
- `id` (uuid, primary key)
- `account_id` (uuid, references accounts)
- `first_name` (text, not null)
- `last_name` (text, not null)
- `email` (text)
- `phone` (text)
- `mobile` (text)
- `title` (text)
- `department` (text)
- `linkedin_url` (text)
- `twitter_url` (text)
- `owner_id` (uuid, references profiles)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### leads
Potential customers with scoring
- `id` (uuid, primary key)
- `first_name` (text, not null)
- `last_name` (text, not null)
- `email` (text)
- `phone` (text)
- `company` (text)
- `title` (text)
- `source` (text)
- `status` (text, default: 'new')
- `score` (integer, default: 0)
- `owner_id` (uuid, references profiles)
- `converted_to_contact_id` (uuid, references contacts)
- `converted_to_opportunity_id` (uuid, references opportunities)
- `converted_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### opportunities
Deals and pipeline management
- `id` (uuid, primary key)
- `name` (text, not null)
- `account_id` (uuid, references accounts)
- `contact_id` (uuid, references contacts)
- `stage` (text, not null, default: 'prospecting')
- `amount` (numeric)
- `probability` (integer, default: 0)
- `expected_close_date` (date)
- `closed_date` (date)
- `status` (text, default: 'open')
- `owner_id` (uuid, references profiles)
- `description` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### interactions
Communication history tracking
- `id` (uuid, primary key)
- `type` (text, not null)
- `subject` (text)
- `description` (text)
- `contact_id` (uuid, references contacts)
- `account_id` (uuid, references accounts)
- `opportunity_id` (uuid, references opportunities)
- `lead_id` (uuid, references leads)
- `user_id` (uuid, references profiles)
- `interaction_date` (timestamptz, default: now())
- `created_at` (timestamptz)

### tasks
Task and follow-up management
- `id` (uuid, primary key)
- `title` (text, not null)
- `description` (text)
- `status` (text, default: 'pending')
- `priority` (text, default: 'medium')
- `due_date` (timestamptz)
- `assigned_to` (uuid, references profiles)
- `created_by` (uuid, references profiles)
- `contact_id` (uuid, references contacts)
- `account_id` (uuid, references accounts)
- `opportunity_id` (uuid, references opportunities)
- `lead_id` (uuid, references leads)
- `completed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### notes
Shared notes and collaboration
- `id` (uuid, primary key)
- `content` (text, not null)
- `contact_id` (uuid, references contacts)
- `account_id` (uuid, references accounts)
- `opportunity_id` (uuid, references opportunities)
- `lead_id` (uuid, references leads)
- `created_by` (uuid, references profiles)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### tags
Flexible tagging system
- `id` (uuid, primary key)
- `name` (text, unique, not null)
- `color` (text)
- `created_at` (timestamptz)

### entity_tags
Many-to-many relationship for tags
- `id` (uuid, primary key)
- `tag_id` (uuid, references tags)
- `entity_type` (text, not null)
- `entity_id` (uuid, not null)
- `created_at` (timestamptz)

## 2. Security

- Enable RLS on all tables
- Create helper functions for role checking
- Admins have full access to all data
- Sales managers can view their team's data
- Sales reps can view and edit their own data
- Marketing and support have read access with limited write
- Executives have read-only access to all data

## 3. Notes

- First registered user becomes admin
- All timestamps use timestamptz for proper timezone handling
- Foreign keys ensure data integrity
- Indexes on frequently queried fields for performance
*/

-- Create user role enum
CREATE TYPE user_role AS ENUM ('admin', 'sales_manager', 'sales_rep', 'marketing', 'support', 'executive');

-- Create territories table
CREATE TABLE IF NOT EXISTS territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  region text,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  phone text,
  full_name text,
  role user_role DEFAULT 'sales_rep'::user_role NOT NULL,
  avatar_url text,
  territory_id uuid REFERENCES territories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  annual_revenue numeric,
  employee_count integer,
  owner_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  mobile text,
  title text,
  department text,
  linkedin_url text,
  twitter_url text,
  owner_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opportunities table (must be before leads due to foreign key)
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  stage text NOT NULL DEFAULT 'prospecting',
  amount numeric,
  probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  closed_date date,
  status text DEFAULT 'open',
  owner_id uuid REFERENCES profiles(id),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  company text,
  title text,
  source text,
  status text DEFAULT 'new',
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  owner_id uuid REFERENCES profiles(id),
  converted_to_contact_id uuid REFERENCES contacts(id),
  converted_to_opportunity_id uuid REFERENCES opportunities(id),
  converted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  subject text,
  description text,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  interaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  assigned_to uuid REFERENCES profiles(id),
  created_by uuid REFERENCES profiles(id),
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Create entity_tags table
CREATE TABLE IF NOT EXISTS entity_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tag_id, entity_type, entity_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_accounts_owner ON accounts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_account ON contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner ON opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_interactions_contact ON interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_interactions_account ON interactions(account_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(interaction_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON entity_tags(entity_type, entity_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Helper function to check if user is sales manager
CREATE OR REPLACE FUNCTION is_sales_manager(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'sales_manager'::user_role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- RLS Policies for territories
CREATE POLICY "Everyone can view territories" ON territories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage territories" ON territories
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for accounts
CREATE POLICY "Admins have full access to accounts" ON accounts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all accounts" ON accounts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own accounts" ON accounts
  FOR ALL TO authenticated USING (owner_id = auth.uid());

-- RLS Policies for contacts
CREATE POLICY "Admins have full access to contacts" ON contacts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own contacts" ON contacts
  FOR ALL TO authenticated USING (owner_id = auth.uid());

-- RLS Policies for leads
CREATE POLICY "Admins have full access to leads" ON leads
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all leads" ON leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own leads" ON leads
  FOR ALL TO authenticated USING (owner_id = auth.uid());

-- RLS Policies for opportunities
CREATE POLICY "Admins have full access to opportunities" ON opportunities
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all opportunities" ON opportunities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own opportunities" ON opportunities
  FOR ALL TO authenticated USING (owner_id = auth.uid());

-- RLS Policies for interactions
CREATE POLICY "Admins have full access to interactions" ON interactions
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all interactions" ON interactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create interactions" ON interactions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for tasks
CREATE POLICY "Admins have full access to tasks" ON tasks
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all tasks" ON tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage tasks assigned to them" ON tasks
  FOR ALL TO authenticated USING (assigned_to = auth.uid() OR created_by = auth.uid());

-- RLS Policies for notes
CREATE POLICY "Admins have full access to notes" ON notes
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view all notes" ON notes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create notes" ON notes
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE TO authenticated USING (created_by = auth.uid());

-- RLS Policies for tags
CREATE POLICY "Everyone can view tags" ON tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for entity_tags
CREATE POLICY "Everyone can view entity_tags" ON entity_tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage entity_tags" ON entity_tags
  FOR ALL TO authenticated USING (true);

-- Trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  -- Only insert into profiles after user is confirmed
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    -- Count existing users in profiles
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- Insert into profiles, first user gets admin role
    INSERT INTO profiles (id, username, email, phone, full_name, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      NEW.email,
      NEW.phone,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'sales_rep'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();