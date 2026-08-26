/**
 * HeroConfig.ts
 *
 * Centralized configuration for the Swiss Minimalist WebGL Hero.
 * This eliminates hardcoding and allows rapid iteration of the entire hero aesthetic.
 */

export const HeroConfig = {
  typography: {
    title: "SUSHANT\nKUMAR",
    subtitle: "FULL STACK · MOBILE · AI/AGENTIC ENGINEER",
    tagline: "You envision. I engineer. Translating abstract imagination into autonomous reality.",
    stats: [
      { value: "2,00,000+", label: "DAILY USERS" },
      { value: "5+", label: "YEARS PROD." },
      { value: "3", label: "MCP SERVERS" }
    ],
    ctas: [
      { label: "SEE WORK", href: "#projects", primary: true },
      { label: "CONTACT", href: "#contact", primary: false }
    ]
  },
  
  // The WebGL Fluid Shader Configuration
  shader: {
    // The void background color
    backgroundColor: "#09090b",
    
    // The color of the fluid ripples when disturbed by the mouse
    // Using a very subtle, dark off-white/grey to maintain the minimalist void feel
    fluidColor: "#1a1a24",
    
    // Physics parameters
    viscosity: 0.05,
    mouseRadius: 0.15,
    dissipation: 0.98,
    speed: 0.2
  },

  layout: {
    // Defines the alignment of the massive typography
    alignment: "center", // 'left' | 'center'
    
    // Whether to show the bottom scroll indicator
    showScrollHint: true
  }
}
