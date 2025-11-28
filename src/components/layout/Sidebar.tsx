import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, UserPlus, Target, 
  CheckSquare, BarChart3, Settings, Sparkles,
  ChevronLeft, ChevronRight, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Contacts', path: '/contacts', icon: Users },
  { name: 'Leads', path: '/leads', icon: UserPlus },
  { name: 'Pipeline', path: '/pipeline', icon: Target },
  { name: 'Activities', path: '/activities', icon: CheckSquare },
  { name: 'AI Insights', path: '/ai-insights', icon: Brain, highlight: true },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-border transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                Enterprise CRM
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground',
                    isCollapsed && 'justify-center',
                    item.highlight && !isActive && 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : item.highlight ? 'text-purple-400' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  {!isCollapsed && (
                    <>
                      <span className={cn('font-medium', item.highlight && !isActive && 'text-purple-400')}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <Sparkles className="ml-auto h-4 w-4 text-purple-400 animate-pulse" />
                      )}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'w-full justify-center hover:bg-sidebar-hover',
              isCollapsed && 'px-0'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
