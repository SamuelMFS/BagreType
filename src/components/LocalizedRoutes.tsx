import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Landing from '../pages/Landing';
import Intro from '../pages/Intro';
import DataCollection from '../pages/DataCollection';
import Results from '../pages/Results';
import Learn from '../pages/Learn';
import PostBaseline from '../pages/PostBaseline';
import LessonsJourney from '../pages/LessonsJourney';
import Lesson from '../pages/Lesson';
import Practice from '../pages/Practice';
import Generate from '../pages/Generate';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';
import CompareProgress from '../pages/CompareProgress';
import ComparisonResults from '../pages/ComparisonResults';
import NotFound from '../pages/NotFound';
import { ScrollProvider } from '../contexts/ScrollContext';

const LocalizedRoutes = () => {
  const { i18n: i18nInstance } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Extract language from URL path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const possibleLanguage = pathSegments[0];
    
    // Check if the first segment is a valid language code
    const validLanguages = ['en', 'pt-BR'];
    const detectedLanguage = validLanguages.includes(possibleLanguage) ? possibleLanguage : 'en';
    
    // Update local state
    setCurrentLanguage(detectedLanguage);
    
    // Set language if different from current and i18n is available
    if (i18nInstance && i18nInstance.language !== detectedLanguage) {
      try {
        i18nInstance.changeLanguage(detectedLanguage);
      } catch (error) {
        console.error('Error changing language:', error);
      }
    }
  }, [location.pathname, i18nInstance]);

  // Helper function to create localized paths
  const createLocalizedPath = (path: string) => {
    return `/${currentLanguage}${path}`;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={createLocalizedPath('/')} replace />} />
      <Route path="/:lang" element={<Landing />} />
      <Route path="/:lang/intro" element={<Intro />} />
      <Route path="/:lang/collect" element={<DataCollection />} />
      <Route path="/:lang/results" element={<Results />} />
      <Route path="/:lang/learn" element={<Learn />} />
      <Route path="/:lang/post-baseline" element={<PostBaseline />} />
      <Route path="/:lang/lessons" element={
        <ScrollProvider>
          <LessonsJourney />
        </ScrollProvider>
      } />
      <Route path="/:lang/lesson/:chapterId/:lessonId" element={<Lesson />} />
      <Route path="/:lang/practice" element={<Practice />} />
      <Route path="/:lang/generate" element={<Generate />} />
      <Route path="/:lang/auth" element={<Auth />} />
      <Route path="/:lang/compare-progress" element={<CompareProgress />} />
      <Route path="/:lang/comparison-results" element={<ComparisonResults />} />
      <Route path="/:lang/profile" element={<Profile />} />
      <Route path="/:lang/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default LocalizedRoutes;
