/**
 * Alternative AI Service - Direct Google Gemini API Integration
 * 
 * This version uses Google Gemini API directly without Miaoda platform.
 * 
 * Setup:
 * 1. Get Google AI API key from: https://aistudio.google.com/app/apikey
 * 2. Add to .env: VITE_GOOGLE_AI_API_KEY=your_api_key_here
 * 3. Replace the import in your components:
 *    From: import { ... } from '@/services/aiService'
 *    To:   import { ... } from '@/services/aiService.direct'
 */

import type { Lead, Contact, Opportunity, Interaction } from '@/types/types';

const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_AI_API_KEY}`;

interface AIMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

async function callAI(messages: AIMessage[]): Promise<string> {
  try {
    if (!GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file');
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text || 'No response from AI';
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

export async function analyzeLeadScore(lead: Lead): Promise<{
  score: number;
  reasoning: string;
  recommendations: string[];
}> {
  const prompt = `Analyze this sales lead and provide a score from 0-100 based on their potential value:

Lead Information:
- Name: ${lead.first_name} ${lead.last_name}
- Company: ${lead.company || 'Not provided'}
- Title: ${lead.title || 'Not provided'}
- Email: ${lead.email || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Source: ${lead.source || 'Unknown'}
- Current Status: ${lead.status}
- Current Score: ${lead.score}

Provide your response in this exact JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation of the score>",
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback parsing
  }

  return {
    score: lead.score,
    reasoning: response,
    recommendations: ['Follow up within 24 hours', 'Research company background', 'Prepare personalized pitch'],
  };
}

export async function predictChurnRisk(contact: Contact, interactions: Interaction[]): Promise<{
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
  reasoning: string;
  preventionActions: string[];
}> {
  const lastInteraction = interactions[0];
  const interactionCount = interactions.length;
  const daysSinceLastContact = lastInteraction
    ? Math.floor((Date.now() - new Date(lastInteraction.interaction_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const prompt = `Analyze this customer's churn risk:

Customer: ${contact.first_name} ${contact.last_name}
Title: ${contact.title || 'Unknown'}
Department: ${contact.department || 'Unknown'}
Total Interactions: ${interactionCount}
Days Since Last Contact: ${daysSinceLastContact}
Last Interaction Type: ${lastInteraction?.type || 'None'}

Provide churn risk analysis in this JSON format:
{
  "riskLevel": "<low|medium|high>",
  "probability": <number 0-100>,
  "reasoning": "<explanation>",
  "preventionActions": ["<action 1>", "<action 2>", "<action 3>"]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    riskLevel: daysSinceLastContact > 60 ? 'high' : daysSinceLastContact > 30 ? 'medium' : 'low',
    probability: Math.min(daysSinceLastContact * 1.5, 100),
    reasoning: response,
    preventionActions: ['Schedule check-in call', 'Send value-add content', 'Offer exclusive benefit'],
  };
}

export async function suggestNextBestAction(
  entityType: 'lead' | 'contact' | 'opportunity',
  entityData: any,
  recentInteractions: Interaction[]
): Promise<{
  action: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  timing: string;
}> {
  const interactionSummary = recentInteractions
    .slice(0, 5)
    .map(i => `${i.type}: ${i.subject || 'No subject'} (${new Date(i.interaction_date).toLocaleDateString()})`)
    .join('\n');

  const prompt = `Based on this ${entityType} data and recent interactions, suggest the next best action:

${entityType.toUpperCase()} Data:
${JSON.stringify(entityData, null, 2)}

Recent Interactions:
${interactionSummary || 'No recent interactions'}

Provide recommendation in this JSON format:
{
  "action": "<specific action to take>",
  "priority": "<high|medium|low>",
  "reasoning": "<why this action>",
  "timing": "<when to do it>"
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    action: 'Schedule follow-up call',
    priority: 'medium',
    reasoning: response,
    timing: 'Within 2-3 business days',
  };
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  keyPhrases: string[];
}> {
  const prompt = `Analyze the sentiment of this text:

"${text}"

Provide analysis in this JSON format:
{
  "sentiment": "<positive|neutral|negative>",
  "score": <number -100 to 100>,
  "keyPhrases": ["<phrase 1>", "<phrase 2>", "<phrase 3>"]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    sentiment: 'neutral',
    score: 0,
    keyPhrases: [],
  };
}

export async function generateEmailDraft(
  recipientName: string,
  purpose: string,
  context: string
): Promise<string> {
  const prompt = `Write a professional business email:

To: ${recipientName}
Purpose: ${purpose}
Context: ${context}

Write a concise, professional email (3-4 paragraphs max).`;

  return await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);
}

export async function segmentCustomers(contacts: Contact[]): Promise<{
  segments: Array<{
    name: string;
    description: string;
    contactIds: string[];
    characteristics: string[];
  }>;
}> {
  const contactSummary = contacts.slice(0, 20).map(c => ({
    id: c.id,
    name: `${c.first_name} ${c.last_name}`,
    title: c.title,
    department: c.department,
  }));

  const prompt = `Analyze these contacts and suggest customer segments:

${JSON.stringify(contactSummary, null, 2)}

Provide segmentation in this JSON format:
{
  "segments": [
    {
      "name": "<segment name>",
      "description": "<segment description>",
      "contactIds": ["<id1>", "<id2>"],
      "characteristics": ["<trait 1>", "<trait 2>"]
    }
  ]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    segments: [
      {
        name: 'General Contacts',
        description: 'All contacts',
        contactIds: contacts.map(c => c.id),
        characteristics: ['Diverse group'],
      },
    ],
  };
}

export async function predictOpportunityWinProbability(opportunity: Opportunity): Promise<{
  probability: number;
  reasoning: string;
  riskFactors: string[];
  strengthFactors: string[];
}> {
  const prompt = `Analyze this sales opportunity and predict win probability:

Opportunity: ${opportunity.name}
Stage: ${opportunity.stage}
Amount: $${opportunity.amount || 0}
Current Probability: ${opportunity.probability}%
Expected Close: ${opportunity.expected_close_date || 'Not set'}
Status: ${opportunity.status}

Provide analysis in this JSON format:
{
  "probability": <number 0-100>,
  "reasoning": "<explanation>",
  "riskFactors": ["<risk 1>", "<risk 2>"],
  "strengthFactors": ["<strength 1>", "<strength 2>"]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    probability: opportunity.probability,
    reasoning: response,
    riskFactors: ['Timeline uncertainty'],
    strengthFactors: ['Strong engagement'],
  };
}

export async function generateDashboardInsights(data: {
  totalLeads: number;
  totalOpportunities: number;
  totalRevenue: number;
  conversionRate: number;
}): Promise<{
  insights: string[];
  recommendations: string[];
  trends: string[];
}> {
  const prompt = `Analyze this CRM dashboard data and provide actionable insights:

Dashboard Metrics:
- Total Leads: ${data.totalLeads}
- Total Opportunities: ${data.totalOpportunities}
- Total Revenue: $${data.totalRevenue}
- Conversion Rate: ${data.conversionRate}%

Provide analysis in this JSON format:
{
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"],
  "trends": ["<trend 1>", "<trend 2>"]
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    insights: [
      'Your pipeline is growing steadily',
      'Conversion rates are within industry standards',
      'Revenue targets are on track',
    ],
    recommendations: [
      'Focus on high-value opportunities',
      'Increase follow-up frequency with warm leads',
      'Implement automated nurture campaigns',
    ],
    trends: [
      'Lead generation trending upward',
      'Deal velocity improving',
    ],
  };
}

export async function calculateCustomerLifetimeValue(
  contact: Contact,
  opportunities: Opportunity[]
): Promise<{
  clv: number;
  reasoning: string;
  growthPotential: 'high' | 'medium' | 'low';
}> {
  const totalRevenue = opportunities
    .filter(o => o.stage === 'closed_won')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const prompt = `Calculate Customer Lifetime Value (CLV) for this customer:

Customer: ${contact.first_name} ${contact.last_name}
Title: ${contact.title || 'Unknown'}
Department: ${contact.department || 'Unknown'}
Total Won Deals: ${opportunities.filter(o => o.stage === 'closed_won').length}
Total Revenue: $${totalRevenue}
Active Opportunities: ${opportunities.filter(o => o.status === 'open').length}

Provide CLV analysis in this JSON format:
{
  "clv": <estimated lifetime value in dollars>,
  "reasoning": "<explanation of calculation>",
  "growthPotential": "<high|medium|low>"
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    clv: totalRevenue * 1.5,
    reasoning: response,
    growthPotential: totalRevenue > 100000 ? 'high' : totalRevenue > 50000 ? 'medium' : 'low',
  };
}

export async function smartSearch(query: string, context: string): Promise<{
  suggestions: string[];
  filters: Array<{ field: string; value: string }>;
  intent: string;
}> {
  const prompt = `Analyze this search query and provide smart suggestions:

Query: "${query}"
Context: ${context}

Provide search analysis in this JSON format:
{
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "filters": [{"field": "<field name>", "value": "<filter value>"}],
  "intent": "<what user is trying to find>"
}`;

  const response = await callAI([
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ]);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback
  }

  return {
    suggestions: [query],
    filters: [],
    intent: 'General search',
  };
}
