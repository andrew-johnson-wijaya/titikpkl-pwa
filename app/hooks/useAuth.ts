'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile, Merchant } from '@/app/lib/supabase/types';

export function useAuth() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setMerchant(null);
        return;
      }

      setUser(currentUser);

      // Ambil profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);

        // Jika merchant, ambil data toko
        if (profileData.role === 'MERCHANT') {
          const { data: merchantData } = await supabase
            .from('merchants')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

          if (merchantData) {
            setMerchant(merchantData as Merchant);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData();
      } else {
        setUser(null);
        setProfile(null);
        setMerchant(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserData]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setMerchant(null);
    router.push('/');
    router.refresh();
  };

  return {
    supabase,
    user,
    profile,
    merchant,
    loading,
    signOut,
    refreshAuth: fetchUserData,
  };
}
