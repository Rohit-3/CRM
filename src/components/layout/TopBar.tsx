import { Search, Bell, User, LogOut, Settings, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-topbar border-b border-border z-30 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
            <Input
              placeholder="Search with AI... (Ctrl+K)"
              className="pl-10 pr-10 bg-background border-border focus:border-primary"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-4">
          {/* AI Assistant Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover border-border" align="end">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <Separator />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New lead assigned</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          John Doe has been assigned to you
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Deal closed</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Acme Corp deal worth $50,000 closed
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Follow-up reminder</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Follow up with Tech Solutions today
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <Button variant="ghost" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover border-border" align="end">
              <div className="space-y-2">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
                <Separator />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
                <Separator />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
