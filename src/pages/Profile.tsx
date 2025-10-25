import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import Navigation from '@/components/Navigation';
import Bubbles from '@/components/Bubbles';
import LightRays from '@/components/LightRays';
import FloatingParticles from '@/components/FloatingParticles';
import SwimmingFish from '@/components/SwimmingFish';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Settings, 
  LogOut,
  Calendar,
  Keyboard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  totalLessonsCompleted: number;
  totalTestsCompleted: number;
  averageWPM: number;
  bestWPM: number;
  totalTimeSpent: number;
  currentStreak: number;
  joinDate: string;
  baselineWPM: number;
  baselineAccuracy: number;
}

const Profile = () => {
  const { lang } = useParams();
  const { t } = useLocalization();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate(`/${lang}/auth`);
      return;
    }
    
    loadUserStats();
  }, [user, navigate, lang]);

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load lesson progress
      const { data: lessonProgress, error: lessonError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (lessonError) {
        console.error('Error loading lesson progress:', lessonError);
      }

      // Load typing sessions
      const { data: typingSessions, error: sessionsError } = await supabase
        .from('typing_sessions')
        .select('*')
        .eq('user_id', user.id);

      if (sessionsError) {
        console.error('Error loading typing sessions:', sessionsError);
      }

      // Load user progress (baseline data)
      const { data: userProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError) {
        console.error('Error loading user progress:', progressError);
      }

      // Calculate stats from actual data
      const completedLessons = lessonProgress || [];
      const completedTests = completedLessons.filter(lp => lp.lesson_id.includes('test'));
      
      // Calculate WPM statistics from typing sessions
      const allWPMs = typingSessions?.map(session => session.wpm).filter(wpm => wpm > 0) || [];
      const averageWPM = allWPMs.length > 0 ? allWPMs.reduce((sum, wpm) => sum + wpm, 0) / allWPMs.length : 0;
      const bestWPM = allWPMs.length > 0 ? Math.max(...allWPMs) : 0;
      
      // Calculate total time spent (in minutes)
      const totalTimeSpent = typingSessions?.reduce((total, session) => total + (session.time_seconds || 0), 0) / 60 || 0;
      
      // Calculate current streak (simplified - consecutive days with activity)
      const sessionDates = typingSessions?.map(session => new Date(session.created_at).toDateString()) || [];
      const uniqueDates = [...new Set(sessionDates)].sort();
      let currentStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (uniqueDates.includes(today)) {
        currentStreak = 1;
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const currentDate = new Date(uniqueDates[i]);
          const nextDate = new Date(uniqueDates[i + 1]);
          const diffDays = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      } else if (uniqueDates.includes(yesterday)) {
        currentStreak = 1;
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const currentDate = new Date(uniqueDates[i]);
          const nextDate = new Date(uniqueDates[i + 1]);
          const diffDays = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      
      const stats: UserStats = {
        totalLessonsCompleted: completedLessons.length,
        totalTestsCompleted: completedTests.length,
        averageWPM: Math.round(averageWPM),
        bestWPM: Math.round(bestWPM),
        totalTimeSpent: Math.round(totalTimeSpent),
        currentStreak,
        joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
        baselineWPM: userProgress?.baseline_wpm || 0,
        baselineAccuracy: userProgress?.baseline_accuracy || 0
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(`/${lang}/`);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        <LightRays />
        <Bubbles />
        <FloatingParticles />
        <SwimmingFish />
        
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
                {t('profile.loading')}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      <LightRays />
      <Bubbles />
      <FloatingParticles />
      <SwimmingFish />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="animate-fade-in space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-float">
              {t('profile.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('profile.subtitle')}
            </p>
          </div>

          {/* User Info Card */}
          <Card className="bg-card/90 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">
                    {user?.user_metadata?.full_name || user?.email || t('profile.anonymous')}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {user?.email}
                  </CardDescription>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t('profile.memberSince')}: {userStats?.joinDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lessons Completed */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats?.totalLessonsCompleted || 0}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.lessonsCompleted')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tests Completed */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats?.totalTestsCompleted || 0}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.testsCompleted')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average WPM */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(userStats?.averageWPM || 0)}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.averageWPM')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best WPM */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Keyboard className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(userStats?.bestWPM || 0)}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.bestWPM')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Spent */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatTime(userStats?.totalTimeSpent || 0)}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.timeSpent')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats?.currentStreak || 0}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.currentStreak')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Baseline WPM */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Target className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(userStats?.baselineWPM || 0)}</p>
                    <p className="text-sm text-muted-foreground">{t('profile.baselineWPM')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Baseline Accuracy */}
            <Card className="bg-card/90 backdrop-blur-md border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(userStats?.baselineAccuracy || 0)}%</p>
                    <p className="text-sm text-muted-foreground">{t('profile.baselineAccuracy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(`/${lang}/lessons`)}
              variant="ocean"
              size="lg"
              className="gap-2"
            >
              <Target className="w-5 h-5" />
              {t('profile.continueLearning')}
            </Button>
            <Button
              onClick={() => navigate(`/${lang}/practice`)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Keyboard className="w-5 h-5" />
              {t('profile.practice')}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              {t('profile.signOut')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
