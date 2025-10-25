import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";
import LocalizedRoutes from "./components/LocalizedRoutes";
import Bubbles from "./components/Bubbles";
import LightRays from "./components/LightRays";
import FloatingParticles from "./components/FloatingParticles";
import SwimmingFish from "./components/SwimmingFish";
import OceanDepthBackground from "./components/OceanDepthBackground";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            {/* Global background elements - persist across all pages */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <OceanDepthBackground />
              <LightRays />
              <Bubbles />
              <FloatingParticles />
              <SwimmingFish />
            </div>
            
            <LocalizedRoutes />
            <div className="fixed top-4 right-4 z-50 flex gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </BrowserRouter>
        </TooltipProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
