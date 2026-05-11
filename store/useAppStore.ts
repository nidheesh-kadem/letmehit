import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getWeekStart } from "../lib/dates";
import type { AppState, Completion, Settings, WeekRecord } from "./types";

type AppStore = AppState & {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  initWeek: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addCompletion: (note?: string) => void;
  removeCompletion: (id: string) => void;
  rolloverWeek: (claimed?: boolean) => void;
  _devReset: () => void;
};

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      settings: {
        rewardDay: 6,
        reward: "",
        weeklyTarget: 10,
        onboardingComplete: false,
      },
      currentWeek: { weekStartDate: "", completions: [] },
      history: [],

      initWeek() {
        const { currentWeek, settings } = get();
        const thisWeek = getWeekStart();

        if (currentWeek.weekStartDate === thisWeek) return;

        if (currentWeek.weekStartDate !== "") {
          // Auto-archive stale week (app wasn't opened on reward day)
          const record: WeekRecord = {
            weekStartDate: currentWeek.weekStartDate,
            target: settings.weeklyTarget,
            completionsCount: currentWeek.completions.length,
            hitTarget:
              currentWeek.completions.length >= settings.weeklyTarget,
            reward: settings.reward,
            rewardClaimed: false,
          };
          set((s) => ({
            history: [...s.history, record],
            currentWeek: { weekStartDate: thisWeek, completions: [] },
          }));
        } else {
          set({ currentWeek: { weekStartDate: thisWeek, completions: [] } });
        }
      },

      updateSettings(patch) {
        set((s) => ({ settings: { ...s.settings, ...patch } }));
      },

      addCompletion(note) {
        const completion: Completion = {
          id: makeId(),
          timestamp: new Date().toISOString(),
          note,
        };
        set((s) => ({
          currentWeek: {
            ...s.currentWeek,
            completions: [...s.currentWeek.completions, completion],
          },
        }));
      },

      removeCompletion(id) {
        set((s) => ({
          currentWeek: {
            ...s.currentWeek,
            completions: s.currentWeek.completions.filter((c) => c.id !== id),
          },
        }));
      },

      // Dev-only: wipe all state so onboarding can be retested without reinstalling
      _devReset() {
        set({
          settings: {
            rewardDay: 6,
            reward: "",
            weeklyTarget: 10,
            onboardingComplete: false,
          },
          currentWeek: { weekStartDate: "", completions: [] },
          history: [],
        });
      },

      // Called by the reward-day screen (Phase 5) when the user taps Claim.
      // Auto-archive from initWeek() uses claimed: false.
      rolloverWeek(claimed = true) {
        const { currentWeek, settings } = get();
        const record: WeekRecord = {
          weekStartDate: currentWeek.weekStartDate,
          target: settings.weeklyTarget,
          completionsCount: currentWeek.completions.length,
          hitTarget:
            currentWeek.completions.length >= settings.weeklyTarget,
          reward: settings.reward,
          rewardClaimed: claimed,
        };
        set((s) => ({
          history: [...s.history, record],
          currentWeek: { weekStartDate: getWeekStart(), completions: [] },
        }));
      },
    }),
    {
      name: "let-me-hit-store",
      storage: createJSONStorage(() => AsyncStorage),
      // _hasHydrated and its setter are runtime-only; never write to AsyncStorage
      partialize: (state) => ({
        settings: state.settings,
        currentWeek: state.currentWeek,
        history: state.history,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
