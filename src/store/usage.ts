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
  count: number; // Local count for non-logged in users (lifetime)
  limit: number;
  isPro: boolean;
  userEmail: string | null;
  userId: string | null;
  dbCreditsUsed: number; // Credits used from DB
  dbPlan: string; // Plan from DB
  lastReset: string | null; // Last reset timestamp from DB
  
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
      limit: 2, // Default to 2 for guests (lifetime)
      isPro: false,
      userEmail: null,
      userId: null,
      dbCreditsUsed: 0,
      dbPlan: 'free',
      lastReset: null,
      
      setUsage: (count, limit, isPro) => set({ count, limit, isPro }),
      
      getDisplayCount: () => {
        const state = get();
        return state.userId ? state.dbCreditsUsed : getGuestCredits();
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
          // Always ensure user exists in DB before incrementing
          await state.syncWithDb();
          await state.checkDailyReset();
          
          // Update in DB
          const newCredits = get().dbCreditsUsed + 1;
          set({ dbCreditsUsed: newCredits });
          
          try {
            await supabase
              .from('users1')
              .update({ credits_used: newCredits })
              .eq('user_id', state.userId);
          } catch (error) {
            console.error('Failed to update credits in DB', error);
          }
        } else {
          // Update locally
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
        
        // If last_reset is null, initialize it without resetting credits
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
        
        // Check if last_reset is older than 24 hours AND credits_used >= 5
        if (state.dbCreditsUsed >= 5 && (now.getTime() - lastResetDate.getTime()) >= 24 * 60 * 60 * 1000) {
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
          // 1. Get current user (optional since we have state.userId, but let's follow instructions if needed, or just use state)
          const { data: userData, error } = await supabase
            .from('users1')
            .select('*')
            .eq('user_id', state.userId)
            .maybeSingle();
            
          console.log("Auth user:", { id: state.userId, email: state.userEmail });
          console.log("Existing DB user:", userData);
            
          if (!userData) {
            console.log("User created");
            // 3. If user does NOT exist: Insert a new row
            // Note: We are NOT inserting last_reset here because the column doesn't exist in the DB yet.
            // Once the column is added in Supabase, we can add it back to the insert payload.
            const { data: newData, error: insertError } = await supabase
              .from('users1')
              .insert([
                {
                  user_id: state.userId,
                  email: state.userEmail,
                  plan: 'free',
                  credits_used: 0
                }
              ])
              .select()
              .single();
              
            if (!insertError && newData) {
              set({ 
                dbCreditsUsed: newData.credits_used || 0, 
                dbPlan: newData.plan || 'free',
                isPro: newData.plan === 'pro',
                limit: newData.plan === 'pro' ? Infinity : 5,
                lastReset: newData.last_reset || new Date().toISOString()
              });
            } else {
              console.error('Failed to insert new user', insertError);
            }
          } else {
            console.log("User already exists");
            // 4. If user EXISTS: DO NOT reset credits on login
            // Instead, check time difference
            const now = new Date();
            const lastResetDate = userData.last_reset ? new Date(userData.last_reset) : null;
            
            let newCreditsUsed = userData.credits_used || 0;
            let newLastReset = userData.last_reset;
            
            // If last_reset is null, initialize it without resetting credits
            if (!lastResetDate) {
              newLastReset = now.toISOString();
              // We wrap this in a try-catch because the column might not exist yet
              try {
                await supabase
                  .from('users1')
                  .update({ last_reset: newLastReset })
                  .eq('user_id', state.userId);
              } catch (e) {
                console.warn("Could not update last_reset, column might be missing");
              }
            } else if (newCreditsUsed >= 5 && (now.getTime() - lastResetDate.getTime()) >= 24 * 60 * 60 * 1000) {
              // If 24 hours or more have passed AND credits_used >= 5: Reset credits_used = 0, Update last_reset = current timestamp
              newCreditsUsed = 0;
              newLastReset = now.toISOString();
              
              try {
                await supabase
                  .from('users1')
                  .update({ credits_used: 0, last_reset: newLastReset })
                  .eq('user_id', state.userId);
              } catch (e) {
                console.warn("Could not update last_reset, column might be missing");
                // Fallback to just updating credits if last_reset fails
                await supabase
                  .from('users1')
                  .update({ credits_used: 0 })
                  .eq('user_id', state.userId);
              }
            }
            
            set({ 
              dbCreditsUsed: newCreditsUsed, 
              dbPlan: userData.plan || 'free',
              isPro: userData.plan === 'pro',
              limit: userData.plan === 'pro' ? Infinity : 5,
              lastReset: newLastReset
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
        // Clear state immediately for responsive UI
        set({ userEmail: null, userId: null, limit: 2, dbCreditsUsed: 0, dbPlan: 'free', isPro: false, lastReset: null, count: getGuestCredits() });
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Failed to sign out from Supabase', error);
        }
      },

      upgradeToPro: async () => {
        const state = get();
        if (!state.userId) return;

        set({ dbPlan: 'pro', isPro: true, limit: Infinity });

        try {
          await supabase
            .from('users1')
            .update({ plan: 'pro' })
            .eq('user_id', state.userId);
        } catch (error) {
          console.error('Failed to upgrade to pro in DB', error);
        }
      }
    }),
    {
      name: 'praxo-usage-storage',
    }
  )
);
