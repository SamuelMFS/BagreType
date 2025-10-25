import { Link, useLocation, useNavigate } from "react-router-dom";
import { Database, GraduationCap, Keyboard, Settings, LogIn, LogOut, User, BarChart3, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBaselineStatus } from "@/hooks/useBaselineStatus";
import { useLocalization } from "@/hooks/useLocalization";
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
  const { t, currentLanguage } = useLocalization();

  const handleSignOut = async () => {
    await signOut();
    navigate(`/${currentLanguage}`);
  };

  const handleLearnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasCompletedBaseline) {
      navigate(`/${currentLanguage}/lessons`);
    } else {
      navigate(`/${currentLanguage}/learn`);
    }
  };

  const navItems = [
    { path: `/${currentLanguage}/collect`, icon: Database, label: t('navigation.dataCollection') },
    { path: `/${currentLanguage}/learn`, icon: GraduationCap, label: t('navigation.learnToType') },
    { path: `/${currentLanguage}/practice`, icon: Keyboard, label: t('navigation.practice') },
    { path: `/${currentLanguage}/generate`, icon: Settings, label: t('navigation.generateLayout') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={`/${currentLanguage}`} className="text-2xl font-bold text-primary hover:text-accent transition-wave">
            BagreType
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === `/${currentLanguage}/learn` && location.pathname === `/${currentLanguage}/lessons` && hasCompletedBaseline);
              
              // Special handling for "Learn to Type" link
              if (item.path === `/${currentLanguage}/learn`) {
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
                  <DropdownMenuItem onClick={() => navigate(`/${currentLanguage}/profile`)}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    {t('navigation.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${currentLanguage}/results`)}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t('navigation.viewResults')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('navigation.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/${currentLanguage}/auth`)}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline">{t('navigation.signIn')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
