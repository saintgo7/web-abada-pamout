# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PamOut by ABADA Inc. is a multi-tool AI workspace application built with React + Vite. It provides specialized AI modules for software outsourcing tasks including RFP generation, cost estimation, code generation, UI/UX design, and video generation using Google's Gemini and Veo models.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 3000, host 0.0.0.0)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Environment Setup

The application requires a `GEMINI_API_KEY` in `.env.local` for AI functionality. The key is injected at build time via Vite's `define` config (vite.config.ts:14) as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.

## Architecture

### Core Layout Structure (App.tsx)
- **Left sidebar**: Tool selection grid and DevOps metrics chart
- **Right content**: Chat workspace for the active tool
- **State management**: Local component state (no Redux/Context)
- **Theming**: Dark/light mode with Tailwind-style dark mode (`dark:` prefix classes)
- **Internationalization**: Bilingual support via `translations.ts` object (English/Korean)

### Tool System
Tools are defined in `constants.ts` as the `TOOLS` array. Each tool has:
- `id`: Unique identifier
- `name`: Display name
- `description`: Tool description
- `icon`: React SVG element
- `category`: 'generation' | 'analysis' | 'coding'

### Chat System (ChatWindow.tsx)
The chat component handles all user-AI interactions:
- Standard tools: Use `getGeminiResponse()` from geminiService
- Video tool: Uses `GoogleGenAI.generateVideos()` with polling for async generation
- Messages stored as array in local state with `{ id, role, content, timestamp }` shape
- Supports image upload for video generation (image-to-video via Veo)

### AI Service Layer (services/geminiService.ts)
- `getGeminiResponse()`: Single-turn text generation with system instructions
- `getGeminiStream()`: Streaming responses (currently unused)
- Default model: `gemini-3-pro-preview`
- System instruction tailored to each tool context via `activeToolId`

### Special Considerations

**Video Generation Flow**:
1. Checks for API key via `window.aistudio.hasSelectedApiKey()` (AI Studio integration)
2. Calls `generateVideos()` with `veo-3.1-fast-generate-preview` model
3. Polls operation every 10 seconds until `operation.done` is true
4. Downloads video blob and creates object URL for display
5. Renders video using HTML video tag in component state

**Global Objects**:
- `window.aistudio`: AI Studio integration for API key management (openSelectKey, hasSelectedApiKey)

### Component Structure
```
components/
├── Navbar.tsx       # Theme toggle, language toggle, navigation
├── ToolCard.tsx     # Tool selection cards with active state styling
├── ChatWindow.tsx   # Main chat interface with video generation UI
└── Logo.tsx         # ABADA Inc. logo component
```

### TypeScript Configuration
- Module resolution: `bundler` (Vite-specific)
- JSX: `react-jsx` (automatic runtime)
- Path alias: `@/*` maps to project root
- Target: ES2022 with React 19.2.3

## Styling Approach

Uses inline Tailwind-style utility classes (not a Tailwind project - just CSS classes that follow the naming convention). Dark mode is implemented via:
- `dark:` prefix classes for conditional styling
- `document.documentElement.classList.add('dark')` for theme toggle
- Color scheme: Indigo (#6366f1) for primary, Emerald (#10b981) for success/accuracy metrics

## Message Formatting

Chat messages support:
- Plain text with `whitespace-pre-wrap`
- Video URLs rendered as HTML video elements
- Timestamps displayed in locale format
- User messages: right-aligned, indigo-600 background
- Assistant messages: left-aligned, gray background
