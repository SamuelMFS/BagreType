import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useBaselineStatus = () => {
  const [hasCompletedBaseline, setHasCompletedBaseline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadBaselineStatus = async () => {
      try {
        if (user) {
          // For logged-in users, check Supabase
          const { data, error } = await supabase
            .from('user_progress')
            .select('baseline_completed')
            .eq('user_id', user.id)
            .single();

          if (data && !error) {
            setHasCompletedBaseline(data.baseline_completed || false);
          }
        } else {
          // For anonymous users, check localStorage
          const stored = localStorage.getItem('baseline_completed');
          setHasCompletedBaseline(stored === 'true');
        }
      } catch (error) {
        console.error('Error loading baseline status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBaselineStatus();
  }, [user]);

  return { hasCompletedBaseline, isLoading };
};
