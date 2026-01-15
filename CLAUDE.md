# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Next.js 15.5 using the App Router, React 19, TypeScript, and Tailwind CSS v4. The site features interactive animations (GSAP), canvas-based particle effects, MDX-based blog posts, and dynamic backgrounds that respond to user activity.

## Development Commands

**Package Manager:** This project uses `pnpm` (version 10.11.1). Do not use npm or yarn.

```bash
# Start development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture & Code Organization

### Directory Structure

```
/
├── src/app/              # Next.js App Router (pages, layouts, API routes)
│   ├── api/blogs/        # API endpoint to fetch MDX blog metadata
│   ├── blog/             # Blog section with dynamic routes
│   │   ├── [blogSlug]/   # Dynamic blog post pages
│   │   ├── (blogs)/      # MDX blog content files
│   │   └── (component)/  # Blog-specific MDX components
│   └── me/               # About page with components in route groups
├── components/           # Shared UI and feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (environment detection, background selector)
├── utils/                # Helper functions (cn() for Tailwind class merging)
├── constants/            # Centralized data and configuration
└── types/                # TypeScript type definitions
```

### Key Architectural Patterns

**App Router & Route Groups:**
- Uses Next.js 15 App Router with route groups `(name)` for organizing page-specific components without affecting URL structure
- Path alias: `@/*` maps to `./src/*` (note: only `/app` lives in `/src`)
- Server and Client components are mixed; client components use `'use client'` directive

**Component Organization:**
- Components at root level (not in `/src`) include both feature components (Header, Blogs, Projects, Skills, Experiences) and UI primitives (Dropdown, LinkPremative, SoundComponent)
- Route groups like `/me/(components)/` keep page-specific components colocated with their pages
- Higher-order components pattern used extensively (SoundComponent, LinkPremative)

**Animation & Interactivity:**
- Heavy use of GSAP for animations (scroll effects, sprite animations, element transforms)
- Canvas-based effects for particle backgrounds (`particleBackground.tsx`) and sprite animations
- Idle detection (`useDetectMouseMove` hook) triggers background changes after 10s of inactivity in production

**Content & Data:**
- MDX blog posts compiled server-side using `next-mdx-remote/rsc`
- Blog metadata extracted from frontmatter (title, imgUrl) via `/api/blogs` endpoint
- Static data (projects, skills, experience) stored in `constants/data.ts` with TypeScript interfaces

**Environment-Specific Behavior:**
- Background selector uses random backgrounds in production, default in development
- `lib/env.ts` provides `isDevelopment()` and `isProduction()` helpers

## Important Implementation Details

### Styling
- Uses Tailwind CSS v4 with custom theme variables in `globals.css` (oklch color space)
- Custom colors: `--color-foreground`, `--color-orange`, `--color-light-foreground`
- Use `cn()` utility from `lib/utils.ts` to safely merge Tailwind classes (combines clsx + tailwind-merge)
- Geist Sans and Geist Mono fonts loaded via `next/font`

### Audio & Accessibility
- Sound effects managed via `useNativeSoundEffect` hook with preloading and volume normalization (0.1)
- Sound effects automatically skipped if user has `prefers-reduced-motion` enabled
- Use `SoundComponent` HOC to add interactive sound feedback to components

### Canvas Rendering
- Canvas components use `devicePixelRatio` scaling for crisp rendering on high-DPI displays
- Particle background responds to mouse movement with physics-based animations

### TypeScript Configuration
- Strict mode enabled with `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`
- `@typescript-eslint/no-explicit-any` rule is disabled in ESLint config
- Target: ES2017, Module resolution: bundler

### MDX Blog System
- Blog content files live in `src/app/blog/(blogs)/` as `.mdx` files
- Custom MDX components can be created in `src/app/blog/(component)/` (e.g., `regex-comp.tsx`)
- Frontmatter structure: `title`, `imgUrl` (other fields can be added as needed)
- Blog slugs derived from filename without extension

## Common Patterns

**Adding a New Blog Post:**
1. Create `src/app/blog/(blogs)/your-slug.mdx` with frontmatter
2. Add any custom components to `src/app/blog/(component)/`
3. The `/api/blogs` endpoint will automatically pick it up

**Adding a New Project/Experience:**
1. Update `constants/data.ts` - add to `ProjectInfo[]` or `expInfo[]` arrays
2. Follow existing TypeScript interfaces (`ProjectInfoProps`, `DropDownProps`)

**Creating Interactive Components:**
1. Wrap with `SoundComponent` to add sound effects
2. Use `LinkPremative` for links (handles internal vs external automatically)
3. Add GSAP animations with `@gsap/react` hooks (`useGSAP`)

**Background Management:**
- Backgrounds defined in `constants/backgrounds.tsx`
- `BackgroundSelector` in `components/background_selector.tsx` handles switching logic
- New backgrounds should be added as React components returning JSX

## Deployment

The project is configured for Vercel deployment with `@vercel/analytics` integrated in the root layout.
