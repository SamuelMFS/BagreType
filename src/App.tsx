import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollProvider } from "./contexts/ScrollContext";
import ThemeToggle from "./components/ThemeToggle";
import Landing from "./pages/Landing";
import Intro from "./pages/Intro";
import DataCollection from "./pages/DataCollection";
import Learn from "./pages/Learn";
import LessonsJourney from "./pages/LessonsJourney";
import Practice from "./pages/Practice";
import Generate from "./pages/Generate";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ScrollProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/collect" element={<DataCollection />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/lessons" element={<LessonsJourney />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ThemeToggle />
            </BrowserRouter>
          </TooltipProvider>
        </ScrollProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
