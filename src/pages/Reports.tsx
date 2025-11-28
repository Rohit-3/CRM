import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { getDashboardStats, getPipelineStages, getLeadSources } from '@/db/api';
import type { DashboardStats, PipelineStage, LeadSourceData } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
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
        description: error.message || 'Failed to load report data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your CRM performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openOpportunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
              <span className="text-sm font-medium">Won Deals</span>
              <Badge className="bg-success text-success-foreground">
                {stats.wonOpportunities}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
              <span className="text-sm font-medium">Lost Deals</span>
              <Badge className="bg-destructive text-destructive-foreground">
                {stats.lostOpportunities}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
              <span className="text-sm font-medium">Conversion Rate</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-bold">{stats.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border border-border rounded-lg">
              <span className="text-sm font-medium">Average Deal Size</span>
              <span className="font-bold">{formatCurrency(stats.averageDealSize)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pipeline data available
                </p>
              ) : (
                pipelineStages.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {stage.stage}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {stage.count} {stage.count === 1 ? 'deal' : 'deals'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(stage.totalValue)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Sources Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {leadSources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 col-span-3">
                No lead source data available
              </p>
            ) : (
              leadSources.map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <span className="text-sm font-medium capitalize">
                    {source.source}
                  </span>
                  <Badge variant="secondary">{source.count}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
