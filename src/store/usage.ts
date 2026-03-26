import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

const getGuestCredits = () => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem('guest_credits_used');
  return stored ? parseInt(stored, 10) : 0;
};

const setGuestCredits = (val: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_credits_used', val.toString());
  }
};

interface UsageState {
  browserId: string;
  count: number;
  limit: number;
  isPro: boolean;
  userEmail: string | null;
  userId: string | null;
  dbCreditsUsed: number;
  dbPlan: string;
  lastReset: string | null;

  setUsage: (count: number, limit: number, isPro: boolean) => void;
  incrementCount: () => Promise<void>;
  checkDailyReset: () => Promise<void>;
  login: (email: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
  syncWithDb: () => Promise<void>;
  getDisplayCount: () => number;
  getDisplayLimit: () => number;
  getTimeUntilReset: () => string | null;
  upgradeToPro: () => Promise<void>;
}

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      browserId: uuidv4(),
      count: getGuestCredits(),
      limit: 2,
      isPro: false,
      userEmail: null,
      userId: null,
      dbCreditsUsed: 0,
      dbPlan: 'free',
      lastReset: null,

      setUsage: (count, limit, isPro) => set({ count, limit, isPro }),

      getDisplayCount: () => {
        const state = get();

        if (state.userId) {
          // ✅ Pro users should never display consumed credits
          if (state.dbPlan === 'pro') return 0;
          return state.dbCreditsUsed;
        }

        return getGuestCredits();
      },

      getDisplayLimit: () => {
        const state = get();

        if (state.userId) {
          return state.dbPlan === 'pro' ? Infinity : 5;
        }

        return 2;
      },

      getTimeUntilReset: () => {
        const state = get();
        if (!state.userId || state.dbPlan === 'pro' || !state.lastReset) return null;

        const now = new Date();
        const lastResetDate = new Date(state.lastReset);
        const resetTime = new Date(lastResetDate.getTime() + 24 * 60 * 60 * 1000);

        const diffMs = resetTime.getTime() - now.getTime();
        if (diffMs <= 0) return 'now';

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
      },

      incrementCount: async () => {
        const state = get();

        if (state.userId) {
          // ✅ Pro users should NEVER consume credits
          if (state.dbPlan === 'pro') return;

          await state.syncWithDb();
          await state.checkDailyReset();

          const latestState = get();

          // double-check after sync
          if (latestState.dbPlan === 'pro') return;

          const newCredits = latestState.dbCreditsUsed + 1;
          set({ dbCreditsUsed: newCredits });

          try {
            await supabase
              .from('users1')
              .update({ credits_used: newCredits })
              .eq('user_id', latestState.userId);
          } catch (error) {
            console.error('Failed to update credits in DB', error);
          }
        } else {
          const current = getGuestCredits();
          const next = Math.min(current + 1, 2);
          setGuestCredits(next);
          set({ count: next });
        }
      },

      checkDailyReset: async () => {
        const state = get();

        if (!state.userId || state.dbPlan === 'pro') return;

        const now = new Date();
        const lastResetDate = state.lastReset ? new Date(state.lastReset) : null;

        if (!lastResetDate) {
          const newLastReset = now.toISOString();
          set({ lastReset: newLastReset });

          try {
            await supabase
              .from('users1')
              .update({ last_reset: newLastReset })
              .eq('user_id', state.userId);
          } catch (error) {
            console.error('Failed to initialize last_reset in DB', error);
          }
          return;
        }

        if (
          state.dbCreditsUsed >= 5 &&
          (now.getTime() - lastResetDate.getTime()) >= 24 * 60 * 60 * 1000
        ) {
          const newLastReset = now.toISOString();
          set({ dbCreditsUsed: 0, lastReset: newLastReset });

          try {
            await supabase
              .from('users1')
              .update({ credits_used: 0, last_reset: newLastReset })
              .eq('user_id', state.userId);
          } catch (error) {
            console.error('Failed to reset credits in DB', error);
          }
        }
      },

      syncWithDb: async () => {
        const state = get();
        if (!state.userId) return;

        try {
          const { data: userData } = await supabase
            .from('users1')
            .select('*')
            .eq('user_id', state.userId)
            .maybeSingle();

          console.log('Auth user:', { id: state.userId, email: state.userEmail });
          console.log('Existing DB user:', userData);

          if (!userData) {
            console.log('User created');

            const { data: newData, error: insertError } = await supabase
              .from('users1')
              .insert([
                {
                  user_id: state.userId,
                  email: state.userEmail,
                  plan: 'free',
                  credits_used: 0,
                },
              ])
              .select()
              .single();

            if (!insertError && newData) {
              set({
                dbCreditsUsed: newData.plan === 'pro' ? 0 : (newData.credits_used || 0),
                dbPlan: newData.plan || 'free',
                isPro: newData.plan === 'pro',
                limit: newData.plan === 'pro' ? Infinity : 5,
                lastReset: newData.last_reset || new Date().toISOString(),
              });
            } else {
              console.error('Failed to insert new user', insertError);
            }
          } else {
            console.log('User already exists');

            const now = new Date();
            const lastResetDate = userData.last_reset ? new Date(userData.last_reset) : null;

            let newCreditsUsed = userData.credits_used || 0;
            let newLastReset = userData.last_reset;
            const currentPlan = userData.plan || 'free';

            // ✅ If user is pro, always force clean pro state
            if (currentPlan === 'pro') {
              set({
                dbCreditsUsed: 0,
                dbPlan: 'pro',
                isPro: true,
                limit: Infinity,
                lastReset: userData.last_reset || null,
              });
              return;
            }

            if (!lastResetDate) {
              newLastReset = now.toISOString();
              try {
                await supabase
                  .from('users1')
                  .update({ last_reset: newLastReset })
                  .eq('user_id', state.userId);
              } catch (e) {
                console.warn('Could not update last_reset, column might be missing');
              }
            } else if (
              newCreditsUsed >= 5 &&
              (now.getTime() - lastResetDate.getTime()) >= 24 * 60 * 60 * 1000
            ) {
              newCreditsUsed = 0;
              newLastReset = now.toISOString();

              try {
                await supabase
                  .from('users1')
                  .update({ credits_used: 0, last_reset: newLastReset })
                  .eq('user_id', state.userId);
              } catch (e) {
                console.warn('Could not update last_reset, column might be missing');
                await supabase
                  .from('users1')
                  .update({ credits_used: 0 })
                  .eq('user_id', state.userId);
              }
            }

            set({
              dbCreditsUsed: newCreditsUsed,
              dbPlan: currentPlan,
              isPro: currentPlan === 'pro',
              limit: currentPlan === 'pro' ? Infinity : 5,
              lastReset: newLastReset,
            });
          }
        } catch (error) {
          console.error('Failed to sync with DB', error);
        }
      },

      login: async (email: string, userId: string) => {
        set({ userEmail: email, userId, limit: 5 });
        await get().syncWithDb();
      },

      logout: async () => {
        set({
          userEmail: null,
          userId: null,
          limit: 2,
          dbCreditsUsed: 0,
          dbPlan: 'free',
          isPro: false,
          lastReset: null,
          count: getGuestCredits(),
        });

        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Failed to sign out from Supabase', error);
        }
      },

      upgradeToPro: async () => {
        const state = get();
        if (!state.userId) return;

        set({
          dbPlan: 'pro',
          isPro: true,
          limit: Infinity,
          dbCreditsUsed: 0,
        });

        try {
          await supabase
            .from('users1')
            .update({
              plan: 'pro',
              credits_used: 0,
            })
            .eq('user_id', state.userId);
        } catch (error) {
          console.error('Failed to upgrade to pro in DB', error);
        }
      },
    }),
    {
      name: 'praxo-usage-storage',
      onRehydrateStorage: () => (state) => {
        // ✅ After page refresh, always re-sync store with DB
        state?.syncWithDb();
      },
    }
  )
);
