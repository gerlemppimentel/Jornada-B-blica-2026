import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name: string;
  congregation: string;
  user_role: string;
  congregation_id: string | null;
}

export const useAuth = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Erro ao buscar perfil:', error);
          } else {
            setProfile(profileData as UserProfile);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        navigate('/login');
      }
    });

    fetchUserProfile();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const isAdmin = profile?.user_role === 'admin';

  const checkAdminAccess = () => {
    if (!isAdmin) {
      // Se não for admin, redireciona para a página principal
      navigate('/');
      return false;
    }
    return true;
  };

  return { profile, loading, isAdmin, checkAdminAccess };
};