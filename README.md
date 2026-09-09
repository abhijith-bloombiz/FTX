# FTX – First Torque X (Production Website)

An ultra-premium, cinematic digital experience for **FTX – First Torque X**, a premier automotive protection and detailing center specializing in Paint Protection Film (PPF), Ceramic Coating, and Professional Detailing.

Built using Next.js 14 (App Router), TypeScript, Tailwind CSS, and custom internationalization supporting English and Arabic (RTL).

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **Localization**: Custom App Router Locale System (`/en`, `/ar` with full RTL layout)
- **Form Validation**: Native & Custom Schema Validator
- **Deployment**: Vercel / Node Server Compatible

---

## 📁 Folder Structure

```
d:/Bloombiz/NTX/
├── PROJECT_DOCUMENTATION.md      # Technical & engineering specification
├── README.md                     # Production setup and maintenance guide
├── public/                       # Static brand assets & images
│   ├── brand/                    # FTX logo SVG/PNG files
│   ├── images/
│   │   ├── hero/                 # High-res cinematic hero photography
│   │   ├── services/             # PPF, Ceramic Coating & Detailing shots
│   │   ├── gallery/              # Showcase & Before/After comparison images
│   │   └── about/                # Workshop & craftsmanship images
├── src/
│   ├── app/
│   │   ├── [locale]/             # Localized route handler ([locale] = en | ar)
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── about/page.tsx    # About Page
│   │   │   ├── services/page.tsx # Services Page
│   │   │   ├── gallery/page.tsx  # Gallery / Our Work Page
│   │   │   ├── packages/page.tsx # Packages Page
│   │   │   └── contact/page.tsx  # Contact Page
│   │   ├── api/contact/route.ts  # Contact API Route handler
│   │   ├── globals.css           # Design tokens, variables & fonts
│   │   ├── not-found.tsx         # Custom 404 page
│   │   └── loading.tsx           # Global fallback loader
│   ├── components/
│   │   ├── layout/               # Navbar, Mobile Menu, Footer, Language Switcher
│   │   ├── sections/             # Page section components (Hero, Intro, Services, WhyFTX, etc.)
│   │   └── ui/                   # Reusable UI (BeforeAfterSlider, Lightbox, PackageCard, ContactForm)
│   ├── config/                   # Site config, navigation links, contact info, social links
│   ├── data/                     # Service, package, gallery, and testimonial datasets
│   ├── i18n/                     # Locale config and translation dictionaries (`en.json`, `ar.json`)
│   ├── lib/                      # Helper utilities and WhatsApp link builder
│   └── types/                    # TypeScript interfaces
```

---

## 🛠️ Development Setup & Commands

### Prerequisites
- Node.js `>= 18.17.0`
- `npm` `>= 9.0.0`

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Running Locally
```bash
# Run local dev server on http://localhost:3000
npm run dev
```

### 3. Production Build
```bash
# Type check and build production bundle
npm run build

# Start production server
npm start
```

### 4. Code Checks
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site URL Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WhatsApp Integration Number (e.g. +971500000000)
NEXT_PUBLIC_WHATSAPP_NUMBER=971500000000

# Google Maps Directions URL
NEXT_PUBLIC_GOOGLE_MAPS_URL=https://maps.google.com/?q=FTX+First+Torque+X

# Contact Form Recipient Email
CONTACT_EMAIL=info@ftxdetailing.com
```

---

## 📝 Updating Content & Configurations

### 1. Updating Services Data
Edit `src/data/services.ts`. Add or modify service objects including titles, key benefits, process steps, and image paths.

### 2. Updating Packages
Edit `src/data/packages.ts`. You can update pricing, feature bullet points, and package IDs. (When a user clicks "REQUEST A QUOTE", the package ID automatically pre-populates the contact form).

### 3. Updating Gallery & Before/After Showcase
Edit `src/data/gallery.ts`. Add gallery items with category tags: `'ppf' | 'ceramic' | 'detailing' | 'before-after'`.

### 4. Updating Translations (English / Arabic)
- **English**: Update `src/i18n/messages/en.json`
- **Arabic**: Update `src/i18n/messages/ar.json`

Ensure key parity between `en.json` and `ar.json` for proper locale rendering.

### 5. Updating Business Information
Edit `src/config/site.ts` and `src/config/contact.ts` to update business hours, location address, phone numbers, or social media handles.

---

## 🚢 Deployment

### Deploying to Vercel
1. Connect your repository to Vercel.
2. Ensure Environment Variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, etc.) are configured in Vercel settings.
3. Vercel automatically detects Next.js App Router and deploys with optimized Edge Network caching.

---

## 📞 Support & Maintenance

For questions or updates regarding the **FTX – First Torque X** website, refer to `PROJECT_DOCUMENTATION.md` for full component specifications.
