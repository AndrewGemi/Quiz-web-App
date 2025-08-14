# Quizify — Team-Based Quiz Game

Mobile-friendly, team-vs-team quiz app with categories, countdown timer, last-seconds beeps + “time’s up” buzzer, animated UI, and refresh-proof progress (via session storage). Built with React and Tailwind.

## ✨ Features

- **Teams & Categories**: create teams, pick a category, play round-robin.
- **Question Flow**: one question at a time, progress bar, sticky “Next/Finish”.
- **Timer**: circular SVG countdown (default **30s**), **pause/resume**, optional **double “time’s up”** sound, low-time pulse.
- **Sounds**: short beep for last seconds + buzzer at 0 (file-based). Safe pause handling.
- **Mobile-first UI**: safe-area aware header/footer, big tap targets, RTL-friendly.
- **Animations**: fade/slide/stagger without extra libs (CSS keyframes).
- **No-Repeat Play**: unbiased **Fisher–Yates shuffle** per category; optional global de-dup.
- **Refresh-Safe**: state persisted to `sessionStorage` and **rehydrated** after reload (with drift-corrected timer).

> Power-Ups: **Under construction / to be added soon.**

---

## 🧱 Tech Stack

- **React** (hooks, reducer state machine)
- **Tailwind CSS** (plus a few custom CSS variables)
- Optional: **Framer Motion** (not required; CSS animations included)

---

## 🗂️ Project Structure (key parts)

```
src/
  App.js                 # reducer, state machine, fetch questions, hydrate/persist
  components/
    Header.jsx           # sticky, safe-area aware app bar
    Main.jsx             # constrained container with bottom padding
    TeamSetup.jsx        # add/remove teams, start
    CategorySelection.jsx
    TeamTransition.jsx   # “next up” overlay
    Question.jsx
    Options.jsx
    Timer.jsx            # SVG timer + sounds
    Progress.jsx
    NextButton.jsx
    Footer.jsx           # sticky action bar
    Logo.jsx
public/
  data/questions.json    # categories + questions
  sounds/beep.mp3
  sounds/timesup.mp3
```

---

## 🔢 Data Format

`public/data/questions.json` expects:

```json
{
  "categories": [
    {
      "title": "General Knowledge",
      "questions": [
        {
          "id": "gk-001",
          "question": "What is the capital of France?",
          "options": ["Paris", "Rome", "Madrid", "Berlin"],
          "correctOption": 0,
          "points": 10
        }
      ]
    }
  ]
}
```

**Required**: `question`, `options[]`, `correctOption` (0-based).  
**Recommended**: `id` (for global de-dup), `points` (per-question scoring).

---

## ▶️ Getting Started

### Prereqs

- Node 18+ (or 20+), npm/yarn/pnpm

### Install & Run

```bash
# clone
git clone <your-repo-url>
cd <your-repo>

# install deps
npm i

# start dev server
npm run start
```

### Build

```bash
npm run build
```

---

## ⚙️ Configuration

### Timer length

`SECS_PER_QUESTION` in `App.js`:

```js
const SECS_PER_QUESTION = 30;
```

### Sounds

Place files in `public/sounds/`:

```
beep.mp3         # short beep for last seconds (e.g., last 3–5s)
timesup.mp3      # buzzer at 0 (can be configured to play twice)
```

Wired to:

- **Stop on pause** (no lingering audio; cancels in-flight play promises)
- **Respect autoplay policies** (plays after first user interaction)

### Shuffle

Shuffling happens **on category select** (recommended) or **once on data load** for fixed per-session order.

- Unbiased **Fisher–Yates**, `O(n)` time.
- Guarantees each question appears once per playthrough (unless your source has duplicates).

### Persistence (Refresh-Proof)

- Saves a snapshot to **`sessionStorage`** (`quizify_state_v1`) after meaningful state changes.
- On reload, **hydrates** the state if the `categories` signature matches the current questions file.
- Corrects for **timer drift** by subtracting elapsed seconds, and auto-fills the correct answer if time expired during reload.

Switch to `localStorage` if you want cross-tab persistence.

---

## 🧠 State Machine (high level)

`status` values:

- `loading` → fetch `questions.json`
- `selectingTeams` → enter teams
- `selectingCategory` → pick a category
- `active` → team transition → question + timer → next
- `finished` → category results or final leaderboard
- `error` → fetch/load failure

Key actions: `dataReceived`, `dataFailed`, `teamsConfirmed`, `selectCategory`, `tick`, `toggleTimer`, `newAnswer`, `nextQuestion`, `categoryComplete`, `restart`, `hydrate`.

---

## 🧩 Power-Ups

**Under construction / to be added soon.**  
Planned examples: 50/50, Freeze (5s), Double Next, Skip. Each will have clear stock, cooldowns, and reducer-driven effects with UI badges.

---

## ♿ Accessibility & RTL

- Buttons ≥ **44×44px**, visible focus states, ARIA labels (timer & CTAs).
- Right-aligned question text works for Arabic/RTL.
- Sticky bars respect **safe-area insets** on iOS.

---

## 🎨 Styling & Motion

- Tailwind for layout + custom CSS variables in `index.css`.
- CSS keyframes for **fade/slide/scale**; staggered options via index-based delays.
- Optional Framer Motion for physics-style animations.

---

## 🚀 Deployment

### Netlify / Vercel

- Push repo, select framework “React” / CRA/Vite as applicable.
- Ensure `public/data/questions.json` + `public/sounds/*` are included.
- If hosting on a subpath, `process.env.PUBLIC_URL` guards your JSON fetch.

### GitHub Pages

- `npm run build` → publish `/build`.
- If using a custom base path, set `homepage` in `package.json` or adjust `PUBLIC_URL`.

---

## 🧪 Testing Ideas (optional)

- **Reducer**: tick, answer scoring, category transitions, restart, hydrate.
- **Timer**: fake timers to assert tick cadence & pause behavior.
- **Audio**: ensure sounds stop on pause and do not fire while paused.
- **Options**: selection, correct/wrong classes, (future) 50/50 hiding.
- **Hydration**: mock `sessionStorage`; verify drift correction and discard on questions.json change.

---

## ⚠️ Known Gotchas

- **Mobile audio policies**: audio plays only after a user gesture; iOS silent switch mutes audio.
- **Data changes**: if `questions.json` changes, old snapshots are discarded via a categories signature check.
- **“Random every step”**: avoid independent random picks per question—shuffle once and walk the array by index.

---

## 🗺️ Roadmap

- Implement power-ups (50/50, Freeze, Double Next, Skip) with reducer cases + UI badges.
- Seeded shuffle option for tournaments.
- “Resume game?” modal when a saved snapshot is detected.
- Export results (CSV/JSON) per category and final leaderboard.

---

## 📄 License

MIT (or replace with your preferred license).

---

## 🙌 Credits

- Brand color `#6b05fa` and gradients used throughout the UI.
- SFX suggestions from free libraries like Pixabay/Mixkit.
- Thanks to the team for testing on mobile devices!
