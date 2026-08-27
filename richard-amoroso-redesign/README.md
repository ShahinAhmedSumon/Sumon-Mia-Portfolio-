# Amoroso Violin Studio — redesign mockup

**Content:** every page and block of [`richardamoroso.com`](https://richardamoroso.com/)
**Design language:** [`natesviolin.com`](https://natesviolin.com/) (Nathan Cole, Violin)

A static, dependency-free concept: plain HTML + one CSS design system + vanilla JS. No frameworks, no build step.
All copy is taken from the real site (lightly rewritten into the new voice); imagery is AI-generated placeholder art — swap the ten files in `assets/img/` for Richard's own photographs and the layout is production-ready. Audio/video players and forms are visual only (nothing posts).

## Pages (1:1 with the source site)

| File | Original URL | What lives there |
|---|---|---|
| `index.html` | `/` | Hero + stat band, “what do you need help with”, Essential Excerpts membership, ArtistWorks, performances, testimonials, results, free guide, affiliations |
| `studio.html` | `/amoroso-violin-studio/` | Since 2004 / 100+ students, Student Benefits (scales, études, musicianship, purposeful practice, performing under pressure, auditions), a week in the studio |
| `programs.html` | `/programs/` | Essential Excerpts membership · ArtistWorks online instruction · Institute for College Readiness · private lessons · enrolment FAQ |
| `my-story.html` | `/my-story/` | Full biography as a scroll timeline (age 4 → Greenfield at 12 → Dickinson → Philly Pops → Philadelphia Orchestra 1998 → studio 2004) |
| `performances.html` | `/performances/` | Professional biography, selected appearances, the 1765 Nicolò Gagliano, audio/video player section |
| `case-studies.html` | `/amoroso-violin-studio/student-case-studies/` | Matt Brown, Jessica Clough, Crystal Kowalski, Asher, John, Jamie — long-form case studies |
| `student-performances.html` | `/amoroso-violin-studio/student-performances/` | Mozart 5 (Jamie Lee), Grub Springs (Matt Brown), Zigeunerweisen (Grace Jo), Vivaldi group recital, Beethoven 10 (Asher) |
| `contact.html` | `/contact/` | Contact form (full name / phone / email / message + both consent boxes), studio locations, FAQ |
| `legal.html` | `/privacy-policy/` + `/terms-of-service/` | Privacy policy and terms, kept readable |

## The design system

Tokens live at the top of `assets/css/design.css` — change these six lines and the whole site re-skins.

```
--ivory #F4EEE2  paper #FBF7F0  sand #E8DCC8     /* warm gallery ground   */
--ink   #15100C  amber #A6551F / #C67433          /* ink + violin varnish  */
Fraunces (display serif, italic for emphasis)  ·  Jost (UI/body, 0.2em tracked labels)
```

Signature devices borrowed from natesviolin.com:

- **Top ticker** + **sticky condensed header** with a serif wordmark and a handwritten `R.A.` signature
- **Arch-topped photography** (`--r-arch`) instead of rectangles — reads “instrument case / concert poster”, never generic SaaS
- **Oversized serif headline with one italic line** underlined in amber (`.d-1 em`)
- **Stat band** with count-up numbers (1998 · 100+ · 2004 · 1765)
- **Numbered section markers** (`01 / 10`, top-right) and hairline rules instead of boxes and shadows
- **Outlined pill buttons** that sweep-fill amber from the bottom on hover
- **`rows` list** — big serif item, thin rules, circular arrow token, 0.7rem left-shift on hover
- **Horizontal year timeline** with snap scrolling (the “How I Got Here” device)
- **Infinite marquees** for affiliations and the “Philadelphia Orchestra / Since 1998” strapline
- **Editorial case-study cards**, mock **audio players** with generated waveforms, star testimonials, a **lead-magnet modal**
- **Outlined giant `AMOROSO` footer wordmark** over ink, with the mailing-list form from the original footer
- Paper grain overlay, corner ticks on the viewport frame, scroll progress bar, rotating f-hole seal

Motion: every block reveals on scroll (`.in`), reduced-motion safe. Everything is keyboard reachable with visible focus rings, `aria-current` on the active nav item, semantic landmarks, and a skip link.

## Files

```
richard-amoroso-redesign/
├─ index.html  studio.html  programs.html  my-story.html  performances.html
├─ case-studies.html  student-performances.html  contact.html  legal.html
├─ assets/css/design.css     /* the whole design system, 28 commented sections */
├─ assets/js/icons.js        /* inline SVG sprite, written into <head> so <use> resolves */
├─ assets/js/main.js         /* reveal, ticker, accordion, modal, players, counters */
└─ assets/img/*.jpg          /* 10 generated placeholders */
```

## Preview

```bash
cd richard-amoroso-redesign && python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

`../build_pages.py` re-generates the eight inner pages from the shared header/footer partials in `index.html` — edit the partials there and re-run it to keep every page in sync.
