/* ─────────────────────────────────────────────────────────────
   Portfolio — Javier Espinosa Pico
   Vanilla JS: navbar scroll, mobile menu, acordeón casos
   ───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── i18n: selector de idioma ES / EN ────────────────────────
  const LANG_KEY   = 'portfolio.lang'
  const SUPPORTED  = ['es', 'en']
  const DEFAULT    = 'es'
  const dict       = window.TRANSLATIONS || {}

  const detectInitialLang = () => {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored && SUPPORTED.includes(stored)) return stored
    const nav = (navigator.language || '').toLowerCase()
    return nav.startsWith('en') ? 'en' : DEFAULT
  }

  const applyLang = (lang) => {
    const table = dict[lang]
    if (!table) return

    document.documentElement.lang = lang

    // textContent swap
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (table[key] != null) el.textContent = table[key]
    })

    // innerHTML swap (para contenido con marcado HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html')
      if (table[key] != null) el.innerHTML = table[key]
    })

    // Atributos traducibles: data-i18n-attr="attr:key,attr:key"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr')
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim())
        if (attr && key && table[key] != null) el.setAttribute(attr, table[key])
      })
    })

    // Estado visual de los botones del selector
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const isActive = btn.dataset.langBtn === lang
      btn.classList.toggle('bg-indigo-600', isActive)
      btn.classList.toggle('text-white', isActive)
      btn.classList.toggle('text-slate-400', !isActive)
      btn.classList.toggle('hover:text-white', !isActive)
      btn.setAttribute('aria-pressed', String(isActive))
    })

    localStorage.setItem(LANG_KEY, lang)
  }

  // Aplicar idioma inicial antes de que el usuario note nada
  applyLang(detectInitialLang())

  // Listeners sobre ambos sets de botones (desktop + mobile)
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langBtn))
  })

  // ── Navbar: cambio de estilo al hacer scroll ────────────────
  const navbar = document.getElementById('navbar')

  const updateNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('nav-scrolled')
    } else {
      navbar.classList.remove('nav-scrolled')
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true })
  updateNavbar()

  // ── Mobile menu toggle ──────────────────────────────────────
  const menuBtn     = document.getElementById('menu-btn')
  const menuClose   = document.getElementById('menu-close')
  const mobileMenu  = document.getElementById('mobile-menu')
  const menuLinks   = mobileMenu.querySelectorAll('a')

  const openMenu  = () => {
    mobileMenu.classList.remove('hidden')
    menuBtn.classList.add('hidden')
    menuClose.classList.remove('hidden')
  }

  const closeMenu = () => {
    mobileMenu.classList.add('hidden')
    menuBtn.classList.remove('hidden')
    menuClose.classList.add('hidden')
  }

  menuBtn.addEventListener('click', openMenu)
  menuClose.addEventListener('click', closeMenu)
  menuLinks.forEach(link => link.addEventListener('click', closeMenu))

  // ── Acordeón: casos de estudio ──────────────────────────────
  const caseHeaders  = document.querySelectorAll('[data-case-toggle]')
  let   openCaseId   = null

  caseHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const id      = header.dataset.caseToggle
      const body    = document.getElementById(`case-body-${id}`)
      const arrow   = header.querySelector('[data-arrow]')
      const isOpen  = openCaseId === id

      // Cerrar el que estaba abierto
      if (openCaseId) {
        const prevBody  = document.getElementById(`case-body-${openCaseId}`)
        const prevArrow = document.querySelector(`[data-case-toggle="${openCaseId}"] [data-arrow]`)
        prevBody.classList.add('hidden')
        prevArrow?.classList.remove('rotate-180', 'border-indigo-600')
      }

      if (isOpen) {
        openCaseId = null
      } else {
        body.classList.remove('hidden')
        arrow?.classList.add('rotate-180', 'border-indigo-600')
        openCaseId = id
      }
    })
  })

  // ── Intersection Observer: animación de entrada ─────────────
  const animatedEls = document.querySelectorAll('[data-animate]')

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })

    animatedEls.forEach(el => observer.observe(el))
  } else {
    animatedEls.forEach(el => el.classList.add('is-visible'))
  }

  // ── Año actual en footer ────────────────────────────────────
  const yearEl = document.getElementById('current-year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

})
