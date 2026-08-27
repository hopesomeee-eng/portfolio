/**
 * App.tsx  — Portfolio V4
 *
 * Architecture:
 *   NavBar (fixed top)
 *   CursorGlow (fixed overlay)
 *   Hero section (100vh, R3F canvas inside)
 *   → About, Projects, Skills, Blog, Contact (normal HTML)
 *   LoadingScreen (fixed overlay, fades out)
 *   SectionNav (fixed right dots)
 *
 * The R3F canvas is NOT fixed to the whole page.
 * It lives only inside the hero section.
 * Below the hero, regular dark HTML sections take over.
 */
import { useEffect, useRef, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 3D scene
import { CinematicHero } from './components/CinematicHero'

// UI components
import { NavBar }           from './components/NavBar'
import { CursorGlow }       from './components/CursorGlow'
import { LoadingScreen }    from './components/LoadingScreen'
import { SectionNav }       from './components/SectionNav'
import { ScrollOverlay }    from './components/ScrollOverlay'
import { SettingsToggle }   from './components/SettingsToggle'
import { ReloadPrompt }     from './components/ReloadPrompt'
import { ResumeViewer }     from './components/ResumeViewer'

// HTML sections
import { AboutSection }       from './components/AboutSection'
import { HowIBuildSection }   from './components/HowIBuildSection'
import { ArchitectureSection } from './components/ArchitectureSection'
import { ProjectsSection }    from './components/ProjectsSection'
import { SkillsSection }      from './components/SkillsSection'
import { BlogSection }        from './components/BlogSection'
import { ContactSection }     from './components/ContactSection'

import { usePortfolioStore } from './store'
import './style.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const { isLoaded, setIsLoaded, performanceMode, setPerformanceMode } = usePortfolioStore()
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  // Track mouse position (raw pixels — passed to 3D scene)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Lenis smooth scroll — must be the ONLY scroll manager
  useEffect(() => {
    // Kill any native scroll-behavior (conflicts with Lenis)
    document.documentElement.style.scrollBehavior = 'auto'

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      infinite: false,
    })

    // Use GSAP RAF for 60fps sync
    // CRITICAL: GSAP ticker gives time in SECONDS, Lenis.raf() needs MILLISECONDS
    function onRaf(time: number) {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  // Loading screen — dismiss after canvas is ready
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [setIsLoaded])

  // Optimization: Pause expensive WebGL rendering when hero is out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    const hero = document.getElementById('hero')
    if (hero) observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="portfolio-root">
      {/* Fixed overlays */}
      <CursorGlow />
      <NavBar />
      <ReloadPrompt />
      {isLoaded && <SectionNav />}
      {isLoaded && <SettingsToggle />}

      {/* ── HERO SECTION — 3D canvas lives here ── */}
      <section
        id="hero"
        className="hero-section"
        data-cursor="3d"
      >
        {/* R3F Canvas — fills the hero section */}
        {/* pointer-events: none so wheel events pass through to Lenis/page */}
        <div className="hero-canvas-wrapper" style={{ pointerEvents: 'none' }}>
          <PerformanceMonitor 
            onDecline={() => setPerformanceMode('eco')}
            onIncline={() => setPerformanceMode('cinematic')}
            flipflops={3}
            onFallback={() => setPerformanceMode('eco')}
          >
            <Canvas
              frameloop={isHeroVisible ? 'always' : 'demand'}
              orthographic
              camera={{ position: [0, 0, 1], zoom: 1 }}
              dpr={performanceMode === 'eco' ? [1, 1] : [1, 2]}
              gl={{ antialias: false, powerPreference: 'high-performance' }}
              onCreated={() => setIsLoaded(true)}
            >
              <Suspense fallback={null}>
                <CinematicHero mouseRef={mouseRef} />
              </Suspense>
            </Canvas>
          </PerformanceMonitor>
        </div>

        {/* Hero text overlay — bottom-left, compact */}
        <ScrollOverlay isLoaded={isLoaded} />
      </section>

      {/* ── HTML SECTIONS ── */}
      {/* The Global Spine: Anchors the entire journey */}
      <div className="global-spine" style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(255,255,255,0.03)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <AboutSection />
        <HowIBuildSection />
        <ArchitectureSection />
        <ProjectsSection />
        <SkillsSection />
        <BlogSection />
        <ContactSection />
      </div>

      {/* Loading screen — fades out after hero is ready */}
      <LoadingScreen isLoaded={isLoaded} />

      {/* Full screen overlays */}
      <ResumeViewer />
    </div>
  )
}
