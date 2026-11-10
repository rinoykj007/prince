import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import capturedCSS from "../styles/site.css?inline";

// Splits text into letters or words that rise in one after another when scrolled into view
function SplitText({ text, by = "word" }: { text: string; by?: "char" | "word" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) setOn(true);
        else if (e.boundingClientRect.top > 0) setOn(false); // left below the screen: replay next time
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const parts = by === "char" ? Array.from(text) : text.split(" ");
  return (
    <span
      ref={ref}
      className={`split ${by === "char" ? "split-name" : "split-desc"}${on ? " on" : ""}`}
      aria-label={text}
    >
      {parts.map((t, i) => (
        <span key={i} aria-hidden="true">
          <span
            className="split-p"
            style={{ transitionDelay: i * (by === "char" ? 50 : 70) + "ms" }}
          >
            {t === " " ? " " : t}
          </span>
          {by === "word" && i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

const ImportedFont = "font" as unknown as import("react").ElementType;

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "💍 Prince \u0026 Malavika Wedding Invitation" }] }),
  component: Index,
});

// Wedding ceremony: Friday, 29 January 2027, muhurtham 10:30 AM IST
const WEDDING_DATE = new Date("2027-01-29T10:30:00+05:30").getTime();

const CONTACT_PHONE = "9605019992";
const WEDDING_EVENTS = [
  {
    key: "ceremony",
    label: "Wedding Ceremony",
    title: "Prince & Malavika Wedding Ceremony",
    start: "20270129T100000",
    end: "20270129T110000",
    location: "J's International Convention Centre, Kalluvathukkal, Kollam",
    map: "https://maps.app.goo.gl/8gmnynP1SUSi3W9A6?g_st=aw",
  },
  {
    key: "reception",
    label: "Wedding Reception",
    title: "Prince & Malavika Wedding Reception",
    start: "20270130T173000",
    end: "20270130T210000",
    location: "Marine Pride Beach Resort, Edava, Varkala",
    map: "https://maps.app.goo.gl/xvpoM3h5z7WWLAME6?g_st=aw",
  },
];

// Set this to the URL that should receive RSVPs (POST, JSON: name, email, attend, guests).
const RSVP_ENDPOINT = "";

function RsvpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attend, setAttend] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please tell us your name.");
      setStatus("error");
      return;
    }
    if (!RSVP_ENDPOINT) {
      setError("RSVP isn't connected yet. Please let the family know directly.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          attend,
          guests: attend === "yes" ? guests : 0,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="k-rv-card k-rv-done">
        <div className="k-rv-check">
          <i className={`fas ${attend === "yes" ? "fa-check" : "fa-heart"}`} />
        </div>
        <h3 className="k-rv-thanks">{attend === "yes" ? "See you there!" : "We'll miss you"}</h3>
        <p className="k-rv-lead">
          {attend === "yes"
            ? `Thank you, ${name.trim()}. We can't wait to celebrate with you.`
            : `Thank you for letting us know, ${name.trim()}. You'll be in our hearts on the day.`}
        </p>
      </div>
    );
  }

  return (
    <form className="k-rv-card" onSubmit={submit} noValidate>
      <style>{`
.k-rv-card{position:relative;max-width:620px;margin:56px auto 0;padding:46px 36px 38px;border-radius:30px;background:linear-gradient(160deg,#fffaf8 0%,#f9e6e6 100%);border:1px solid rgba(183,110,121,.4);box-shadow:0 24px 56px rgba(183,110,121,.22),0 0 0 6px rgba(255,255,255,.5);color:#4a2a3a;text-align:center}
.k-rv-icon{width:64px;height:64px;margin:-78px auto 18px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0c4b4,#b76e79);color:#fff;font-size:24px;box-shadow:0 0 0 6px #fffaf8,0 12px 24px rgba(183,110,121,.35)}
.k-rv-lead{margin:0 0 14px;font-family:'Instrument Serif',serif;font-size:25px;line-height:1.3;color:#4a2a3a}
.k-rv-by{display:inline-block;margin-bottom:28px;padding:6px 16px;border:1px solid rgba(183,110,121,.55);border-radius:20px;font-size:13px;font-weight:600;color:#9a5a66;background:rgba(255,255,255,.6)}
.k-rv-field{position:relative;margin-bottom:16px;text-align:left}
.k-rv-field input{width:100%;height:56px;padding:20px 16px 4px;border-radius:14px;border:1px solid rgba(183,110,121,.35);background:rgba(255,255,255,.75);color:#4a2a3a;font-size:16px;outline:none;transition:border-color .3s,box-shadow .3s,background .3s}
.k-rv-field input:focus{border-color:#b76e79;background:#fff;box-shadow:0 0 0 4px rgba(183,110,121,.15)}
.k-rv-field label{position:absolute;left:16px;top:18px;font-size:16px;color:#9b7a84;pointer-events:none;transition:all .2s}
.k-rv-field input:focus+label,.k-rv-field input:not(:placeholder-shown)+label{top:8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#b76e79}
.k-rv-req{display:inline-block;width:6px;height:6px;margin-left:6px;border-radius:50%;background:#b76e79;vertical-align:middle}
.k-rv-tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:22px 0}
.k-rv-tile{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 10px;border-radius:16px;border:1px solid rgba(183,110,121,.35);background:rgba(255,255,255,.6);color:#8a5a66;font-size:14px;font-weight:600;cursor:pointer;transition:all .3s}
.k-rv-tile i{font-size:20px}
.k-rv-tile:hover{transform:translateY(-3px);border-color:#b76e79}
.k-rv-tile.on{background:linear-gradient(135deg,#f0c4b4,#b76e79);border-color:transparent;color:#fff;box-shadow:0 10px 24px rgba(183,110,121,.35)}
.k-rv-guests{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .5s ease,opacity .4s ease}
.k-rv-guests.open{grid-template-rows:1fr;opacity:1}
.k-rv-guests>div{overflow:hidden}
.k-rv-glabel{margin:4px 0 10px;font-size:13px;color:#7a5560}
.k-rv-glabel span{color:#a58a92;font-size:12px}
.k-rv-step{display:inline-flex;align-items:center;gap:22px;margin-bottom:22px;padding:8px;border-radius:40px;border:1px solid rgba(183,110,121,.35);background:rgba(255,255,255,.7)}
.k-rv-step button{display:flex;align-items:center;justify-content:center;padding:0;width:42px;height:42px;border:0;border-radius:50%;background:rgba(183,110,121,.14);color:#8a4a58;font-size:18px;cursor:pointer;transition:all .25s}
.k-rv-step button:hover{background:#b76e79;color:#fff}
.k-rv-num{min-width:36px;font-family:'Instrument Serif',serif;font-size:34px;line-height:1;color:#b76e79}
.k-rv-btn{position:relative;overflow:hidden;width:100%;height:54px;border:0;border-radius:30px;background:linear-gradient(135deg,#f0c4b4,#b76e79);color:#fff;font-size:16px;font-weight:700;cursor:pointer;transition:transform .3s,box-shadow .3s}
.k-rv-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 14px 28px rgba(183,110,121,.4)}
.k-rv-btn:disabled{opacity:.75;cursor:wait}
.k-rv-btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:k-rv-shine 3.5s ease-in-out infinite}
.k-rv-err{margin:0 0 14px;padding:10px 14px;border-radius:12px;background:rgba(203,26,26,.08);border:1px solid rgba(203,26,26,.3);font-size:14px;color:#a02424}
.k-rv-done{padding:56px 30px}
.k-rv-check{width:84px;height:84px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0c4b4,#b76e79);color:#fff;font-size:34px;animation:k-rv-pop .7s cubic-bezier(.2,.9,.3,1.4)}
.k-rv-thanks{margin:0 0 10px;font-family:'Instrument Serif',serif;font-size:40px;font-weight:400;color:#b76e79}
.k-rv-done .k-rv-lead{margin:0;font-size:20px;color:#6a4350}
.k-rv-card.k-pre{opacity:0;transform:translateY(40px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)}
.k-rv-card.k-pre.k-in{opacity:1;transform:none}
@keyframes k-rv-shine{0%,60%{left:-60%}100%{left:130%}}
@keyframes k-rv-pop{0%{transform:scale(.3);opacity:0}100%{transform:scale(1);opacity:1}}
@media(prefers-reduced-motion:reduce){.k-rv-card.k-pre{opacity:1;transform:none;transition:none}.k-rv-btn::after,.k-rv-check{animation:none}}
@media(max-width:576px){.k-rv-card{padding:42px 20px 30px;border-radius:24px}.k-rv-lead{font-size:22px}}
`}</style>
      <div className="k-rv-icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9.5 12 3l9 6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="m3 10 9 6 9-6" />
        </svg>
      </div>
      <p className="k-rv-lead">
        Join us as we begin our new journey together. Your presence will mean the world to us.
      </p>
      <span className="k-rv-by">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4m-8 9 3 3 5-5" />
        </svg>{" "}
        Kindly confirm your attendance
      </span>
      <div className="k-rv-field">
        <input
          id="rsvp_name"
          name="name"
          type="text"
          placeholder=" "
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="rsvp_name">
          Your name
          <span className="k-rv-req" />
        </label>
      </div>
      <div className="k-rv-field">
        <input
          id="rsvp_email"
          name="email"
          type="email"
          placeholder=" "
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="rsvp_email">Email (optional)</label>
      </div>
      <div className="k-rv-tiles" role="radiogroup" aria-label="Will you attend?">
        <button
          type="button"
          role="radio"
          aria-checked={attend === "yes"}
          className={`k-rv-tile${attend === "yes" ? " on" : ""}`}
          onClick={() => setAttend("yes")}
        >
          <i className="fas fa-champagne-glasses" />
          Joyfully accept
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={attend === "no"}
          className={`k-rv-tile${attend === "no" ? " on" : ""}`}
          onClick={() => setAttend("no")}
        >
          <i className="fa-regular fa-heart" />
          Regretfully decline
        </button>
      </div>
      <div className={`k-rv-guests${attend === "yes" ? " open" : ""}`} id="rsvp_guests_wrap">
        <div>
          <p className="k-rv-glabel">
            How many guests will be attending? <span>(including yourself)</span>
          </p>
          <div className="k-rv-step">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
            >
              <span aria-hidden="true">&minus;</span>
            </button>
            <span className="k-rv-num" aria-live="polite">
              {guests}
            </span>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {status === "error" && (
        <p className="k-rv-err" role="alert">
          {error}
        </p>
      )}
      <button className="k-rv-btn" type="submit" id="rsvpBtn" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <i className="fas fa-circle-notch fa-spin" /> Sending…
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane" /> Send RSVP
          </>
        )}
      </button>
    </form>
  );
}

const GALLERY_PHOTOS = [
  {
    src: "/site-assets/photos/photo-1.jpeg",
  },
  {
    src: "/site-assets/photos/photo-2.jpeg",
  },
  {
    src: "/site-assets/photos/photo-3.jpeg",
  },
  {
    src: "/site-assets/photos/photo-4.jpeg",
  },
  {
    src: "/site-assets/photos/photo-5.jpeg",
  },
  {
    src: "/site-assets/photos/photo-6.jpeg",
  },
  {
    src: "/site-assets/photos/photo-7.jpeg",
  },
  {
    src: "/site-assets/photos/photo-8.jpeg",
  },
];

const BIGDAY_CARDS = [
  {
    key: "ceremony",
    event: WEDDING_EVENTS[0]!,
    icon: "/site-assets/221c2e134e7a4701.png",
    tag: "The Vows",
    title: "Wedding Ceremony",
    day: "29",
    month: "Jan 2027",
    weekday: "Friday",
    time: "Muhurtham 10:30 – 11:00 AM",
    notes: ["Groom's party departs at 8:00 AM", "Welcoming the Groom at 10:00 AM"],
  },
  {
    key: "reception",
    event: WEDDING_EVENTS[1]!,
    icon: "/site-assets/ce0625b47b4ab8df.png",
    tag: "Celebration",
    title: "Wedding Reception",
    day: "30",
    month: "Jan 2027",
    weekday: "Saturday",
    time: "5:30 PM – 9:00 PM",
    notes: ["We request the pleasure of your company at the wedding reception of our son"],
  },
];

function googleCalendarUrl(e: (typeof WEDDING_EVENTS)[number]) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${e.start}/${e.end}`,
    ctz: "Asia/Kolkata",
    details: e.label,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function icsUrl(e: (typeof WEDDING_EVENTS)[number]) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Prince & Malavika Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${e.key}@prince-malavika-wedding`,
    `DTSTAMP:${e.start}`,
    `DTSTART;TZID=Asia/Kolkata:${e.start}`,
    `DTEND;TZID=Asia/Kolkata:${e.end}`,
    `SUMMARY:${e.title}`,
    `LOCATION:${e.location.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function getTimeLeft() {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [galIdx, setGalIdx] = useState(0);
  const [galPause, setGalPause] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  // Try to start the music as soon as the page loads. Browsers usually block sound until the guest
  // interacts, so if that fails it starts on the first tap, key press or scroll instead.
  useEffect(() => {
    const a = musicRef.current;
    if (!a) return;
    const events = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    const start = () => {
      a.play()
        .then(() => {
          setPlaying(true);
          events.forEach((e) => window.removeEventListener(e, start));
        })
        .catch(() => {});
    };
    a.play()
      .then(() => setPlaying(true))
      .catch(() => events.forEach((e) => window.addEventListener(e, start, { passive: true })));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);
  const toggleMusic = () => {
    const a = musicRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      a.pause();
      setPlaying(false);
    }
  };
  const galTouch = useRef(0);
  useEffect(() => {
    if (lightbox !== null || galPause) return;
    const id = setTimeout(() => setGalIdx((i) => (i + 1) % GALLERY_PHOTOS.length), 5000);
    return () => clearTimeout(id);
  }, [galIdx, lightbox, galPause]);
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? i : (i + 1) % GALLERY_PHOTOS.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) =>
          i === null ? i : (i + GALLERY_PHOTOS.length - 1) % GALLERY_PHOTOS.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Big Day cards: staggered reveal when scrolled into view
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".k-ev-card");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("k-in");
            // drop the stagger delay once revealed so hover stays snappy
            setTimeout(() => ((en.target as HTMLElement).style.transitionDelay = "0s"), 1500);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    cards.forEach((c, i) => {
      c.style.transitionDelay = `${i * 0.18}s`;
      c.classList.add("k-pre");
      io.observe(c);
    });
    document.querySelectorAll<HTMLElement>(".k-rv-card").forEach((c) => {
      c.classList.add("k-pre");
      io.observe(c);
    });
    document.querySelectorAll<HTMLElement>(".k-ft-inner").forEach((c) => {
      c.classList.add("k-pre");
      io.observe(c);
    });
    document.querySelectorAll<HTMLElement>(".k-qa-item").forEach((c, i) => {
      c.style.transitionDelay = `${i * 0.12}s`;
      c.classList.add("k-pre");
      io.observe(c);
    });
    return () => io.disconnect();
  }, []);

  // Hero background carousel: smooth crossfade with a slow zoom
  useEffect(() => {
    const slides = Array.from(
      document.querySelectorAll<HTMLElement>("#carouselExampleControls .carousel-inner > div"),
    );
    if (slides.length < 2) return;
    const FADE = 2000;
    const HOLD = 6000;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const imgOf = (el: HTMLElement) => el.querySelector<HTMLElement>("img");
    slides.forEach((el, k) => {
      el.style.display = "block";
      el.style.opacity = k === 0 ? "1" : "0";
      el.style.zIndex = k === 0 ? "2" : "0";
      el.style.transition = `opacity ${FADE}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      const img = imgOf(el);
      if (img) img.style.willChange = "transform";
    });
    const zoomIn = (el: HTMLElement) => {
      const img = imgOf(el);
      if (!img || reduce) return;
      img.style.transition = "none";
      img.style.transform = "scale(1)";
      void img.offsetWidth;
      img.style.transition = `transform ${HOLD + FADE * 2}ms ease-out`;
      img.style.transform = "scale(1.08)";
    };
    zoomIn(slides[0]!);
    if (reduce) return;
    let cur = 0;
    let timer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      const prev = cur;
      cur = (cur + 1) % slides.length;
      slides[prev]!.style.zIndex = "1"; // keep old photo fully visible underneath
      slides[cur]!.style.zIndex = "2";
      zoomIn(slides[cur]!);
      slides[cur]!.style.opacity = "1"; // new photo fades in on top, so there is no dip
      timer = setTimeout(() => {
        slides[prev]!.style.opacity = "0";
        slides[prev]!.style.zIndex = "0";
      }, FADE + 50);
    }, HOLD);
    return () => {
      clearInterval(id);
      clearTimeout(timer);
    };
  }, []);

  // Text animation: plays when the text scrolls onto the screen, and again each time it comes back
  useEffect(() => {
    if (!opened) return; // wait until the Save the Date overlay is closed
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".theme-eight section h1, .theme-eight section h4, .theme-eight section h6, .theme-eight section p",
      ),
    ).filter(
      (el) =>
        !el.closest("#home, #enquiry, form, .k-footer, .modal") && !el.querySelector(".split"),
    );
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("txt-in");
          else if (e.boundingClientRect.top > 0) e.target.classList.remove("txt-in"); // left below the screen: reset
        }),
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      const siblings = Array.from(el.parentElement?.children ?? []);
      el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 120 + "ms";
      el.classList.add("txt-anim");
      io.observe(el);
    });
    return () => {
      io.disconnect();
      els.forEach((el) => el.classList.remove("txt-anim", "txt-in"));
    };
  }, [opened]);

  // Fill the Our Story timeline line as the guest scrolls
  useEffect(() => {
    const ol = document.querySelector<HTMLElement>(".k-timeline");
    if (!ol) return;
    const update = () => {
      const rect = ol.getBoundingClientRect();
      const fill = Math.min(Math.max(window.innerHeight * 0.6 - rect.top, 0), rect.height);
      ol.style.setProperty("--fill", fill + "px");
      ol.querySelectorAll<HTMLElement>(".k-tl-dot").forEach((d) => {
        const r = d.getBoundingClientRect();
        d.classList.toggle("on", r.top + r.height / 2 - rect.top <= fill);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    const raf = setInterval(update, 400); // safety net in case a scroll event is missed
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      clearInterval(raf);
    };
  }, []);

  // Fade sections up as they scroll into view
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".theme-eight section"),
    ).filter((el) => el.id !== "home" && el.id !== "enquiry");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    sections.forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <>
      <style>
        {
          ".theme-eight :where(p,a,li,span,button,input,textarea,select,label):not(#home *),.theme-eight .side-nav-link{font-family:'Inter',sans-serif!important}.theme-eight :where(h1,h2,h3,h4,h5,h6,[class*='heading-font'],[class*='headingfont']):not(#home *){font-family:'Instrument Serif',Georgia,serif!important;font-weight:400!important;letter-spacing:.2px}.theme-eight [class*='Sacramento']{font-family:'Pinyon Script',cursive!important}.theme-eight i.fas,.theme-eight i.fa,.theme-eight i.far{font-family:'Font Awesome 6 Free'!important}.theme-eight i.fab{font-family:'Font Awesome 6 Brands'!important}"
        }
      </style>
      <style>
        {
          "html{scroll-behavior:smooth}section[id],div[id=rsvp]{scroll-margin-top:16px}:root{--k-navy:#1a2040;--k-pink:#e66dba;--k-gold:#f3d9a4}.hero-cta{margin-top:26px;padding:0 16px}.hero-date{color:#fff;opacity:.9;font-size:13px;letter-spacing:.6px;margin:0 0 14px;text-align:center}.hero-date i{color:var(--k-pink);margin:0 2px}.hero-cta-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}.cta-primary,.cta-ghost{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:50px;font-size:14px;font-weight:600;text-decoration:none;transition:transform .2s,box-shadow .2s,background .2s}.cta-primary{background:linear-gradient(135deg,#e66dba,#a8398a);color:#fff;box-shadow:0 8px 24px rgba(230,109,186,.45)}.cta-ghost{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.4);backdrop-filter:blur(8px)}.cta-primary:hover,.cta-ghost:hover{transform:translateY(-2px);color:#fff}.cta-ghost:hover{background:rgba(255,255,255,.22)}.cta-primary i,.cta-ghost i{font-weight:900;font-style:normal}"
        }
      </style>
      <style>
        {
          ".reveal{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}.reveal.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}.k-footer{margin-top:80px;padding:64px 20px 36px;text-align:center;background:linear-gradient(180deg,#2b3358 0%,#1a2040 100%);color:#fff}.k-footer-word{font-family:'Instrument Serif',serif!important;font-size:clamp(44px,12vw,120px);line-height:1;color:#f3d9a4;letter-spacing:.5px}.k-footer-sub{margin:14px 0 26px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#e66dba}.k-footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 26px;margin-bottom:28px}.k-footer-links a{color:#ffffffcc;text-decoration:none;font-size:14px;padding-bottom:2px;border-bottom:1px solid transparent;transition:color .2s,border-color .2s}.k-footer-links a:hover{color:#f3d9a4;border-color:#f3d9a4}.k-footer-love{margin:0;font-size:12px;color:#ffffff80}.k-footer-love i{color:#e66dba;font-weight:900;font-style:normal}"
        }
      </style>
      <style>
        {
          '.k-timeline{position:relative;list-style:none;margin:50px auto 0;padding:0;max-width:980px}.k-timeline:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%);background:#ddd6df}.k-timeline:after{content:"";position:absolute;left:50%;top:0;width:2px;height:var(--fill,0px);transform:translateX(-50%);background:linear-gradient(180deg,#a8398a,#e66dba);transition:height .12s linear}.k-tl-item{position:relative;display:flex;width:50%;padding:0 46px 46px 0;box-sizing:border-box}.k-tl-item:nth-child(even){margin-left:50%;padding:0 0 46px 46px}.k-tl-dot{position:absolute;top:34px;right:-18px;width:36px;height:36px;border-radius:50%;background:#fff;color:#b9a9b6;border:2px solid #ddd6df;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .4s;z-index:2}.k-tl-dot.on{background:linear-gradient(135deg,#e66dba,#a8398a);color:#fff;border-color:transparent;box-shadow:0 0 0 6px rgba(230,109,186,.22)}.k-tl-item:nth-child(even) .k-tl-dot{right:auto;left:-18px}.k-tl-dot i{font-weight:900;font-style:normal}.k-tl-card{display:flex;gap:18px;align-items:center;width:100%;padding:18px;border-radius:24px;background:linear-gradient(160deg,#2b3358,#1a2040);border:1px solid rgba(243,217,164,.35);box-shadow:0 14px 34px rgba(26,32,64,.28);color:#fff;transition:transform .3s}.k-tl-card:hover{transform:translateY(-4px)}.k-tl-photo{width:110px;height:110px;flex:none;border-radius:50%;object-fit:cover;border:3px solid #f3d9a4;box-shadow:0 0 0 5px rgba(243,217,164,.15)}.k-tl-body{text-align:left;min-width:0}.k-tl-year{display:inline-block;font-family:\'Instrument Serif\',serif!important;font-size:30px;line-height:1;color:#f3d9a4;margin-right:10px}.k-tl-date{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#e66dba}.k-tl-title{margin:6px 0 6px!important;font-size:24px!important;color:#fff!important;text-align:left!important}.k-tl-text{margin:0;font-size:13.5px;line-height:1.65;color:#ffffffcc;text-align:left}@media (max-width:760px){.k-timeline:before,.k-timeline:after{left:18px}.k-tl-item,.k-tl-item:nth-child(even){width:100%;margin-left:0;padding:0 0 32px 52px}.k-tl-dot,.k-tl-item:nth-child(even) .k-tl-dot{left:0;right:auto;top:26px}.k-tl-card{flex-direction:column;text-align:center;padding:22px 18px}.k-tl-photo{width:130px;height:130px}.k-tl-body,.k-tl-title,.k-tl-text{text-align:center!important}}'
        }
      </style>
      <style>
        {
          ".hero-cta{max-width:440px;margin-left:auto;margin-right:auto}.hero-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.hero-cta-row .cta-primary{grid-column:1/-1;justify-content:center;padding:14px 22px}.hero-cta-row .cta-ghost{justify-content:center;padding:12px 10px;font-size:13px;white-space:nowrap}.hero-date{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}@media (min-width:760px){.hero-cta{max-width:none}.hero-cta-row{display:flex;justify-content:center}.hero-cta-row .cta-primary{padding:12px 26px}.hero-cta-row .cta-ghost{padding:12px 22px;font-size:14px}}"
        }
      </style>
      <style>
        {
          '.theme-eight{isolation:isolate;background:transparent!important}.theme-eight::before{content:"";position:fixed;inset:-24px;z-index:-1;background:linear-gradient(rgba(246,242,248,.86),rgba(246,242,248,.9)),url(/site-assets/photos/photo-8.jpeg) center/cover no-repeat;filter:blur(3px);pointer-events:none}'
        }
      </style>
      <style>
        {
          ".txt-anim{opacity:0;transform:translateY(22px);filter:blur(4px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1),filter .9s ease}.txt-anim.txt-in{opacity:1;transform:none;filter:none}@media (prefers-reduced-motion:reduce){.txt-anim{opacity:1;transform:none;filter:none;transition:none}}"
        }
      </style>
      <style>
        {
          ".split-p{display:inline-block;opacity:0;transform:translateY(.7em);filter:blur(3px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1),filter .7s ease}.split.on .split-p{opacity:1;transform:none;filter:none}@media (prefers-reduced-motion:reduce){.split-p{opacity:1;transform:none;filter:none;transition:none}}"
        }
      </style>
      <style>
        {
          ".split-name{font-family:'Playfair Display',Georgia,serif!important;font-weight:600;font-size:1.15em;letter-spacing:.02em;color:#2b3358}.split-desc{font-family:'Cormorant Garamond',Georgia,serif!important;font-style:italic;font-weight:600;font-size:1.3em;line-height:1.35;color:#5a4a63}"
        }
      </style>
      <style>
        {
          '.k-tl-meta{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}.k-tl-card{position:relative;overflow:hidden}.k-tl-card:before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#e66dba,#f3d9a4)}@media (max-width:760px){.k-tl-item,.k-tl-item:nth-child(even){padding:0 0 22px 46px}.k-tl-card{display:grid!important;grid-template-columns:76px 1fr;grid-template-areas:"photo meta" "photo title" "text text";column-gap:14px;row-gap:2px;align-items:center;text-align:left!important;padding:18px 16px 16px!important;border-radius:18px!important}.k-tl-body{display:contents}.k-tl-photo{grid-area:photo;width:76px!important;height:76px!important;border-width:2px!important}.k-tl-meta{grid-area:meta;align-self:end}.k-tl-year{font-size:26px!important;margin-right:0!important}.k-tl-title{grid-area:title;align-self:start;margin:0!important;font-size:22px!important;text-align:left!important}.k-tl-text{grid-area:text;margin-top:12px!important;font-size:14px!important;line-height:1.7!important;text-align:left!important;padding-top:12px;border-top:1px solid rgba(255,255,255,.12)}.k-tl-body,.k-tl-title,.k-tl-text{text-align:left!important}.k-tl-dot,.k-tl-item:nth-child(even) .k-tl-dot{width:32px;height:32px;top:20px;left:2px}}'
        }
      </style>
      <style>
        {
          ".k-tl-card{display:block!important;position:relative;padding:0!important;background:#fff!important;border:1px solid #eadff0!important;border-radius:22px!important;overflow:hidden;color:#2b3358!important;box-shadow:0 12px 30px rgba(60,40,90,.12)!important;text-align:left!important}.k-tl-card:before{display:none!important}.k-tl-photo{display:block!important;width:100%!important;height:230px!important;border:0!important;border-radius:999px 999px 0 0!important;object-fit:cover;object-position:center 25%;box-shadow:none!important}.k-tl-body{display:block!important;padding:18px 22px 24px;text-align:left!important}.k-tl-meta{position:absolute;left:50%;top:188px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;flex-wrap:nowrap;white-space:nowrap;padding:7px 16px;border-radius:999px;background:rgba(26,32,64,.88);backdrop-filter:blur(6px)}.k-tl-year{font-size:22px!important;margin:0!important;color:#f3d9a4!important}.k-tl-date{font-size:10px!important;letter-spacing:1.8px;color:#f6b9de!important}.k-tl-title{margin:22px 0 8px!important;font-size:26px!important;color:#2b3358!important;text-align:center!important}.k-tl-text{margin:0!important;padding:0!important;border:0!important;font-size:14.5px!important;line-height:1.75!important;color:#5d5a6b!important;text-align:center!important}.k-tl-dot,.k-tl-item:nth-child(even) .k-tl-dot{top:26px}@media (max-width:760px){.k-tl-card{display:block!important}.k-tl-photo{height:210px!important;width:100%!important}.k-tl-meta{top:170px}.k-tl-item,.k-tl-item:nth-child(even){padding:0 0 28px 46px}.k-tl-body{padding:18px 18px 22px}.k-tl-title,.k-tl-text{text-align:center!important}.k-tl-text{text-align:left!important}}"
        }
      </style>
      <style>
        {
          '.k-tl-card{display:block!important;position:relative;min-height:400px;padding:0!important;border:0!important;border-radius:26px!important;overflow:hidden;background:#1a2040!important;box-shadow:0 18px 40px rgba(26,32,64,.3)!important;color:#fff!important;text-align:left!important}.k-tl-card:before{content:"";display:block!important;position:absolute;inset:0;height:auto!important;z-index:1;background:linear-gradient(180deg,rgba(26,32,64,0) 30%,rgba(26,32,64,.82) 68%,rgba(26,32,64,.96) 100%)!important}.k-tl-photo{position:absolute;inset:0;display:block!important;width:100%!important;height:100%!important;border:0!important;border-radius:0!important;object-fit:cover;object-position:center 20%;box-shadow:none!important;transition:transform 1.2s ease}.k-tl-card:hover .k-tl-photo{transform:scale(1.06)}.k-tl-body{position:absolute;left:0;right:0;bottom:0;z-index:2;display:block!important;padding:0 24px 24px;text-align:left!important}.k-tl-meta{position:absolute;left:18px;top:-0px;transform:none;display:flex;align-items:center;gap:8px;white-space:nowrap;padding:0;background:none;backdrop-filter:none}.k-tl-card .k-tl-meta{top:auto;left:auto;position:static;display:inline-flex;margin-bottom:14px;transform:none;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.35)}.k-tl-year{font-size:20px!important;margin:0!important;color:#fff!important}.k-tl-date{font-size:10px!important;letter-spacing:1.8px;color:#f3d9a4!important}.k-tl-title{margin:0 0 8px!important;font-size:30px!important;line-height:1.1!important;color:#fff!important;text-align:left!important}.k-tl-title:after{content:"";display:block;width:44px;height:2px;margin-top:10px;background:linear-gradient(90deg,#e66dba,#f3d9a4)}.k-tl-text{margin:12px 0 0!important;padding:0!important;border:0!important;font-size:14px!important;line-height:1.7!important;color:rgba(255,255,255,.88)!important;text-align:left!important}.k-tl-dot,.k-tl-item:nth-child(even) .k-tl-dot{top:24px}@media (max-width:760px){.k-tl-card{min-height:460px}.k-tl-item,.k-tl-item:nth-child(even){padding:0 0 26px 46px}.k-tl-body{padding:0 20px 22px}.k-tl-title{font-size:27px!important}}'
        }
      </style>
      <style>
        {
          ".k-timeline:before{width:3px!important;background:rgba(230,109,186,.32)!important;border-radius:3px}.k-timeline:after{width:3px!important;border-radius:3px;background:linear-gradient(180deg,#a8398a,#e66dba 70%,#f3d9a4)!important;box-shadow:0 0 12px rgba(230,109,186,.55)}.k-timeline:before,.k-timeline:after{display:block!important}"
        }
      </style>
      <style>
        {
          ".k-tl-text{text-align:justify!important;text-align-last:left;text-justify:inter-word;hyphens:auto;-webkit-hyphens:auto;word-spacing:.02em}.k-tl-body{padding-left:22px!important;padding-right:22px!important;box-sizing:border-box}@media (max-width:760px){.k-tl-body{padding-left:20px!important;padding-right:20px!important}}"
        }
      </style>
      <style>
        {
          ".k-tl-title{font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;font-size:34px!important;letter-spacing:.01em!important;line-height:1.05!important}.k-tl-text{font-family:'Lora',Georgia,serif!important;font-weight:400;font-size:14px!important;line-height:1.8!important;letter-spacing:.005em}.k-tl-date{font-family:'Inter',sans-serif!important}@media (max-width:760px){.k-tl-title{font-size:32px!important}}"
        }
      </style>
      <style>
        {
          ".theme-eight .k-marquee-text>span:not(#x){font-family:'Instrument Serif',Georgia,serif!important;font-weight:400!important;letter-spacing:.03em;background-image:linear-gradient(100deg,#1a2040 0%,#2b3358 22%,#a8398a 62%,#e66dba 100%)!important;background-size:100% 100%;background-origin:content-box;-webkit-background-clip:text;background-clip:text;color:transparent!important;-webkit-text-fill-color:transparent;-webkit-text-stroke:0!important;filter:drop-shadow(0 2px 8px rgba(168,57,138,.18))}.theme-eight .k-marquee-text>span:not(#x) font,.theme-eight .k-marquee-text>span:not(#x) i{-webkit-text-fill-color:#e66dba!important;color:#e66dba!important;background:none!important}"
        }
      </style>
      <style>
        {
          ".k-mq-pill{position:absolute;right:20px;top:4px;width:150px;height:90px;border-radius:50px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a2040 0%,#6a2f7f 55%,#e66dba 100%);box-shadow:0 8px 20px rgba(168,57,138,.35);-webkit-text-fill-color:initial}.theme-eight .k-marquee-text .k-mq-pill i:not(#x){background:none!important;-webkit-background-clip:border-box;background-clip:border-box;-webkit-text-fill-color:#fdebf6!important;color:#fdebf6!important;display:inline-block!important;font-family:'Font Awesome 6 Free'!important;font-size:40px;font-weight:900;font-style:normal;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}@media (max-width:520px){.k-mq-pill{width:80px;height:50px;right:20px;top:2px}.theme-eight .k-marquee-text .k-mq-pill i:not(#x){font-size:22px}}"
        }
      </style>
      <style>
        {
          ".top-icon-btn i,.side-nav-link i,.side-live i{font-weight:900;font-style:normal;display:inline-block;line-height:1}.top-icon-btn{width:44px;height:44px;border:none;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,.25);transition:transform .2s,background .25s,color .25s}.top-icon-btn:hover{transform:scale(1.08)}.top-icon-btn:active{transform:scale(.94)}.side-nav-link{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,.04);color:#fff;text-decoration:none;font-size:15px;font-weight:500;letter-spacing:.3px;transition:background .2s,transform .2s,color .2s}.side-nav-link:hover{background:rgba(255,255,255,.08);color:#f3d9a4;transform:translateX(4px)}"
        }
      </style>
      <style>
        {capturedCSS.replace(
          /(<\/|<)(s)(tyle)/gi,
          (_, prefix, letter, rest) => prefix + (letter === "s" ? "\\73 " : "\\53 ") + rest,
        )}
      </style>
      <>
        <div
          className="theme-eight bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#f6f2f8]! text-site-import-foreground overflow-x-hidden! [font-variant-ligatures:none]!"
          style={
            {
              "--BackgroundColor": "#f6f2f8",
              "--BackgroundImage": "url('/site-assets/photos/photo-1.jpeg')",
              "--BrownTextColor": "#2d1205",
              "--ButtonColor": "#323c60",
              "--ButtonTextColor": "#fff",
              "--GradientColor": "#e66dba",
              "--PrimaryColor": "#a8879c",
              "--WhiteColor": "#ffffff",
              "--heading-font": "'Monallesia Script', cursive, sans-serif",
              "--headingColor": "#060644",
              "--textcolor": "#434343",
              fontFamily: '"Inter 18pt",sans-serif',
            } as unknown as CSSProperties
          }
          data-site-import-document-lang="en"
          id="home"
        >
          <audio id="bg-music" ref={musicRef} loop {...({ preload: "auto" } as any)}>
            <source src="/site-assets/wedding-music.mp3" type="audio/mpeg" />
          </audio>
          {/* ═══════════════════════════════════════════════
           WEDDING OVERLAY
      ═══════════════════════════════════════════════ */}
          <div
            className="items-center! flex! inset-0! justify-center! overflow-hidden! fixed! z-99999!"
            id="ov-root"
            style={{
              opacity: opened ? 0 : 1,
              visibility: opened ? "hidden" : "visible",
              transition: "opacity 0.6s ease, visibility 0s linear 0.6s",
            }}
          >
            <div className="inset-0 overflow-hidden pointer-events-none absolute" id="ov-petals">
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e8c4dc] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[12.6px] left-[15.2%] opacity-0 absolute top-[-8%] w-[12.6px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:1.3s]! [animation-duration:14.4s]!"
                style={{ "--ov-dx": "108px", "--ov-rot": "652deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#b880a8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[16.7px] left-[53.4%] opacity-0 absolute top-[-8%] w-[16.7px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:2.7s]! [animation-duration:10.4s]!"
                style={{ "--ov-dx": "109px", "--ov-rot": "568deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#c490b8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[14.9px] left-[41%] opacity-0 absolute top-[-8%] w-[14.9px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:2.5s]! [animation-duration:12.8s]!"
                style={{ "--ov-dx": "-100px", "--ov-rot": "1047deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#f0b8d8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[13.8px] left-[24.5%] opacity-0 absolute top-[-8%] w-[13.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:1.3s]! [animation-duration:12.1s]!"
                style={{ "--ov-dx": "109px", "--ov-rot": "525deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#d4a0c8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[13.5px] left-[89.4%] opacity-0 absolute top-[-8%] w-[13.5px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:7.2s]! [animation-duration:14.2s]!"
                style={{ "--ov-dx": "23px", "--ov-rot": "608deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dba] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[9px] left-[33.8%] opacity-0 absolute top-[-8%] w-[9px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:3.7s]! [animation-duration:9.2s]!"
                style={{ "--ov-dx": "-28px", "--ov-rot": "662deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dba] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[14.6px] left-[18.2%] opacity-0 absolute top-[-8%] w-[14.6px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:5.6s]! [animation-duration:10.5s]!"
                style={{ "--ov-dx": "-67px", "--ov-rot": "369deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#d4a0c8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[10.8px] left-[14.5%] opacity-0 absolute top-[-8%] w-[10.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:6.7s]! [animation-duration:7.4s]!"
                style={{ "--ov-dx": "57px", "--ov-rot": "588deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#c490b8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[15.5px] left-[24.1%] opacity-0 absolute top-[-8%] w-[15.5px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:3.1s]! [animation-duration:8.2s]!"
                style={{ "--ov-dx": "21px", "--ov-rot": "646deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#d4a0c8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[9.4px] left-[55.1%] opacity-0 absolute top-[-8%] w-[9.4px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:5.7s]! [animation-duration:9.1s]!"
                style={{ "--ov-dx": "-6px", "--ov-rot": "784deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#b880a8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[9.8px] left-[97%] opacity-0 absolute top-[-8%] w-[9.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:5.3s]! [animation-duration:11.2s]!"
                style={{ "--ov-dx": "3px", "--ov-rot": "526deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dba] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[16.9px] left-[87.4%] opacity-0 absolute top-[-8%] w-[16.9px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:5s]! [animation-duration:7.4s]!"
                style={{ "--ov-dx": "-16px", "--ov-rot": "448deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#f0b8d8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[16.1px] left-[71.4%] opacity-0 absolute top-[-8%] w-[16.1px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:3.3s]! [animation-duration:7.8s]!"
                style={{ "--ov-dx": "36px", "--ov-rot": "966deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#f0b8d8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[16.7px] left-[84.1%] opacity-0 absolute top-[-8%] w-[16.7px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:6.5s]! [animation-duration:15.8s]!"
                style={{ "--ov-dx": "-22px", "--ov-rot": "784deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#c490b8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[16.3px] left-[80.2%] opacity-0 absolute top-[-8%] w-[16.3px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:2.1s]! [animation-duration:11.6s]!"
                style={{ "--ov-dx": "64px", "--ov-rot": "749deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e8c4dc] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[11.3px] left-[92.4%] opacity-0 absolute top-[-8%] w-[11.3px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:3.7s]! [animation-duration:12.4s]!"
                style={{ "--ov-dx": "-109px", "--ov-rot": "596deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#f0b8d8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[11.8px] left-[9.7%] opacity-0 absolute top-[-8%] w-[11.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:7s]! [animation-duration:15.1s]!"
                style={{ "--ov-dx": "-59px", "--ov-rot": "610deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e8c4dc] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[13.6px] left-[24.3%] opacity-0 absolute top-[-8%] w-[13.6px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:4.1s]! [animation-duration:11.4s]!"
                style={{ "--ov-dx": "-0px", "--ov-rot": "545deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#c490b8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[7.2px] left-[29.4%] opacity-0 absolute top-[-8%] w-[7.2px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:1.8s]! [animation-duration:12.7s]!"
                style={{ "--ov-dx": "-65px", "--ov-rot": "431deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#c490b8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[15.7px] left-[80.7%] opacity-0 absolute top-[-8%] w-[15.7px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:7.9s]! [animation-duration:7.4s]!"
                style={{ "--ov-dx": "-26px", "--ov-rot": "535deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#d4a0c8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-[15.8px] left-[58.1%] opacity-0 absolute top-[-8%] w-[15.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:0.4s]! [animation-duration:12.8s]!"
                style={{ "--ov-dx": "-102px", "--ov-rot": "697deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e8c4dc] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[7.8px] left-[48.6%] opacity-0 absolute top-[-8%] w-[7.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:1.6s]! [animation-duration:7.2s]!"
                style={{ "--ov-dx": "-64px", "--ov-rot": "568deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#d4a0c8] rounded-tl-[50%] rounded-tr-none rounded-br-[50%] rounded-bl-none h-[14.8px] left-full opacity-0 absolute top-[-8%] w-[14.8px] [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:0.3s]! [animation-duration:15.8s]!"
                style={{ "--ov-dx": "-12px", "--ov-rot": "1050deg" } as unknown as CSSProperties}
              />
              <span
                className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#b880a8] rounded-tl-none rounded-tr-[50%] rounded-br-none rounded-bl-[50%] h-3 left-[49.6%] opacity-0 absolute top-[-8%] w-3 [animation:auto_linear_0s_infinite_normal_none_running_petalFall] [animation-delay:5.6s]! [animation-duration:15.7s]!"
                style={{ "--ov-dx": "108px", "--ov-rot": "870deg" } as unknown as CSSProperties}
              />
            </div>
            <div className="inset-0 pointer-events-none absolute" id="ov-sparks">
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[2.6px] left-[90.5%] opacity-0 absolute top-[58.2%] w-[2.6px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:5s]! [animation-duration:2s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[3.1px] left-[27.2%] opacity-0 absolute top-[61.8%] w-[3.1px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:4.3s]! [animation-duration:2.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[2.1px] left-[20.6%] opacity-0 absolute top-[23.4%] w-[2.1px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:0s]! [animation-duration:4.4s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[3.8px] left-[61.8%] opacity-0 absolute top-[91.8%] w-[3.8px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:3.7s]! [animation-duration:2.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[1.7px] left-[66.4%] opacity-0 absolute top-[29.9%] w-[1.7px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.6s]! [animation-duration:4.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[2.3px] left-[24.3%] opacity-0 absolute top-[69.6%] w-[2.3px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:4.6s]! [animation-duration:3.8s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[2.9px] left-[45%] opacity-0 absolute top-[21.2%] w-[2.9px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:2.8s]! [animation-duration:4.7s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[2.2px] left-[42.2%] opacity-0 absolute top-[36.5%] w-[2.2px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.1s]! [animation-duration:4.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[2.7px] left-[17.8%] opacity-0 absolute top-[84.4%] w-[2.7px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.6s]! [animation-duration:3.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[1.8px] left-[78.2%] opacity-0 absolute top-[39.7%] w-[1.8px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:3.1s]! [animation-duration:4.3s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[3.5px] left-[25.8%] opacity-0 absolute top-[61.3%] w-[3.5px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.7s]! [animation-duration:4.2s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[2.5px] left-[88%] opacity-0 absolute top-[47.5%] w-[2.5px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:4.4s]! [animation-duration:2.3s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[1.7px] left-[5.4%] opacity-0 absolute top-[27.9%] w-[1.7px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:2.6s]! [animation-duration:2.3s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[1.7px] left-[6.1%] opacity-0 absolute top-[76.9%] w-[1.7px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.3s]! [animation-duration:4s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[1.9px] left-[79.3%] opacity-0 absolute top-[52%] w-[1.9px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:0.6s]! [animation-duration:2.3s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[3.3px] left-[7.7%] opacity-0 absolute top-[55.3%] w-[3.3px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:3.4s]! [animation-duration:1.9s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffffe6] rounded-[50%] h-[2.8px] left-[85.5%] opacity-0 absolute top-[61.8%] w-[2.8px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:2.9s]! [animation-duration:4.6s]!" />
              <span className="ov-s bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#e66dbae6] rounded-[50%] h-[2.1px] left-[83.8%] opacity-0 absolute top-[48%] w-[2.1px] [animation:auto_ease-in-out_0s_infinite_normal_none_running_sparkle] [animation-delay:1.6s]! [animation-duration:2.2s]!" />
            </div>
            <div
              className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffff12] border border-solid border-[#ffffff24] rounded-[28px] shadow-[rgba(6,6,68,0.55)_0px_8px_40px,rgba(230,109,186,0.18)_0px_0px_0px_1px,rgba(255,255,255,0.18)_0px_1px_0px_inset,rgba(0,0,0,0.1)_0px_-1px_0px_inset] max-w-[430px] opacity-100 relative text-center transform-[translateY(0px)_scale(1)] w-[92%] z-10 pt-7 pr-[18px] pb-6 pl-[18px] [animation:1.1s_cubic-bezier(0.22,1,0.36,1)_0.3s_1_normal_both_running_cardReveal] [backdrop-filter:blur(28px)] md:pt-[38px] md:pr-8 md:pb-[30px] md:pl-8"
              id="ov-card"
            >
              {/* Save the Date */}
              <div className="leading-none mt-0 mr-auto mb-[22px] ml-auto opacity-100 text-center transform-[scale(1)_rotate(0deg)] [animation:0.9s_cubic-bezier(0.34,1.56,0.64,1)_0.7s_1_normal_both_running_sealIn]">
                <div className="items-baseline flex justify-center m-0">
                  <span className="ov-std-save text-[#f0dfc5] text-[30px] font-extrabold tracking-[6px] leading-[1.1] uppercase [text-shadow:rgba(230,180,100,0.25)_0px_1px_12px]">
                    Save
                  </span>
                </div>
                <div className="items-baseline flex justify-center m-0">
                  <span className="ov-the font-[family-name:Sacramento,cursive] text-[28px] tracking-[0px] leading-none mr-[5px]">
                    the
                  </span>
                  <span className="ov-std-date text-[#f0dfc5] text-[30px] font-extrabold tracking-[6px] leading-[1.1] uppercase [text-shadow:rgba(230,180,100,0.25)_0px_1px_12px]">
                    Date
                  </span>
                </div>
                <div className="items-center flex gap-2.5 justify-center mt-[9px]">
                  <span className="[background:linear-gradient(90deg,transparent,rgba(230,180,100,0.5))] h-px w-[38px]" />
                  <i className="fas fa-heart antialiased text-[#e66dba] inline-block text-[9px] not-italic font-black leading-none [filter:drop-shadow(rgba(230,109,186,0.7)_0px_0px_4px)] [font-variant:normal] [text-rendering:auto]" />
                  <span className="[background:linear-gradient(270deg,transparent,rgba(230,180,100,0.5))] h-px w-[38px]" />
                </div>
              </div>
              {/* Couple photos */}
              <div className="items-center flex gap-3.5 justify-center mb-5 opacity-100 translate-y-0 [animation:0.8s_ease_1s_1_normal_both_running_fadeUp]">
                <div className="items-center flex flex-col gap-[9px]">
                  <div className="shrink-0 h-[94px] relative w-[94px] max-[420px]:h-[76px] max-[420px]:w-[76px]">
                    <img
                      className="border-[2.5px] border-solid border-[#9c6f22] rounded-[50%] shadow-[rgba(0,0,0,0.45)_0px_6px_24px,rgba(230,109,186,0.12)_0px_0px_0px_3px] block h-[94px] object-cover align-middle w-[94px] [object-position:center_top] max-[420px]:h-[76px] max-[420px]:w-[76px] max-w-none"
                      src="/site-assets/photos/photo-2.jpeg"
                      alt="A.J Prince"
                    />
                    <div className="border-[1.5px] border-solid border-[#9c6f22bf] rounded-[50%] inset-[-7px] absolute [animation:2.4s_ease-out_0s_infinite_normal_none_running_ringPulse]" />
                    <div className="border-[1.5px] border-solid border-[#9c6f2273] rounded-[50%] inset-[-7px] absolute [animation:2.4s_ease-out_1.2s_infinite_normal_none_running_ringPulse]" />
                  </div>
                </div>
                <div className="ov-amp [background:linear-gradient(140deg,rgb(240,160,208),rgb(230,109,186),rgb(168,135,156),rgb(230,109,186),rgb(240,160,208))_0%_0%/300%_300%_text] shrink-0 -mt-3.5 text-[42px]! leading-[42px] [-webkit-text-fill-color:transparent] [animation:4s_ease_0s_infinite_normal_none_running_ampShimmer] [filter:drop-shadow(rgba(230,109,186,0.5)_0px_0px_14px)] md:text-[54px]! md:leading-[54px]">
                  &amp;
                </div>
                <div className="items-center flex flex-col gap-[9px]">
                  <div className="shrink-0 h-[94px] relative w-[94px] max-[420px]:h-[76px] max-[420px]:w-[76px]">
                    <img
                      className="border-[2.5px] border-solid border-[#9c6f22] rounded-[50%] shadow-[rgba(0,0,0,0.45)_0px_6px_24px,rgba(230,109,186,0.12)_0px_0px_0px_3px] block h-[94px] object-cover align-middle w-[94px] [object-position:center_top] max-[420px]:h-[76px] max-[420px]:w-[76px] max-w-none"
                      src="/site-assets/photos/photo-4.jpeg"
                      alt="Malavika P Panayam"
                    />
                    <div className="border-[1.5px] border-solid border-[#9c6f22bf] rounded-[50%] inset-[-7px] absolute [animation:2.4s_ease-out_0s_infinite_normal_none_running_ringPulse]" />
                    <div className="border-[1.5px] border-solid border-[#9c6f2273] rounded-[50%] inset-[-7px] absolute [animation:2.4s_ease-out_1.2s_infinite_normal_none_running_ringPulse]" />
                  </div>
                </div>
              </div>
              {/* Names */}
              <div className="ov-names mb-1 opacity-100 translate-y-0 [animation:0.8s_ease_1.15s_1_normal_both_running_fadeUp]">
                <h1 className="text-[#6d1a2b]! font-[family-name:Roboto,sans-serif]! font-normal! tracking-[0.5px]! m-0! p-0! text-[30px]! leading-[33px]! md:text-[38px]! md:leading-[44px]!">
                  <span className="whitespace-nowrap">Prince</span>{" "}
                  <em className="[background:linear-gradient(135deg,rgb(240,160,208),rgb(230,109,186))_text] italic text-[24px] py-0 px-[3.6px] [-webkit-text-fill-color:transparent] [vertical-align:1.2px] md:text-[36.8px] md:py-0 md:px-[5.52px] md:[vertical-align:1.84px]">
                    &amp;
                  </em>{" "}
                  <span className="whitespace-nowrap">Malavika</span>
                </h1>
              </div>
              {/* Divider */}
              <div className="ov-divider items-center flex gap-2.5 my-4 mx-0 opacity-100 translate-y-[3.55271e-15px] [animation:0.8s_ease_1.25s_1_normal_both_running_fadeUp]">
                <i className="fas fa-ring antialiased text-[#e66dbad9] inline-block text-[13px] not-italic font-black leading-none [font-variant:normal] [text-rendering:auto]" />
              </div>
              {/* Date & Time */}
              <div className="mb-[22px] opacity-100 translate-y-0 [animation:0.8s_ease_1.35s_1_normal_both_running_fadeUp]">
                <p className="ov-date-tag text-[#9c6f22]! text-[10px]! tracking-[3.5px] leading-[1.4]! mb-1.5 mt-0 uppercase">
                  Wedding Ceremony
                </p>
                <p className="ov-date-main text-[#4a1420]! text-[16px]! font-semibold tracking-[0.3px] leading-[1.4]! mb-3 mt-0">
                  Friday, 29 January 2027
                </p>
                <div className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#9c6f2214] border border-solid border-[#9c6f2266] rounded-[14px] flex overflow-hidden">
                  <div className="flex flex-1 flex-col gap-1 py-[11px] px-2.5">
                    <span className="ov-ti-ev text-[#e66dbad9] text-[9px] font-semibold tracking-[2.5px] uppercase">
                      Time
                    </span>
                    <span className="ov-ti-t text-[#ffffffe0] text-[13px] font-medium tracking-[0.2px]">
                      Muhurtham 10 AM – 11 AM
                    </span>
                  </div>
                  <div className="border-l border-solid border-l-[#9c6f2266] flex flex-1 flex-col gap-1 py-[11px] px-2.5">
                    <span className="ov-ti-ev text-[#e66dbad9] text-[9px] font-semibold tracking-[2.5px] uppercase">
                      Venue
                    </span>
                    <span className="ov-ti-t text-[#ffffffe0] text-[13px] font-medium tracking-[0.2px]">
                      J's International Convention Centre, Kalluvathukkal, Kollam
                    </span>
                  </div>
                </div>
              </div>
              {/* CTA */}
              <div className="opacity-100 translate-y-[3.55271e-15px] [animation:0.8s_ease_1.5s_1_normal_both_running_fadeUp]">
                <button
                  className="items-center! [background:#6d1a2b]! border-current! rounded-[50px]! border-none! shadow-[rgba(109,26,43,0.35)_0px_8px_22px] text-[#fbf3e4]! cursor-pointer flex! font-semibold gap-2.5! justify-center! tracking-[1.2px] m-0 outline-0! overflow-hidden relative! normal-case w-full! text-[14px]! leading-[21px] py-[15px]! px-6! [animation:2.8s_ease-in-out_2.2s_infinite_normal_none_running_btnGlow] [appearance:button] [border-image:none]! [border-width:medium]! [font-family:inherit] [transition:transform_0.25s,box-shadow_0.25s] active:scale-97 hover:shadow-[rgba(109,26,43,0.45)_0px_10px_32px]! hover:translate-y-[-3px] md:text-[15px]! md:leading-[22.5px] md:py-[17px]! md:px-8!"
                  id="ov-cta"
                  onClick={() => {
                    setOpened(true);
                    const a = musicRef.current;
                    if (a && a.paused) a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
                  }}
                >
                  {"\n        "}
                  <span className="relative z-1">View Invitation</span>
                  {"\n        "}
                  <i className="fas fa-heart antialiased inline-block text-[15px] not-italic font-black leading-none relative transition-transform duration-300 z-1 [font-variant:normal] [text-rendering:auto]" />
                  {"\n      "}
                </button>
              </div>
              <p className="ov-hint text-[#4a142099]! text-[11px]! tracking-[0.4px]! leading-normal! mt-3.5! mr-0! mb-0! ml-0! opacity-100 translate-y-0 [animation:0.8s_ease_1.7s_1_normal_both_running_fadeUp]!">
                A love story worth celebrating — your invitation is inside ✨
              </p>
            </div>
          </div>
          {/* ═══════════════════════════════════════════════
           END WEDDING OVERLAY
      ═══════════════════════════════════════════════ */}
          <a
            className="bg-[#37bd69] border-current rounded-[50%] border-none bottom-[30px] cursor-pointer text-[22px] h-[60px] outline-0! p-0 fixed right-[30px] text-center underline duration-300 w-[60px] z-999 text-white leading-[50px] [border-image:none] [border-width:medium] hover:text-(--ButtonTextColor) hover:no-underline max-[520px]:bottom-[15px] max-[520px]:h-[50px] max-[520px]:right-[15px] max-[520px]:w-[50px] md:leading-[60px]"
            href="https://api.whatsapp.com/send?text=%F0%9F%92%8D%E2%9C%A8+*Prince+%26+Malavika*+%E2%9C%A8%F0%9F%92%8D%0A%0AYou+are+lovingly+invited+to+join+us+on+our+special+day+%F0%9F%A4%8D%0A%0A%F0%9F%8E%89+*Wedding+Ceremony%3A*%0A%F0%9F%97%93%EF%B8%8F+Friday%2C+29+Jan+2027%0A%E2%8F%B0+Muhurtham+10%3A30+AM+-+11%3A00+AM%0A%F0%9F%93%8D+J's+International+Convention+Centre%2C+Kalluvathukkal%2C+Kollam%0A%0A%F0%9F%8E%89+*Wedding+Reception%3A*%0A%F0%9F%97%93%EF%B8%8F+Saturday%2C+30+Jan+2027%0A%E2%8F%B0+5%3A30+PM+-+9%3A00+PM%0A%F0%9F%93%8D+Marine+Pride+Beach+Resort%2C+Edava%2C+Varkala%0A%0AWith+love+%26+gratitude+%E2%9D%A4%EF%B8%8F"
            target="_blank"
            title="Share on WhatsApp"
          >
            <i className="fab fa-whatsapp antialiased inline-block not-italic font-normal leading-none [font-variant:normal] [text-rendering:auto]" />
          </a>
          <div
            style={{ position: "fixed", right: 12, top: 12, zIndex: 1020, display: "flex", gap: 8 }}
          >
            <button
              aria-label={playing ? "Mute music" : "Play music"}
              onClick={toggleMusic}
              className="top-icon-btn"
              style={{ background: "rgba(26,32,64,0.75)", color: "#fff" }}
            >
              <i className={`fas ${playing ? "fa-volume-up" : "fa-volume-mute"}`} id="volume" />
            </button>
            <button
              aria-label={menuOpen ? "Close menu" : "Menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="top-icon-btn"
              style={{
                background: menuOpen
                  ? "linear-gradient(135deg,#e66dba,#a8398a)"
                  : "rgba(255,255,255,0.92)",
                color: menuOpen ? "#fff" : "#2b3358",
              }}
            >
              <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} id="searchic" />
            </button>
          </div>
          {/* Side navigation */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "rgba(15,10,35,0.55)",
              backdropFilter: "blur(3px)",
              opacity: menuOpen ? 1 : 0,
              visibility: menuOpen ? "visible" : "hidden",
              transition: "opacity 0.3s ease, visibility 0s linear " + (menuOpen ? "0s" : "0.3s"),
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 280,
              maxWidth: "85%",
              zIndex: 999,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              padding: "76px 22px 24px",
              background: "linear-gradient(160deg,#2b3358 0%,#1a2040 60%,#3a2350 100%)",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.45)",
              borderLeft: "1px solid rgba(230,109,186,0.25)",
              transform: menuOpen ? "translateX(0)" : "translateX(105%)",
              visibility: menuOpen ? "visible" : "hidden",
              transition:
                "transform 0.35s cubic-bezier(.4,0,.2,1), visibility 0s linear " +
                (menuOpen ? "0s" : "0.35s"),
              overflowY: "auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                paddingBottom: 20,
                marginBottom: 18,
                borderBottom: "1px solid rgba(243,217,164,0.25)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 34,
                  color: "#f3d9a4",
                  lineHeight: 1.1,
                }}
              >
                Prince &amp; Malavika
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#e66dbad9",
                  marginTop: 6,
                }}
              >
                Wedding Invitation
              </div>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              {[
                ["#home", "Home", "fa-home"],
                ["#happycouples", "Happy Couple", "fa-heart"],
                ["#ourstory", "Families", "fa-book-open"],
                ["#whenandwhere", "When & Where", "fa-map-marker-alt"],
                ["#gallery", "Gallery", "fa-images"],
                ["#video", "Video", "fa-video"],
                ["#rsvp", "RSVP", "fa-envelope-open-text"],
              ].map(([href, label, icon]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="side-nav-link"
                >
                  <i
                    className={`fas ${icon}`}
                    style={{ width: 22, color: "#e66dba", fontSize: 14 }}
                  />
                  {label}
                </a>
              ))}
            </nav>
            <a
              className="side-live"
              href="https://www.youtube.com/watch?v=1FdJyaCZ5ow"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "13px 16px",
                borderRadius: 50,
                background: "linear-gradient(135deg,#e66dba,#a8398a)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.8,
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(230,109,186,0.4)",
              }}
            >
              <i className="fas fa-broadcast-tower" /> Live Streaming
            </a>
          </aside>
          <div
            className="modal hidden h-full left-0 opacity-0 outline-0 overflow-x-hidden overflow-y-auto fixed top-0 transition-opacity duration-150 ease-linear w-full [z-index:var(--bs-modal-zindex)] motion-reduce:transition-none"
            id="whishModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="whishModalLabel"
            aria-hidden="true"
          >
            <div
              className="items-center flex my-4! mx-auto! max-w-[min(500px,-32px_+_100vw)]! min-h-[calc(100%_-_var(--bs-modal-margin)_*_2)] pointer-events-none relative transform-[translate(0px,-50px)] transition-transform duration-300 ease-out w-auto! min-[576px]:ml-auto min-[576px]:mr-auto motion-reduce:transition-none"
              role="document"
            >
              <div className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#1e2a4a] border-current! rounded-[18px] border-none! box-border! flex flex-col max-w-full! outline-0 overflow-hidden pointer-events-auto relative w-full! text-site-import-foreground [border:var(--bs-modal-border-width)_solid_var(--bs-modal-border-color)] [border-image:none] [border-width:medium]!">
                <div className="box-border! flex-auto overflow-hidden pt-10 pr-5 pb-8 pl-5 relative w-full!">
                  <button
                    className="bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-transparent! border-current! rounded-none! border-none! shadow-none! text-[#ffffff99]! cursor-pointer text-[16px] h-auto! leading-none! m-0 opacity-100 outline-0! p-0! absolute right-[15px] normal-case top-[15px] duration-300 w-auto! [appearance:button] [border-image:none]! [border-width:medium]! [font-family:inherit] hover:bg-none! hover:[background-position:0%_0%]! hover:[background-size:auto_auto]! hover:[background-repeat:repeat]! hover:[background-origin:padding-box]! hover:[background-clip:border-box]! hover:[background-attachment:scroll]! hover:bg-transparent! hover:text-white!"
                    aria-label="Close"
                    type="button"
                    aria-bs-label="Close"
                  >
                    <i className="fas fa-times antialiased inline-block not-italic font-black leading-none [font-variant:normal] [text-rendering:auto]" />
                  </button>
                  <h5
                    className="text-white! font-[family-name:Roboto,sans-serif]! text-[22px]! font-bold leading-[1.2] mt-0 mr-0 mb-[25px] ml-0 mb-[22px]! p-0 text-center w-full"
                    id="whishModalLabel"
                  >
                    Send Greetings
                  </h5>
                  <div
                    className="alert alert-success rounded-[10px]! text-[14px] mt-0! mr-0! mb-3! ml-0! py-(--bs-alert-padding-y) px-(--bs-alert-padding-x) relative bg-[#d1e7dd] text-[#0f5132] [border:var(--bs-alert-border)]"
                    style={{ display: "none" } as unknown as CSSProperties}
                    role="alert"
                    id="success_alert"
                  />
                  <div
                    className="alert alert-danger rounded-[10px]! text-[14px] mt-0! mr-0! mb-3! ml-0! py-(--bs-alert-padding-y) px-(--bs-alert-padding-x) relative bg-[#f8d7da] text-[#842029] [border:var(--bs-alert-border)]"
                    style={{ display: "none" } as unknown as CSSProperties}
                    role="alert"
                    id="error_alert"
                  />
                  <form id="whishForm">
                    <input
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[45px] m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      type="hidden"
                      name="_token"
                      defaultValue="IJ29EZpW8mIaTr2liEskdGdRRQlRUtEXlZGhhDMy"
                      autoComplete="off"
                    />{" "}
                    <input
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[45px] m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      type="hidden"
                      id="invitation_id"
                      name="invitation_id"
                      defaultValue="752"
                    />
                    <input
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[45px] m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      type="hidden"
                      id="invitation_url"
                      name="invitation_url"
                      defaultValue=""
                    />
                    <input
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[45px] m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
                      placeholder="Your Name *"
                    />
                    <input
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[45px] m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      type="text"
                      id="email"
                      name="email"
                      autoComplete="off"
                      placeholder="Your Email (optional)"
                    />
                    <textarea
                      className="appearance-none bg-none! [background-position:0%_0%]! [background-size:auto_auto]! [background-repeat:repeat]! [background-origin:padding-box]! [background-clip:border-box]! [background-attachment:scroll]! bg-[#ffffff14]! border! border-solid! border-[#ffffff33]! rounded-[10px]! box-border! text-white! block! text-[16px]! h-[110px]! m-0 mb-3! mt-[5px]! max-w-full! outline-none! py-3! px-3.5! resize-none touch-manipulation w-full! [font-family:inherit] [line-height:inherit] [transition:border-color_0.2s] focus:bg-none! focus:[background-position:0%_0%]! focus:[background-size:auto_auto]! focus:[background-repeat:repeat]! focus:[background-origin:padding-box]! focus:[background-clip:border-box]! focus:[background-attachment:scroll]! focus:bg-[#ffffff21]! focus:border-[#ffffff80]! placeholder:text-[#ffffff73]!"
                      id="message"
                      name="message"
                      cols={30}
                      rows={5}
                      placeholder="Write your heartfelt message..."
                    />
                    <button
                      className="[background:var(--ButtonColor,linear-gradient(135deg,#3b4e82,#2c3a66))]! border! border-solid! border-[#ffffff26]! rounded-[10px]! text-white! cursor-pointer inline-block text-[14px]! font-bold tracking-[1px] leading-[45px] mt-[5px] mr-0 mb-0 ml-0 mt-1! outline-0! py-0 px-5 relative uppercase duration-300 w-full [appearance:button] [border-image:none] [font-family:inherit]"
                      type="submit"
                      id="whishBtn"
                      aria-label="Submit"
                    >
                      Send Wish
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <section
            className="happycouples-wrapper relative text-center overflow-hidden overflow-x-hidden overflow-y-hidden max-[1024px]:w-full xl:overflow-visible xl:overflow-x-visible xl:overflow-y-visible"
            id="home"
          >
            <div className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#00000040] table h-full left-0 absolute top-0 w-full z-20 p-0 max-[520px]:h-screen max-[980px]:h-[600px] md:pt-0 md:pr-0 md:pb-[75px] md:pl-0 xl:pt-0 xl:pr-0 xl:pb-[140px] xl:pl-0">
              <span className="table-cell align-bottom w-full">
                <div>
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[2px] leading-[1.2] mt-0 mr-0 mb-2.5 ml-0 opacity-80 p-0 text-center uppercase w-full text-white">
                    we’re getting married
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium p-0 text-white text-[32px] leading-[38.4px] mt-0 mr-0 mb-[15px] ml-0 [text-shadow:rgba(0,0,0,0.6)_2px_4px_8px] md:text-[60px] md:leading-[72px] md:mt-0 md:mr-0 md:mb-[60px] md:ml-0">
                    <span className="inline align-baseline whitespace-nowrap w-auto">Prince</span>{" "}
                    &amp;{" "}
                    <span className="inline align-baseline whitespace-nowrap w-auto">Malavika</span>
                  </h1>
                </div>
                <div className="row flex flex-wrap justify-center! ml-[calc(-.5_*_var(--bs-gutter-x))] mr-[calc(-.5_*_var(--bs-gutter-x))] mt-[calc(-1_*_var(--bs-gutter-y))]">
                  <div className="shrink-0 mt-(--bs-gutter-y) max-w-full pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full min-[1200px]:flex-none min-[1200px]:w-1/2 min-[992px]:flex-none min-[992px]:w-2/3">
                    <div id="countdown2">
                      <ul className="block p-0 text-center w-full mt-5 mr-0 mb-[120px] ml-0 max-[980px]:text-center md:mt-5 md:mr-0 md:mb-0 md:ml-0 xl:m-0">
                        <li className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffff99] border-current rounded-[50%] border-none inline-block h-[120px] list-none relative w-[120px] my-0 mx-0.5 pt-[18px] pr-0 pb-0 pl-0 [backdrop-filter:blur(10px)] [border-image:none] [border-width:medium] max-[520px]:h-20 max-[520px]:w-20 md:my-0 md:mx-[5px] md:pt-6 md:pr-0 md:pb-0 md:pl-0 xl:my-0 xl:mx-2.5">
                          <span
                            className="inline-block font-semibold h-auto leading-[normal] text-center align-bottom w-full text-[#2d1205] text-[22px] md:text-[42px]"
                            id="days2"
                          >
                            {timeLeft.days}
                          </span>
                          <h6 className="font-[family-name:Roboto,sans-serif]! font-semibold tracking-[2px] m-0 opacity-80 p-0 text-center uppercase w-full text-[#2d1205] text-[11px] leading-[13.2px] md:text-[13px] md:leading-[15.6px]">
                            Days
                          </h6>
                        </li>
                        <li className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffff99] border-current rounded-[50%] border-none inline-block h-[120px] list-none relative w-[120px] my-0 mx-0.5 pt-[18px] pr-0 pb-0 pl-0 [backdrop-filter:blur(10px)] [border-image:none] [border-width:medium] max-[520px]:h-20 max-[520px]:w-20 md:my-0 md:mx-[5px] md:pt-6 md:pr-0 md:pb-0 md:pl-0 xl:my-0 xl:mx-2.5">
                          <span
                            className="inline-block font-semibold h-auto leading-[normal] text-center align-bottom w-full text-[#2d1205] text-[22px] md:text-[42px]"
                            id="hours2"
                          >
                            {timeLeft.hours}
                          </span>
                          <h6 className="font-[family-name:Roboto,sans-serif]! font-semibold tracking-[2px] m-0 opacity-80 p-0 text-center uppercase w-full text-[#2d1205] text-[11px] leading-[13.2px] md:text-[13px] md:leading-[15.6px]">
                            Hours
                          </h6>
                        </li>
                        <li className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffff99] border-current rounded-[50%] border-none inline-block h-[120px] list-none relative w-[120px] my-0 mx-0.5 pt-[18px] pr-0 pb-0 pl-0 [backdrop-filter:blur(10px)] [border-image:none] [border-width:medium] max-[520px]:h-20 max-[520px]:w-20 md:my-0 md:mx-[5px] md:pt-6 md:pr-0 md:pb-0 md:pl-0 xl:my-0 xl:mx-2.5">
                          <span
                            className="inline-block font-semibold h-auto leading-[normal] text-center align-bottom w-full text-[#2d1205] text-[22px] md:text-[42px]"
                            id="minutes2"
                          >
                            {timeLeft.minutes}
                          </span>
                          <h6 className="font-[family-name:Roboto,sans-serif]! font-semibold tracking-[2px] m-0 opacity-80 p-0 text-center uppercase w-full text-[#2d1205] text-[11px] leading-[13.2px] md:text-[13px] md:leading-[15.6px]">
                            Minutes
                          </h6>
                        </li>
                        <li className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#ffffff99] border-current rounded-[50%] border-none inline-block h-[120px] list-none relative w-[120px] my-0 mx-0.5 pt-[18px] pr-0 pb-0 pl-0 [backdrop-filter:blur(10px)] [border-image:none] [border-width:medium] max-[520px]:h-20 max-[520px]:w-20 md:my-0 md:mx-[5px] md:pt-6 md:pr-0 md:pb-0 md:pl-0 xl:my-0 xl:mx-2.5">
                          <span
                            className="inline-block font-semibold h-auto leading-[normal] text-center align-bottom w-full text-[#2d1205] text-[22px] md:text-[42px]"
                            id="seconds2"
                          >
                            {timeLeft.seconds}
                          </span>
                          <h6 className="font-[family-name:Roboto,sans-serif]! font-semibold tracking-[2px] m-0 opacity-80 p-0 text-center uppercase w-full text-[#2d1205] text-[11px] leading-[13.2px] md:text-[13px] md:leading-[15.6px]">
                            Seconds
                          </h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div className="relative" id="carouselExampleControls">
              <div className="carousel-inner overflow-hidden relative w-full">
                <div className="hidden float-left mr-[-100%] opacity-0 relative transform-none transition-transform duration-600 ease-in-out transition-opacity! w-full [backface-visibility:hidden] motion-reduce:transition-none">
                  <div>
                    <img
                      className="h-screen object-cover align-middle w-full max-[520px]:h-screen max-[520px]:pb-0 max-[980px]:h-[600px] max-[980px]:pb-0 max-w-none"
                      src="/site-assets/photos/photo-9.jpeg"
                      alt={"Prince & Malavika"}
                    />
                  </div>
                </div>
                <div className="hidden float-left mr-[-100%] opacity-0 relative transform-none transition-transform duration-600 ease-in-out transition-opacity! w-full [backface-visibility:hidden] motion-reduce:transition-none">
                  <div>
                    <img
                      className="h-screen object-cover align-middle w-full max-[520px]:h-screen max-[520px]:pb-0 max-[980px]:h-[600px] max-[980px]:pb-0 max-w-none"
                      src="/site-assets/photos/photo-1.jpeg"
                      alt={"Prince & Malavika"}
                    />
                  </div>
                </div>
                <div className="hidden float-left mr-[-100%] opacity-0 relative transform-none transition-transform duration-600 ease-in-out transition-opacity! w-full [backface-visibility:hidden] motion-reduce:transition-none">
                  <div>
                    <img
                      className="h-screen object-cover align-middle w-full max-[520px]:h-screen max-[520px]:pb-0 max-[980px]:h-[600px] max-[980px]:pb-0 max-w-none"
                      src="/site-assets/photos/photo-8.jpeg"
                      alt={"Prince & Malavika"}
                    />
                  </div>
                </div>
                <div className="block float-left mr-[-100%] opacity-100 relative transform-none transition-transform duration-600 ease-in-out transition-opacity! w-full z-1 [backface-visibility:hidden] motion-reduce:transition-none">
                  <div>
                    <img
                      className="h-screen object-cover align-middle w-full max-[520px]:h-screen max-[520px]:pb-0 max-[980px]:h-[600px] max-[980px]:pb-0 max-w-none"
                      src="/site-assets/photos/photo-2.jpeg"
                      alt={"Prince & Malavika"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <a
              className="scrollbar-icon bottom-5 text-site-import-accent h-[68px] left-1/2 ml-[-72px] outline-0! absolute underline duration-300 w-36 z-100 [background-size:144px_auto] hover:text-[#0a58ca]"
              href="#happycouples"
            />
          </section>
          <div>
            <section
              className="event-details-section text-center w-full mt-20 mr-0 mb-0 ml-0 overflow-hidden overflow-x-hidden overflow-y-hidden max-[1024px]:w-full md:mt-[120px] md:mr-0 md:mb-0 md:ml-0 xl:overflow-visible xl:overflow-x-visible xl:overflow-y-visible"
              id="happycouples"
            >
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="inline-block w-full mt-0 mr-0 mb-[45px] ml-0 xl:m-0">
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 p-0 text-center uppercase text-[#a8879c]">
                    happy couple
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-[#060644] text-[32px] md:text-[52px]">
                    Moments of Love
                  </h1>
                  <p className="mx-auto mt-6 max-w-[620px] px-4 text-[19px] italic leading-8 text-[#6d1a2b]">
                    “Love is the quiet promise to look in the same direction, together, for a
                    lifetime.”
                  </p>
                  <p className="mx-auto mt-5 max-w-[620px] px-4 text-[17px] italic leading-8 text-[#9c6f22]">
                    May the Almighty bless this union with a love that deepens, a joy that lasts and
                    a home full of laughter. Your presence and blessings will make our celebration
                    complete.
                  </p>
                </div>
                <div className="row flex flex-wrap justify-center! ml-[calc(-.5_*_var(--bs-gutter-x))] mr-[calc(-.5_*_var(--bs-gutter-x))] mt-[calc(-1_*_var(--bs-gutter-y))]">
                  <div className="col-lg-5 shrink-0 mt-(--bs-gutter-y) max-w-full w-full py-0! px-3! min-[992px]:flex-none min-[992px]:w-[41.6667%] xl:py-0! xl:px-12!">
                    <div className="propic rounded-[50%] inline-block h-[300px] mb-[45px] relative w-[300px]">
                      <img
                        className="rounded-[50%] h-full object-cover align-middle w-full max-w-none"
                        src="/site-assets/photos/photo-2.jpeg"
                        alt="A.J Prince"
                      />
                    </div>
                    <h4 className="font-[family-name:Roboto,sans-serif]! text-[24px] font-medium leading-[1.2] mt-0 mr-0 mb-2.5 ml-0 p-0 w-full text-[#060644]">
                      <SplitText text="A.J Prince" by="char" />
                    </h4>
                    <p className="text-[16px] leading-7 m-0 p-0 text-[#434343]">
                      <SplitText text="“A good heart, a steady hand, and a love that grows stronger with every passing day. He walks beside her with kindness, laughter and a promise to always stand by her side.”" />
                    </p>
                  </div>
                  <div className="shrink-0 mt-(--bs-gutter-y) max-w-full pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full hidden invisible min-[992px]:flex-none min-[992px]:w-1/6 xl:block xl:visible">
                    <img
                      className="mt-[60px] align-middle w-full max-w-none"
                      src="/site-assets/69507b2fce9033be.png"
                      alt=""
                    />
                  </div>
                  <div className="col-lg-5 shrink-0 max-w-full w-full mt-[45px] mr-0 mb-0 ml-0 pt-[18px]! pr-3! pb-0! pl-3! min-[992px]:flex-none min-[992px]:w-[41.6667%] xl:m-0 xl:py-0! xl:px-12!">
                    <div className="pg-couple-amp text-[52px] italic leading-none mt-0 mr-0 mb-[18px] ml-0 text-center text-[#060644] block! xl:hidden!">
                      &amp;
                    </div>
                    <div className="propic rounded-[50%] inline-block h-[300px] mb-[45px] relative w-[300px]">
                      <img
                        className="rounded-[50%] h-full object-cover align-middle w-full max-w-none"
                        src="/site-assets/photos/photo-4.jpeg"
                        alt="Malavika P Panayam"
                      />
                    </div>
                    <h4 className="font-[family-name:Roboto,sans-serif]! text-[24px] font-medium leading-[1.2] mt-0 mr-0 mb-2.5 ml-0 p-0 w-full text-[#060644]">
                      <SplitText text="Malavika P Panayam" by="char" />
                    </h4>
                    <p className="text-[16px] leading-7 m-0 p-0 text-[#434343]">
                      <SplitText text="“Where there is love there is home, and she carries it with her wherever she goes. With grace, warmth and a gentle smile, she turns every ordinary moment into something beautiful.”" />
                    </p>
                  </div>
                </div>
                <div className="row flex flex-wrap justify-center! ml-[calc(-.5_*_var(--bs-gutter-x))] mr-[calc(-.5_*_var(--bs-gutter-x))] mt-[calc(-1_*_var(--bs-gutter-y))]">
                  <div className="shrink-0 mt-(--bs-gutter-y) max-w-full pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full hidden invisible min-[992px]:flex-none min-[992px]:w-1/6 xl:block xl:visible">
                    <a
                      className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-(--ButtonColor) rounded-[25px] block text-[15px] leading-[45px] mt-[-45px] mr-0 mb-0 ml-0 outline-0! p-0 no-underline uppercase duration-300 w-full text-white hover:bg-none hover:[background-position:0%_0%] hover:[background-size:auto_auto] hover:[background-repeat:repeat] hover:[background-origin:padding-box] hover:[background-clip:border-box] hover:[background-attachment:scroll] hover:bg-(--headingColor) hover:text-(--WhiteColor)"
                      href="#rsvp"
                    >
                      RSVP
                    </a>
                  </div>
                </div>
              </div>
              <style>{`
.scrollingtext-wrap{-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.k-marquee-text>span:not(#x){font-size:44px!important;line-height:60px!important;letter-spacing:.16em!important;padding-right:96px!important;margin-top:0!important;background-image:linear-gradient(100deg,#2b3358 0%,#6b4a78 55%,#a8879c 100%)!important;filter:none!important}
.k-marquee-text .k-mq-pill{width:12px!important;height:12px!important;top:50%!important;right:42px!important;margin-top:-6px;border-radius:2px!important;background:#c9a96a!important;box-shadow:0 0 0 5px #fbf6ea,0 0 0 6px #c9a96a99!important;transform:rotate(45deg)}
.k-marquee-text .k-mq-pill i{display:none!important}
@media(min-width:768px){.k-marquee-text>span:not(#x){font-size:76px!important;line-height:100px!important;padding-right:150px!important}.k-marquee-text .k-mq-pill{right:64px!important;width:14px!important;height:14px!important;margin-top:-7px}}
`}</style>
              <div className="scrollingtext-wrap flex left-0 overflow-hidden p-0! whitespace-nowrap w-full mt-[45px] mr-0 mb-0 ml-0 md:mt-[100px] md:mr-0 md:mb-0 md:ml-0">
                <div className="text text-[14px]! [text-transform:inherit]! k-marquee-text">
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Wedding Celebration{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-ring" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Joyful Union{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-heart" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Prince{" "}
                    <ImportedFont className="relative top-[-15px] text-[45px] max-[520px]:-top-1.5 md:text-[80px]">
                      ❤️
                    </ImportedFont>{" "}
                    Malavika{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-star" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    With Love &amp; Blessings{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-spa" />
                    </span>
                  </span>
                </div>
                <div className="text text-[14px]! [text-transform:inherit]! k-marquee-text">
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Wedding Celebration{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-ring" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Joyful Union{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-heart" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    Prince{" "}
                    <ImportedFont className="relative top-[-15px] text-[45px] max-[520px]:-top-1.5 md:text-[80px]">
                      ❤️
                    </ImportedFont>{" "}
                    Malavika{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-star" />
                    </span>
                  </span>
                  <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                    With Love &amp; Blessings{" "}
                    <span className="k-mq-pill">
                      <i className="fas fa-spa" />
                    </span>
                  </span>
                </div>
              </div>
              <a
                className="outline-0! no-underline duration-300 text-site-import-foreground hover:no-underline hover:[color:inherit]"
                id="ourstory"
              />
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="w-full mt-20 mr-0 mb-0 ml-0 md:mt-[100px] md:mr-0 md:mb-0 md:ml-0">
                  <div className="inline-block w-full mt-0 mr-0 mb-[45px] ml-0 xl:mt-0 xl:mr-0 xl:mb-5 xl:ml-0">
                    <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 -mb-1.5! p-0 relative text-center uppercase text-[#a8879c]">
                      our families
                    </h6>
                    <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-[#060644] text-[32px] md:text-[52px]">
                      With Family Blessings
                    </h1>
                  </div>
                  <ol className="k-timeline">
                    {[
                      {
                        img: "/site-assets/photos/photo-2.jpeg",
                        year: "Groom",
                        date: "A.J Prince",
                        title: "The Groom's Family",
                        icon: "fa-home",
                        text: "Son of Late Sri. S. Ashokan and Smt. S. Jaya. Grandson of Late Sri. V.K Jayasenan and Smt. K Subhaga (Jaya Medicals, Adoor) and Late Sri. S Sivadasan and Late Smt. G Sairanthry (Janatha Printers, Varkala). “A good heart, a steady hand, and a love that grows stronger with every passing day. He walks beside her with kindness, laughter and a promise to always stand by her side.”",
                      },
                      {
                        img: "/site-assets/photos/photo-4.jpeg",
                        year: "Bride",
                        date: "Malavika P Panayam",
                        title: "The Bride's Family",
                        icon: "fa-heart",
                        text: "Daughter of Sri. R.B. Pramode Panayam and Smt. Kala Rani T.S. “Where there is love there is home, and she carries it with her wherever she goes. With grace, warmth and a gentle smile, she turns every ordinary moment into something beautiful.”",
                      },
                    ].map((m) => (
                      <li key={m.title} className="k-tl-item">
                        <span className="k-tl-dot">
                          <i className={`fas ${m.icon}`} />
                        </span>
                        <div className="k-tl-card">
                          <img src={m.img} alt={m.title} className="k-tl-photo" />
                          <div className="k-tl-body">
                            <div className="k-tl-meta">
                              <span className="k-tl-year">{m.year}</span>
                              <span className="k-tl-date">{m.date}</span>
                            </div>
                            <h4 className="k-tl-title">{m.title}</h4>
                            <p className="k-tl-text">{m.text}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
            <section className="bigday-wrapper bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-(--PrimaryColor) py-20 px-0 relative w-full z-100 mt-[100px] mr-0 mb-0 ml-0 md:mt-[140px] md:mr-0 md:mb-0 md:ml-0">
              <a
                className="outline-0! no-underline duration-300 text-site-import-foreground hover:no-underline hover:[color:inherit]"
                id="whenandwhere"
              />
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="inline-block mb-10 w-full">
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 opacity-80 p-0 text-center uppercase text-white">
                    when &amp; where
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-white text-[32px] md:text-[52px]">
                    The Big Day
                  </h1>
                </div>
                <style>{`
.k-ev-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;max-width:1000px;margin:0 auto;padding:0 12px}
.k-ev-card{position:relative;margin-top:64px;padding:0 26px 30px;border-radius:28px;background:linear-gradient(160deg,#2b3358,#1a2040);border:1px solid rgba(243,217,164,.35);box-shadow:0 14px 34px rgba(26,32,64,.28);color:#fff;text-align:center;transition:transform .3s}
.k-ev-card:hover{transform:translateY(-4px)}
.k-ev-icon{display:block;width:128px;height:128px;margin:-64px auto 16px;border-radius:50%;object-fit:cover;background:#fff;border:3px solid #f3d9a4;box-shadow:0 0 0 6px rgba(243,217,164,.15)}
.k-ev-tag{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e66dba}
.k-ev-title{margin:6px 0 16px!important;font-family:'Instrument Serif',serif!important;font-size:32px!important;font-weight:400!important;line-height:1.1!important;color:#fff!important;text-align:center!important}
.k-ev-date{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px}
.k-ev-day{font-family:'Instrument Serif',serif;font-size:68px;line-height:1;color:#f3d9a4}
.k-ev-month{text-align:left;font-size:12px;letter-spacing:2px;line-height:1.7;text-transform:uppercase;color:#ffffffcc}
.k-ev-month b{display:block;font-size:15px;letter-spacing:3px;color:#fff;font-weight:600}
.k-ev-time{display:inline-block;margin-bottom:18px;padding:6px 16px;border:1px solid rgba(243,217,164,.5);border-radius:20px;font-size:13px;font-weight:600;color:#f3d9a4}
.k-ev-info{margin:0 0 20px;font-size:14px;line-height:1.7;color:#ffffffcc}
.k-ev-info i{margin-right:8px;color:#f3d9a4}
.k-ev-info a{color:inherit;text-decoration:none}
.k-ev-info svg{display:inline-block;margin-right:8px;vertical-align:-2px;color:#f3d9a4}
.k-ev-loc>svg:first-child{display:block;margin:0 auto 6px}
.k-ev-time svg{margin-right:4px;vertical-align:-2px}
.k-ev-btn{display:inline-block;padding:0 24px;border-radius:20px;background:#f3d9a4;color:#1a2040;font-size:14px;font-weight:600;line-height:40px;text-decoration:none;transition:all .3s}
.k-ev-btn:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(0,0,0,.25)}
.k-ev-cal{margin-top:18px;padding-top:14px;border-top:1px dashed rgba(243,217,164,.3);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ffffffa0}
.k-ev-cal a{margin:0 6px;color:#f3d9a4;text-decoration:underline;text-underline-offset:3px}
.k-ev-card.k-pre{opacity:0;transform:translateY(50px) scale(.96);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)}
.k-ev-card.k-pre.k-in{opacity:1;transform:none}
.k-ev-card.k-pre.k-in:hover{transform:translateY(-4px)}
.k-ev-icon{animation:k-ev-float 4s ease-in-out infinite}
.k-ev-card:nth-child(2) .k-ev-icon{animation-delay:-2s}
.k-ev-card.k-in .k-ev-day{animation:k-ev-pop .8s cubic-bezier(.2,.9,.3,1.4) .35s both}
.k-ev-card.k-in .k-ev-time{animation:k-ev-fade .7s ease .6s both}
.k-ev-btn{position:relative;overflow:hidden}
.k-ev-btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);animation:k-ev-shine 3.5s ease-in-out infinite}
@keyframes k-ev-float{0%,100%{transform:translateY(0);box-shadow:0 0 0 6px rgba(243,217,164,.15)}50%{transform:translateY(-6px);box-shadow:0 0 0 12px rgba(243,217,164,.06)}}
@keyframes k-ev-pop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
@keyframes k-ev-fade{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}
@keyframes k-ev-shine{0%,60%{left:-60%}100%{left:130%}}
@media(prefers-reduced-motion:reduce){.k-ev-card.k-pre{opacity:1;transform:none;transition:none}.k-ev-icon,.k-ev-btn::after,.k-ev-card .k-ev-day,.k-ev-card .k-ev-time{animation:none!important}}
@media(max-width:820px){.k-ev-grid{grid-template-columns:1fr}}
`}</style>
                <div className="k-ev-grid">
                  {BIGDAY_CARDS.map((c) => (
                    <div key={c.key} className="k-ev-card">
                      <img className="k-ev-icon" src={c.icon} alt={c.title} />
                      <div className="k-ev-tag">{c.tag}</div>
                      <h4 className="k-ev-title">{c.title}</h4>
                      <div className="k-ev-date">
                        <span className="k-ev-day">{c.day}</span>
                        <span className="k-ev-month">
                          <b>{c.month}</b>
                          {c.weekday}
                        </span>
                      </div>
                      <div className="k-ev-time">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>{" "}
                        {c.time}
                      </div>
                      {c.notes.map((n) => (
                        <p key={n} className="k-ev-info" style={{ margin: "0 0 8px" }}>
                          {n}
                        </p>
                      ))}
                      <p className="k-ev-info k-ev-loc">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.800 12 21 12 21z" />
                          <circle cx="12" cy="9.5" r="2.5" />
                        </svg>
                        {c.event.location}
                        <br />
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                        </svg>
                        <a href={`tel:+91${CONTACT_PHONE}`}>+91 {CONTACT_PHONE}</a>
                      </p>
                      <a
                        className="k-ev-btn"
                        href={c.event.map}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Location
                      </a>
                      <div className="k-ev-cal">
                        Add to calendar
                        <br />
                        <a href={googleCalendarUrl(c.event)} target="_blank" rel="noreferrer">
                          Google
                        </a>
                        ·
                        <a href={icsUrl(c.event)} download={`${c.key}.ics`}>
                          Apple / Outlook
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="bigdaybottom-wrapper bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-(--ButtonColor) pt-[70px] pr-0 pb-[60px] pl-0 relative w-full">
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <style>{`
.k-qa-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;max-width:900px;margin:0 auto;padding:0 12px}
.k-qa-item{display:block;padding:26px 14px 22px;border-radius:24px;background:linear-gradient(160deg,#2b3358,#1a2040);border:1px solid rgba(243,217,164,.35);box-shadow:0 12px 28px rgba(10,14,36,.35);text-align:center;text-decoration:none;color:#fff;transition:transform .3s,box-shadow .3s,border-color .3s}
.k-qa-item:hover{transform:translateY(-6px);border-color:#f3d9a4;box-shadow:0 18px 36px rgba(10,14,36,.5),0 0 22px rgba(243,217,164,.18)}
.k-qa-ico{position:relative;display:flex;align-items:center;justify-content:center;width:96px;height:96px;margin:0 auto 14px;border-radius:50%;background:radial-gradient(circle,rgba(243,217,164,.18),rgba(243,217,164,0) 70%);animation:k-qa-float 4s ease-in-out infinite}
.k-qa-item:nth-child(2) .k-qa-ico{animation-delay:-1s}
.k-qa-item:nth-child(3) .k-qa-ico{animation-delay:-2s}
.k-qa-item:nth-child(4) .k-qa-ico{animation-delay:-3s}
.k-qa-glyph{display:block;width:62px;height:62px;background:linear-gradient(135deg,#fff3d6 0%,#f3d9a4 40%,#e66dba 100%);-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;transition:transform .3s}
.k-qa-item:hover .k-qa-glyph{transform:scale(1.15) rotate(-4deg)}
.k-qa-live::before{content:"";position:absolute;inset:6px;border-radius:50%;border:2px solid rgba(243,217,164,.5);animation:k-qa-pulse 2s ease-out infinite}
.k-qa-label{margin:0!important;font-family:Roboto,sans-serif!important;font-size:15px!important;font-weight:500!important;letter-spacing:1.5px;text-transform:uppercase;color:#fff!important;transition:color .3s}
.k-qa-item:hover .k-qa-label{color:#f3d9a4!important}
.k-qa-cap{margin-top:6px;font-size:12px;color:#ffffffa0}
.k-qa-item.k-pre{opacity:0;transform:translateY(40px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.k-qa-item.k-pre.k-in{opacity:1;transform:none}
.k-qa-item.k-pre.k-in:hover{transform:translateY(-6px)}
@keyframes k-qa-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes k-qa-pulse{0%{transform:scale(.85);opacity:.9}100%{transform:scale(1.3);opacity:0}}
@media(prefers-reduced-motion:reduce){.k-qa-item.k-pre{opacity:1;transform:none;transition:none}.k-qa-ico,.k-qa-live::before{animation:none!important}}
@media(max-width:820px){.k-qa-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.k-qa-item:last-child:nth-child(odd){grid-column:1/-1}.k-qa-ico{width:80px;height:80px}.k-qa-glyph{width:52px;height:52px}.k-qa-label{font-size:13px!important}}
`}</style>
                <div className="k-qa-grid">
                  {[
                    {
                      label: "Invitation Card",
                      cap: "View the e-invite",
                      img: "/site-assets/fb4a36cf4e187cb2.png",
                      href: "#",
                      target: "#wedding-invitation",
                    },
                    {
                      label: "Send Greetings",
                      cap: "Leave a blessing",
                      img: "/site-assets/8e0489cad50e3ac8.png",
                      href: "#",
                      target: "#whishModal",
                    },
                    {
                      label: "RSVP",
                      cap: "Confirm attendance",
                      img: "/site-assets/70f36d4b07131e54.png",
                      href: "#rsvp",
                    },
                  ].map((a) => (
                    <a
                      key={a.label}
                      className="k-qa-item"
                      aria-label={a.label}
                      href={a.href}
                      {...(a.target ? { "data-bs-target": a.target } : {})}
                    >
                      <span className="k-qa-ico">
                        <span
                          className="k-qa-glyph"
                          style={{ WebkitMaskImage: `url(${a.img})`, maskImage: `url(${a.img})` }}
                        />
                      </span>
                      <h6 className="k-qa-label">{a.label}</h6>
                      <div className="k-qa-cap">{a.cap}</div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
            {/* Gallery */}
            <section
              className="mt-20 mr-0 mb-0 ml-0 overflow-hidden overflow-x-hidden overflow-y-hidden max-[1024px]:w-full md:mt-[120px] md:mr-0 md:mb-0 md:ml-0 xl:overflow-visible xl:overflow-x-visible xl:overflow-y-visible"
              id="gallery"
            >
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="inline-block mb-[45px] w-full">
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 p-0 text-center uppercase text-[#a8879c]">
                    Gallery
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-[#060644] text-[32px] md:text-[52px]">
                    Our Moments
                  </h1>
                </div>
                <article id="content">
                  <div className="my-0 mx-auto overflow-hidden w-full">
                    <style>{`
.k-gl-wrap{max-width:1100px;margin:0 auto;padding:0 12px}
.k-gl-frame{position:relative;perspective:1400px}
.k-gl-frame::before{content:"";position:absolute;inset:8% 4% -4%;z-index:0;border-radius:40px;background:radial-gradient(60% 60% at 30% 40%,rgba(230,109,186,.55),transparent 70%),radial-gradient(60% 60% at 75% 60%,rgba(243,217,164,.6),transparent 70%);filter:blur(46px);opacity:.75}
.k-gl-stage{position:relative;z-index:1;height:560px;border-radius:30px;overflow:hidden;background:#1a2040;box-shadow:0 26px 60px rgba(26,32,64,.38);cursor:zoom-in;transform:rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));transition:transform .25s ease-out;will-change:transform}
.k-gl-corners{position:absolute;inset:14px;z-index:3;pointer-events:none;border-radius:20px;background:linear-gradient(#f3d9a4,#f3d9a4) top left/26px 2px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) top left/2px 26px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) top right/26px 2px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) top right/2px 26px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) bottom left/26px 2px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) bottom left/2px 26px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) bottom right/26px 2px no-repeat,linear-gradient(#f3d9a4,#f3d9a4) bottom right/2px 26px no-repeat;opacity:.8}
.k-gl-badge{position:absolute;z-index:4;top:28px;left:28px;display:flex;align-items:center;gap:10px;padding:8px 18px 8px 14px;border-radius:30px;background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3);color:#fff;font-family:var(--heading-font);font-size:22px;line-height:1}
.k-gl-badge i{font-size:13px;color:#ff9ccf;animation:k-gl-beat 1.6s ease-in-out infinite}
@keyframes k-gl-beat{0%,100%{transform:scale(1)}40%{transform:scale(1.35)}}
.k-gl-slide{position:absolute;inset:0;opacity:0;transition:opacity 1s ease}
.k-gl-slide.on{opacity:1}
.k-gl-bg{position:absolute;inset:-30px;width:calc(100% + 60px)!important;height:calc(100% + 60px)!important;max-width:none!important;object-fit:cover;filter:blur(28px) brightness(.55) saturate(1.2)}
.k-gl-fg{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain;padding:22px;transform:scale(1);transition:transform 6s ease-out}
.k-gl-slide.on .k-gl-fg{transform:scale(1.06)}
.k-gl-stage::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(26,32,64,.25),transparent 25%,transparent 70%,rgba(26,32,64,.55))}
.k-gl-count{position:absolute;z-index:3;left:26px;bottom:22px;color:#fff;font-family:'Instrument Serif',serif;font-size:34px;line-height:1}
.k-gl-count small{font-size:14px;letter-spacing:2px;opacity:.7;margin-left:6px;font-family:Roboto,sans-serif}
.k-gl-arrow{display:flex;align-items:center;justify-content:center;padding:0;position:absolute;z-index:3;bottom:18px;width:46px;height:46px;border:0;border-radius:50%;background:rgba(255,255,255,.16);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-size:15px;cursor:pointer;transition:all .3s}
.k-gl-arrow:hover{background:#f3d9a4;color:#1a2040}
.k-gl-prev{right:84px}.k-gl-next{right:26px}
.k-gl-bar{position:absolute;z-index:3;left:0;bottom:0;height:3px;background:linear-gradient(90deg,#f3d9a4,#e66dba);animation:k-gl-prog 5s linear}
@keyframes k-gl-prog{from{width:0}to{width:100%}}
.k-gl-thumbs{display:flex;justify-content:center;gap:12px;margin-top:16px;overflow-x:auto;padding:6px 4px 10px;scrollbar-width:none}
.k-gl-thumbs::-webkit-scrollbar{display:none}
.k-gl-th{flex:0 0 96px;height:78px;padding:0;border:2px solid transparent;border-radius:16px;overflow:hidden;cursor:pointer;opacity:.55;background:none;transition:all .35s}
.k-gl-th img{width:100%;height:100%;object-fit:cover;display:block;max-width:none}
.k-gl-th:hover{opacity:.9;transform:translateY(-3px)}
.k-gl-th.on{opacity:1;border-color:#e66dba;box-shadow:0 8px 18px rgba(230,109,186,.35);transform:translateY(-3px)}
@media(prefers-reduced-motion:reduce){.k-gl-slide{transition:none}.k-gl-fg,.k-gl-bar,.k-gl-badge i{animation:none;transition:none}.k-gl-stage{transform:none!important}}
@media(max-width:700px){.k-gl-thumbs{justify-content:flex-start}.k-gl-badge{top:18px;left:18px;font-size:18px;padding:6px 14px 6px 11px}.k-gl-corners{inset:10px}.k-gl-stage{height:400px;border-radius:22px}.k-gl-fg{padding:12px}.k-gl-count{left:18px;bottom:16px;font-size:26px}.k-gl-arrow{width:40px;height:40px;bottom:14px}.k-gl-prev{right:66px}.k-gl-next{right:18px}.k-gl-th{flex-basis:72px;height:60px;border-radius:12px}}
.k-lb{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(10,14,36,.92);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:k-lb-in .3s ease}
.k-lb img{max-width:92vw;max-height:86vh;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);object-fit:contain}
.k-lb button{display:flex;align-items:center;justify-content:center;padding:0;position:absolute;border:0;border-radius:50%;width:46px;height:46px;background:rgba(255,255,255,.14);color:#fff;font-size:18px;cursor:pointer;transition:background .3s}
.k-lb button:hover{background:#f3d9a4;color:#1a2040}
.k-lb-x{top:18px;right:18px}.k-lb-p{left:18px;top:50%;margin-top:-23px}.k-lb-n{right:18px;top:50%;margin-top:-23px}
.k-lb-c{position:absolute;bottom:20px;left:0;right:0;text-align:center;color:#ffffffb0;font-size:13px;letter-spacing:2px}
@keyframes k-lb-in{from{opacity:0}to{opacity:1}}
`}</style>
                    <div className="k-gl-wrap">
                      <div className="k-gl-frame">
                        <div
                          className="k-gl-stage"
                          onClick={() => setLightbox(galIdx)}
                          onMouseEnter={() => setGalPause(true)}
                          onMouseLeave={(e) => {
                            setGalPause(false);
                            e.currentTarget.style.setProperty("--tx", "0deg");
                            e.currentTarget.style.setProperty("--ty", "0deg");
                          }}
                          onMouseMove={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty(
                              "--ty",
                              `${((e.clientX - r.left) / r.width - 0.5) * 5}deg`,
                            );
                            e.currentTarget.style.setProperty(
                              "--tx",
                              `${-((e.clientY - r.top) / r.height - 0.5) * 4}deg`,
                            );
                          }}
                          onTouchStart={(e) => {
                            galTouch.current = e.touches[0]!.clientX;
                          }}
                          onTouchEnd={(e) => {
                            const dx = e.changedTouches[0]!.clientX - galTouch.current;
                            if (Math.abs(dx) > 50)
                              setGalIdx(
                                (galIdx + (dx < 0 ? 1 : GALLERY_PHOTOS.length - 1)) %
                                  GALLERY_PHOTOS.length,
                              );
                          }}
                        >
                          <div className="k-gl-corners" />
                          <div className="k-gl-badge">
                            <i className="fas fa-heart" />
                            Prince &amp; Malavika
                          </div>
                          {GALLERY_PHOTOS.map((g, i) => (
                            <div key={g.src} className={`k-gl-slide${i === galIdx ? " on" : ""}`}>
                              <img className="k-gl-bg" src={g.src} alt="" />
                              <img
                                className="k-gl-fg"
                                src={g.src}
                                alt={`Gallery photo ${i + 1}`}
                                loading={i === 0 ? "eager" : "lazy"}
                              />
                            </div>
                          ))}
                          <div className="k-gl-count">
                            {String(galIdx + 1).padStart(2, "0")}
                            <small>/ {String(GALLERY_PHOTOS.length).padStart(2, "0")}</small>
                          </div>
                          <button
                            className="k-gl-arrow k-gl-prev"
                            aria-label="Previous photo"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGalIdx(
                                (galIdx + GALLERY_PHOTOS.length - 1) % GALLERY_PHOTOS.length,
                              );
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m15 5-7 7 7 7" />
                            </svg>
                          </button>
                          <button
                            className="k-gl-arrow k-gl-next"
                            aria-label="Next photo"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGalIdx((galIdx + 1) % GALLERY_PHOTOS.length);
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m9 5 7 7-7 7" />
                            </svg>
                          </button>
                          <div
                            key={galIdx}
                            className="k-gl-bar"
                            style={{ animationPlayState: galPause ? "paused" : "running" }}
                          />
                        </div>
                      </div>
                      <div className="k-gl-thumbs">
                        {GALLERY_PHOTOS.map((g, i) => (
                          <button
                            key={g.src}
                            className={`k-gl-th${i === galIdx ? " on" : ""}`}
                            aria-label={`Show photo ${i + 1}`}
                            onClick={() => setGalIdx(i)}
                          >
                            <img src={g.src} alt="" />
                          </button>
                        ))}
                      </div>
                    </div>
                    {lightbox !== null && (
                      <div className="k-lb" onClick={() => setLightbox(null)}>
                        <img
                          src={GALLERY_PHOTOS[lightbox]!.src}
                          alt=""
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          className="k-lb-x"
                          aria-label="Close"
                          onClick={() => setLightbox(null)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                        <button
                          className="k-lb-p"
                          aria-label="Previous"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightbox(
                              (lightbox + GALLERY_PHOTOS.length - 1) % GALLERY_PHOTOS.length,
                            );
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m15 5-7 7 7 7" />
                          </svg>
                        </button>
                        <button
                          className="k-lb-n"
                          aria-label="Next"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightbox((lightbox + 1) % GALLERY_PHOTOS.length);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m9 5 7 7-7 7" />
                          </svg>
                        </button>
                        <div className="k-lb-c">
                          {lightbox + 1} / {GALLERY_PHOTOS.length}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </section>
            {/* Videos */}
            <section
              className="relative w-full z-10 mt-20 mr-0 mb-0 ml-0 overflow-hidden overflow-x-hidden overflow-y-hidden md:mt-[100px] md:mr-0 md:mb-0 md:ml-0 xl:overflow-visible xl:overflow-x-visible xl:overflow-y-visible"
              id="video"
            >
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="inline-block mb-[45px] w-full">
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 p-0 text-center uppercase text-[#a8879c]">
                    our videos
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-[#060644] text-[32px] md:text-[52px]">
                    Our Highlights
                  </h1>
                </div>
                <div className="row flex flex-wrap justify-center! ml-[calc(-.5_*_var(--bs-gutter-x))] mr-[calc(-.5_*_var(--bs-gutter-x))] mt-[calc(-1_*_var(--bs-gutter-y))]">
                  <div className="flex-none mb-6! mt-(--bs-gutter-y) max-w-full pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full min-[768px]:flex-none min-[768px]:w-5/6 min-[992px]:flex-none min-[992px]:w-2/3">
                    <div className="bg-none [background-position:0%_0%] [background-size:auto_auto] [background-repeat:repeat] [background-origin:padding-box] [background-clip:border-box] [background-attachment:scroll] bg-[#1a1a2e] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden pt-[56.25%] relative w-full">
                      <img
                        className="border-0 h-auto! inset-0 max-w-full absolute align-middle w-[936px]"
                        id="ytPlayer"
                        alt="Prince and Malavika"
                        src="/site-assets/photos/photo-6.jpeg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className="rsvp-section-con mt-20 mr-0 mb-0 ml-0 overflow-hidden overflow-x-hidden overflow-y-hidden max-[1024px]:w-full md:mt-[120px] md:mr-0 md:mb-0 md:ml-0 xl:overflow-visible xl:overflow-x-visible xl:overflow-y-visible"
              id="rsvp"
            >
              <div className="container ml-auto mr-auto max-w-[1440px]! pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full">
                <div className="inline-block mb-[45px] w-full">
                  <h6 className="font-[family-name:Roboto,sans-serif]! text-[14px] font-medium tracking-[4px] leading-[1.2] mt-0 mr-0 mb-1.5 ml-0 p-0 text-center uppercase text-[#a8879c]">
                    RSVP
                  </h6>
                  <h1 className="font-[family-name:var(--heading-font)]! font-medium leading-[52px] m-0 p-0 relative text-center w-full text-[#060644] text-[32px] md:text-[52px]">
                    Will You Join Us?
                  </h1>
                </div>
                <div className="row rsvp-bg flex flex-wrap justify-center! ml-[calc(-.5_*_var(--bs-gutter-x))] mr-[calc(-.5_*_var(--bs-gutter-x))] mt-[calc(-1_*_var(--bs-gutter-y))] relative! max-[1024px]:bg-none! max-[1024px]:[background-position:0%_0%]! max-[1024px]:[background-size:auto_auto]! max-[1024px]:[background-repeat:repeat]! max-[1024px]:[background-origin:padding-box]! max-[1024px]:[background-clip:border-box]! max-[1024px]:[background-attachment:scroll]! max-[1024px]:bg-transparent!">
                  <div className="shrink-0 mt-(--bs-gutter-y) max-w-full pl-[calc(var(--bs-gutter-x)_*_.5)] pr-[calc(var(--bs-gutter-x)_*_.5)] w-full min-[1200px]:flex-none min-[1200px]:w-[50%] min-[992px]:flex-none min-[992px]:w-[60%]">
                    <RsvpForm />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="scrollingtext-wrap flex left-0 overflow-hidden p-0! whitespace-nowrap w-full mt-[45px]! mr-0! mb-[90px]! ml-0! max-[1024px]:overflow-hidden max-[1024px]:w-full md:mt-[100px]! md:mr-0! md:mb-[120px]! md:ml-0!">
            <div className="text text-[14px]! [text-transform:inherit]! k-marquee-text">
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Wedding{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-ring" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Love{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-heart" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Happiness{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-star" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Forever{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-spa" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Memories{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-spa" />
                </span>
              </span>
            </div>
            <div className="text text-[14px]! [text-transform:inherit]! k-marquee-text">
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Wedding{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-ring" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Love{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-heart" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Happiness{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-star" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Forever{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-spa" />
                </span>
              </span>
              <span className="inline-block font-[family-name:var(--headingfont)]! font-bold h-auto mt-2.5 mr-0 mb-0 ml-0 relative uppercase w-auto text-[#060644] text-[60px] leading-[60px] pt-0 pr-[130px] pb-0 pl-0 [-webkit-text-stroke-color:var(--BlueColor)] [-webkit-text-stroke-width:2px] md:text-[120px] md:leading-[100px] md:pt-0 md:pr-[190px] md:pb-0 md:pl-0">
                Memories{" "}
                <span className="k-mq-pill">
                  <i className="fas fa-spa" />
                </span>
              </span>
            </div>
          </div>
          <footer className="k-footer">
            <style>{`
.k-footer{position:relative;margin-top:80px!important;padding:72px 20px 0!important;background:radial-gradient(60% 55% at 50% 22%,rgba(243,217,164,.14),transparent 70%),linear-gradient(180deg,#2b3358 0%,#1a2040 100%)!important}
.k-ft-top{position:absolute;left:50%;top:-24px;width:48px;height:48px;margin-left:-24px;border:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#f3d9a4;color:#1a2040;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.25);transition:transform .3s,box-shadow .3s}
.k-ft-top:hover{transform:translateY(-4px);box-shadow:0 14px 26px rgba(0,0,0,.35)}
.k-ft-photo{position:relative;width:132px;height:132px;margin:0 auto 22px}
.k-ft-photo img{position:relative;z-index:1;width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center 25%;border:3px solid #f3d9a4;box-shadow:0 12px 28px rgba(0,0,0,.35)}
.k-ft-photo::before{content:"";position:absolute;inset:-12px;border-radius:50%;border:1px dashed rgba(243,217,164,.55);animation:k-ft-spin 30s linear infinite}
.k-ft-photo span{position:absolute;z-index:2;right:-4px;bottom:4px;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f3d9a4,#e66dba);color:#1a2040}
@keyframes k-ft-spin{to{transform:rotate(360deg)}}
.k-ft-cta-row{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-bottom:30px}
.k-ft-btn{display:inline-block;padding:0 28px;border-radius:30px;font-size:14px;font-weight:600;line-height:44px;text-decoration:none;transition:transform .3s,box-shadow .3s,background .3s,color .3s}
.k-ft-btn.fill{background:linear-gradient(135deg,#f3d9a4,#e9b9cf);color:#1a2040}
.k-ft-btn.line{border:1px solid rgba(243,217,164,.6);color:#f3d9a4}
.k-ft-btn:hover{transform:translateY(-3px)}
.k-ft-btn.fill:hover{box-shadow:0 12px 24px rgba(243,217,164,.3)}
.k-ft-btn.line:hover{background:rgba(243,217,164,.12)}
.k-ft-orn{display:flex;align-items:center;justify-content:center;gap:14px;max-width:320px;margin:0 auto 24px;color:#f3d9a4}
.k-ft-orn::before,.k-ft-orn::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(243,217,164,.55))}
.k-ft-orn::after{transform:scaleX(-1)}
.k-ft-orn span{width:7px;height:7px;background:#f3d9a4;transform:rotate(45deg)}
.k-footer-links{gap:8px 0!important}
.k-footer-links a{position:relative;border-bottom:0!important;padding:2px 0!important}
.k-footer-links a+a{margin-left:22px}
.k-footer-links a+a::before{content:"";position:absolute;left:-12px;top:50%;width:3px;height:3px;margin-top:-1.5px;border-radius:50%;background:rgba(243,217,164,.6)}
.k-footer-links a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:#f3d9a4;transform:scaleX(0);transform-origin:left;transition:transform .35s}
.k-footer-links a:hover::after{transform:scaleX(1)}
.k-ft-inner.k-pre{opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.8,.2,1)}
.k-ft-inner.k-pre.k-in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.k-ft-inner.k-pre{opacity:1;transform:none;transition:none}.k-ft-photo::before{animation:none}}
@media(max-width:576px){`}</style>
            <button
              className="k-ft-top"
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 14 6-6 6 6" />
              </svg>
            </button>
            <div className="k-ft-inner">
              <div className="k-ft-photo">
                <img src={GALLERY_PHOTOS[0]!.src} alt="Prince and Malavika" />
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 5 6.3 5c2 0 3.7 1 5.7 3.2C14 6 15.7 5 17.7 5 21 5 23.2 8.2 21.6 11.8 19.5 16.4 12 21 12 21z" />
                  </svg>
                </span>
              </div>
              <div className="k-footer-word">Prince &amp; Malavika</div>
              <p className="k-footer-sub">29 · 01 · 2027 &nbsp;—&nbsp; Kalluvathukkal, Kollam</p>
              <div className="k-ft-orn">
                <span />
              </div>
              <div className="k-footer-links">
                <a href="#ourstory">Families</a>
                <a href="#whenandwhere">When &amp; Where</a>
                <a href="#gallery">Gallery</a>
                <a href="#rsvp">RSVP</a>
                <a
                  href="https://www.youtube.com/watch?v=1FdJyaCZ5ow"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Streaming
                </a>
              </div>
              <div className="k-ft-cta-row">
                <a className="k-ft-btn fill" href="#rsvp">
                  RSVP Now
                </a>
                <a
                  className="k-ft-btn line"
                  href={WEDDING_EVENTS[0]!.map}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Location
                </a>
              </div>
              <p className="k-footer-love">
                With best compliments from Vrijesh &amp; Poppy
              </p>
            </div>
          </footer>
          {/* Invitation card modal */}
          <div
            className="modal hidden h-full left-0 opacity-0 outline-0 overflow-x-hidden overflow-y-auto fixed top-0 transition-opacity duration-150 ease-linear w-full [z-index:var(--bs-modal-zindex)] motion-reduce:transition-none"
            id="wedding-invitation"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className="items-center flex m-(--bs-modal-margin) min-h-[calc(100%_-_var(--bs-modal-margin)_*_2)] pointer-events-none relative transform-[translate(0px,-50px)] transition-transform duration-300 ease-out w-auto min-[576px]:ml-auto min-[576px]:mr-auto min-[576px]:max-w-(--bs-modal-width) motion-reduce:transition-none"
              role="document"
            >
              <div className="bg-clip-padding border-current! rounded-[15px] border-none! flex flex-col outline-0 overflow-hidden pointer-events-auto relative w-full bg-white text-site-import-foreground [border:var(--bs-modal-border-width)_solid_var(--bs-modal-border-color)] [border-image:none] [border-width:medium]!">
                <div className="flex-auto p-0 relative">
                  <button
                    className="bg-white border-current rounded-[50%] border-none cursor-pointer text-[16px] h-[30px] m-0 opacity-100 outline-0! p-0 absolute right-[15px] normal-case top-[15px] duration-300 w-[30px] text-[#434343] [appearance:button] [border-image:none] [border-width:medium] [font-family:inherit] [line-height:inherit] hover:bg-none hover:[background-position:0%_0%] hover:[background-size:auto_auto] hover:[background-repeat:repeat] hover:[background-origin:padding-box] hover:[background-clip:border-box] hover:[background-attachment:scroll] hover:bg-(--ButtonColor) hover:text-(--ButtonTextColor)"
                    aria-label="close"
                    type="button"
                    aria-bs-label="Close"
                  >
                    {"\n\t\t\t\t\t\t"}
                    <i className="fas fa-times antialiased inline-block not-italic font-black leading-none [font-variant:normal] [text-rendering:auto]" />
                    {"\n\t\t\t\t\t"}
                  </button>

                  <img
                    className="h-auto align-middle w-full max-w-none"
                    src="/site-assets/4e45546628d67f34.png"
                    alt="Invitation card"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
