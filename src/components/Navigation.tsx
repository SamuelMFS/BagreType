import { Link, useLocation } from "react-router-dom";
import { Database, GraduationCap, Keyboard, Settings } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

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
          
          <div className="flex gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
