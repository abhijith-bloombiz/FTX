# FTX – First Torque X (Technical & Engineering Specification)

## 1. Executive Summary

**FTX – First Torque X** is a high-performance, ultra-premium digital experience for an elite automotive protection and detailing center specializing in Paint Protection Film (PPF), Ceramic Coating, and Professional Detailing. 

The website is designed and engineered based on the Google Stitch UI project (`2233122347375023900`), delivering a cinematic presentation combined with production-grade Next.js App Router architecture, full bilingual English/Arabic (RTL) support, interactive automotive components, and strict type safety.

---

## 2. Technical Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Server Components default, optimized routing, SSG/SSR capability |
| **Language** | TypeScript (Strict Mode) | Complete type-safety for services, packages, gallery, and API interfaces |
| **Styling** | Tailwind CSS + Vanilla CSS Variables | Rapid design system execution with dark obsidian tokens and responsive layout |
| **Icons** | Lucide React | Lightweight, accessible SVG icon set |
| **Localization** | Custom Locale Router (`/en`, `/ar`) | Full native LTR/RTL document structure with dynamic JSON dictionaries |
| **Animation** | CSS Micro-transitions + IntersectionObserver | High performance 60fps animations respecting `prefers-reduced-motion` |

---

## 3. Brand Identity & Design System

### 3.1 Color Palette
- **Obsidian Canvas (Surface Level 0)**: `#131313` / `#0e0e0e`
- **Charcoal Surface (Surface Level 1)**: `#1f1f1f`
- **Elevated Surface (Surface Level 2)**: `#2a2a2a`
- **Primary Brand Accent (FTX Lime)**: `#a4d65e` (Container: `#bff377`)
- **Secondary Metallic (Machined Silver)**: `#c6c6c6` (Fixed: `#e3e2e2`)
- **Text Primary**: `#e2e2e2` / `#ffffff`
- **Subtle Outline**: `#434939` (1px 10% opacity)

### 3.2 Typography Hierarchy
- **Headlines (Latin)**: `Space Grotesk` (Geometric, technical, performance aesthetic)
- **Headlines (Arabic)**: `Noto Sans Arabic`
- **Body Content**: `Hanken Grotesk` / `Inter`
- **Labels / Technical Metadata**: `JetBrains Mono`

### 3.3 Visual & Shape Language
- **Corner Radius**: 4px (`rounded`) for precision machined metal feel.
- **Accents**: 45-degree angled clipped corners on CTA buttons and badge chips.
- **Textures**: SVG Hexagonal / Honeycomb grid background overlays at 4-5% opacity.
- **Glow Effects**: Ambient 15-20% opacity primary lime drop shadows on interactive elements.

---

## 4. Internationalization & RTL Specification

### 4.1 URL Route Architecture
- `/en` -> English Homepage
- `/en/about` -> English About Page
- `/en/services` -> English Services Page
- `/en/gallery` -> English Gallery / Our Work Page
- `/en/packages` -> English Packages Page
- `/en/contact` -> English Contact Page
- `/ar` -> Arabic Homepage (RTL)
- `/ar/about` -> Arabic About Page (RTL)
- `/ar/services` -> Arabic Services Page (RTL)
- `/ar/gallery` -> Arabic Gallery / Our Work Page (RTL)
- `/ar/packages` -> Arabic Packages Page (RTL)
- `/ar/contact` -> Arabic Contact Page (RTL)

### 4.2 Document & Layout RTL Adaptation
- `html` tag dynamically receives `dir="rtl"` or `dir="ltr"` and `lang="ar"` or `lang="en"`.
- Navigation layout mirrors (Logo on right, links in middle, language/CTA on left in RTL mode).
- Typography switches smoothly to Arabic font stack with line-height adjustments.
- Form inputs, sliders, and gallery cards adjust text alignment and flex direction.

---

## 5. Application Folder Architecture

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx             # Root locale layout with html dir & lang
│   │   ├── page.tsx               # Home Page
│   │   ├── about/page.tsx         # About Us Page
│   │   ├── services/page.tsx      # Services Page
│   │   ├── gallery/page.tsx       # Our Work / Gallery Page
│   │   ├── packages/page.tsx      # Packages Page
│   │   └── contact/page.tsx       # Contact Us Page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts           # Contact form POST API handler
│   ├── error.tsx                  # Global error boundary
│   ├── loading.tsx                # Global fallback spinner
│   ├── not-found.tsx              # Custom 404 page
│   ├── robots.ts                  # SEO robots text generator
│   ├── sitemap.ts                 # XML sitemap generator
│   └── globals.css                # Global CSS variables & tokens
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Floating navbar with scroll effect
│   │   ├── MobileMenu.tsx         # Responsive mobile navigation panel
│   │   ├── LanguageSwitcher.tsx   # EN | AR locale switcher
│   │   └── Footer.tsx             # Premium footer component
│   ├── sections/
│   │   ├── HeroSection.tsx        # Cinematic Hero
│   │   ├── IntroSection.tsx       # Editorial split intro
│   │   ├── ServicesGrid.tsx       # Core services section
│   │   ├── WhyFTX.tsx             # Brand values grid
│   │   ├── FeaturedWork.tsx       # Featured showcase
│   │   ├── Testimonials.tsx       # Customer reviews section
│   │   └── FinalCTA.tsx           # Conversion footer banner
│   ├── ui/
│   │   ├── BeforeAfterSlider.tsx  # Interactive drag comparison slider
│   │   ├── GalleryFilter.tsx      # Interactive category pills
│   │   ├── Lightbox.tsx           # Fullscreen gallery image modal
│   │   ├── PackageCard.tsx        # Package pricing & features card
│   │   └── ContactForm.tsx        # Validated quote request form
│
├── config/
│   ├── site.ts                    # General business information
│   ├── navigation.ts              # Route mappings for EN and AR
│   ├── contact.ts                 # Phone, WhatsApp, Email, Address
│   └── social.ts                  # Social media links
│
├── data/
│   ├── services.ts                # Structured services data (PPF, Ceramic, Detailing)
│   ├── packages.ts                # Structured package pricing & features
│   ├── gallery.ts                 # Gallery items with category tags
│   └── testimonials.ts            # Client testimonials data
│
├── i18n/
│   ├── config.ts                  # Locales definition ('en', 'ar')
│   └── messages/
│       ├── en.json                # English strings
│       └── ar.json                # Arabic strings
│
├── lib/
│   ├── utils.ts                   # Utility functions (cn, formatters)
│   ├── whatsapp.ts                # Contextual WhatsApp URL builder
│   └── validation/
│       └── contact.ts             # Contact form schema validator
│
└── types/
    ├── service.ts                 # Service data interfaces
    ├── package.ts                 # Package data interfaces
    ├── gallery.ts                 # Gallery item interfaces
    └── contact.ts                 # Contact form payload interfaces
```

---

## 6. Key Interactive Features

### 6.1 Interactive Before/After Slider
- Allows users to drag a central divider across high-resolution before/after vehicle photos (e.g. paint correction & ceramic coating results).
- Supports touch events on mobile devices and keyboard arrow key navigation for accessibility.

### 6.2 Pre-populated Package Quote Routing
- Clicking **"REQUEST A QUOTE"** on a package (e.g. Full Body PPF) routes to `/contact?service=ppf&package=full-body-ppf`.
- The Contact Form reads query parameters and automatically pre-selects the corresponding dropdown options.

### 6.3 Contextual WhatsApp Link Generator
- Generates localized WhatsApp chat links with customized message payloads:
  - **General**: `"Hello FTX, I would like to know more about your services."`
  - **Package Specific**: `"Hello FTX, I am interested in booking the Full Body PPF package."`

### 6.4 Filterable Gallery & Fullscreen Lightbox
- Category filters: `ALL`, `PPF`, `CERAMIC`, `DETAILING`, `BEFORE_AFTER`.
- Lightbox popup with next/previous navigation, keyboard escape closing, and image captions.

---

## 7. Contact API Endpoint Specification

### `POST /api/contact`
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "phone": "+971500000000",
    "email": "alex@example.com",
    "vehicleModel": "Porsche 911 GT3 RS",
    "service": "ppf",
    "package": "full-body-ppf",
    "message": "Looking for clear bra installation."
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Your quote request has been received. Our specialist will contact you shortly."
  }
  ```
- **Response Validation Error (400 Bad Request)**:
  ```json
  {
    "success": false,
    "errors": {
      "phone": "Please enter a valid phone number",
      "email": "Please enter a valid email address"
    }
  }
  ```

---

## 8. Quality Assurance & Performance Checklist
- [x] Zero hardcoded user-facing strings (all served via `en.json` / `ar.json`).
- [x] Responsive layout across 320px, 390px (Mobile), 768px (Tablet), 1024px, 1440px, 2560px (Ultra-wide).
- [x] GPU-accelerated CSS transforms and opacity for 60fps animations.
- [x] Respect `prefers-reduced-motion` browser settings.
- [x] Clean production build with 0 TypeScript warnings/errors and 0 ESLint errors.
