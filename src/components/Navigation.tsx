import { Link, useLocation, useNavigate } from "react-router-dom";
import { Database, GraduationCap, Keyboard, Settings, LogIn, LogOut, User, BarChart3, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBaselineStatus } from "@/hooks/useBaselineStatus";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasCompletedBaseline } = useBaselineStatus();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLearnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasCompletedBaseline) {
      navigate('/lessons');
    } else {
      navigate('/learn');
    }
  };

  const navItems = [
    { path: "/collect", icon: Database, label: "Data Collection" },
    { path: "/learn", icon: GraduationCap, label: "Learn to Type" },
    { path: "/practice", icon: Keyboard, label: "Practice" },
    { path: "/generate", icon: Settings, label: "Generate Layout" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-accent transition-wave">
            BagreType
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === "/learn" && location.pathname === "/lessons" && hasCompletedBaseline);
              
              // Special handling for "Learn to Type" link
              if (item.path === "/learn") {
                return (
                  <button
                    key={item.path}
                    onClick={handleLearnClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-wave ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-underwater"
                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-wave ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-underwater"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/results')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Results
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
