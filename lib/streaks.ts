import type { WeekRecord } from "../store/types";

// Streak rules (per spec):
//   hit week  → streak +1, reset consecutive-miss counter
//   miss week → streak holds
//   3+ consecutive misses → hard reset to 0

export function computeCurrentStreak(history: WeekRecord[]): number {
  if (history.length === 0) return 0;

  let streak = 0;
  let consecutiveMisses = 0;

  // Walk newest → oldest
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].hitTarget) {
      streak++;
      consecutiveMisses = 0;
    } else {
      consecutiveMisses++;
      if (consecutiveMisses >= 3) {
        streak = 0;
        break;
      }
    }
  }

  return streak;
}

export function computeLongestStreak(history: WeekRecord[]): number {
  if (history.length === 0) return 0;

  let longest = 0;
  let current = 0;
  let consecutiveMisses = 0;

  // Walk oldest → newest so we can track the running max
  for (const week of history) {
    if (week.hitTarget) {
      current++;
      consecutiveMisses = 0;
      if (current > longest) longest = current;
    } else {
      consecutiveMisses++;
      if (consecutiveMisses >= 3) {
        current = 0;
        consecutiveMisses = 0;
      }
    }
  }

  return longest;
}
