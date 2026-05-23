# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Project overview

Joliundo (joliundo.in) is a Kerala job platform whose landing page serves a single purpose: collect emails for a waitlist, then immediately unlock an inline AI-powered CV tailoring tool. The entire page is one Vite vanilla JS project — no framework, no build pipeline complexity.

## Architecture

**Single-page, no routing.** Four sections in sequence: Hero → Exchange (email gate + CV tool) → How It Works → Footer.

**Two-state UI in `#state-a` / `#state-b`:** The exchange section has a email gate (State A) that transitions to the CV tool (State B) after a valid email is submitted. The transition uses CSS grid-template-rows and opacity; do not restructure this into a framework component.

**`main.js` structure:**
- `saveEmail()` — writes to `localStorage` under key `joliundo_waitlist`. TODO comment marks it for Supabase replacement.
- `rewriteCV()` — calls OpenRouter (OpenAI-compatible endpoint) with `google/gemini-2.0-flash-exp:free`. The API key is a top-of-file constant with a TODO; it must move to a backend before any public launch.
- `initEmailGate()` — handles validation, shake animation, and the State A → B transition.
- `initCVTool()` — tab switching, rewrite button flow, copy-to-clipboard.
- `initScrollReveal()` — IntersectionObserver on `.how__step` elements.

**Design tokens** are CSS custom properties on `:root` in `style.css`. The full green palette (`--green-vivid` through `--green-white`) plus semantic tokens (`--bg`, `--surface`, `--accent`, etc.) are defined there. `--accent` is `#00c76a` (vivid emerald) — the single high-energy color used for CTAs, active states, and labels.

**Typography stack:**
- `Playfair Display` — display headlines (hero, section headings)
- `Outfit` — body text
- `JetBrains Mono` — labels, tags, inputs, small UI text

## Key constraints

- No `transition: all` anywhere — always specify exact CSS properties.
- No `ease-in` on interactive elements — always `ease-out` or `cubic-bezier(0.23, 1, 0.32, 1)`.
- All hover states are gated behind `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` override at the bottom of `style.css` kills all animations.
- The OpenRouter free tier has rate limits (429 = "Too many requests. Try again in a moment.") — handle inline, never with `alert()`.

## Environment variables

Copy `.env.example` to `.env` and fill in the value. Vite exposes variables prefixed `VITE_` via `import.meta.env`.

| Variable | Used in | Purpose |
|---|---|---|
| `VITE_OPENROUTER_API_KEY` | `main.js` | OpenRouter API key for CV rewriting |

`.env` is gitignored. `.env.example` is committed. **Note:** Vite inlines env vars into the JS bundle at build time, so the key is visible to anyone who inspects the bundle. The correct fix before public launch is a backend proxy.

## Before launching publicly

1. Move `VITE_OPENROUTER_API_KEY` behind a backend proxy so the key never reaches the client.
2. Replace `localStorage` email storage with Supabase or Resend.
3. Add a custom domain and update `HTTP-Referer` in the OpenRouter call.
