export type UserRole = 'admin' | 'sales_manager' | 'sales_rep' | 'marketing' | 'support' | 'executive';

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  territory_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Territory {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  annual_revenue: number | null;
  employee_count: number | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  account_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  title: string | null;
  department: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  source: string | null;
  status: string;
  score: number;
  owner_id: string | null;
  converted_to_contact_id: string | null;
  converted_to_opportunity_id: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  name: string;
  account_id: string | null;
  contact_id: string | null;
  stage: string;
  amount: number | null;
  probability: number;
  expected_close_date: string | null;
  closed_date: string | null;
  status: string;
  owner_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  type: string;
  subject: string | null;
  description: string | null;
  contact_id: string | null;
  account_id: string | null;
  opportunity_id: string | null;
  lead_id: string | null;
  user_id: string | null;
  interaction_date: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string | null;
  contact_id: string | null;
  account_id: string | null;
  opportunity_id: string | null;
  lead_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  content: string;
  contact_id: string | null;
  account_id: string | null;
  opportunity_id: string | null;
  lead_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
}

export interface EntityTag {
  id: string;
  tag_id: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

// Extended types with relations
export interface ContactWithAccount extends Contact {
  account?: Account;
  owner?: Profile;
}

export interface OpportunityWithRelations extends Opportunity {
  account?: Account;
  contact?: Contact;
  owner?: Profile;
}

export interface LeadWithOwner extends Lead {
  owner?: Profile;
}

export interface TaskWithRelations extends Task {
  assigned_user?: Profile;
  created_user?: Profile;
  contact?: Contact;
  account?: Account;
  opportunity?: Opportunity;
  lead?: Lead;
}

export interface InteractionWithRelations extends Interaction {
  user?: Profile;
  contact?: Contact;
  account?: Account;
  opportunity?: Opportunity;
  lead?: Lead;
}

export interface NoteWithCreator extends Note {
  creator?: Profile;
}

// Dashboard statistics
export interface DashboardStats {
  totalLeads: number;
  totalContacts: number;
  totalOpportunities: number;
  totalRevenue: number;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  conversionRate: number;
  averageDealSize: number;
  tasksOverdue: number;
  tasksDueToday: number;
}

// Pipeline stage data
export interface PipelineStage {
  stage: string;
  count: number;
  totalValue: number;
}

// Lead source data
export interface LeadSourceData {
  source: string;
  count: number;
}
