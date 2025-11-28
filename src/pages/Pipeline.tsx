import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Search, DollarSign, Calendar, TrendingUp, 
  MoreVertical, Filter, Sparkles, Target
} from 'lucide-react';
import { getOpportunities, updateOpportunity } from '@/db/api';
import type { Opportunity } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateOpportunityDialog } from '@/components/dialogs/CreateOpportunityDialog';

const STAGES = [
  { id: 'prospecting', label: 'New', color: 'bg-blue-500', textColor: 'text-blue-400', bgLight: 'bg-blue-500/10' },
  { id: 'qualification', label: 'Qualified', color: 'bg-purple-500', textColor: 'text-purple-400', bgLight: 'bg-purple-500/10' },
  { id: 'proposal', label: 'Proposition', color: 'bg-amber-500', textColor: 'text-amber-400', bgLight: 'bg-amber-500/10' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500', textColor: 'text-orange-400', bgLight: 'bg-orange-500/10' },
  { id: 'closed_won', label: 'Won', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgLight: 'bg-emerald-500/10' },
  { id: 'closed_lost', label: 'Lost', color: 'bg-red-500', textColor: 'text-red-400', bgLight: 'bg-red-500/10' },
];

export default function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<Opportunity | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load opportunities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOpportunitiesByStage = (stageId: string) => {
    return filteredOpportunities.filter((opp) => opp.stage === stageId);
  };

  const getTotalValueByStage = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((sum, opp) => sum + (opp.amount || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    setDraggedItem(opportunity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.stage !== targetStage) {
      try {
        await updateOpportunity(draggedItem.id, { stage: targetStage });
        
        const updatedOpportunities = opportunities.map((opp) =>
          opp.id === draggedItem.id ? { ...opp, stage: targetStage } : opp
        );
        setOpportunities(updatedOpportunities);
        
        toast({
          title: 'Success',
          description: `Moved "${draggedItem.name}" to ${STAGES.find(s => s.id === targetStage)?.label}`,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update opportunity',
          variant: 'destructive',
        });
      }
    }
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your deals through each stage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Card className="bg-card border-border px-4 py-2 flex items-center gap-3">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total Pipeline</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0))}
            </p>
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAGES.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const totalValue = getTotalValueByStage(stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col min-h-[600px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <Card className="bg-card border-border mb-3">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', stage.color)} />
                      <h3 className="font-semibold text-foreground">{stage.label}</h3>
                    </div>
                    <Badge variant="secondary" className={cn(stage.bgLight, stage.textColor)}>
                      {stageOpportunities.length}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                </CardHeader>
              </Card>

              {/* Opportunities */}
              <div className="space-y-3 flex-1">
                {stageOpportunities.length === 0 ? (
                  <Card className="bg-card/50 border-dashed border-border">
                    <CardContent className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">No deals</p>
                    </CardContent>
                  </Card>
                ) : (
                  stageOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity)}
                      className={cn(
                        'bg-card border-border cursor-move hover:border-primary/50 transition-all duration-300 group',
                        draggedItem?.id === opportunity.id && 'opacity-50'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {opportunity.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Amount */}
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                            <span className="text-lg font-bold text-foreground">
                              {formatCurrency(opportunity.amount || 0)}
                            </span>
                          </div>

                          {/* Metadata */}
                          <div className="space-y-2 text-sm">
                            {opportunity.probability && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Win Probability</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={cn('h-full rounded-full', stage.color)}
                                      style={{ width: `${opportunity.probability}%` }}
                                    />
                                  </div>
                                  <span className="font-medium text-foreground">
                                    {opportunity.probability}%
                                  </span>
                                </div>
                              </div>
                            )}

                            {opportunity.expected_close_date && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(opportunity.expected_close_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* AI Insights Badge */}
                          {opportunity.probability && opportunity.probability > 70 && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                              <Sparkles className="h-3 w-3" />
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Opportunity Dialog */}
      <CreateOpportunityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadOpportunities}
      />
    </div>
  );
}
