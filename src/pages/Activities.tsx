import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Calendar, Clock, CheckCircle2, AlertCircle,
  Phone, Mail, Video, Users, Filter, Search
} from 'lucide-react';
import { getTasks } from '@/db/api';
import type { Task } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function Activities() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'meeting':
        return Video;
      default:
        return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400';
      case 'low':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'today') {
      const today = new Date().toDateString();
      return task.due_date && new Date(task.due_date).toDateString() === today;
    }
    if (activeTab === 'upcoming') {
      const today = new Date();
      return task.due_date && new Date(task.due_date) > today;
    }
    if (activeTab === 'overdue') {
      const today = new Date();
      return task.due_date && new Date(task.due_date) < today && task.status !== 'completed';
    }
    return task.status === activeTab;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-muted" />
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
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks, calls, meetings, and follow-ups
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Activity
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-10 bg-card border-border"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter(t => {
                    const today = new Date();
                    return t.due_date && new Date(t.due_date) < today && t.status !== 'completed';
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No activities found</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => {
                const Icon = getActivityIcon('task');
                
                return (
                  <Card 
                    key={task.id}
                    className="bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'p-3 rounded-lg',
                          task.status === 'completed' ? 'bg-emerald-500/10' : 'bg-primary/10'
                        )}>
                          <Icon className={cn(
                            'h-5 w-5',
                            task.status === 'completed' ? 'text-emerald-400' : 'text-primary'
                          )} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {task.priority && (
                              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                {task.priority} priority
                              </Badge>
                            )}
                            {task.assigned_to && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Assigned</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
