import { useEffect, useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react'
import './styles.css'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const CURRENT_MENU_IMAGE = '/assets/bakery-menu.png'
const goTo = (path: string) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const startOrder = () => goTo('/contact?order=1')
function InstagramIcon() {
  return <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
}
function Logo() {
  return <button className="logo" onClick={() => goTo('/')} aria-label="Miss Louise Bakery home">
    <img src="/assets/logo-transparent.png" alt="Miss Louise Bakery" />
  </button>
}

function SiteHeader({ onOrder }: { onOrder: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const visit = (action: () => void) => { action(); setMenuOpen(false) }

  return <header className="site-header">
    <Logo />
    <nav className="desktop-nav" aria-label="Main navigation">
      <button onClick={() => goTo('/menu')}>Our Menu</button>
      <button onClick={() => goTo('/about')}>Our Story</button>
      <button onClick={() => goTo('/contact')}>Contact Us</button>
    </nav>
    <button className="order-mini" onClick={onOrder}>Order online <ShoppingBag size={16}/></button>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu" aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
    {menuOpen && <nav className="mobile-nav"><button onClick={() => visit(() => goTo('/menu'))}>Our Menu</button><button onClick={() => visit(() => goTo('/about'))}>Our Story</button><button onClick={() => visit(() => goTo('/contact'))}>Contact Us</button></nav>}
  </header>
}

function SiteFooter() {
  return <footer><Logo/><p>© 2026 Miss Louise Bakery. Made with a cherry on top.</p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></footer>
}

function HomePage() {
  const [notice, setNotice] = useState('')
  const order = startOrder

  return <main id="top">
    <div className="announcement">Made from scratch in Galveston, Texas <span>✦</span> Baked with love</div>
    <SiteHeader onOrder={order} />

    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><i/> Galveston's little sweet spot <i/></div>
        <h1>From Louise,<br/><em>with love.</em></h1>
        <p>Homemade sweets baked fresh in Galveston, Texas. Every little bite is made to make your day a little sweeter.</p>
        <div className="hero-actions"><button className="button button-red" onClick={order}>Place an order <ArrowRight size={17}/></button><button className="text-button" onClick={() => goTo('/menu')}>View the menu <span>→</span></button></div>
      </div>
      <div className="hero-visual">
        <div className="sunburst"/>
        <div className="hero-photo-wrap"><img src="/assets/image.jpeg" alt="An assortment of fresh Miss Louise Bakery cookies"/></div>
        <div className="round-sticker">BAKED<br/>FRESH<br/><b>DAILY</b></div>
        <img className="cherry-art" src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      </div>
    </section>

    <section className="ticker" aria-label="Bakery offerings"><span>COOKIES</span><b>✦</b><span>BROWNIES</span><b>✦</b><span>COOKIE BOXES</span><b>✦</b><span>CELEBRATIONS</span><b>✦</b><span>COOKIES</span></section>

    <section id="menu" className="favorites section-pad">
      <div className="section-heading"><div><span className="eyebrow plain">A little something sweet</span><h2>Fresh from the <em>oven</em></h2></div><button className="text-button" onClick={() => goTo('/menu')}>See the full menu <span>→</span></button></div>
      <div className="treat-grid">
        <article className="treat-card photo-card pink-card">
          <img src="/assets/cookies.png" alt="Fresh chocolate chip cookies with colorful candy pieces" loading="lazy" />
          <div className="treat-copy"><span>THE FULL LINEUP</span><h3>Signature cookies</h3><p>Big, bakery-style cookies with a flavor for every craving.</p></div>
        </article>
        <article className="treat-card photo-card cream-card">
          <img src="/assets/cupcakes.jpeg" alt="Homemade cupcakes topped with pink frosting" loading="lazy" />
          <div className="treat-copy"><span>CELEBRATE SWEETLY</span><h3>Pretty cupcakes</h3><p>Soft, homemade cupcakes finished with a swirl of frosting.</p></div>
        </article>
        <article className="treat-card photo-card red-card">
          <img src="/assets/cookies2.jpeg" alt="A tray of strawberry shortcake cookies" loading="lazy" />
          <div className="treat-copy"><span>A LITTLE EXTRA</span><h3>Specialty treats</h3><p>Creative flavors, playful toppings, and something new to fall in love with.</p></div>
        </article>
      </div>
    </section>

    <section className="fresh-gallery section-pad" aria-labelledby="fresh-gallery-title">
      <div className="fresh-gallery-heading">
        <span className="eyebrow plain">A peek at what we’re baking</span>
        <h2 id="fresh-gallery-title">Made fresh,<br/><em>made happy.</em></h2>
      </div>
      <div className="fresh-gallery-grid">
        <figure className="fresh-photo fresh-photo-wide">
          <img src="/assets/sprinkle-cookie.jpg" alt="Freshly baked sprinkle cookies cooling on a tray" loading="lazy" />
        </figure>
        <figure className="fresh-photo">
          <img src="/assets/star-cookie.jpg" alt="Star-cut sandwich cookies dusted with powdered sugar" loading="lazy" />
        </figure>
        <figure className="fresh-photo">
          <img src="/assets/yummy-dessert.JPG" alt="Fresh blueberry desserts baked in pink tins" loading="lazy" />
        </figure>
      </div>
    </section>

    <section className="bakery-film" aria-label="A look inside Miss Louise Bakery">
      <video autoPlay muted loop playsInline controls preload="metadata" poster="/assets/image.jpeg">
        <source src="/assets/PltNSAn0bgXuqMDRmMCfz.mp4" type="video/mp4" />
      </video>
      <div className="film-caption">
        <span className="eyebrow plain">Meet the cookie lineup</span>
        <h2>See the sweets<br/><em>up close.</em></h2>
        <p>Thick, colorful, and baked with all the good stuff.</p>
      </div>
    </section>

    <section id="about" className="story section-pad">
      <img className="story-mark" src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      <p className="eyebrow plain">Our recipe for a good day</p>
      <h2>Sweet treats, <em>sweet memories.</em></h2>
      <p className="story-copy">Miss Louise Bakery is a love letter to the simple joy of something homemade. We believe a cookie can turn a day around, a cake can say what words can’t, and there’s always room for dessert.</p>
      <button className="button button-outline" onClick={() => goTo('/about')}>Read our story <ArrowRight size={17}/></button>
    </section>

    <section className="reviews section-pad">
      <div className="reviews-heading">
        <div><span className="eyebrow plain">Sweet notes from our customers</span><h2>Made with love,<br/><em>felt by you.</em></h2></div>
      </div>
      <div className="review-grid">
        <figure><img src="/assets/customerreview1.jpeg" alt="Five-star customer review praising the amazing homemade taste, decoration, care, and effort in Miss Louise cookies" loading="lazy" /></figure>
        <figure><img src="/assets/customerreview2.jpeg" alt="Customer review recommending Miss Louise for professional, affordable, sweet, cute, and delicious cookies" loading="lazy" /></figure>
        <figure><img src="/assets/customerreview3.jpeg" alt="Five-star customer review saying the Rice Krispy treats slapped" loading="lazy" /></figure>
      </div>
    </section>

    <section id="visit" className="visit"><div><span className="eyebrow plain">Come say hello</span><h2>Find your next<br/><em>favorite treat.</em></h2></div><div className="visit-card"><p>Serving up sweet things in</p><h3>Galveston, Texas</h3><a href="https://www.instagram.com/miss_louise_bakery" target="_blank" rel="noreferrer">Follow along <InstagramIcon /></a></div></section>
    <SiteFooter />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </main>
}

function AboutPage() {
  const [notice, setNotice] = useState('')
  const order = startOrder

  useEffect(() => {
    document.title = 'Our Story | Miss Louise Bakery'
    return () => { document.title = 'Miss Louise Bakery' }
  }, [])

  return <main id="top" className="about-page">
    <div className="announcement">Made from scratch in Galveston, Texas <span>✦</span> Baked with love</div>
    <SiteHeader onOrder={order} />

    <section className="about-hero">
      <div className="about-hero-copy">
        <span className="eyebrow plain">The heart behind the bakery</span>
        <h1>Home-baked<br/><em>happiness.</em></h1>
        <p>Miss Louise Bakery began with a love for homemade desserts and the joy that comes from sharing them with others.</p>
        <img className="about-hero-cherries" src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      </div>
      <div className="about-collage" aria-label="Miss Louise Bakery desserts">
        <img className="about-photo-main" src="/assets/cupcakes.jpeg" alt="Homemade cupcakes topped with swirls of pink frosting" />
        <img className="about-photo-small" src="/assets/cookies.png" alt="Fresh chocolate chip cookies with colorful candy pieces" />
        <div className="about-photo-note">FROM OUR HOME<br/><b>TO YOURS</b></div>
      </div>
    </section>

    <section className="about-origin section-pad">
      <div className="origin-heading">
        <span className="eyebrow plain">How it all started</span>
        <h2>Made with love,<br/><em>from scratch.</em></h2>
      </div>
      <div className="origin-copy">
        <p>Miss Louise Bakery is a home-based bakery established from our love for homemade desserts and the joy we get from sharing them with others. Our desserts are made with love, the best ingredients, and a true passion for baking—and that is what makes them special.</p>
        <p>What began as making desserts for friends and family has grown into a small home bakery with a simple aim: to bring our community delicious, homemade desserts. From cookies and cupcakes to our specialty sweets, everything is lovingly made from scratch.</p>
      </div>
    </section>

    <section className="about-values section-pad">
      <div className="values-intro">
        <span className="eyebrow plain">What matters to us</span>
        <h2>Our recipe is<br/><em>pretty simple.</em></h2>
      </div>
      <div className="values-grid">
        <article><span>01</span><h3>Homemade</h3><p>Every dessert is thoughtfully made from scratch in our home bakery.</p></article>
        <article><span>02</span><h3>Good ingredients</h3><p>We choose quality ingredients because every delicious detail matters.</p></article>
        <article><span>03</span><h3>Shared joy</h3><p>We bake to bring people together and make all kinds of days sweeter.</p></article>
      </div>
    </section>

    <section className="about-bts">
      <div className="about-bts-copy">
        <span className="eyebrow plain">Behind the scenes</span>
        <h2>Where the magic<br/><em>gets made.</em></h2>
        <p>A little look at the care, creativity, and hands-on work that goes into every Miss Louise treat.</p>
      </div>
      <video autoPlay controls muted loop playsInline preload="metadata" poster="/assets/cookies2.jpeg">
        <source src="/assets/behind-the-scenes.mp4" type="video/mp4" />
      </video>
    </section>

    <section className="about-belief">
      <div className="belief-photo"><img src="/assets/IMG_2689.jpeg" alt="A box of Miss Louise Bakery cookies ready to share" /></div>
      <div className="belief-copy">
        <span className="eyebrow plain">Why we bake</span>
        <h2>Dessert is<br/><em>personal.</em></h2>
        <p>At Miss Louise Bakery, we believe desserts can bring us together, make an occasion feel special, or simply make an ordinary day a little better.</p>
        <p>Thank you for supporting our home bakery and allowing us to be part of your special moments, gatherings, and everyday celebrations.</p>
        <div className="signature"><small>Always,</small><strong>From Louise, With Love.</strong></div>
      </div>
    </section>

    <section className="about-cta">
      <img src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      <div><span className="eyebrow plain">Something sweet is waiting</span><h2>Ready for a treat?</h2></div>
      <button className="button button-red" onClick={order}>Place an order <ArrowRight size={17}/></button>
    </section>

    <SiteFooter />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </main>
}

function MenuPage() {
  const [notice, setNotice] = useState('')
  const order = startOrder

  useEffect(() => {
    document.title = 'Menu | Miss Louise Bakery'
    return () => { document.title = 'Miss Louise Bakery' }
  }, [])

  return <main id="top" className="menu-page">
    <div className="announcement">Made from scratch in Galveston, Texas <span>✦</span> Baked with love</div>
    <SiteHeader onOrder={order} />

    <section className="menu-hero">
      <img className="menu-hero-cherry" src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      <span className="eyebrow plain">Cookies, cupcakes &amp; specialty treats</span>
      <h1>Pick your<br/><em>favorite.</em></h1>
      <p>Everything is homemade from scratch in Galveston. Take a look at our current flavors and find something sweet for today.</p>
    </section>

    <section className="menu-display">
      <div className="menu-frame">
        <img src={CURRENT_MENU_IMAGE} alt="Miss Louise Bakery menu featuring cookies, cupcakes, specialty treats, and prices" />
      </div>
      <aside className="menu-side-note">
        <span className="eyebrow plain">Good to know</span>
        <h2>Made fresh,<br/><em>just for you.</em></h2>
        <p>Availability may change as flavors rotate. Reach out to confirm today’s treats or ask about a special order.</p>
        <button className="button button-red" onClick={order}>Start an order <ArrowRight size={17}/></button>
        <a className="menu-full-link" href={CURRENT_MENU_IMAGE} target="_blank" rel="noreferrer">Open full-size menu ↗</a>
      </aside>
    </section>

    <section className="menu-bottom-cta">
      <div><span className="eyebrow plain">Need something special?</span><h2>Let’s make your day<br/><em>a little sweeter.</em></h2></div>
      <a className="button button-outline" href="https://www.instagram.com/miss_louise_bakery" target="_blank" rel="noreferrer">Message us <InstagramIcon /></a>
    </section>

    <SiteFooter />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </main>
}

function ContactPage() {
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const isOrder = new URLSearchParams(window.location.search).get('order') === '1'
  const order = () => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    document.title = isOrder ? 'Order Online | Miss Louise Bakery' : 'Contact Us | Miss Louise Bakery'
    return () => { document.title = 'Miss Louise Bakery' }
  }, [isOrder])

  const sendInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const inquiry = {
      type: isOrder ? 'order' : 'inquiry',
      name,
      reply: String(data.get('reply') || ''),
      inquiry: String(data.get('inquiry') || ''),
      date: String(data.get('date') || ''),
      details: String(data.get('details') || ''),
      website: String(data.get('website') || ''),
    }
    setNotice(`Sending your ${isOrder ? 'order request' : 'inquiry'}…`)
    setSending(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inquiry),
      })
      const result = await response.json() as { delivered?: string[], failed?: string[], error?: string }
      if (!response.ok) throw new Error(result.error || 'Delivery failed')
      form.reset()
      const destinations = result.delivered?.join(' and ') || 'the bakery'
      const partial = result.failed?.length ? ` ${result.failed.join(' and ')} delivery needs attention.` : ''
      setNotice(`Thank you! Your ${isOrder ? 'order request' : 'inquiry'} was delivered to ${destinations}.${partial}`)
    } catch {
      const message = [
        `Hi Miss Louise Bakery! I would love to ${isOrder ? 'place an order' : 'send an inquiry'}.`, '',
        `Name: ${inquiry.name}`, `Best way to reply: ${inquiry.reply}`,
        `Inquiry: ${inquiry.inquiry}`, `Date needed: ${inquiry.date || 'Flexible'}`,
        `Details: ${inquiry.details}`,
      ].join('\n')
      window.location.href = `mailto:aspenlax30@gmail.com?subject=${encodeURIComponent(`Miss Louise Bakery inquiry from ${name}`)}&body=${encodeURIComponent(message)}`
      setNotice('Online delivery is not configured yet, so your email app is opening instead.')
    } finally {
      setSending(false)
    }
  }

  return <main id="top" className="contact-page">
    <div className="announcement">Made from scratch in Galveston, Texas <span>✦</span> Baked with love</div>
    <SiteHeader onOrder={order} />

    <section className="contact-hero">
      <div className="contact-hero-copy">
        <span className="eyebrow plain">{isOrder ? 'Online ordering' : 'We’d love to hear from you'}</span>
        <h1>{isOrder ? <>Order something<br/><em>sweet.</em></> : <>Let’s make<br/><em>something sweet.</em></>}</h1>
        <p>{isOrder ? 'Choose what you’re craving and send us the details. We’ll follow up to confirm availability, pickup, and payment.' : 'Planning a celebration, craving a cookie box, or wondering what is available? Tell us what you have in mind.'}</p>
      </div>
      <div className="contact-hero-photo">
        <img src="/assets/chocolate-chip-cookies.JPG" alt="Freshly baked Miss Louise Bakery chocolate chip cookies" />
        <img className="contact-cherries" src="/assets/cherry-transparent.png" alt="" aria-hidden="true" />
      </div>
    </section>

    <section className="contact-main section-pad">
      <form id="inquiry-form" className="contact-form" onSubmit={sendInquiry}>
        <div className="contact-form-heading"><span className="eyebrow plain">{isOrder ? 'Start your order' : 'Start an inquiry'}</span><h2>Tell us the<br/><em>sweet details.</em></h2></div>
        <div className="form-grid">
          <label><span>Your name</span><input name="name" type="text" autoComplete="name" required placeholder="First and last name" /></label>
          <label><span>Best way to reply</span><input name="reply" type="text" required placeholder="Instagram handle or phone" /></label>
          <label><span>What can we make?</span><select name="inquiry" defaultValue="" required><option value="" disabled>Choose one</option><option>Cookies</option><option>Cupcakes</option><option>Specialty treats</option><option>Assorted dessert box</option><option>Something else</option></select></label>
          <label><span>Date needed</span><input name="date" type="date" /></label>
          <label className="form-wide"><span>Tell us more</span><textarea name="details" required rows={6} placeholder="Quantity, flavors, occasion, colors, inspiration, or any questions…" /></label>
          <label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <button className="button button-red" type="submit" disabled={sending}>{sending ? 'Sending…' : isOrder ? 'Send order request' : 'Send inquiry'} {!sending && <ArrowRight size={17}/>}</button>
        <p className="form-note">{isOrder ? 'This is an order request, not a final confirmation. The bakery will reply with availability, pickup, and payment details. ' : ''}Your information is sent privately by email and Discord.</p>
      </form>

      <aside className="contact-details">
        <img src="/assets/mini-logo.png" alt="Miss Louise Bakery monogram" />
        <span className="eyebrow plain">From our home to yours</span>
        <h2>Galveston,<br/>Texas</h2>
        <p>Miss Louise is a home-based bakery. Pickup and order details are shared privately after your inquiry is confirmed.</p>
        <a href="https://www.instagram.com/miss_louise_bakery" target="_blank" rel="noreferrer"><InstagramIcon /> @miss_louise_bakery</a>
        <div className="contact-steps"><div><b>01</b><span>Send your idea</span></div><div><b>02</b><span>Confirm details</span></div><div><b>03</b><span>Enjoy your treats</span></div></div>
      </aside>
    </section>

    <section className="contact-kind-note"><img src="/assets/cherry-transparent.png" alt="" aria-hidden="true" /><p>Thank you for thinking of our home bakery for your celebrations, gatherings, and ordinary days.</p></section>
    <SiteFooter />
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </main>
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])
  if (path.startsWith('/about')) return <AboutPage />
  if (path.startsWith('/menu')) return <MenuPage />
  if (path.startsWith('/contact')) return <ContactPage />
  return <HomePage />
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
