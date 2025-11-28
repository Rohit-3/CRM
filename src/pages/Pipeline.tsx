import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Sparkles, DollarSign, Calendar, User, TrendingUp, LayoutGrid, List, CalendarDays, BarChart3, MapPin, Settings } from 'lucide-react';
import { getOpportunities, createOpportunity, updateOpportunity } from '@/db/api';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Opportunity } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { predictOpportunityWinProbability } from '@/services/aiService';

type ViewMode = 'kanban' | 'list' | 'calendar' | 'chart';

const STAGES = [
  { id: 'prospecting', label: 'New', color: 'bg-slate-700' },
  { id: 'qualification', label: 'Qualified', color: 'bg-blue-600' },
  { id: 'proposal', label: 'Proposition', color: 'bg-purple-600' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-600' },
  { id: 'closed_won', label: 'Won', color: 'bg-emerald-600' },
  { id: 'closed_lost', label: 'Lost', color: 'bg-red-600' },
];

export default function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [draggedItem, setDraggedItem] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    stage: 'prospecting',
    amount: '',
    probability: '50',
    expected_close_date: '',
    description: '',
  });
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = opportunities.filter(
        (opp) =>
          opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOpportunities(filtered);
    } else {
      setFilteredOpportunities(opportunities);
    }
  }, [searchTerm, opportunities]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getOpportunities();
      setOpportunities(data);
      setFilteredOpportunities(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Opportunity name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createOpportunity({
        name: formData.name,
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        probability: parseInt(formData.probability),
        expected_close_date: formData.expected_close_date || null,
        description: formData.description || null,
        owner_id: profile?.id || null,
        contact_id: null,
        account_id: null,
        closed_date: null,
        status: 'open',
      });

      toast({
        title: 'Success',
        description: 'Opportunity created successfully',
      });

      setDialogOpen(false);
      setFormData({
        name: '',
        stage: 'prospecting',
        amount: '',
        probability: '50',
        expected_close_date: '',
        description: '',
      });
      loadOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create opportunity',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    setDraggedItem(opportunity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.stage === newStage) {
      setDraggedItem(null);
      return;
    }

    try {
      await updateOpportunity(draggedItem.id, { stage: newStage });
      toast({
        title: 'Success',
        description: `Moved to ${STAGES.find(s => s.id === newStage)?.label}`,
      });
      loadOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update opportunity',
        variant: 'destructive',
      });
    } finally {
      setDraggedItem(null);
    }
  };

  const handleAIPrediction = async (opportunity: Opportunity) => {
    try {
      toast({
        title: 'AI Analysis',
        description: 'Predicting win probability...',
      });

      const result = await predictOpportunityWinProbability(opportunity);

      toast({
        title: 'AI Win Probability',
        description: `${result.probability}% chance of winning. ${result.reasoning}`,
        duration: 10000,
      });
    } catch (error: any) {
      toast({
        title: 'AI Error',
        description: error.message || 'Failed to predict win probability',
        variant: 'destructive',
      });
    }
  };

  const getOpportunitiesByStage = (stage: string) => {
    return filteredOpportunities.filter((opp) => opp.stage === stage);
  };

  const getStageTotal = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + (opp.amount || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-emerald-400';
    if (probability >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Pipeline</h1>
                <p className="text-sm text-slate-400 mt-1">Manage your sales opportunities</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="text-white"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="text-white"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="text-white"
                >
                  <CalendarDays className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Opportunity</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Add a new opportunity to your pipeline
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Opportunity Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Enterprise Software Deal"
                          className="bg-slate-800 border-slate-700"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stage">Stage</Label>
                        <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STAGES.map((stage) => (
                              <SelectItem key={stage.id} value={stage.id}>
                                {stage.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="50000"
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="probability">Probability (%)</Label>
                          <Input
                            id="probability"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.probability}
                            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expected_close_date">Expected Close Date</Label>
                        <Input
                          id="expected_close_date"
                          type="date"
                          value={formData.expected_close_date}
                          onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Additional details..."
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700">
                        Cancel
                      </Button>
                      <Button type="submit">Create Opportunity</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="container mx-auto px-6 py-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageOpportunities = getOpportunitiesByStage(stage.id);
              const stageTotal = getStageTotal(stage.id);

              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-80"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Stage Header */}
                  <div className={`${stage.color} rounded-t-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{stage.label}</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {stageOpportunities.length}
                      </Badge>
                    </div>
                    {stageTotal > 0 && (
                      <p className="text-sm text-white/80 font-medium">
                        {formatCurrency(stageTotal)}
                      </p>
                    )}
                  </div>

                  {/* Stage Content */}
                  <div className="bg-slate-800/50 rounded-b-lg p-3 min-h-[calc(100vh-280px)] space-y-3">
                    {stageOpportunities.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="h-8 w-8 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400">No opportunities</p>
                      </div>
                    ) : (
                      stageOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, opportunity)}
                          className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all cursor-move group hover:shadow-lg hover:shadow-primary/10"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-white group-hover:text-primary transition-colors">
                              {opportunity.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAIPrediction(opportunity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            >
                              <Sparkles className="h-4 w-4 text-primary" />
                            </Button>
                          </div>

                          {opportunity.description && (
                            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                              {opportunity.description}
                            </p>
                          )}

                          <div className="space-y-2">
                            {opportunity.amount && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-emerald-400" />
                                <span className="font-semibold text-emerald-400">
                                  {formatCurrency(opportunity.amount)}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-slate-400" />
                              <span className={`font-medium ${getProbabilityColor(opportunity.probability)}`}>
                                {opportunity.probability}% probability
                              </span>
                            </div>

                            {opportunity.expected_close_date && (
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(opportunity.expected_close_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for Other Views */}
      {viewMode !== 'kanban' && (
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center">
                <div className="text-6xl">📄</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {viewMode === 'list' && 'List View'}
              {viewMode === 'calendar' && 'Calendar View'}
              {viewMode === 'chart' && 'Chart View'}
            </h2>
            <p className="text-slate-400 mb-6">
              This view is coming soon. Use Kanban view to manage your pipeline.
            </p>
            <Button onClick={() => setViewMode('kanban')}>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Switch to Kanban
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
