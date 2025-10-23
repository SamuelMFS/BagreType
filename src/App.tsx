import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollProvider } from "./contexts/ScrollContext";
import ThemeToggle from "./components/ThemeToggle";
import Landing from "./pages/Landing";
import Intro from "./pages/Intro";
import DataCollection from "./pages/DataCollection";
import Results from "./pages/Results";
import Learn from "./pages/Learn";
import PostBaseline from "./pages/PostBaseline";
import LessonsJourney from "./pages/LessonsJourney";
import Lesson from "./pages/Lesson";
import Practice from "./pages/Practice";
import Generate from "./pages/Generate";
import Auth from "./pages/Auth";
import CompareProgress from "./pages/CompareProgress";
import ComparisonResults from "./pages/ComparisonResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/collect" element={<DataCollection />} />
            <Route path="/results" element={<Results />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/post-baseline" element={<PostBaseline />} />
            <Route path="/lessons" element={
              <ScrollProvider>
                <LessonsJourney />
              </ScrollProvider>
            } />
            <Route path="/lesson/:chapterId/:lessonId" element={<Lesson />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/compare-progress" element={<CompareProgress />} />
            <Route path="/comparison-results" element={<ComparisonResults />} />
            <Route path="/profile" element={<Navigate to="/404" replace />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
            <ThemeToggle />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
