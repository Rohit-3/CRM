import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, DollarSign, Trash2, Sparkles } from 'lucide-react';
import { getOpportunities, createOpportunity, deleteOpportunity } from '@/db/api';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Opportunity } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { predictOpportunityWinProbability } from '@/services/aiService';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    const filtered = opportunities.filter(opp =>
      opp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOpportunities(filtered);
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
    
    if (!formData.name) {
      toast({
        title: 'Error',
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
        account_id: null,
        contact_id: null,
        closed_date: null,
        status: 'open',
        owner_id: profile?.id || null,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    
    try {
      await deleteOpportunity(id);
      toast({
        title: 'Success',
        description: 'Opportunity deleted successfully',
      });
      loadOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete opportunity',
        variant: 'destructive',
      });
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-info text-info-foreground';
      case 'qualification':
        return 'bg-primary text-primary-foreground';
      case 'proposal':
        return 'bg-warning text-warning-foreground';
      case 'negotiation':
        return 'bg-accent text-accent-foreground';
      case 'closed_won':
        return 'bg-success text-success-foreground';
      case 'closed_lost':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground">
            Track deals through your sales pipeline
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Opportunity</DialogTitle>
              <DialogDescription>
                Add a new deal to your pipeline
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Opportunity Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospecting">Prospecting</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
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
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_close_date">Expected Close Date</Label>
                    <Input
                      id="expected_close_date"
                      type="date"
                      value={formData.expected_close_date}
                      onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Opportunity</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Opportunities ({filteredOpportunities.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No opportunities found. Create your first opportunity to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium">{opp.name}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(opp.stage)}>
                        {opp.stage.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(opp.amount)}
                      </div>
                    </TableCell>
                    <TableCell>{opp.probability}%</TableCell>
                    <TableCell>
                      {opp.expected_close_date
                        ? new Date(opp.expected_close_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIPrediction(opp)}
                          title="AI Win Probability"
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(opp.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
