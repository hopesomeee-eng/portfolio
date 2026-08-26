/**
 * BlogSection.tsx — Medium articles
 *
 * Brutalist, typography-heavy list layout. No frosted glass cards.
 * Slices cleanly across the Global Spine.
 */
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Article {
  title: string
  link: string
  pubDate: string
  categories: string[]
  readTime: string
}

// Hardcoded fallback
const FALLBACK_ARTICLES: Article[] = [
  {
    title: 'The Two-Layer Heresy: Why Senior Flutter Developers Are Deleting the Domain Layer',
    link:  'https://medium.com/@sushant18072002/the-two-layer-heresy-why-senior-flutter-developers-are-deleting-the-domain-layer-d412ece43117',
    pubDate: 'Aug 23, 2026',
    categories: ['Flutter', 'Architecture'],
    readTime: '8 min',
  },
  {
    title: 'Stop Using GitHub Copilot Like a Junior Developer (The 2026 Setup)',
    link:  'https://medium.com/@sushant18072002/i-used-github-copilot-wrong-for-a-year-heres-what-finally-made-it-click-31fd584a5657',
    pubDate: 'Apr 26, 2026',
    categories: ['AI', 'GitHub Copilot'],
    readTime: '10 min',
  },
  {
    title: "I Killed 188 Skipped Frames in My Flutter App. Here\u2019s the Autopsy",
    link:  'https://medium.com/@sushant18072002/i-killed-188-skipped-frames-in-my-flutter-app-heres-the-autopsy-f507fda31c98',
    pubDate: 'Earlier 2026',
    categories: ['Flutter', 'Performance'],
    readTime: '12 min',
  },
]

function ArticleRow({ article, index }: { article: Article; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <motion.a
      ref={ref}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', damping: 20, delay: index * 0.1 }}
      data-cursor="blog"
      className="swiss-blog-row"
      style={{
        textDecoration: 'none',
        borderTop: '1px solid #27272a',
        padding: '3rem 0',
        transition: 'background 0.3s, padding 0.3s',
        color: '#fafafa',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const t = e.currentTarget as HTMLElement
        t.style.background = 'rgba(255,255,255,0.03)'
        t.style.paddingLeft = '2rem'
        t.style.paddingRight = '2rem'
        const title = t.querySelector('h3')
        if (title) title.style.color = '#f59e0b'
        const tags = t.querySelectorAll('.blog-tag')
        tags.forEach(tag => (tag as HTMLElement).style.borderColor = '#fafafa')
      }}
      onMouseLeave={e => {
        const t = e.currentTarget as HTMLElement
        t.style.background = 'transparent'
        t.style.paddingLeft = '0'
        t.style.paddingRight = '0'
        const title = t.querySelector('h3')
        if (title) title.style.color = '#fafafa'
        const tags = t.querySelectorAll('.blog-tag')
        tags.forEach(tag => (tag as HTMLElement).style.borderColor = '#27272a')
      }}
    >
      {/* Date & Meta */}
      <div className="swiss-blog-meta">
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          {article.pubDate}
        </div>
        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
          {article.readTime} read ↗
        </div>
      </div>

      {/* Title */}
      <div className="swiss-blog-title">
        <h3 style={{
          fontSize: 'var(--text-h2)', fontWeight: 800,
          fontFamily: 'Inter, sans-serif', lineHeight: 1.2,
          letterSpacing: '-0.02em', margin: 0,
          transition: 'color 0.3s'
        }}>
          {article.title}
        </h3>
      </div>

      {/* Tags */}
      <div className="swiss-blog-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignContent: 'flex-start' }}>
        {article.categories.map(cat => (
          <span key={cat} className="blog-tag" style={{
            fontSize: '9px', fontWeight: 600, padding: '4px 10px',
            borderRadius: '100px', border: `1px solid #27272a`,
            fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
            transition: 'border-color 0.3s'
          }}>{cat}</span>
        ))}
      </div>
    </motion.a>
  )
}

export function BlogSection() {
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  useEffect(() => {
    // Try to fetch live. Fallback is already set.
    const RSS_URL   = 'https://medium.com/feed/@sushant18072002'
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`
    fetch(PROXY_URL)
      .then(r => r.json())
      .then(data => {
        const parser  = new DOMParser()
        const doc     = parser.parseFromString(data.contents, 'text/xml')
        const items   = Array.from(doc.querySelectorAll('item')).slice(0, 3)
        if (items.length === 0) return
        const parsed  = items.map(item => ({
          title:      item.querySelector('title')?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() ?? '',
          link:       item.querySelector('link')?.textContent?.trim() ?? '#',
          pubDate:    new Date(item.querySelector('pubDate')?.textContent ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          categories: Array.from(item.querySelectorAll('category')).map(c => c.textContent?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() ?? '').filter(Boolean),
          readTime:   '~8 min',
        }))
        setArticles(parsed)
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  return (
    <section id="blog" style={{ padding: '15vh 0', background: '#09090b', position: 'relative', zIndex: 10 }}>
      <div className="swiss-grid" ref={ref}>

        <div className="swiss-block-wide mobile-header-row" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              className="swiss-label" style={{ marginBottom: '1rem' }}
            >
              05 / WRITING
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="swiss-headline" style={{ margin: 0 }}
            >
              I write about what I build.
            </motion.h2>
          </div>
          <motion.a 
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            href="https://medium.com/@sushant18072002" target="_blank" rel="noopener noreferrer"
            data-cursor="link"
            style={{ fontSize: '11px', color: '#f59e0b', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            All articles ↗
          </motion.a>
        </div>

        <div className="swiss-block-wide" style={{ borderBottom: '1px solid #27272a' }}>
          {articles.map((article, i) => <ArticleRow key={article.link} article={article} index={i} />)}
        </div>
        
      </div>
    </section>
  )
}
