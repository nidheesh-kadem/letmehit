export type Settings = {
  rewardDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  reward: string;
  weeklyTarget: number;
  onboardingComplete: boolean;
};

export type Completion = {
  id: string;
  timestamp: string;
  note?: string;
};

export type CurrentWeek = {
  weekStartDate: string;
  completions: Completion[];
};

export type WeekRecord = {
  weekStartDate: string;
  target: number;
  completionsCount: number;
  hitTarget: boolean;
  reward: string;
  rewardClaimed: boolean;
};

export type AppState = {
  settings: Settings;
  currentWeek: CurrentWeek;
  history: WeekRecord[];
};
