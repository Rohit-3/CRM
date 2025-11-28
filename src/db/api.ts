import { supabase } from './supabase';
import type {
  Profile,
  Territory,
  Account,
  Contact,
  Lead,
  Opportunity,
  Interaction,
  Task,
  Note,
  Tag,
  DashboardStats,
  PipelineStage,
  LeadSourceData,
} from '@/types/types';

// ============ Profiles ============
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getCurrentProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return getProfile(user.id);
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// ============ Territories ============
export const getTerritories = async (): Promise<Territory[]> => {
  const { data, error } = await supabase
    .from('territories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createTerritory = async (territory: Omit<Territory, 'id' | 'created_at'>): Promise<Territory | null> => {
  const { data, error } = await supabase
    .from('territories')
    .insert(territory)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// ============ Accounts ============
export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAccount = async (id: string): Promise<Account | null> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createAccount = async (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<Account | null> => {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateAccount = async (id: string, updates: Partial<Account>): Promise<Account | null> => {
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Contacts ============
export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getContact = async (id: string): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getContactsByAccount = async (accountId: string): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Leads ============
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getLead = async (id: string): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Opportunities ============
export const getOpportunities = async (): Promise<Opportunity[]> => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getOpportunity = async (id: string): Promise<Opportunity | null> => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getOpportunitiesByAccount = async (accountId: string): Promise<Opportunity[]> => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>): Promise<Opportunity | null> => {
  const { data, error } = await supabase
    .from('opportunities')
    .insert(opportunity)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateOpportunity = async (id: string, updates: Partial<Opportunity>): Promise<Opportunity | null> => {
  const { data, error } = await supabase
    .from('opportunities')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteOpportunity = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('opportunities')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Interactions ============
export const getInteractions = async (): Promise<Interaction[]> => {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .order('interaction_date', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getInteractionsByContact = async (contactId: string): Promise<Interaction[]> => {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('contact_id', contactId)
    .order('interaction_date', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getInteractionsByAccount = async (accountId: string): Promise<Interaction[]> => {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('account_id', accountId)
    .order('interaction_date', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createInteraction = async (interaction: Omit<Interaction, 'id' | 'created_at'>): Promise<Interaction | null> => {
  const { data, error } = await supabase
    .from('interactions')
    .insert(interaction)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteInteraction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Tasks ============
export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getMyTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getTasksByEntity = async (entityType: string, entityId: string): Promise<Task[]> => {
  const column = `${entityType}_id`;
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq(column, entityId)
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Notes ============
export const getNotesByEntity = async (entityType: string, entityId: string): Promise<Note[]> => {
  const column = `${entityType}_id`;
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq(column, entityId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createNote = async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note | null> => {
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateNote = async (id: string, updates: Partial<Note>): Promise<Note | null> => {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============ Tags ============
export const getTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createTag = async (tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from('tags')
    .insert(tag)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// ============ Dashboard Analytics ============
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [
    leadsResult,
    contactsResult,
    opportunitiesResult,
    openOppsResult,
    wonOppsResult,
    lostOppsResult,
    tasksResult,
  ] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase.from('opportunities').select('amount'),
    supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('opportunities').select('amount').eq('status', 'won'),
    supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'lost'),
    supabase.from('tasks').select('due_date, status'),
  ]);

  const totalLeads = leadsResult.count || 0;
  const totalContacts = contactsResult.count || 0;
  const allOpportunities = Array.isArray(opportunitiesResult.data) ? opportunitiesResult.data : [];
  const totalOpportunities = allOpportunities.length;
  const totalRevenue = allOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
  
  const openOpportunities = openOppsResult.count || 0;
  const wonOpportunities = Array.isArray(wonOppsResult.data) ? wonOppsResult.data.length : 0;
  const lostOpportunities = lostOppsResult.count || 0;
  
  const conversionRate = totalLeads > 0 ? (wonOpportunities / totalLeads) * 100 : 0;
  const averageDealSize = wonOpportunities > 0 
    ? (Array.isArray(wonOppsResult.data) ? wonOppsResult.data : []).reduce((sum, opp) => sum + (opp.amount || 0), 0) / wonOpportunities 
    : 0;

  const tasks = Array.isArray(tasksResult.data) ? tasksResult.data : [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const tasksOverdue = tasks.filter(t => 
    t.status !== 'completed' && t.due_date && new Date(t.due_date) < today
  ).length;
  
  const tasksDueToday = tasks.filter(t => {
    if (t.status === 'completed' || !t.due_date) return false;
    const dueDate = new Date(t.due_date);
    return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
  }).length;

  return {
    totalLeads,
    totalContacts,
    totalOpportunities,
    totalRevenue,
    openOpportunities,
    wonOpportunities,
    lostOpportunities,
    conversionRate,
    averageDealSize,
    tasksOverdue,
    tasksDueToday,
  };
};

export const getPipelineStages = async (): Promise<PipelineStage[]> => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('stage, amount')
    .eq('status', 'open');
  
  if (error) throw error;
  
  const opportunities = Array.isArray(data) ? data : [];
  const stageMap = new Map<string, { count: number; totalValue: number }>();
  
  opportunities.forEach(opp => {
    const stage = opp.stage || 'unknown';
    const current = stageMap.get(stage) || { count: 0, totalValue: 0 };
    stageMap.set(stage, {
      count: current.count + 1,
      totalValue: current.totalValue + (opp.amount || 0),
    });
  });
  
  return Array.from(stageMap.entries()).map(([stage, data]) => ({
    stage,
    count: data.count,
    totalValue: data.totalValue,
  }));
};

export const getLeadSources = async (): Promise<LeadSourceData[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('source');
  
  if (error) throw error;
  
  const leads = Array.isArray(data) ? data : [];
  const sourceMap = new Map<string, number>();
  
  leads.forEach(lead => {
    const source = lead.source || 'Unknown';
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });
  
  return Array.from(sourceMap.entries()).map(([source, count]) => ({
    source,
    count,
  }));
};
