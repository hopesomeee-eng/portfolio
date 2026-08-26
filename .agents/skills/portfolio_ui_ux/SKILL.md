---
name: portfolio-ui-ux
description: Strict design system and UI/UX guidelines for Sushant Kumar's Portfolio. Enforces Swiss Tech Minimalism, WebGL usage, and Central Config Architecture.
---

# Sushant Kumar Portfolio UI/UX Guidelines (Swiss Tech Minimalism)

This skill dictates the absolute design laws for this workspace. DO NOT deviate from these rules. The goal is to project the aura of an elite Full Stack/Mobile/AI Engineer. We achieve this through extreme minimalism, perfect typography, and physical motion physics.

## 1. The Core Philosophy
- **Information Density through Scale:** Do not use borders, `.card` classes, or `backdrop-filter` boxes to separate content. Separate content purely through massive typographic scale differences and negative space.
- **The Void:** The background is ALWAYS `#09090b`. No colorful gradients.
- **No AI Slop:** Do not generate cheap 3D primitive geometry or noisy sci-fi images. If we need visuals, we use high-end WebGL math shaders (like fluid dynamics) or strict wireframes.

## 2. The Architecture (No Hardcoding)
React components in this project must be "dumb" rendering engines.
- NEVER hardcode text, project names, or URLs into a `.tsx` file.
- All content MUST be pulled from the centralized configuration files in `src/config/`.
- If you add a new section, you must create a new config file for it.

## 3. Motion & Physics
- **Semantic HTML + Framer Motion:** We use semantic HTML for accessibility, but all entrance animations are governed by Framer Motion spring physics.
- **Mass implies Importance:** Large `h1` elements must use high `damping` and `stiffness` to feel heavy when they slide into view. Small badges should have a lighter, faster spring.
- **GSAP for Scroll:** Scroll-linked animations (parallaxes, marquees) must use `gsap/ScrollTrigger`.
- **Interaction over Clutter:** Project images should be hidden by default and only reveal on hover (tracking the mouse).

## 4. Typography
- Font Family: `Inter, sans-serif`
- Only use uppercase for headlines and labels.
- Maintain brutal contrast: extremely thin font weights (`300`) next to extremely heavy font weights (`900`).

## 5. The Palette
- Background: `#09090b`
- Primary Text: `#fafafa`
- Accent: `#f59e0b` (Use sparingly for active states or critical CTAs)

**If a user asks you to add a new section to the portfolio, you MUST read this file and apply these rules before writing any code.**
