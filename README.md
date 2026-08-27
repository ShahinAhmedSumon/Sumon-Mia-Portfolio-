# Ahmed Sumon — Personal Portfolio Website

A premium, modern, single-page portfolio website for **Ahmed Sumon**, a web developer with 3+ years of industry experience specialising in **WordPress, WooCommerce, Shopify, SEO** and **custom web development**.

## ✨ Features

- **Hero section** with animated typing effect and live code card
- **Custom cursor**, floating chips and scroll-triggered reveal animations
- **Marquee** tech-stack ticker
- **Services** — WordPress, eCommerce, custom dev, SEO & performance
- **Capabilities** — the full range of websites I can build
- **Skills** — animated progress bars across Development, CMS/eCommerce and Growth
- **Portfolio** — 21 real projects presented as filterable cards (Business, eCommerce, Services, Corporate, Creative, Education, Specialized)
- **Why work with me** + a clear 4-step **process**
- **FAQ** accordion
- **Contact form** (opens the visitor's email client, pre-filled)
- Fully **responsive** (desktop / tablet / mobile)
- SEO-friendly: semantic HTML, Open Graph tags and JSON-LD structured data
- **Site Dashboard** (`admin.html`) — self-hosted CMS: edit all content via a browser UI, save commits directly to GitHub via the API

## 🛠️ Tech

Plain **HTML, CSS and vanilla JavaScript** — no build step, no dependencies. Fast and easy to host anywhere.

## 🔧 Site Dashboard (Admin Panel)

A self-hosted dashboard lets you edit portfolio content without touching code.

**URL:** `https://shahinahmedsumon.github.io/Sumon-Mia-Portfolio-/admin.html`

**How it works:**
1. Generate a GitHub Personal Access Token with `repo` scope at <https://github.com/settings/tokens>
2. Open `admin.html` and log in with your token
3. Edit Hero, About, Projects, FAQ, Contact and Theme sections
4. Click **Save Changes** — the dashboard commits `content.json` to GitHub via the API
5. GitHub Pages rebuilds automatically within ~1 minute

**Files:**
| File | Purpose |
|---|---|
| `admin.html` | Dashboard UI |
| `assets/css/admin.css` | Dashboard styles |
| `assets/js/admin.js` | Dashboard logic (GitHub API integration) |
| `content.json` | All editable site content |
| `assets/js/content.js` | Loads `content.json` and applies it to the live site |

## 🚀 Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## 📬 Contact

- **Name:** Ahmed Sumon
- **Email:** ahmedsumonshahin645@gmail.com

---

© Ahmed Sumon. Built with care.
