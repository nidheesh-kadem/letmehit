# Let Me Hit — Project Specification

> Working name. The directory `let_me_hit` is the starting reference; we can revisit before App Store submission.

## Mission

A weekly-cycle goal tracker built specifically for how ADHD brains work. The user stacks task completions through the week, defines their own real-world reward, and unlocks it on their chosen reward day if they hit their target. No shame, no zero-resets, no daily-streak guilt loops.

## Audience: ADHD adults

The entire app is designed around ADHD-specific patterns:

- **Delayed gratification is hard** → the weekly reward day is the dopamine anchor
- **Daily streak shame is destructive** → missed weeks trigger a soft reset, not zero
- **Decision fatigue is real** → onboarding is 3 questions, done in 60 seconds
- **Dopamine feedback matters** → haptics + animations on every completion
- **Time blindness is real** → always show "X days until reward day" prominently

Position the app as "built for the way ADHD brains work" — NOT as a treatment, therapy, or medical tool. This keeps us clear of Apple's health-app review rules.

## Core mechanic

1. User sets up once: pick reward day, write reward, set weekly target
2. Throughout the week, one-tap to log a task completion
3. On reward day:
   - Target hit → celebration + reward "unlocked" + streak +1
   - Target missed → soft "this week was a draft, fresh start tomorrow"; streak holds
4. Week rolls over

## Stack

- **Framework**: Expo (managed workflow)
- **Language**: TypeScript
- **State**: Zustand + persist middleware
- **Storage**: AsyncStorage
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for RN)
- **Animations**: react-native-reanimated 3
- **Haptics**: expo-haptics
- **Notifications**: expo-notifications (local only)
- **Payments**: RevenueCat (defer integration to Phase 8)
- **Analytics**: PostHog (defer to Phase 8)
- **Crash reporting**: Sentry (defer to Phase 8)
- **Build/deploy**: EAS Build + EAS Submit

## No backend

This is intentional and load-bearing. Single user. All data on-device. No accounts, no sync, no social, no server. Do not add one in MVP, even if it seems easy.

## Data model

```typescript
type Settings = {
  rewardDay: 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0 = Sunday
  reward: string
  weeklyTarget: number
  onboardingComplete: boolean
}

type Completion = {
  id: string
  timestamp: string  // ISO
  note?: string
}

type CurrentWeek = {
  weekStartDate: string  // ISO date, Monday of current week
  completions: Completion[]
}

type WeekRecord = {
  weekStartDate: string
  target: number
  completionsCount: number
  hitTarget: boolean
  reward: string         // snapshot at time of week
  rewardClaimed: boolean
}

type AppState = {
  settings: Settings
  currentWeek: CurrentWeek
  history: WeekRecord[]
}
```

Current streak and longest streak are **derived** from history, not stored.

## MVP screens (five total)

1. **Onboarding** — three sequential steps: reward day → reward text → weekly target
2. **Home** — progress ring, giant +1 button, "X days until [rewardDay]" countdown, current reward visible
3. **Add completion modal** — optional note field, satisfying confirm
4. **Reward day** — appears automatically on reward day; celebration if target hit, soft message if not
5. **History** — week-by-week ledger, current streak, longest streak

## Out of scope for MVP

These will be tempting. Do not build them until v1 ships:

- Friend streaks / accountability partners
- Multiple simultaneous rewards or reward tiers
- Task categories
- Calendar integration
- Apple Health integration
- Widgets (high value but defer to v1.1)
- Live Activities
- Custom themes
- AI-anything
- Cloud sync
- Export/import
- Cheat detection / anti-gaming logic

## Design principles (ADHD-specific)

- **No shame copy.** Missed target = "draft week, fresh start." Never "you failed."
- **Soft resets.** Missing a week pauses the streak; it doesn't zero. Three+ misses might fully reset, with a gentle message.
- **One screen, one decision.** Onboarding never asks two things at once.
- **Big touch targets.** Thumb-friendly buttons.
- **Satisfying feedback.** Haptics on every meaningful tap. Spring animations on progress ring. The reward-day celebration must feel earned.
- **Always show progress AND the reward.** The reward is the dopamine — don't hide it.
- **Default to assumptions.** Onboarding suggests sensible defaults (Saturday reward day, target of 10) so user just confirms.

## File structure (suggested)

```
let_me_hit/
├── app/                    # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx           # Home
│   ├── onboarding/
│   ├── completion-modal.tsx
│   ├── reward-day.tsx
│   └── history.tsx
├── components/
│   ├── ProgressRing.tsx
│   ├── CompletionButton.tsx
│   └── ...
├── store/
│   ├── useAppStore.ts      # Zustand store
│   └── types.ts
├── lib/
│   ├── dates.ts            # Week math, day-of-week helpers
│   ├── streaks.ts          # Streak computation from history
│   └── haptics.ts
├── constants/
│   ├── colors.ts
│   └── copy.ts             # All user-facing strings live here
├── PROJECT_SPEC.md
└── package.json
```

## Phased build plan

### Phase 0 — Project setup
- Initialize Expo with TypeScript template
- Install all non-deferred dependencies
- Configure NativeWind + Tailwind
- Set up Expo Router with placeholder screens
- Verify it runs on Expo Go on physical iPhone
- **Acceptance**: blank app boots on phone; file structure matches spec

### Phase 1 — Data layer
- Implement TypeScript types from Data model section
- Build Zustand store with persist middleware
- Build date utilities (current week start, days until X, etc.)
- Build streak computation (from history)
- **Acceptance**: store actions work in isolation; data persists across reloads

### Phase 2 — Onboarding
- Three sequential screens
- Sensible defaults pre-filled
- Sets `onboardingComplete = true` on finish
- **Acceptance**: fresh install routes to onboarding; completed onboarding routes to Home

### Phase 3 — Home screen
- Animated progress ring (completions/target)
- Days-until-reward-day countdown
- Current reward shown subtly
- Giant +1 button at bottom
- Tap opens completion modal
- **Acceptance**: visual progress reflects store state; tap triggers haptic

### Phase 4 — Completion modal
- Optional note input
- Confirm/cancel
- Satisfying close animation on confirm
- Updates store + haptics
- **Acceptance**: completion appears in current week; ring updates

### Phase 5 — Reward day logic
- Detect when today === rewardDay
- Show reward day screen automatically
- Celebration animation if hit; soft message if not
- "Claim reward" button rolls week into history, starts fresh week
- **Acceptance**: week rollover works; streak updates correctly

### Phase 6 — History screen
- List of past weeks (hit/miss visual)
- Current streak display
- Longest streak display
- **Acceptance**: visual ledger matches store

### Phase 7 — Settings
- Edit reward, target, reward day
- Doesn't reset current progress
- **Acceptance**: changes persist; current week unaffected

### Phase 8 — Production wiring
- App icon + splash screen
- Bundle identifier
- EAS configuration
- Sentry integration
- PostHog integration
- RevenueCat skeleton (SDK installed and initialized, no products yet)
- Local notification for reward day morning
- **Acceptance**: production build succeeds via EAS

### Phase 9 — TestFlight
- Apple Developer account active
- EAS Submit to TestFlight
- Internal testing on your device
- Invite 5–10 beta testers from r/ADHD, r/adhdwomen
- Iterate on feedback

### Phase 10 — Launch
- App Store listing (screenshots, description, keywords)
- Decide paywall mechanic (recommended: one-time $4.99–6.99 + 7-day trial)
- Hook up RevenueCat product
- Optional marketing site (one page)
- Launch posts on r/ADHD, r/adhdwomen, ADHD TikTok, IndieHackers

## How to work this spec

- **Read this file at the start of every Claude Code session.**
- **Don't skip phases. Don't combine phases.**
- **Commit to git after each phase** with the phase number in the message
- **Ask before adding anything not in this spec.**
- **Push back on scope creep.** If the user asks for something outside the current phase, say "this is post-MVP per the spec, want to add to v1.1 list?"
