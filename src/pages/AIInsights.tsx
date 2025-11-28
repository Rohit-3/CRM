import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  Sparkles,
  Mail,
  MessageSquare,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { getLeads, getContacts, getOpportunities, getInteractions } from '@/db/api';
import { 
  analyzeLeadScore, 
  predictChurnRisk, 
  suggestNextBestAction,
  analyzeSentiment,
  generateEmailDraft,
  segmentCustomers,
  predictOpportunityWinProbability
} from '@/services/aiService';
import type { Lead, Contact, Opportunity } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function AIInsights() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const { toast } = useToast();

  // Email generation state
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');

  // Sentiment analysis state
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leadsData, contactsData, oppsData] = await Promise.all([
        getLeads(),
        getContacts(),
        getOpportunities(),
      ]);
      setLeads(leadsData);
      setContacts(contactsData);
      setOpportunities(oppsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    }
  };

  const handleAnalyzeLead = async () => {
    if (leads.length === 0) {
      toast({
        title: 'No Leads',
        description: 'Please create some leads first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const lead = leads[0];
      const result = await analyzeLeadScore(lead);
      setAiResult({
        type: 'lead_score',
        lead: lead,
        ...result,
      });
      toast({
        title: 'Analysis Complete',
        description: 'AI has analyzed the lead',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to analyze lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePredictChurn = async () => {
    if (contacts.length === 0) {
      toast({
        title: 'No Contacts',
        description: 'Please create some contacts first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const contact = contacts[0];
      const interactions = await getInteractions();
      const contactInteractions = interactions.filter(i => i.contact_id === contact.id);
      const result = await predictChurnRisk(contact, contactInteractions);
      setAiResult({
        type: 'churn_prediction',
        contact: contact,
        ...result,
      });
      toast({
        title: 'Prediction Complete',
        description: 'AI has predicted churn risk',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to predict churn',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextBestAction = async () => {
    if (opportunities.length === 0) {
      toast({
        title: 'No Opportunities',
        description: 'Please create some opportunities first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const opp = opportunities[0];
      const interactions = await getInteractions();
      const oppInteractions = interactions.filter(i => i.opportunity_id === opp.id);
      const result = await suggestNextBestAction('opportunity', opp, oppInteractions);
      setAiResult({
        type: 'next_action',
        opportunity: opp,
        ...result,
      });
      toast({
        title: 'Recommendation Ready',
        description: 'AI has suggested next best action',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to get recommendation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePredictWinProbability = async () => {
    if (opportunities.length === 0) {
      toast({
        title: 'No Opportunities',
        description: 'Please create some opportunities first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const opp = opportunities[0];
      const result = await predictOpportunityWinProbability(opp);
      setAiResult({
        type: 'win_probability',
        opportunity: opp,
        ...result,
      });
      toast({
        title: 'Analysis Complete',
        description: 'AI has predicted win probability',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to predict probability',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailRecipient || !emailPurpose) {
      toast({
        title: 'Missing Information',
        description: 'Please provide recipient name and purpose',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const email = await generateEmailDraft(emailRecipient, emailPurpose, emailContext);
      setGeneratedEmail(email);
      toast({
        title: 'Email Generated',
        description: 'AI has drafted your email',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to generate email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSentiment = async () => {
    if (!sentimentText) {
      toast({
        title: 'No Text',
        description: 'Please enter text to analyze',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSentiment(sentimentText);
      setSentimentResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'AI has analyzed sentiment',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to analyze sentiment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSegmentCustomers = async () => {
    if (contacts.length === 0) {
      toast({
        title: 'No Contacts',
        description: 'Please create some contacts first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await segmentCustomers(contacts);
      setAiResult({
        type: 'segmentation',
        ...result,
      });
      toast({
        title: 'Segmentation Complete',
        description: 'AI has segmented your customers',
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to segment customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success text-success-foreground';
      case 'negative':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary rounded-lg">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">
            Leverage artificial intelligence to optimize your CRM strategy
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lead Scoring
                </CardTitle>
                <CardDescription>
                  AI-powered lead qualification and scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleAnalyzeLead} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Analyze Top Lead'}
                </Button>
                {aiResult?.type === 'lead_score' && (
                  <div className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {aiResult.lead.first_name} {aiResult.lead.last_name}
                      </span>
                      <Badge className="bg-primary text-primary-foreground">
                        Score: {aiResult.score}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiResult.reasoning}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recommendations:</p>
                      <ul className="text-sm space-y-1">
                        {aiResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Churn Prediction
                </CardTitle>
                <CardDescription>
                  Identify customers at risk of leaving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handlePredictChurn} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Predict Churn Risk'}
                </Button>
                {aiResult?.type === 'churn_prediction' && (
                  <div className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {aiResult.contact.first_name} {aiResult.contact.last_name}
                      </span>
                      <Badge className={getRiskColor(aiResult.riskLevel)}>
                        {aiResult.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Probability:</span>
                      <span className="font-bold">{aiResult.probability}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiResult.reasoning}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Prevention Actions:</p>
                      <ul className="text-sm space-y-1">
                        {aiResult.preventionActions.map((action: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-warning mt-0.5" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Win Probability
                </CardTitle>
                <CardDescription>
                  Predict opportunity success likelihood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handlePredictWinProbability} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Predict Win Rate'}
                </Button>
                {aiResult?.type === 'win_probability' && (
                  <div className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{aiResult.opportunity.name}</span>
                      <Badge className="bg-primary text-primary-foreground">
                        {aiResult.probability}% Win Rate
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiResult.reasoning}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-success">Strengths:</p>
                        <ul className="text-sm space-y-1">
                          {aiResult.strengthFactors.map((factor: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">• {factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-destructive">Risks:</p>
                        <ul className="text-sm space-y-1">
                          {aiResult.riskFactors.map((factor: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">• {factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Segmentation
                </CardTitle>
                <CardDescription>
                  AI-powered customer grouping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleSegmentCustomers} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Segment Customers'}
                </Button>
                {aiResult?.type === 'segmentation' && (
                  <div className="space-y-3">
                    {aiResult.segments.map((segment: any, idx: number) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{segment.name}</span>
                          <Badge variant="outline">{segment.contactIds.length} contacts</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{segment.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {segment.characteristics.map((char: string, cidx: number) => (
                            <Badge key={cidx} variant="secondary" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Generator
                </CardTitle>
                <CardDescription>
                  AI-powered email drafting assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input
                    id="recipient"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Email Purpose</Label>
                  <Input
                    id="purpose"
                    value={emailPurpose}
                    onChange={(e) => setEmailPurpose(e.target.value)}
                    placeholder="Follow-up after meeting"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (Optional)</Label>
                  <Textarea
                    id="context"
                    value={emailContext}
                    onChange={(e) => setEmailContext(e.target.value)}
                    placeholder="We discussed pricing and timeline..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleGenerateEmail} disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate Email'}
                </Button>
                {generatedEmail && (
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm font-medium mb-2">Generated Email:</p>
                    <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {generatedEmail}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Analyze customer communication sentiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sentiment-text">Text to Analyze</Label>
                  <Textarea
                    id="sentiment-text"
                    value={sentimentText}
                    onChange={(e) => setSentimentText(e.target.value)}
                    placeholder="Enter customer message or feedback..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleAnalyzeSentiment} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                </Button>
                {sentimentResult && (
                  <div className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sentiment:</span>
                      <Badge className={getSentimentColor(sentimentResult.sentiment)}>
                        {sentimentResult.sentiment.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-bold">{sentimentResult.score}</span>
                    </div>
                    {sentimentResult.keyPhrases.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Phrases:</p>
                        <div className="flex flex-wrap gap-2">
                          {sentimentResult.keyPhrases.map((phrase: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Next Best Action
              </CardTitle>
              <CardDescription>
                AI-recommended actions for your opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleNextBestAction} disabled={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Get Recommendation'}
              </Button>
              {aiResult?.type === 'next_action' && (
                <div className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{aiResult.opportunity.name}</span>
                    <Badge className={
                      aiResult.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                      aiResult.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                      'bg-info text-info-foreground'
                    }>
                      {aiResult.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Recommended Action:</p>
                      <p className="text-sm text-muted-foreground mt-1">{aiResult.action}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Timing:</p>
                      <p className="text-sm text-muted-foreground mt-1">{aiResult.timing}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reasoning:</p>
                      <p className="text-sm text-muted-foreground mt-1">{aiResult.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
