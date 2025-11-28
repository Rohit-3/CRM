import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Sparkles, DollarSign, TrendingUp, Calendar, 
  MoreVertical, Edit, Trash2, Copy, Eye, Clock,
  CheckCircle2, AlertCircle, Zap
} from 'lucide-react';
import type { Opportunity } from '@/types/types';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onDragStart: (e: React.DragEvent, opportunity: Opportunity) => void;
  onAIPredict: (opportunity: Opportunity) => void;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunity: Opportunity) => void;
  onDuplicate?: (opportunity: Opportunity) => void;
  onView?: (opportunity: Opportunity) => void;
}

export function OpportunityCard({
  opportunity,
  onDragStart,
  onAIPredict,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
}: OpportunityCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const getProbabilityBgColor = (probability: number) => {
    if (probability >= 75) return 'bg-emerald-500/10 border-emerald-500/20';
    if (probability >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getStatusIcon = () => {
    if (opportunity.probability >= 75) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (opportunity.probability >= 50) return <Clock className="h-4 w-4 text-amber-400" />;
    return <AlertCircle className="h-4 w-4 text-red-400" />;
  };

  const getDaysUntilClose = () => {
    if (!opportunity.expected_close_date) return null;
    const closeDate = new Date(opportunity.expected_close_date);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opportunity)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'bg-slate-900 rounded-lg p-4 border border-slate-700',
        'hover:border-slate-600 transition-all duration-300 cursor-move group',
        'hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]',
        'relative overflow-hidden'
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
              {opportunity.name}
            </h4>
            {opportunity.description && (
              <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                {opportunity.description}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAIPredict(opportunity)}
              className={cn(
                'h-8 w-8 p-0 transition-all duration-300',
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              )}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 w-8 p-0 transition-all duration-300',
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-slate-900 border-slate-700" align="end">
                <div className="space-y-1">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(opportunity)}
                      className="w-full justify-start text-white hover:bg-slate-800"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(opportunity)}
                      className="w-full justify-start text-white hover:bg-slate-800"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(opportunity)}
                      className="w-full justify-start text-white hover:bg-slate-800"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAIPredict(opportunity)}
                    className="w-full justify-start text-primary hover:bg-slate-800"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    AI Prediction
                  </Button>
                  {onDelete && (
                    <>
                      <div className="h-px bg-slate-700 my-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(opportunity)}
                        className="w-full justify-start text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          {/* Amount */}
          {opportunity.amount && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-emerald-400 text-lg">
                {formatCurrency(opportunity.amount)}
              </span>
            </div>
          )}

          {/* Probability */}
          <div className={cn(
            'flex items-center justify-between p-2 rounded-md border',
            getProbabilityBgColor(opportunity.probability)
          )}>
            <div className="flex items-center gap-2">
              <TrendingUp className={cn('h-4 w-4', getProbabilityColor(opportunity.probability))} />
              <span className={cn('font-medium text-sm', getProbabilityColor(opportunity.probability))}>
                {opportunity.probability}% probability
              </span>
            </div>
            {getStatusIcon()}
          </div>

          {/* Close Date */}
          {opportunity.expected_close_date && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(opportunity.expected_close_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {daysUntilClose !== null && (
                <Badge 
                  variant={daysUntilClose < 7 ? 'destructive' : daysUntilClose < 30 ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {daysUntilClose > 0 ? `${daysUntilClose}d left` : daysUntilClose === 0 ? 'Today' : 'Overdue'}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Footer - AI Insight Badge */}
        <div className={cn(
          'mt-3 pt-3 border-t border-slate-700/50 transition-all duration-300',
          isHovered ? 'opacity-100' : 'opacity-60'
        )}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-powered insights
            </span>
            <span className="text-slate-500">
              {opportunity.stage.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
