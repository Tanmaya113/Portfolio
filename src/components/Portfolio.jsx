import { useState, useEffect, useRef, useCallback } from "react";
import {
  Terminal, FileCode, Folder, FolderOpen, Mail,
  ChevronRight, Menu, X, GitCommit, ExternalLink, CircleDot,
} from "lucide-react";

/* Brand icons (removed from lucide-react; inlined as minimal SVGs) */
function Github({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}
function Linkedin({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function Instagram({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Design tokens — "editor theme" palette (not a single-accent cliché)   */
/* ---------------------------------------------------------------------- */
const C = {
  bg: "#0a0e14",
  panel: "#0e131b",
  panel2: "#12181f",
  border: "#1f2733",
  borderSoft: "#171e28",
  text: "#c3ccd9",
  textDim: "#5b6675",
  textFaint: "#3d4653",
  green: "#7ee787",
  blue: "#6ea8fe",
  orange: "#ffa657",
  pink: "#ff7b9c",
  purple: "#b795f7",
  red: "#ff6b6b",
};

const FONT = `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace`;

/* ---------------------------------------------------------------------- */
/*  Content                                                                */
/* ---------------------------------------------------------------------- */
const NAV = [
  { id: "hero", label: "~", file: "home" },
  { id: "about", label: "about.md", file: "about.md" },
  { id: "skills", label: "skills.json", file: "skills.json" },
  { id: "experience", label: "experience.log", file: "experience.log" },
  { id: "projects", label: "projects/", file: "projects" },
  { id: "contact", label: "contact.sh", file: "contact.sh" },
];

const SKILLS = {
  "web & backend": ["JavaScript", "Node.js", "Next.js", "NestJS", "TypeScript", "HTML/CSS"],
  "languages": ["Python", "C++", "C", "Java"],
  "data & infra": ["PostgreSQL", "Prisma", "MongoDB", "MySQL", "Docker", "GitHub Actions"],
  "ml / ai": ["Python (ML)", "OpenAI API", "RAG pipelines"],
  "design tools": ["Figma", "Photoshop", "MATLAB"],
};

const EXPERIENCE = [
  { hash: "3e92b1f", date: "2025-12 → 2026-01", title: "AI & Full Stack Development Intern", org: "CaveBeats Technologies", branch: "work" },
  { hash: "a1e4c02", date: "2025-06 → 2025-08", title: "Web Developer & Technical Assistant", org: "Devsamagri (Remote)", branch: "work" },
  { hash: "f9b2310", date: "2023 → 2027", title: "B.Tech, Information Technology", org: "Manipal University Jaipur", branch: "education" },
  { hash: "7d40e88", date: "2025 → ongoing", title: "Machine Learning", org: "Udemy", branch: "education" },
  { hash: "c30af51", date: "2024 → 2025", title: "Python for Data Science", org: "Udemy", branch: "education" },
  { hash: "2b8e916", date: "2024 → ongoing", title: "Web Development Bootcamp", org: "Code With Harry", branch: "education" },
];

const PROJECTS = [
  {
    id: "evident",
    file: "evident.wip",
    status: "WIP",
    name: "Evident",
    tagline: "Real-time AI fact-checking platform",
    desc: "Extracts claims from speech, video, podcasts and transcripts, then verifies them with a RAG pipeline — claim extraction, normalization, evidence retrieval, AI verification and verdict aggregation, backed by 350+ regression tests and CI/CD.",
    stack: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "OpenAI", "Turborepo", "Docker"],
    link: null,
    linkLabel: "in active development",
  },
  {
    id: "moviesphere",
    file: "moviesphere.jsx",
    status: "LIVE",
    name: "MovieSphere",
    tagline: "Full-stack AI recommendation app",
    desc: "A movie rating and recommendation platform with trending titles, personalized suggestions powered by a recommendation model, and a fast, clean interface end-to-end.",
    stack: ["JavaScript", "Node.js", "Recommendation engine", "REST API"],
    link: "https://moviesphere-kv6m.onrender.com/",
    linkLabel: "moviesphere-kv6m.onrender.com",
  },
];

const SOCIALS = [
  { label: "email", value: "tanmayaraghuwanshi@gmail.com", href: "mailto:tanmayaraghuwanshi@gmail.com", Icon: Mail },
  { label: "github", value: "github.com/Tanmaya113", href: "https://github.com/Tanmaya113", Icon: Github },
  { label: "linkedin", value: "linkedin.com/in/tanmayaraghuwanshi", href: "https://www.linkedin.com/in/tanmayaraghuwanshi/", Icon: Linkedin },
  { label: "instagram", value: "@not.tanmay_", href: "https://www.instagram.com/not.tanmay_/", Icon: Instagram },
];

/* ---------------------------------------------------------------------- */
/*  Boot sequence lines                                                    */
/* ---------------------------------------------------------------------- */
const BOOT_LINES = [
  { p: "guest@portfolio", c: "whoami" },
  { out: "tanmaya_raghuwanshi", color: C.green },
  { p: "guest@portfolio", c: "cat role.txt" },
  { out: "B.Tech IT '27 @ Manipal University Jaipur — ML specialization", color: C.text },
  { p: "guest@portfolio", c: "./run --focus" },
  { out: "building full-stack + AI products. two shipped, one in progress.", color: C.textDim },
];

/* ---------------------------------------------------------------------- */
/*  Command interpreter                                                    */
/* ---------------------------------------------------------------------- */
function buildResponse(raw, scrollTo) {
  const cmd = raw.trim().toLowerCase();
  const line = (text, color = C.text) => ({ text, color });

  if (cmd === "") return [];
  if (cmd === "help") {
    return [
      line("available commands:", C.textDim),
      line("  about        → who I am"),
      line("  skills       → tech stack"),
      line("  experience   → education & work log"),
      line("  projects     → things I've shipped"),
      line("  contact      → get in touch"),
      line("  socials      → github / linkedin / instagram"),
      line("  clear        → clear the terminal"),
    ];
  }
  if (cmd === "about" || cmd === "whoami") { scrollTo("about"); return [line("→ opening about.md", C.blue)]; }
  if (cmd === "skills" || cmd === "ls skills") { scrollTo("skills"); return [line("→ opening skills.json", C.blue)]; }
  if (cmd === "experience" || cmd === "exp") { scrollTo("experience"); return [line("→ opening experience.log", C.blue)]; }
  if (cmd === "projects" || cmd === "ls projects") { scrollTo("projects"); return [line("→ opening projects/", C.blue)]; }
  if (cmd === "contact") { scrollTo("contact"); return [line("→ opening contact.sh", C.blue)]; }
  if (cmd === "socials") {
    return SOCIALS.map((s) => line(`  ${s.label.padEnd(10)} ${s.value}`, C.purple));
  }
  if (cmd === "ls") {
    return [
      line("about.md   skills.json   experience.log   projects/   contact.sh", C.blue),
    ];
  }
  if (cmd === "sudo hire tanmaya") {
    return [
      line("[sudo] password for recruiter: ********", C.textDim),
      line("permission granted.", C.green),
      line("→ redirecting to contact.sh ...", C.green),
    ];
  }
  if (cmd === "clear") return "__CLEAR__";
  return [line(`command not found: ${raw}`, C.red), line("type 'help' to see what's available", C.textDim)];
}

/* ---------------------------------------------------------------------- */
/*  Small building blocks                                                  */
/* ---------------------------------------------------------------------- */
function Reveal({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setShown(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(14px)",
        transition: "opacity .6s ease, transform .6s ease",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ index, total, name }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span style={{ color: C.textFaint, fontSize: 12 }}>[{index}/{total}]</span>
      <span style={{ color: C.textDim, fontSize: 12, letterSpacing: 1 }}>{name}</span>
      <div style={{ flex: 1, height: 1, background: C.borderSoft }} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Main                                                                   */
/* ---------------------------------------------------------------------- */
export default function Portfolio() {
  const [active, setActive] = useState("hero");
  const [navOpen, setNavOpen] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [visibleBoot, setVisibleBoot] = useState(0);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const sectionRefs = useRef({});
  const scrollerRef = useRef(null);
  const historyEndRef = useRef(null);

  const scrollTo = useCallback((id) => {
    setNavOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // boot sequence typing
  useEffect(() => {
    if (visibleBoot >= BOOT_LINES.length) { setBootDone(true); return; }
    const delay = BOOT_LINES[visibleBoot].p ? 420 : 240;
    const t = setTimeout(() => setVisibleBoot((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleBoot]);

  // cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  // scrollspy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.dataset.id); });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [history]);

  function submitCommand(e) {
    e.preventDefault();
    const raw = input;
    setInput("");
    const result = buildResponse(raw, scrollTo);
    if (result === "__CLEAR__") { setHistory([]); return; }
    setHistory((h) => [...h, { cmd: raw, out: result }]);
  }

  const activeIdx = NAV.findIndex((n) => n.id === active);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.blue}; color: ${C.bg}; }
        .scrollarea::-webkit-scrollbar { width: 8px; height: 8px; }
        .scrollarea::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        .scrollarea::-webkit-scrollbar-track { background: transparent; }
        a.link-ext { color: ${C.blue}; text-decoration: none; border-bottom: 1px dashed ${C.textFaint}; }
        a.link-ext:hover { border-bottom-color: ${C.blue}; }
        .navitem { transition: background .15s ease, color .15s ease; }
        .navitem:hover { background: ${C.panel2}; }
        .term-input:focus { outline: none; }
        .proj-card { transition: border-color .2s ease, transform .2s ease; }
        .proj-card:hover { border-color: ${C.textDim}; transform: translateY(-2px); }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <div className="flex" style={{ minHeight: "100vh" }}>
        {/* ---------------- Sidebar (file tree) ---------------- */}
        <aside
          className="scrollarea"
          style={{
            width: 240,
            flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            background: C.panel,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            display: navOpen ? "block" : undefined,
          }}
        >
          <div className="hidden md:flex items-center gap-2 px-4" style={{ height: 48, borderBottom: `1px solid ${C.border}` }}>
            <Terminal size={15} color={C.green} />
            <span style={{ fontSize: 13, color: C.textDim }}>portfolio</span>
          </div>
          <nav className="px-2 py-3">
            <div className="flex items-center gap-1.5 px-2 py-1" style={{ fontSize: 12, color: C.textDim }}>
              <FolderOpen size={13} /> <span>tanmaya/</span>
            </div>
            <div style={{ marginLeft: 14, borderLeft: `1px solid ${C.borderSoft}` }}>
              {NAV.filter((n) => n.id !== "hero").map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="navitem w-full flex items-center gap-1.5 px-2 py-1.5"
                  style={{
                    marginLeft: 8,
                    fontSize: 13,
                    textAlign: "left",
                    color: active === n.id ? C.orange : C.textDim,
                    background: active === n.id ? C.panel2 : "transparent",
                    borderLeft: `2px solid ${active === n.id ? C.orange : "transparent"}`,
                  }}
                >
                  <FileCode size={13} />
                  <span>{n.file}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 px-2">
              <div className="flex items-center gap-1.5 px-2 py-1" style={{ fontSize: 12, color: C.textDim }}>
                <Folder size={13} /> <span>connect/</span>
              </div>
              <div style={{ marginLeft: 22 }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank" rel="noreferrer"
                    className="navitem flex items-center gap-1.5 px-2 py-1.5"
                    style={{ fontSize: 12, color: C.textDim }}
                  >
                    <s.Icon size={12} /> <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* mobile nav toggle */}
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="md:hidden"
          style={{
            position: "fixed", top: 12, left: 12, zIndex: 50,
            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6,
            width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {navOpen ? <X size={16} color={C.text} /> : <Menu size={16} color={C.text} />}
        </button>

        {/* ---------------- Main column ---------------- */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* editor tab breadcrumb */}
          <div
            className="flex items-center gap-1 px-4 md:px-6 scrollarea"
            style={{
              height: 48, borderBottom: `1px solid ${C.border}`, background: C.panel,
              position: "sticky", top: 0, zIndex: 20, overflowX: "auto", whiteSpace: "nowrap",
            }}
          >
            {NAV.map((n, i) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                style={{
                  fontSize: 12,
                  padding: "5px 12px",
                  color: active === n.id ? C.text : C.textFaint,
                  background: active === n.id ? C.bg : "transparent",
                  borderTop: `2px solid ${active === n.id ? C.orange : "transparent"}`,
                  borderLeft: i > 0 ? `1px solid ${C.borderSoft}` : "none",
                }}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* ---------------- Hero / terminal ---------------- */}
          <section
            id="hero" data-id="hero"
            ref={(el) => (sectionRefs.current.hero = el)}
            className="px-4 md:px-10 py-10 md:py-16"
          >
            <div
              style={{
                maxWidth: 780, margin: "0 auto", background: C.panel,
                border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden",
              }}
            >
              <div className="flex items-center gap-2 px-4" style={{ height: 36, background: C.panel2, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                <span style={{ marginLeft: 10, fontSize: 12, color: C.textDim }}>guest@portfolio: ~</span>
              </div>

              <div ref={scrollerRef} className="px-4 md:px-6 py-5 scrollarea" style={{ fontSize: 13.5, lineHeight: 1.9, maxHeight: 340, overflowY: "auto" }}>
                {BOOT_LINES.slice(0, visibleBoot).map((l, i) =>
                  l.p ? (
                    <div key={i}>
                      <span style={{ color: C.green }}>{l.p}</span>
                      <span style={{ color: C.textFaint }}>:~$ </span>
                      <span>{l.c}</span>
                    </div>
                  ) : (
                    <div key={i} style={{ color: l.color, paddingLeft: 2 }}>{l.out}</div>
                  )
                )}

                {bootDone && (
                  <>
                    {history.map((h, i) => (
                      <div key={i} className="mt-1">
                        <span style={{ color: C.green }}>guest@portfolio</span>
                        <span style={{ color: C.textFaint }}>:~$ </span>
                        <span>{h.cmd}</span>
                        {h.out.map((o, j) => (
                          <div key={j} style={{ color: o.color, paddingLeft: 2, whiteSpace: "pre-wrap" }}>{o.text}</div>
                        ))}
                      </div>
                    ))}
                    <form onSubmit={submitCommand} className="flex items-center mt-1">
                      <span style={{ color: C.green }}>guest@portfolio</span>
                      <span style={{ color: C.textFaint }}>:~$&nbsp;</span>
                      <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="term-input"
                        style={{ background: "transparent", border: "none", color: C.text, fontFamily: FONT, fontSize: 13.5, flex: 1 }}
                        placeholder="type 'help'"
                      />
                      <span style={{ opacity: cursorOn ? 1 : 0, color: C.orange }}>▍</span>
                    </form>
                    <div ref={historyEndRef} />
                  </>
                )}
              </div>
            </div>

            <div className="text-center mt-8" style={{ maxWidth: 780, margin: "32px auto 0" }}>
              <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
                Tanmaya Raghuwanshi
              </h1>
              <p style={{ color: C.textDim, fontSize: 15, marginTop: 10 }}>
                <span style={{ color: C.purple }}>const</span> focus <span style={{ color: C.blue }}>=</span> <span style={{ color: C.orange }}>"full-stack dev, training in ML"</span>;
              </p>
            </div>
          </section>

          {/* ---------------- About ---------------- */}
          <section
            id="about" data-id="about"
            ref={(el) => (sectionRefs.current.about = el)}
            className="px-4 md:px-10 py-12 md:py-16"
            style={{ borderTop: `1px solid ${C.borderSoft}` }}
          >
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <Reveal>
                <SectionLabel index={1} total={5} name="cat about.md" />
                <p style={{ fontSize: 15.5, lineHeight: 1.85, color: C.text }}>
                  I'm a B.Tech Information Technology student at <span style={{ color: C.blue }}>Manipal University Jaipur</span>,
                  specializing in <span style={{ color: C.orange }}>Machine Learning</span>. My work spans technical
                  computing, data science, and full-stack software development — I like taking a project from
                  a rough idea to something people can actually open and use.
                </p>
                <p style={{ fontSize: 15.5, lineHeight: 1.85, color: C.textDim, marginTop: 14 }}>
                  Right now that means building <span style={{ color: C.green }}>Evident</span>, an AI fact-checking
                  pipeline, and shipping full-stack apps like <span style={{ color: C.green }}>MovieSphere</span> —
                  while going deeper into ML and RAG systems along the way.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  {[["02+", "years learning"], ["05+", "projects built"], ["03+", "stacks explored"]].map(([n, l]) => (
                    <div key={l} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 16px", background: C.panel }}>
                      <div style={{ color: C.orange, fontWeight: 700, fontSize: 18 }}>{n}</div>
                      <div style={{ color: C.textDim, fontSize: 11.5 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ---------------- Skills ---------------- */}
          <section
            id="skills" data-id="skills"
            ref={(el) => (sectionRefs.current.skills = el)}
            className="px-4 md:px-10 py-12 md:py-16"
            style={{ borderTop: `1px solid ${C.borderSoft}` }}
          >
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <Reveal>
                <SectionLabel index={2} total={5} name="cat skills.json" />
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 22px", fontSize: 13.5, lineHeight: 2 }}>
                  <div><span style={{ color: C.textFaint }}>{"{"}</span></div>
                  {Object.entries(SKILLS).map(([cat, items], i, arr) => (
                    <div key={cat} style={{ paddingLeft: 18 }}>
                      <span style={{ color: C.blue }}>"{cat}"</span>
                      <span style={{ color: C.textFaint }}>: [</span>
                      <span style={{ color: C.text }}>
                        {items.map((it, j) => (
                          <span key={it}>
                            <span style={{ color: C.orange }}>"{it}"</span>
                            {j < items.length - 1 ? <span style={{ color: C.textFaint }}>, </span> : null}
                          </span>
                        ))}
                      </span>
                      <span style={{ color: C.textFaint }}>]{i < arr.length - 1 ? "," : ""}</span>
                    </div>
                  ))}
                  <div><span style={{ color: C.textFaint }}>{"}"}</span></div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ---------------- Experience ---------------- */}
          <section
            id="experience" data-id="experience"
            ref={(el) => (sectionRefs.current.experience = el)}
            className="px-4 md:px-10 py-12 md:py-16"
            style={{ borderTop: `1px solid ${C.borderSoft}` }}
          >
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <Reveal>
                <SectionLabel index={3} total={5} name="git log --oneline experience.log" />
                <div>
                  {EXPERIENCE.map((e, i) => (
                    <div key={e.hash} className="flex gap-3" style={{ paddingBottom: i < EXPERIENCE.length - 1 ? 18 : 0 }}>
                      <div className="flex flex-col items-center" style={{ width: 16 }}>
                        <GitCommit size={15} color={e.branch === "work" ? C.orange : C.blue} />
                        {i < EXPERIENCE.length - 1 && <div style={{ width: 1, flex: 1, background: C.borderSoft, marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 4 }}>
                        <div style={{ fontSize: 12.5 }}>
                          <span style={{ color: C.textFaint }}>{e.hash}</span>{" "}
                          <span style={{ color: e.branch === "work" ? C.orange : C.blue }}>[{e.branch}]</span>{" "}
                          <span style={{ color: C.textDim }}>{e.date}</span>
                        </div>
                        <div style={{ fontSize: 15, color: C.text, marginTop: 2 }}>{e.title}</div>
                        <div style={{ fontSize: 13, color: C.textDim }}>{e.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ---------------- Projects ---------------- */}
          <section
            id="projects" data-id="projects"
            ref={(el) => (sectionRefs.current.projects = el)}
            className="px-4 md:px-10 py-12 md:py-16"
            style={{ borderTop: `1px solid ${C.borderSoft}` }}
          >
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <Reveal>
                <SectionLabel index={4} total={5} name="ls -la projects/" />
              </Reveal>
              <div className="flex flex-col gap-4">
                {PROJECTS.map((p) => (
                  <Reveal key={p.id}>
                    <div className="proj-card" style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.panel, overflow: "hidden" }}>
                      <div className="flex items-center justify-between px-4" style={{ height: 38, background: C.panel2, borderBottom: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-2">
                          <FileCode size={13} color={C.textDim} />
                          <span style={{ fontSize: 12.5, color: C.textDim }}>{p.file}</span>
                        </div>
                        <span style={{
                          fontSize: 10.5, letterSpacing: 0.5, padding: "2px 8px", borderRadius: 4,
                          color: p.status === "LIVE" ? C.green : C.orange,
                          border: `1px solid ${p.status === "LIVE" ? C.green : C.orange}`,
                        }}>{p.status}</span>
                      </div>
                      <div className="p-4 md:p-5">
                        <div style={{ fontSize: 19, fontWeight: 700, color: C.text }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: C.orange, marginTop: 2 }}>{p.tagline}</div>
                        <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.75, marginTop: 10 }}>{p.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {p.stack.map((s) => (
                            <span key={s} style={{ fontSize: 11.5, color: C.blue, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 8px" }}>{s}</span>
                          ))}
                        </div>
                        <div className="mt-4">
                          {p.link ? (
                            <a href={p.link} target="_blank" rel="noreferrer" className="link-ext inline-flex items-center gap-1" style={{ fontSize: 13 }}>
                              {p.linkLabel} <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5" style={{ fontSize: 13, color: C.textFaint }}>
                              <CircleDot size={12} /> {p.linkLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Contact ---------------- */}
          <section
            id="contact" data-id="contact"
            ref={(el) => (sectionRefs.current.contact = el)}
            className="px-4 md:px-10 py-12 md:py-20"
            style={{ borderTop: `1px solid ${C.borderSoft}` }}
          >
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              <Reveal>
                <SectionLabel index={5} total={5} name="./contact.sh" />
                <p style={{ fontSize: 15.5, color: C.text, lineHeight: 1.8 }}>
                  Got a web app, an ML idea, or a dashboard to build? I'm open to internships,
                  collaborations, and interesting problems.
                </p>
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 20, overflow: "hidden" }}>
                  {SOCIALS.map((s, i) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 navitem"
                      style={{ borderTop: i > 0 ? `1px solid ${C.borderSoft}` : "none", textDecoration: "none" }}
                    >
                      <s.Icon size={16} color={C.orange} />
                      <span style={{ color: C.textFaint, fontSize: 13.5 }}>--{s.label}</span>
                      <span style={{ color: C.text, fontSize: 13.5 }}>{s.value}</span>
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  {[
                    { label: "Résumé (AI / ML)", href: "/Tanmaya_Raghuwanshi_AI_ML_Engineer_Resume.pdf", color: C.purple },
                    { label: "Résumé (SDE)",     href: "/Tanmaya_Raghuwanshi_SDE_Resume.pdf",           color: C.blue },
                  ].map(({ label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13.5,
                        color,
                        border: `1px solid ${color}`,
                        borderRadius: 6,
                        padding: "8px 18px",
                        textDecoration: "none",
                        transition: "background .15s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${color}1a`}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <ExternalLink size={14} /> {label}
                    </a>
                  ))}
                </div>
              </Reveal>

              <div className="text-center mt-16" style={{ color: C.textFaint, fontSize: 12 }}>
                <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20 }}>
                  built by Tanmaya Raghuwanshi · rendered in a terminal, deployed on the web
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
