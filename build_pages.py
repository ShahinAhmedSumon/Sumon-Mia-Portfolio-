#!/usr/bin/env python3
"""Assemble the Amoroso redesign pages from shared header/footer partials taken
from index.html, so every page stays perfectly in sync. (build tool, not part of the site)"""
import io, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "richard-amoroso-redesign")
idx = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read().split("\n")

def grab(start_marker, end_marker, inclusive_end=True):
    si = next(i for i, l in enumerate(idx) if start_marker in l)
    ei = next(i for i, l in enumerate(idx) if end_marker in l)
    return "\n".join(idx[si: ei + 1 if inclusive_end else ei]).strip()

TOP = grab('<a class="skip"', '<!-- ===== TICKER', inclusive_end=False)
TICKER = grab('<!-- ===== TICKER', '<!-- ===== HEADER', inclusive_end=False)
HEADER = grab('<!-- ===== HEADER', '</header>')
FOOTER = grab('<!-- ===== FOOTER', '</footer>')
MODAL = grab('<!-- ===== LEAD MAGNET MODAL', '<script src', inclusive_end=False)

HEAD_TMPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Jost:wght@300..600&family=Caveat:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/design.css">
<script src="assets/js/icons.js"></script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2315100C'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='17' fill='%23C67433' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E">
</head>
<body>
"""

TAIL = """
<script src="assets/js/icons.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
"""


def page(fname, title, desc, active, body, modal=True, banner_img=None):
    hdr = HEADER
    if active:
        old = '<a href="%s">' % fname
        new = '<a href="%s" aria-current="page">' % fname
        # only mark the first occurrence inside the nav
        nav_i = hdr.index('aria-label="Primary"')
        before, after = hdr[:nav_i], hdr[nav_i:]
        after = after.replace(old, new, 1)
        hdr = before + after
    out = [HEAD_TMPL.format(title=title, desc=desc), TOP, TICKER, hdr,
           '<main id="main">', body.strip(), "</main>", FOOTER]
    out.append('<button class="top-btn" id="toTop" type="button" aria-label="Back to top"><svg class="ic" aria-hidden="true"><use href="#i-arrow-up"></use></svg></button>')
    if modal:
        out.append(MODAL)
    out.append(TAIL)
    txt = expand("\n".join(out) + "\n")
    io.open(os.path.join(ROOT, fname), "w", encoding="utf-8").write(txt)
    print("wrote %-32s %6d bytes" % (fname, len(txt)))


def crumbs(label):
    return ('<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a>'
            '<svg class="ic" aria-hidden="true"><use href="#i-double"></use></svg>'
            '<span style="color:var(--on-ink)">' + label + '</span></nav>')


def banner(kicker, title, lede, right_html="", img=None, alt=""):
    pic = ""
    if img:
        pic = ('<figure class="ph ph--s" data-reveal="scale" style="aspect-ratio:4/5">'
               '<img src="assets/img/%s" alt="%s" width="800" height="1000"></figure>' % (img, alt))
    return """<!-- ===== BANNER ===== -->
<section class="banner on-ink" style="background:var(--ink)">
  <div class="wrap">
    {cr}
    <div class="banner-grid">
      <div class="stack">
        <p class="label on-ink"><i class="dash"></i>{kicker}</p>
        <h1 class="d-1" style="color:var(--on-ink)">{title}</h1>
      </div>
      <div class="stack">
        {lede}
        {right}
      </div>
    </div>
  </div>
</section>
""".format(cr=crumbs(kicker), kicker=kicker, title=title, lede=lede, right=right_html)


# ============================================================ helpers
def sec(idx_no, total, label, body, cls="", attrs=""):
    return """<section class="sec %s" %s>
  <div class="wrap">
    <p class="idx">%02d / %02d</p>
    %s
  </div>
</section>""" % (cls, attrs, idx_no, total, body)


def expand(t):
    t = re.sub(r"@@i:([a-z-]+)@@", lambda m: '<svg class="ic" aria-hidden="true"><use href="#i-%s"></use></svg>' % m.group(1), t)
    t = re.sub(r"@@tick@@", '<li><i><svg class="ic" aria-hidden="true"><use href="#i-check"></use></svg></i>', t)
    return t


# ============================================================ STUDIO
studio_body = """
""" + banner("Amoroso Violin Studio",
             "Since 2004.<br>Teaching <em>100+</em><br>students.",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Whether you are a student graduating from high school and facing the choice of which music university to attend, or a professional violinist auditioning for a spot in a prestigious orchestra, Richard Amoroso has the skills and knowledge that prove positive results.</p>',
             right_html='<div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.6rem"><a class="btn btn--light" href="programs.html"><span>See the programs</span>@@i:arrow@@</a><a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="contact.html"><span>Book a lesson</span></a></div>',
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 06</p>
    <div class="g-split">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>The studio</p>
        <h2 class="d-2">Educated 100+ students,<br>every age and ability.</h2>
        <p>Amoroso Violin Studio was started in 2004 and has educated more than one hundred students across every age and level of playing. Most notably, substantial scholarships have been awarded to students graduating from high school, advancing to prestigious music schools such as Oberlin and Indiana University.</p>
        <p>Many students, while still in high school, have participated as members of the most esteemed youth orchestras in the greater Philadelphia area. Several have gone on to Pennsylvania Regionals and the Pennsylvania State Orchestras.</p>
        <a class="link" href="case-studies.html">Read the case studies@@i:arrow@@'</a>
      </div>
      <div class="g g-2" style="gap:1.1rem;align-items:start" data-reveal="scale">
        <figure class="ph ph--arch ph--raw" style="aspect-ratio:3/4;margin-top:2.6rem">
          <img src="assets/img/students.jpg" alt="A weekly lesson at the studio" width="760" height="1010">
        </figure>
        <div class="stack" style="align-content:end">
          <div class="stats" style="grid-template-columns:1fr;border-top:0">
            <div style="border:0;padding-left:0"><b data-count="100" data-suffix="+">0</b><span>Students since 2004</span></div>
            <div style="border:0;padding-left:0;border-top:1px solid var(--rule)"><b data-count="6" data-suffix=" days">0</b><span>Weekly practice floor for serious students</span></div>
          </div>
          <p class="small">The studio gives students the tools they need at home — the work each player must do to make real change on a daily basis — and inspires them to love the violin and music in general.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec on-sand">
  <div class="wrap">
    <p class="idx">03 / 06</p>
    <div class="g-head" style="margin-bottom:clamp(1.6rem,3vw,2.6rem)">
      <div class="stack">
        <p class="label" data-reveal><i class="dash"></i>Student benefits</p>
        <h2 class="d-2" data-reveal>A sound fundamental<br>platform of technique.</h2>
      </div>
      <p data-reveal>The studio is dedicated to building technique that holds up under pressure — in a lesson, a recital, a festival audition, or a final round behind a screen.</p>
    </div>
    <div class="g g-2">
      <article class="card card--panel" data-reveal>
        <p class="card-num">01 — Scales</p>
        <h3 class="card-title"><span>Every key, every speed,<br>every bowing</span></h3>
        <p>From the beginning, scales of all kinds are at the root of all that is to come. Students learn all scales in every key with varying speeds and bowings; scales with double stops stretch the student's ability to its fullest potential.</p>
      </article>
      <article class="card card--panel" data-reveal>
        <p class="card-num">02 — Études</p>
        <h3 class="card-title"><span>Kreutzer, Rode, Paganini</span></h3>
        <p>While learning skills, students are immersed in études — everything from Kreutzer and Rode to ultimately the Paganini Caprices. Bow technique such as martelé, spiccato and sautillé, with left-hand agility, proper shifting, finger articulation and vibrato.</p>
      </article>
      <article class="card card--panel" data-reveal>
        <p class="card-num">03 — Musicianship</p>
        <h3 class="card-title"><span>Ear training &amp; reading</span></h3>
        <p>Pitch discernment, the ability to see and correctly perform different rhythmic patterns, and textural awareness are essential to becoming accomplished. Violinists of every level keep refining these skills to stay in shape and stay honest about where they are.</p>
      </article>
      <article class="card card--panel" data-reveal>
        <p class="card-num">04 — Practice</p>
        <h3 class="card-title"><span>Practising with a purpose</span></h3>
        <p>So much time is easily wasted not knowing what to do when you go home. The aim is progress — big or small — each and every day, so that practice produces real change rather than repetition.</p>
      </article>
      <article class="card card--panel" data-reveal>
        <p class="card-num">05 — Performance</p>
        <h3 class="card-title"><span>Playing under pressure</span></h3>
        <p>No one is immune to the nerves and excitement of playing in public. The mental game for violin is no different than giving a speech or playing a sport — so it is coached deliberately, not left to chance.</p>
      </article>
      <article class="card card--panel" data-reveal>
        <p class="card-num">06 — Pathway</p>
        <h3 class="card-title"><span>Auditions &amp; college</span></h3>
        <p>Skilled, experienced instruction is available specifically for auditioning. The studio's deep knowledge of solo and orchestral repertoire gives students a major advantage when competing for spots in college or orchestra — and its knowledge of the college decision, from choosing the school and teacher to choosing the repertoire, covers the years that follow.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <p class="idx">04 / 06</p>
    <div class="g-split-r" style="align-items:center">
      <figure class="ph ph--s" data-reveal="scale" style="aspect-ratio:16/11">
        <img src="assets/img/left-hand.jpg" alt="Left-hand technique at close range" width="1100" height="760">
      </figure>
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>What a week looks like</p>
        <h2 class="d-3">One lesson, six<br>days of work.</h2>
        <ol class="rows" style="border-top:1px solid var(--rule)">
          <li><span class="k">MON</span><div class="t" style="font-size:1.2rem">Scales &amp; arpeggios<small>Slow, with a tuner and a mirror. New key each week.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">TUE</span><div class="t" style="font-size:1.2rem">Étude<small>One technical problem isolated, three solutions tested.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">WED</span><div class="t" style="font-size:1.2rem">Repertoire — pages, not pieces<small>Difficult bars first. Rhythm variations, then tempo.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">THU</span><div class="t" style="font-size:1.2rem">Ear training &amp; sight reading<small>Pitch discernment and rhythmic patterns, away from the instrument.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">FRI</span><div class="t" style="font-size:1.2rem">Recording day<small>Play, listen, mark the score. The tape is the honest teacher.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">SAT</span><div class="t" style="font-size:1.2rem">Mock performance<small>Full attire, full room, no stops. Then the lesson.</small></div><span class="go">@@i:arrow-diag@@</span></li>
        </ol>
      </div>
    </div>
  </div>
</section>

<section class="sec on-ink">
  <div class="wrap">
    <p class="idx">05 / 06</p>
    <div class="g-split">
      <div class="stack" data-reveal>
        <p class="label on-ink"><i class="dash"></i>See the results</p>
        <h2 class="d-2">Student case<br>studies.</h2>
        <p class="lede">Richard's main goal is to share his love of music along with the hard work it took him to get where he is today. To see more examples of what his teaching produces, check out the student performance and case study pages.</p>
        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.6rem">
          <a class="btn btn--light" href="case-studies.html"><span>Student case studies</span>@@i:arrow@@</a>
          <a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="student-performances.html"><span>Student performances</span></a>
        </div>
      </div>
      <div class="g g-2" data-reveal="scale" style="gap:1rem">
        <figure class="ph ph--s"><img src="assets/img/recital.jpg" alt="Student chamber recital" width="800" height="800"></figure>
        <figure class="ph ph--s" style="margin-top:2rem"><img src="assets/img/orchestra.jpg" alt="Youth orchestra performance" width="800" height="800"></figure>
      </div>
    </div>
  </div>
</section>

<div class="strip" aria-label="Where students went">
  <div class="strip-track loop">
    <span class="strip-item"><i>Conservatory</i>Oberlin College · John F. Oberlin Scholarship</span>
    <span class="strip-item"><i>University</i>Jacobs School, Indiana University</span>
    <span class="strip-item"><i>School of Music</i>Eastman · full scholarship</span>
    <span class="strip-item"><i>University</i>University of Richmond · music scholarship</span>
    <span class="strip-item"><i>College</i>Boston University · Bard Conservatory</span>
    <span class="strip-item"><i>Youth Orchestra</i>Philadelphia Youth Orchestra</span>
    <span class="strip-item"><i>Festivals</i>PMEA Regionals &amp; State Orchestra</span>
    <span class="strip-item"><i>Scholarship</i>Reading Musical Foundation</span>
  </div>
</div>
"""

page("studio.html", "Amoroso Violin Studio — Since 2004, 100+ students of all ages and skill levels",
     "The studio Richard Amoroso founded in 2004: scales, études, musicianship, practising with a purpose and performing under pressure — for students from first lesson to professional audition.",
     "studio.html", studio_body)

# ============================================================ PROGRAMS
programs_body = """
""" + banner("Programs offered",
             "Obtain critical<br>instruction only a<br><em>seasoned violinist</em><br>can provide.",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Whether you\u2019re just starting or preparing for professional auditions, I provide personalised violin instruction to meet your specific goals. Here are my available programs for dedicated students.</p>',
             right_html='<div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.4rem"><a class="btn btn--light" href="#excerpts"><span>Essential Excerpts</span>@@i:arrow@@</a><a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="#artistworks"><span>ArtistWorks</span></a></div>',
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 06</p>
    <ul class="rows" data-reveal>
      <li><span class="k">01</span><div class="t">Essential Excerpts Membership<small>The flagship audition program — video tutorials, annotated sheet music, bi-monthly live Zoom calls.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">02</span><div class="t">ArtistWorks Online Instruction<small>Hundreds of interactive classical violin lessons with sheet music and play-along tracks.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">03</span><div class="t">Institute for College Readiness<small>Audition programmes, school selection, teacher choice and repertoire — the years after high school.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">04</span><div class="t">Private lessons — studio &amp; online<small>Bryn Mawr, PA · Melbourne, FL · or wherever you are, on a scheduled weekly call.</small></div><span class="go">@@i:arrow-diag@@</span></li>
    </ul>
  </div>
</section>

<section class="sec on-ink" id="excerpts" style="scroll-margin-top:80px">
  <div class="wrap">
    <p class="idx">03 / 06</p>
    <div class="g-split" style="align-items:start">
      <div class="stack" data-reveal>
        <p class="label on-ink"><i class="dash"></i>Membership · 01</p>
        <h2 class="d-2">Essential<br><em>Excerpts</em></h2>
        <p class="lede">Designed for violinists seeking to master orchestral excerpts and win audition positions in professional orchestras.</p>
        <p>Get insider knowledge from a Philadelphia Orchestra member with 25+ years of audition coaching experience. Access comprehensive video tutorials, professional sheet music with audition-standard bowings, bi-monthly live Zoom calls, and a supportive community of fellow auditioners.</p>
        <ul class="ticks">
          @@tick@@Professional violinists preparing for orchestral auditions</li>
          @@tick@@Advanced students seeking to master standard orchestral excerpts</li>
          @@tick@@Musicians wanting insider knowledge of what audition committees listen for</li>
          @@tick@@Players looking for ongoing support through live sessions and community feedback</li>
          @@tick@@Violinists ready to avoid the mistakes that eliminate 90% of audition candidates</li>
        </ul>
        <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.7rem">
          <a class="btn btn--light" href="https://membership.richardamoroso.com/registration"><span>Learn more about the membership</span>@@i:arrow-diag@@</a>
        </div>
      </div>
      <div class="stack">
        <figure class="ph ph--s ph--raw" data-reveal="scale">
          <img src="assets/img/score.jpg" alt="Sheet music with audition-standard bowings marked in pencil" width="900" height="760">
        </figure>
        <div class="g g-2" style="gap:1px;background:var(--rule-on-ink)" data-reveal>
          <div style="background:var(--ink);padding:1.15rem"><b class="display" style="font-size:1.75rem;line-height:1;display:block">Video<br>tutorials</b><p class="small" style="color:var(--on-ink-3);margin-top:.5rem">Every standard excerpt, played, slowed down and explained.</p></div>
          <div style="background:var(--ink);padding:1.15rem"><b class="display" style="font-size:1.75rem;line-height:1;display:block">Live<br>Zoom</b><p class="small" style="color:var(--on-ink-3);margin-top:.5rem">Bi-monthly calls — questions, mock rounds, committee feedback.</p></div>
        </div>
        <div class="quote" data-reveal style="margin-top:1rem">
          <p class="display" style="font-size:1.2rem;line-height:1.25;color:var(--on-ink)">“The studio's deep knowledge of the repertoire — solo and orchestral — gives students a major advantage when competing for spots in college and/or orchestras.”</p>
          <p class="quote-by" style="color:var(--on-ink-3)">Amoroso Violin Studio</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec bg-paper" id="artistworks" style="scroll-margin-top:80px">
  <div class="wrap">
    <p class="idx">04 / 06</p>
    <div class="g-split-r">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>Online · 02</p>
        <h2 class="d-2">ArtistWorks<br>online instruction</h2>
        <h3 class="d-4"><em>Classical violin with Richard Amoroso</em></h3>
        <p>Richard has developed a rich library with hundreds of online classical violin lessons. Students have unlimited access to the interactive lessons including sheet music and play-along tracks. Learn how to play classical violin from a virtuoso.</p>
        <ul class="ticks">
          @@tick@@Explore the massive lesson library covering the key fundamentals of playing</li>
          @@tick@@Lessons range from beginner to intermediate to advanced in the curriculum</li>
          @@tick@@Send videos through the Video Exchange Program and receive timely feedback</li>
          @@tick@@Watch the lessons and feedback shared with the ArtistWorks violin community</li>
        </ul>
        <a class="btn" href="https://artistworks.com/violin-lessons-richard-amoroso"><span>Go to ArtistWorks</span>@@i:arrow-diag@@</a>
      </div>
      <figure class="ph ph--arch ph--raw" data-reveal="scale" style="aspect-ratio:4/5">
        <img src="assets/img/online.jpg" alt="Online violin lesson set-up" width="880" height="1100">
        <span class="card-tag">Video Exchange</span>
      </figure>
    </div>
  </div>
</section>

<section class="sec" id="college" style="scroll-margin-top:80px">
  <div class="wrap">
    <p class="idx">05 / 06</p>
    <div class="g-split">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>For students · 03</p>
        <h2 class="d-2">Institute for<br>College Readiness</h2>
        <p>The studio also has a deep knowledge of the college decision. From selecting the proper school and teacher to selecting the appropriate repertoire, each student receives the information vital to the years after high school.</p>
        <ol class="rows" style="margin-top:.6rem">
          <li><span class="k">STEP 01</span><div class="t" style="font-size:1.25rem">Build the audition programme<small>Two concertos, solo Bach, an étude, orchestral excerpts and scales — assembled to your calendar.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">STEP 02</span><div class="t" style="font-size:1.25rem">Shortlist schools &amp; teachers<small>Conservatory, university or double-degree — matched to how you actually work.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">STEP 03</span><div class="t" style="font-size:1.25rem">Scholarship auditions<small>Preparation for merit competitions and the recordings schools require before December.</small></div><span class="go">@@i:arrow-diag@@</span></li>
          <li><span class="k">STEP 04</span><div class="t" style="font-size:1.25rem">Decide with the full picture<small>Offers, fit, faculty, and the money — weighed together, not one at a time.</small></div><span class="go">@@i:arrow-diag@@</span></li>
        </ol>
      </div>
      <div class="stack">
        <figure class="ph ph--s" data-reveal="scale"><img src="assets/img/recital.jpg" alt="Recital before family and teachers" width="900" height="700"></figure>
        <div class="card--panel" style="background:var(--paper);border-radius:var(--r-s);padding:1.4rem" data-reveal>
          <p class="label"><i class="dash"></i>Also in this studio</p>
          <p class="display" style="font-size:1.15rem;line-height:1.3;margin-top:.6rem">Private lessons — weekly, in Bryn Mawr or Melbourne, and online for students outside Pennsylvania.</p>
          <a class="link" href="contact.html" style="margin-top:.9rem">Enquire about availability@@i:arrow@@</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec sec--tight">
  <div class="wrap">
    <p class="idx">06 / 06</p>
    <div class="g-head" style="margin-bottom:1.4rem">
      <div class="stack"><p class="label"><i class="dash"></i>Before you join</p><h2 class="d-3">Common questions</h2></div>
      <p class="small">Enrolment, level, equipment and what a live call actually looks like.</p>
    </div>
    <div class="acc" data-reveal>
      <div class="acc-item">
        <button class="acc-btn" type="button" aria-expanded="false"><span class="no">01</span><span>Do I need to be a professional to join Essential Excerpts?</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel"><div class="acc-panel-in">No. The membership is built for professional violinists preparing for auditions, but advanced students who are serious about the standard excerpts get just as much from the annotated parts and the video tutorials. If you are still building fundamentals, start with ArtistWorks or a private lesson and join when your left hand is ready.</div></div>
      </div>
      <div class="acc-item">
        <button class="acc-btn" type="button" aria-expanded="false"><span class="no">02</span><span>What happens on the bi-monthly Zoom calls?</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel"><div class="acc-panel-in">Members play, ask, and hear the committee's point of view. We cover bowing choices, risk management in the first thirty seconds, how a panel weighs rounds, and what to practise the week before. Written follow-up notes go out afterwards so the session is not lost.</div></div>
      </div>
      <div class="acc-item">
        <button class="acc-btn" type="button" aria-expanded="false"><span class="no">03</span><span>Is the sheet music included with the membership?</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel"><div class="acc-panel-in">Yes — professional parts with audition-standard bowings are included for every excerpt in the library, and they are yours to print and mark up. Bowings are not decoration: they are the decision that gets you through the first round.</div></div>
      </div>
      <div class="acc-item">
        <button class="acc-btn" type="button" aria-expanded="false"><span class="no">04</span><span>How does the Video Exchange on ArtistWorks work?</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel"><div class="acc-panel-in">You record a passage, upload it, and Richard replies with a filmed response addressing exactly what you played. Your exchange is then visible to the ArtistWorks community, so you learn from everyone's problems as well as your own.</div></div>
      </div>
      <div class="acc-item">
        <button class="acc-btn" type="button" aria-expanded="false"><span class="no">05</span><span>Where is the studio, and can I study online instead?</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc-panel"><div class="acc-panel-in">The studio teaches in Bryn Mawr, Pennsylvania and Melbourne, Florida, and online for students anywhere. Weekly lessons are the standard; many audition candidates add a second session in the final month before a live round.</div></div>
      </div>
    </div>
  </div>
</section>
"""

page("programs.html", "Programs — Essential Excerpts, ArtistWorks & College Readiness | Amoroso Violin Studio",
     "The three programmes Richard Amoroso teaches: the Essential Excerpts audition membership, ArtistWorks online classical violin instruction, and the Institute for College Readiness.",
     "programs.html", programs_body)

# ============================================================ MY STORY
def tl(year, head, text, img=None, alt=""):
    pic = ""
    if img:
        pic = '<figure class="ph ph--s" style="aspect-ratio:4/3;margin-bottom:.9rem"><img src="assets/img/%s" alt="%s" width="600" height="450"></figure>' % (img, alt)
    return """<li class="tl-item">%s<span class="tl-year">%s</span><h4>%s</h4><p>%s</p></li>""" % (pic, year, head, text)

story_body = """
""" + banner("My story",
             "Started playing<br>at <em>four</em> —<br>wanting to be<br>like Dad.",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Hello, my name is Richard Amoroso. I have been playing the violin for as long as I can remember.</p>',
             right_html='<p class="small" style="color:var(--on-ink-3)">My earliest memories were intently watching my dad play and practice his cello. I dearly loved him and still do.</p>',
             img="young-richard.jpg", alt="Richard as a boy with his first violin",
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 07</p>
    <div class="g-split" style="align-items:start">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>1970s · the first instrument</p>
        <h2 class="d-3">A smaller cello<br>that wasn’t.</h2>
        <p>Wanting to be like him, I have pictures of me playing a toy violin like a cello when I was two or three. But one day when I was four, my dad — while doing his coursework to be certified to teach music — brought home a violin. I remember it like it was yesterday. My eyes popped out: I had no idea they made real “cellos” that were smaller than me.</p>
        <p>It was too big. I begged him to get me a smaller one, and on the third try he brought one home I could hold and play. He showed me a few things, and within a short time that day I successfully played Twinkle Twinkle. My parents were immediately thrilled — I played the song over the phone for my grandparents and great aunts. Little did I know I would be performing on the violin for the rest of my life.</p>
        <p class="small">I still have and cherish that very same instrument.</p>
      </div>
      <div class="g g-2" data-reveal="scale" style="gap:1rem">
        <figure class="ph ph--arch ph--raw" style="aspect-ratio:3/4"><img src="assets/img/young-richard.jpg" alt="Richard as a child, playing at home" width="700" height="930"><figcaption class="cap"><b>Archive</b><span>c.1975</span></figcaption></figure>
        <div class="stack" style="align-content:end;gap:.9rem">
          <div class="stats" style="grid-template-columns:1fr">
            <div style="border:0;padding:0"><b data-count="4">0</b><span>Years old, first lesson</span></div>
            <div style="border:0;padding:0;border-top:1px solid var(--rule)"><b data-count="45" data-suffix=" min">0</b><span>Daily practice, until age 11</span></div>
          </div>
          <p class="small">First lessons with Chuck Parker. First performance: a first-grade Christmas concert — nervous and excited, “I would say it is no different now when I have to perform.”</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec on-sand">
  <div class="wrap">
    <p class="idx">03 / 07</p>
    <div class="g-head" style="margin-bottom:clamp(1.2rem,2.4vw,2rem)">
      <div class="stack"><p class="label" data-reveal><i class="dash"></i>How I got here</p><h2 class="d-2" data-reveal>The long way<br>into the orchestra.</h2></div>
      <p data-reveal>Most violinists' paths are a straight line from the practice room to the chair. Mine was not — and that is exactly why I teach the way I do.</p>
    </div>
    <div class="tl">
      <ol class="tl-track">
        """ + tl("1978", "Grandfather's barber shop",
                "As time went on I practised and performed in my grandfather's barber shop while my mother helped in my grandmother's card and gift shop next door. I had no idea how much I was learning about performing and interacting with the public.") + """
        """ + tl("1980s", "An audiophile house",
                "My dad was an audiophile and constantly had music playing to test his components — mostly symphonic. Just by living in that house I received a great musical education, plus the normal father/son arguments about my practice habits.") + """
        """ + tl("1984", "Greenfield Competition",
                "My greatest accomplishment in my youth: at twelve, I won the Philadelphia Orchestra's Student Competition (now the Albert M. Greenfield Competition). The prize was a solo with the Orchestra — the following year I played the first movement of Mozart's Fourth Concerto at the Academy of Music.",
                "recital.jpg", "A youth soloist with orchestra") + """
        """ + tl("1986", "Norman Carol",
                "In high school I took lessons with the Orchestra's retired Concertmaster, played chamber ensembles and Philadelphia Youth Orchestra, and studied piano — while still not considering myself dedicated or passionate about practising.") + """
        """ + tl("1988", "Not music school",
                "At the end of high school I truly did not know what to do. I had the ability and could have gone to music school, but for whatever reason I chose not to. Neither Norman Carol nor my father pushed me. To this day I can't explain it.") + """
        """ + tl("1990", "Villanova → Dickinson",
                "Two years at Villanova, initially as an Electrical Engineering major (I nearly failed Calculus), then Accounting. I transferred to Dickinson College and graduated in Economics — in four years total, so it cost my parents nothing extra.") + """
        """ + tl("1992", "Telemarketer",
                "After Dickinson I had no passion for the jobs I was interviewing for. My lowest point was taking a job as a telemarketer. In between, part-time work at a golf course, where I became a half-decent golfer.") + """
        """ + tl("1993", "Back to school — to teach",
                "I followed my father's footsteps and got certified to teach music at Immaculata College, student teaching at Lower Merion HS in Ardmore. Meanwhile I played freelance gigs on the violin, including a solo with my dad and the Philly Pops in my senior year of high school.") + """
        """ + tl("1994", "The Pops second violin chair",
                "The Philly Pops conductor and personnel manager — who had heard me play — hired me into the second violin section. That is how I met a player who had just left Curtis and was in the Concerto Soloists. We played golf; I asked for a lesson; and all of a sudden I got the bug to practise.") + """
        """ + tl("1994", "One student, one sentence",
                "The most important day: subbing as a band teacher in a middle school, a student overheard me practising during a break and told me I was talented. That is when the direction of my life really started to change.") + """
        """ + tl("1995", "My own version of music school",
                "I asked my dad if it was too late to pursue the violin at 23, without a music degree. He told me to go for it. So I studied with William DePasquale, Rafael Druian and David Arben among others, and practised in amounts and ways I never had in my whole life.",
                "violin-1765.jpg", "The Nicolò Gagliano, Naples 1765") + """
        """ + tl("1997", "The calculated gamble",
                "In two years I won a position with Concerto Soloists and got onto the Philadelphia Orchestra's B sub list. At 27 I had a tough decision: keep the gigs, or protect the practice hours. I quit being a member of Concerto Soloists.") + """
        """ + tl("1998", "First violin, Philadelphia",
                "That September I was in the finals of the Cincinnati Symphony for the third time. But everything was pointed at Philadelphia. My first round felt horrible — and then I let go and was myself. Each round I gained confidence, and ultimately won a position in the First Violin Section.",
                "orchestra.jpg", "With The Philadelphia Orchestra") + """
        """ + tl("2004", "The studio",
                "The same year I returned to Carnegie for a solo recital, I founded Amoroso Violin Studio — twenty-two years and more than one hundred students later.") + """
        """ + tl("TODAY", "Where you go from here",
                "My uncle, also a musician, told me soon after I got into the Orchestra how fortunate I was, and to never lose sight of it. He was right. I truly love music and what I get to do day in and day out.") + """
      </ol>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <p class="idx">04 / 07</p>
    <div class="g-split-r">
      <figure class="ph ph--s" data-reveal="scale" style="aspect-ratio:16/10">
        <img src="assets/img/richard-now.jpg" alt="Richard Amoroso today" width="1000" height="625">
      </figure>
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>What the detours taught me</p>
        <h2 class="d-3">Nobody is too late.<br>Nobody is too old<br>to start again.</h2>
        <p>My path was an unusual one: an economics degree, a telemarketing job, a teaching certificate, and a first audition at 27 in a borrowed, ugly, inexpensive violin I could not have afforded to replace. My greatest strength was perseverance and optimism — and the practice method I had to invent because no one handed me one.</p>
        <p>That is what the studio teaches: not only what to play, but how to work. My attitude in audition season was to not worry about the outcome and focus only on getting better. It is the same advice I give every student who walks in worrying they are behind.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec bg-paper" style="border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="idx">05 / 07</p>
    <div class="g g-3">
      <article class="card" data-reveal>
        <figure class="ph ph--s"><img src="assets/img/young-richard.jpg" alt="Family archive photograph" width="700" height="700"></figure>
        <div class="card-body"><p class="card-num">Archive · 01</p><h3 class="card-title"><span>Dad, and a cello</span></h3><p>To read about my father — cellist, teacher, and the reason any of this started — visit <a class="link" href="https://richardamorosocello.com" style="border:0;text-decoration:underline;text-underline-offset:3px">richardamorosocello.com</a>.</p></div>
      </article>
      <article class="card" data-reveal>
        <figure class="ph ph--s"><img src="assets/img/violin-1765.jpg" alt="The 1765 Nicolò Gagliano" width="700" height="700"></figure>
        <div class="card-body"><p class="card-num">Archive · 02</p><h3 class="card-title"><span>Nicolò Gagliano, 1765</span></h3><p>The instrument I perform and record on — and never owned cheaply.</p></div>
      </article>
      <article class="card" data-reveal>
        <figure class="ph ph--s"><img src="assets/img/orchestra.jpg" alt="Solo recital" width="700" height="700"></figure>
        <div class="card-body"><p class="card-num">Archive · 03</p><h3 class="card-title"><span>Carnegie, twice</span></h3><p>A trio recital and, in 2004, a solo recital at Weill Recital Hall.</p></div>
      </article>
    </div>
  </div>
</section>

<section class="sec on-ink">
  <div class="wrap">
    <div class="g-split" style="align-items:center">
      <div class="quote" data-reveal>
        <p class="pull pull--wide" style="color:var(--on-ink)">“So if you need a helping hand — I can help you play the way you've always dreamed.”</p>
        <p class="quote-by" style="color:var(--on-ink-3)">Richard Amoroso@@i:double@@</p>
      </div>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;justify-content:flex-end" data-reveal>
        <a class="btn btn--light" href="contact.html"><span>Get in touch</span>@@i:arrow@@</a>
        <a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="programs.html"><span>Programs</span></a>
      </div>
    </div>
  </div>
</section>
"""

page("my-story.html", "My Story — Richard Amoroso, violinist and teacher",
     "From a toy violin at age two to the First Violin Section of The Philadelphia Orchestra in 1998: Richard Amoroso's unusually indirect road into the orchestra, and what it taught him about practice.",
     "my-story.html", story_body)

# ============================================================ PERFORMANCES
perf_body = """
""" + banner("Performances",
             "Philadelphia<br>Orchestra member<br><em>since 1998.</em>",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Richard Amoroso has performed as soloist with Peter Nero and the Philly Pops, the North Penn Symphony, and in a trio recital at Carnegie Hall’s Weill Recital Hall. Below is more information on an extraordinary performing career.</p>',
             right_html='<div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.4rem"><a class="btn btn-light" href="#listen"><span>Listen &amp; watch</span>@@i:arrow@@</a></div>'.replace("btn-light", "btn--light"),
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 06</p>
    <div class="g-split">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>Professional biography</p>
        <h2 class="d-3">A career built<br>in the section,<br>not on the poster.</h2>
        <p>Violinist Richard Amoroso joined The Philadelphia Orchestra in 1998 after serving as a member of Concerto Soloists (now the Chamber Orchestra of Philadelphia), Peter Nero and the Philly Pops, and as a substitute violinist with the Orchestra. He also performed with various local music groups, including Pro Música, the Mendelssohn Club, the Philadelphia Singers, the Academy of Vocal Arts, and the Opera Company of Philadelphia (now Opera Philadelphia).</p>
        <p>He has performed as soloist with Peter Nero and the Philly Pops, the North Penn Symphony, and in a trio recital at Carnegie Hall's Weill Recital Hall. He returned to Carnegie in 2004 to perform a solo recital, and has performed Shostakovich's First Violin Concerto with the Helena (MT) Symphony and the Southeastern Pennsylvania Philharmonic.</p>
      </div>
      <div class="stack" data-reveal>
        <div class="quote">
          <p class="pull">“His relationship with the Orchestra began in 1984, at the age of 14, when he won the Orchestra’s Student Competition.”</p>
          <p class="quote-by">On the Albert M. Greenfield Competition</p>
        </div>
        <hr class="hr" style="margin:1.6rem 0">
        <p>Mr. Amoroso holds a bachelor's degree from Dickinson College, from which he graduated <em class="it">magna cum laude</em> and Phi Beta Kappa. A native Philadelphian, he attended Settlement Music School on scholarship and studied with the Orchestra's retired Concertmaster Norman Carol, former Co-Concertmaster William DePasquale, Rafael Druian, and retired Associate Concertmaster David Arben.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec on-sand">
  <div class="wrap">
    <p class="idx">03 / 06</p>
    <div class="g-head" style="margin-bottom:clamp(1.4rem,3vw,2.4rem)">
      <div class="stack"><p class="label" data-reveal><i class="dash"></i>Selected appearances</p><h2 class="d-2" data-reveal>Where he has played.</h2></div>
      <p data-reveal>A working career in chamber, orchestral and solo settings around Philadelphia and beyond.</p>
    </div>
    <ul class="rows" data-reveal>
      <li><span class="k">1984</span><div class="t">Soloist, Philadelphia Orchestra Student Competition<small>Performed as soloist with the Orchestra at the Academy of Music the following year — Mozart Concerto No. 4, first movement.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">1990s</span><div class="t">Concerto Soloists · Peter Nero and the Philly Pops<small>Section violin, later a member of the First Violin chair list as the ensemble became the Chamber Orchestra of Philadelphia.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">1998</span><div class="t">The Philadelphia Orchestra, First Violin Section<small>Won the position after three finals with the Cincinnati Symphony; a member of the Orchestra ever since.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">—</span><div class="t">Carnegie Hall · Weill Recital Hall<small>Trio recital, and a solo recital on the return in 2004.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">—</span><div class="t">Shostakovich First Violin Concerto<small>With the Helena (MT) Symphony and the Southeastern Pennsylvania Philharmonic.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">—</span><div class="t">Pro Música · Mendelssohn Club · Philadelphia Singers<small>Academy of Vocal Arts and the Opera Company of Philadelphia (now Opera Philadelphia).</small></div><span class="go">@@i:arrow-diag@@</span></li>
    </ul>
  </div>
</section>

<section class="sec" id="instrument" style="scroll-margin-top:80px">
  <div class="wrap">
    <p class="idx">04 / 06</p>
    <div class="g-split-r">
      <div class="g g-2" style="gap:1rem" data-reveal="scale">
        <figure class="ph ph--s" style="aspect-ratio:3/4;grid-row:span 2"><img src="assets/img/violin-1765.jpg" alt="Nicolò Gagliano violin, Naples 1765" width="700" height="930"></figure>
        <figure class="ph ph--s"><img src="assets/img/bow-arm.jpg" alt="Bow contact point on the string" width="700" height="520"></figure>
        <figure class="ph ph--s"><img src="assets/img/score.jpg" alt="Annotated part" width="700" height="520"></figure>
      </div>
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>Instrument</p>
        <h2 class="d-2">Nicolò Gagliano<br><em>from 1765.</em></h2>
        <p>The Neapolitan instrument Richard plays in concert, in the studio and on the recordings below. It is also the reason tone is treated as a trainable technique at the studio: an eighteenth-century voice will only sound like one if the right hand knows what it is doing.</p>
        <ul class="ticks">
          @@tick@@Naples, 1765 — the Gagliano workshop, a family of builders</li>
          @@tick@@Used in Philadelphia Orchestra service and in solo recital</li>
          @@tick@@Setup and stringing chosen for projection over brilliance</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="sec bg-paper" id="listen" style="border-block:1px solid var(--rule);scroll-margin-top:80px">
  <div class="wrap">
    <p class="idx">05 / 06</p>
    <div class="g-head" style="margin-bottom:clamp(1.4rem,3vw,2.2rem)">
      <div class="stack"><p class="label" data-reveal><i class="dash"></i>Listen &amp; watch</p><h2 class="d-3" data-reveal>Performances</h2></div>
      <p class="small" data-reveal>Audio and video from Richard's own recordings. In this mockup the players are decorative — the real files live on the original site.</p>
    </div>

    <div class="g g-2" style="gap:clamp(1.2rem,3vw,2.2rem)">
      <div class="stack" data-reveal>
        <a class="ph ph--s" href="#" aria-label="Play Shostakovich Concerto">
          <img src="assets/img/orchestra.jpg" alt="Richard Amoroso performing a concerto" width="900" height="600">
          <span class="play"><i>@@i:play@@</i></span>
        </a>
        <div class="cap"><b>Shostakovich First Violin Concerto</b><span>Helena Symphony</span></div>
        <div class="player"><button class="pp" type="button" aria-pressed="false" aria-label="Play">''@@i:play@@''</button><div class="meta"><b>Richard Amoroso — Shostakovich</b><span>Audio · 00:00 / 04:12</span><div class="wave" data-bars="46"></div></div></div>
      </div>
      <div class="stack" data-reveal>
        <a class="ph ph--s" href="#" aria-label="Watch the demo reel">
          <img src="assets/img/orchestra.jpg" alt="Orchestra performance" width="900" height="600">
          <span class="play"><i>@@i:play@@</i></span>
        </a>
        <div class="cap"><b>Richard Amoroso — Demo</b><span>YouTube</span></div>
        <div class="player"><button class="pp" type="button" aria-pressed="false" aria-label="Play">''@@i:play@@''</button><div class="meta"><b>Demo reel · orchestra &amp; chamber</b><span>Video · 02:38</span><div class="wave" data-bars="46"></div></div></div>
      </div>
    </div>

    <hr class="hr" style="margin:clamp(1.6rem,3vw,2.4rem) 0">

    <div class="g g-2" style="gap:clamp(1.2rem,3vw,2.2rem)">
      <div class="stack" data-reveal>
        <div class="cap" style="padding-top:0"><b>Cello Fan</b><span>Richard Amoroso Sr. (cello) &amp; Jr. (violin)</span></div>
        <div class="player"><button class="pp" type="button" aria-pressed="false" aria-label="Play">''@@i:play@@''</button><div class="meta"><b>Duet with my father</b><span>Video · 03:44</span><div class="wave" data-bars="46"></div></div></div>
        <p class="small">To contact Richard Amoroso Sr., cellist, teacher and author, go to <a class="link" href="https://richardamorosocello.com" style="border:0;text-decoration:underline;text-underline-offset:3px">richardamorosocello.com</a>.</p>
      </div>
      <div class="stack" data-reveal>
        <div class="cap" style="padding-top:0"><b>Andrew Lipke — original composition</b><span>featuring Richard Amoroso</span></div>
        <div class="player"><button class="pp" type="button" aria-pressed="false" aria-label="Play">''@@i:play@@''</button><div class="meta"><b>Contemporary collaboration</b><span>Video · 04:06</span><div class="wave" data-bars="46"></div></div></div>
        <p class="small">Chamber commissions and new-work premieres have run alongside the orchestral season for two decades.</p>
      </div>
    </div>
  </div>
</section>

<section class="sec on-ink">
  <div class="wrap">
    <p class="idx">06 / 06</p>
    <div class="g-split" style="align-items:center">
      <div class="stack" data-reveal>
        <p class="label on-ink"><i class="dash"></i>Next on the stand</p>
        <h2 class="d-3">Teaching is the<br>other performance.</h2>
        <p class="lede">Everything on this page is also curriculum: the bowings, the nerves, the sixty seconds that decide a first round.</p>
      </div>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;justify-content:flex-end" data-reveal>
        <a class="btn btn--light" href="programs.html"><span>Programs</span>@@i:arrow@@</a>
        <a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="student-performances.html"><span>Hear the students</span></a>
      </div>
    </div>
  </div>
</section>
"""

page("performances.html", "Performances — Philadelphia Orchestra member since 1998 | Richard Amoroso",
     "Richard Amoroso's performing biography: The Philadelphia Orchestra, Carnegie Hall's Weill Recital Hall, Peter Nero and the Philly Pops, the Shostakovich concerto, and the 1765 Nicolò Gagliano.",
     "performances.html", perf_body)

# ============================================================ CASE STUDIES
def case(n, name, role, headline, quote, paras, tags, img=None):
    if img:
        media = ('<figure class="ph ph--s" data-reveal="scale" style="aspect-ratio:16/10">'
                 '<img src="assets/img/%s" alt="%s" width="900" height="560">'
                 '<figcaption class="cap"><b>%s</b><span>Case study %02d</span></figcaption></figure>') % (img, name, name, n)
    else:
        media = ('<div class="ph ph--s" data-reveal="scale" style="aspect-ratio:16/10;display:grid;place-items:center;'
                 'background:linear-gradient(160deg,#E8DCC8,#DFD0B7)"><span class="sig" style="font-size:4.4rem;color:var(--amber)">'
                 + name[0] + '</span></div>')
    ps = "".join("<p>%s</p>" % p for p in paras)
    pills = "".join('<span class="pill">%s</span>' % t for t in tags)
    return """
<article class="g-split" style="align-items:start;padding-block:clamp(2rem,4.5vw,4rem);border-top:1px solid var(--rule)">
  <div class="stack">
    <p class="label"><i class="dash"></i>Case study %02d — %s</p>
    <h3 class="d-3">%s</h3>
    <div class="quote">
      <p class="display" style="font-size:1.15rem;line-height:1.34;font-weight:500;letter-spacing:-.012em">%s</p>
      <p class="quote-by">%s</p>
    </div>
    %s
  </div>
  <div class="stack" style="gap:1.1rem">
    %s
    <div class="stack" style="gap:.9rem">%s</div>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.2rem">%s</div>
  </div>
</article>""" % (n, name, headline, quote, role, media, ps, pills)


# ============================================================ STUDENT PERFORMANCES
def player(title, meta, dur, kind="Audio"):
    return ('<div class="player"><button class="pp" type="button" aria-pressed="false" aria-label="Play ' + title + '">@@i:play@@</button><div class="meta"><b>' + title + '</b><span>' + kind + " · " + meta + " · " + dur +
            '</span><div class="wave" data-bars="44"></div></div></div>')


sp_body = """
""" + banner("Student performances",
             "Selected<br>performances of<br><em>successful</em><br>students.",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Many former students have attended prestigious music schools while achieving thousands of dollars in awards and scholarship money. Here is some of what they play now.</p>',
             right_html='<div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-top:.4rem"><a class="btn btn--light" href="case-studies.html"><span>Read the case studies</span>@@i:arrow@@</a></div>',
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 04</p>
    <div class="g g-3">
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/recital.jpg" alt="Jamie Lee performing a Mozart concerto" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Concerto · with orchestra</p>
          <h3 class="card-title"><span>Mozart Concerto No. 5</span></h3>
          <p>by <strong>Jamie Lee</strong> — who graduated from the University of Indiana, where she received a full scholarship.</p>
          """ + player("Mozart K.219 · III. Rondeau", "Jamie Lee", "06:41", "Video") + """
        </div>
      </article>
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/violin-1765.jpg" alt="Old-time fiddle recording session" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Recording · old-time</p>
          <h3 class="card-title"><span>Grub Springs</span></h3>
          <p>by <strong>Matt Brown</strong> — four albums of old-time music released; fiddle, banjo and guitar.</p>
          """ + player("Grub Springs", "Matt Brown", "03:18") + """
        </div>
      </article>
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/left-hand.jpg" alt="Sarasate Zigeunerweisen performance" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Recital · virtuoso repertoire</p>
          <h3 class="card-title"><span>Zigeunerweisen</span></h3>
          <p>Pablo de Sarasate, played by <strong>Grace Jo</strong> — the Hungarian-tinged showpiece that punishes any insecure left hand.</p>
          """ + player("Zigeunerweisen, Op. 20", "Grace Jo", "08:52") + """
        </div>
      </article>
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/orchestra.jpg" alt="Group recital in a hall" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Group recital</p>
          <h3 class="card-title"><span>Evelyn Bravo — Vivaldi,<br>“Winter”</span></h3>
          <p>The last movement from Vivaldi's Four Seasons, performed with Richard Amoroso Jr. on viola, students of the studio, and Richard Amoroso Sr. on cello.</p>
          """ + player("Vivaldi · Winter, III. Allegro", "Evelyn Bravo &amp; studio", "02:46", "Video") + """
        </div>
      </article>
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/score.jpg" alt="Beethoven violin sonata score" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Sonata · at Oberlin</p>
          <h3 class="card-title"><span>Beethoven Violin Sonata<br>No. 10 in G major</span></h3>
          <p>Performed at a recital at Oberlin College and Conservatory by <strong>Asher</strong> — admitted with scholarship to five schools.</p>
          """ + player("Beethoven Op. 96 · I. Allegro moderato", "Asher", "07:09") + """
        </div>
      </article>
      <article class="card card--panel" data-reveal>
        <figure class="ph"><img src="assets/img/bow-arm.jpg" alt="Bow technique in a student recording" width="800" height="500"></figure>
        <div class="card-body">
          <p class="card-num">Studio reel · 2025</p>
          <h3 class="card-title"><span>Scales, étudies and<br>first rounds</span></h3>
          <p>Practice-room clips from current students — the unglamorous half of the results page.</p>
          """ + player("Studio practice reel", "Current students", "04:30", "Video") + """
        </div>
      </article>
    </div>
  </div>
</section>

<section class="sec on-sand">
  <div class="wrap">
    <p class="idx">03 / 04</p>
    <div class="g-head" style="margin-bottom:1.2rem">
      <div class="stack"><p class="label" data-reveal><i class="dash"></i>Where they are now</p><h2 class="d-3" data-reveal>The list, as it stands.</h2></div>
      <p class="small" data-reveal>Names appear with the permission of the students and their families.</p>
    </div>
    <ul class="rows" data-reveal>
      <li><span class="k">JAMIE LEE</span><div class="t" style="font-size:1.25rem">University of Indiana<small>Full scholarship · Mozart Concerto No. 5 with orchestra.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">JESSICA CLOUGH</span><div class="t" style="font-size:1.25rem">University of Richmond<small>Music scholarship · degrees in music and business · Philadelphia Orchestra staff.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">ASHER</span><div class="t" style="font-size:1.25rem">Oberlin College and Conservatory<small>John F. Oberlin Scholarship · Conservatory Dean's Scholarship.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">MARIA KOWALSKI</span><div class="t" style="font-size:1.25rem">Berklee College of Music<small>Full tuition, four years · Reading Musical Foundation four-year award.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">GRACE JO</span><div class="t" style="font-size:1.25rem">Sarasate recital disc<small>Zigeunerweisen, Op. 20 — recorded at sixteen.</small></div><span class="go">@@i:arrow-diag@@</span></li>
      <li><span class="k">MATT BROWN</span><div class="t" style="font-size:1.25rem">Four albums, Denver<small>Old-time fiddle, banjo, guitar · <em>On Big Shoulders</em>.</small></div><span class="go">@@i:arrow-diag@@</span></li>
    </ul>
  </div>
</section>

<section class="sec on-ink">
  <div class="wrap">
    <p class="idx">04 / 04</p>
    <div class="g-split" style="align-items:center">
      <div class="stack" data-reveal>
        <p class="label on-ink"><i class="dash"></i>Your turn</p>
        <h2 class="d-3">Results are a habit,<br>not an event.</h2>
      </div>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;justify-content:flex-end" data-reveal>
        <a class="btn btn--light" href="programs.html"><span>Programs</span>@@i:arrow@@</a>
        <a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="contact.html"><span>Ask about lessons</span></a>
      </div>
    </div>
  </div>
</section>
"""

page("student-performances.html", "Student Performances — recordings from the Amoroso Violin Studio",
     "Mozart concertos, Sarasate, Vivaldi group recitals and Beethoven sonatas: selected performances by students of Richard Amoroso, many of them now at Oberlin, Indiana, Berklee and Richmond.",
     "student-performances.html", sp_body)

# ============================================================ CONTACT
contact_body = """
""" + banner("Contact me",
             "I would love<br>to hear from<br><em>you.</em>",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Thanks! — Richard Amoroso. Tell me where you are with the instrument and what the next audition, recital or term looks like.</p>',
             right_html='<ul class="ticks" style="margin-top:.4rem">@@tick@@Replies within two business days</li>@@tick@@Studio &amp; online lessons · trial lesson available</li></ul>',
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 04</p>
    <div class="g-split" style="align-items:start">
      <div class="form-panel" data-reveal>
        <p class="label"><i class="dash"></i>Send a message</p>
        <h2 class="d-3" style="margin:.7rem 0 1.3rem">Start the conversation.</h2>
        <form class="form" data-demo novalidate>
          <div class="form-grid">
            <label class="field"><span>Full name</span><input type="text" name="name" placeholder="Your name" autocomplete="name"></label>
            <label class="field"><span>Phone</span><input type="tel" name="phone" placeholder="+1 (000) 000-0000" autocomplete="tel"></label>
          </div>
          <label class="field"><span>Email *</span><input type="email" name="email" placeholder="you@email.com" required autocomplete="email"></label>
          <div class="form-grid">
            <label class="field"><span>I’m interested in</span>
              <select name="interest" style="background:transparent"><option>Private lessons (studio)</option><option>Private lessons (online)</option><option>Essential Excerpts membership</option><option>ArtistWorks / Video Exchange</option><option>Institute for College Readiness</option><option>Something else</option></select>
            </label>
            <label class="field"><span>Playing level</span>
              <select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced / pre-conservatory</option><option>College / conservatory</option><option>Professional audition candidate</option></select>
            </label>
          </div>
          <label class="field"><span>Message</span><textarea name="message" placeholder="What are you working on right now?"></textarea></label>
          <label class="check"><input type="checkbox" checked><span>By checking this box, I consent to receive transactional messages related to my account, orders, or services I have requested. These may include appointment reminders, order confirmations and account notifications. Message frequency may vary; message and data rates may apply. Reply HELP for help or STOP to opt out.</span></label>
          <label class="check"><input type="checkbox"><span>By checking this box, I consent to receive marketing and promotional messages, including special offers, discounts and new product updates. Message frequency may vary; message and data rates may apply. Reply HELP for help or STOP to opt out.</span></label>
          <button class="btn btn--full" type="submit"><span>Send</span>@@i:arrow@@</button>
          <p class="small">This is a design mockup — the form does not send anything.</p>
        </form>
      </div>

      <div class="stack">
        <figure class="ph ph--arch ph--raw" data-reveal="scale" style="aspect-ratio:5/6">
          <img src="assets/img/richard-now.jpg" alt="Richard Amoroso" width="800" height="960">
        </figure>
        <div class="g g-2" style="gap:1rem" data-reveal>
          <div class="card--panel" style="padding:1.15rem">
            <p class="label"><i class="dash"></i>Bryn Mawr, PA</p>
            <p class="display" style="font-size:1.05rem;line-height:1.25;margin-top:.5rem">Studio lessons on the Main Line</p>
            <p class="small">The original studio, opened 2004.</p>
          </div>
          <div class="card--panel" style="padding:1.15rem">
            <p class="label"><i class="dash"></i>Melbourne, FL</p>
            <p class="display" style="font-size:1.05rem;line-height:1.25;margin-top:.5rem">1433 Vestavia Circle</p>
            <p class="small">Space, studio &amp; online students.</p>
          </div>
        </div>
        <ul class="rows" data-reveal style="margin-top:.4rem">
          <li><span class="k">EMAIL</span><div class="t" style="font-size:1.2rem"><a href="mailto:richamoroso@gmail.com">richamoroso@gmail.com</a></div><span class="go">@@i:mail@@</span></li>
          <li><span class="k">PHONE</span><div class="t" style="font-size:1.2rem"><a href="tel:+16102027660">(610) 202-7660</a></div><span class="go">@@i:phone@@</span></li>
          <li><span class="k">ELSEWHERE</span><div class="t" style="font-size:1.2rem"><a href="https://linktr.ee/RichardAmoroso">linktr.ee/RichardAmoroso</a></div><span class="go">@@i:arrow-diag@@</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="sec bg-paper" style="border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="idx">03 / 04</p>
    <div class="g-head" style="margin-bottom:1.2rem">
      <div class="stack"><p class="label"><i class="dash"></i>Good to know</p><h2 class="d-3" data-reveal>Before you write.</h2></div>
      <p class="small">Four questions that come up every week.</p>
    </div>
    </div>
    <div class="acc" data-reveal>
      <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false"><span class="no">01</span><span>Are you taking beginners?</span><span class="pm" aria-hidden="true"></span></button><div class="acc-panel"><div class="acc-panel-in">Yes — from the first instrument to the first concerto. Beginner work in this studio is deliberately slow: posture, bow hold, and open strings that sound the way a string is supposed to sound. Most beginners who stay with that foundation are playing real repertoire within two terms.</div></div></div>
      <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false"><span class="no">02</span><span>How do online lessons work?</span><span class="pm" aria-hidden="true"></span></button><div class="acc-panel"><div class="acc-panel-in">A scheduled weekly call with two cameras where possible — one on you, one on the instrument — plus a written practice plan after each session, and video exchanges between lessons when you are stuck. Students on the Essential Excerpts membership get live Zoom calls with me every other week as well.</div></div></div>
      <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false"><span class="no">03</span><span>What should I prepare for a trial lesson?</span><span class="pm" aria-hidden="true"></span></button><div class="acc-panel"><div class="acc-panel-in">Two pieces you know well and one you are struggling with, at whatever tempo you can honestly play them. I want to hear the scale routine you currently use, if you have one. Nothing polished — I am looking for the actual, not the best day.</div></div></div>
      <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false"><span class="no">04</span><span>Do you help with college and audition paperwork?</span><span class="pm" aria-hidden="true"></span></button><div class="acc-panel"><div class="acc-panel-in">Yes. Through the Institute for College Readiness we build the audition programme, shortlist schools and teachers, and prepare the prescreening recordings. Preparing students for college auditions, and helping them understand how to be a successful student, is my other passion.</div></div>
    </div>
  </div>
</section>

<section class="sec on-ink">
  <div class="wrap">
    <p class="idx">04 / 04</p>
    <div class="g-split" style="align-items:center">
      <div class="stack" data-reveal>
        <p class="label on-ink"><i class="dash"></i>Not sure which program?</p>
        <h2 class="d-3">Read the outcomes<br>first, then decide.</h2>
      </div>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;justify-content:flex-end" data-reveal>
        <a class="btn btn--light" href="case-studies.html"><span>Case studies</span>@@i:arrow@@</a>
        <a class="btn btn--ghost" style="--fg:var(--on-ink);box-shadow:inset 0 0 0 1px var(--rule-on-ink)" href="programs.html"><span>Programs</span></a>
      </div>
    </div>
  </div>
</section>
""".replace("</span></div>", "</span></div>")  # no-op keep

page("contact.html", "Contact — Amoroso Violin Studio, Bryn Mawr PA · Melbourne FL · Online",
     "Contact Richard Amoroso about private lessons in Bryn Mawr or Melbourne, online study, the Essential Excerpts membership or the Institute for College Readiness.",
     "contact.html", contact_body)

# ============================================================ LEGAL
legal_body = """
""" + banner("Privacy & terms",
             "The legal<br>pages.",
             '<p class="lede" style="color:rgba(240,232,218,.82)">Privacy Policy and Terms of Service for richardamoroso.com, kept short and readable.</p>',
             ) + """

<section class="sec">
  <div class="wrap">
    <p class="idx">02 / 03</p>
    <div class="g g-2" style="gap:clamp(2rem,5vw,4.5rem);align-items:start">
      <article class="stack" data-reveal>
        <h2 class="d-3">Privacy Policy</h2>
        <p>Amoroso Violin Studio collects only the information you choose to give us: your name, email address and, for SMS consent, a phone number. It is used to answer your enquiry, to send the monthly mailing list, and to manage your enrolment in a program.</p>
        <p>We do not sell personal data. Payment processing is handled by our processors; membership registration data stays inside the membership platform and is deleted on request.</p>
        <p>If you reply STOP to a text message, marketing texts end immediately and transactional messages are limited to what your account requires. Email subscribers can unsubscribe from any message.</p>
        <p class="small">Mockup note: this page is part of a design concept. No analytics, cookies, pixels or forms are actually wired up on this site.</p>
      </article>
      <article class="stack" data-reveal>
        <h2 class="d-3">Terms of Service</h2>
        <p><strong>Lessons.</strong> Lesson times are reserved for you. Cancelling with 24 hours' notice moves the lesson; later cancellations are charged, because the hour was held.</p>
        <p><strong>Memberships.</strong> Essential Excerpts renews until cancelled. Access continues for the paid period, and materials downloaded during it stay yours to practise with.</p>
        <p><strong>Materials.</strong> Video lessons, sheet music and annotated parts are licensed to you personally for study. They may not be redistributed, resold or shared outside your account, on any platform.</p>
        <p><strong>Recordings.</strong> Video Exchange clips are recorded to give you feedback and may be published to the ArtistWorks community unless you ask that they are not.</p>
        <p><strong>Site content.</strong> Photographs, biographical text and testimonials are the property of Richard Amoroso. This redesign is a concept piece and is not affiliated with or endorsed by him.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec bg-paper" style="border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="idx">03 / 03</p>
    <div class="g-split" style="align-items:center">
      <div class="stack" data-reveal>
        <p class="label"><i class="dash"></i>Questions about your data?</p>
        <h2 class="d-3">Write to the studio.</h2>
      </div>
      <div data-reveal style="display:flex;gap:.8rem;flex-wrap:wrap;justify-content:flex-end">
        <a class="btn" href="contact.html"><span>Contact</span>@@i:arrow@@</a>
        <a class="btn btn--ghost" href="mailto:richamoroso@gmail.com"><span>richamoroso@gmail.com</span></a>
      </div>
    </div>
  </div>
</section>
""".replace("</span></div>", "</span></div>")

page("legal.html", "Privacy Policy & Terms of Service — Amoroso Violin Studio",
     "Privacy Policy and Terms of Service for the Amoroso Violin Studio website.",
     "legal.html", legal_body, modal=False)

print("done")
