import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, UserPlus, TrendingUp, DollarSign, Target, CheckCircle2,
  AlertCircle, Calendar, Plus, Sparkles, ArrowUpRight, ArrowDownRight,
  Clock, Zap, Brain, TrendingDown
} from 'lucide-react';
import { getDashboardStats, getPipelineStages, getLeadSources } from '@/db/api';
import type { DashboardStats, PipelineStage, LeadSourceData } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generateDashboardInsights } from '@/services/aiService';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<{
    insights: string[];
    recommendations: string[];
    trends: string[];
  } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, pipelineData, sourcesData] = await Promise.all([
        getDashboardStats(),
        getPipelineStages(),
        getLeadSources(),
      ]);
      setStats(statsData);
      setPipelineStages(pipelineData);
      setLeadSources(sourcesData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    if (!stats) return;
    
    try {
      setLoadingAI(true);
      const insights = await generateDashboardInsights({
        totalLeads: stats.totalLeads,
        totalOpportunities: stats.totalOpportunities,
        totalRevenue: stats.totalRevenue,
        conversionRate: stats.conversionRate,
      });
      setAiInsights(insights);
      toast({
        title: 'AI Insights Generated',
        description: 'Fresh insights are ready for you',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate AI insights',
        variant: 'destructive',
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-4 w-4 rounded-full bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2 bg-muted" />
                <Skeleton className="h-3 w-32 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Active Leads',
      value: stats.totalLeads.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: UserPlus,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Opportunities',
      value: stats.totalOpportunities.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Win Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your business overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={loadAIInsights}
            disabled={loadingAI || !stats}
          >
            <Sparkles className={cn("h-4 w-4", loadingAI && "animate-spin")} />
            {loadingAI ? 'Generating...' : 'AI Insights'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card 
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <Icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={cn(
                    'h-3 w-3',
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  )} />
                  <span className={cn(
                    'text-xs font-medium',
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pipeline Overview */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Pipeline</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your deals through each stage
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pipeline">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => {
                const percentage = (stage.count / stats.totalOpportunities) * 100 || 0;
                const colors = [
                  'bg-blue-500',
                  'bg-purple-500',
                  'bg-amber-500',
                  'bg-emerald-500',
                ];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', colors[index % colors.length])} />
                        <span className="font-medium text-foreground">{stage.stage}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{stage.count} deals</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(stage.totalValue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', colors[index % colors.length])}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Common tasks and shortcuts
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/leads">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/contacts">
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/pipeline">
                <Target className="h-4 w-4 mr-2" />
                Create Opportunity
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/activities">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Schedule Activity
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Where your leads come from
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source, index) => {
                const percentage = (source.count / stats.totalLeads) * 100 || 0;
                const colors = [
                  { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' },
                  { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' },
                  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
                  { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{source.source}</span>
                      <Badge variant="secondary" className={cn(color.bg, color.text)}>
                        {source.count}
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', color.bar)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI-Powered Insights
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {aiInsights ? 'Smart recommendations for your business' : 'Click "AI Insights" to generate recommendations'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingAI ? (
              <>
                <Skeleton className="h-20 w-full bg-muted" />
                <Skeleton className="h-20 w-full bg-muted" />
                <Skeleton className="h-20 w-full bg-muted" />
              </>
            ) : aiInsights ? (
              <>
                {aiInsights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                    <Zap className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Insight {index + 1}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight}</p>
                    </div>
                  </div>
                ))}
                {aiInsights.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                    <TrendingUp className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Recommendation {index + 1}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <Zap className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">High-Priority Follow-ups</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 opportunities need immediate attention. Follow up today to increase win probability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <TrendingUp className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Revenue Forecast</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on current pipeline, projected revenue for next month: {formatCurrency(stats.totalRevenue * 1.15)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Stale Leads Alert</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      5 leads haven't been contacted in over 7 days. Re-engage to prevent loss.
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
