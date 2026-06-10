import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState, useEffect } from "react";
import profile from "@/assets/profile.png";
import nameCard from "@/assets/name_card.png";
import imgKainPo from "@/assets/kainpo.png";
import imgTilaok from "@/assets/tilaok.png";
import imgTarShare from "@/assets/tarshare.png";
import imgFlexor from "@/assets/flexor.png";
import imgIcSync from "@/assets/icsync.png";
import imgUpou from "@/assets/upou.png";
import designBoard from "@/assets/design_board.png";
import sticker1 from "@/assets/board_sticker1.png";
import sticker2 from "@/assets/board_sticker2.png";
import sticker3 from "@/assets/board_sticker3.png";
import sticker4 from "@/assets/board_sticker4.png";
import sticker5 from "@/assets/board_sticker5.png";
import sticker6 from "@/assets/board_sticker6.png";
import logo from "@/assets/website_logo.png";


export const Route = createFileRoute("/")({
  component: Index,
});

// Scroll-reveal wrapper: slides + fades in when section enters viewport
function SectionReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(48px) scale(0.98)",
        transition: `opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function InteractiveTitle() {
  const lines = ["DESIGNING", "FOR THE", "PEOPLE."];
  // Cumulative char index for staggered delay across all lines
  let charIndex = 0;
  return (
    <h1 className="font-display font-bold leading-[0.95] text-[12vw] md:text-[6rem] tracking-tight cursor-default select-none">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split("").map((char, ci) => {
            const idx = charIndex++;
            const delay = `${idx * 40}ms`;
            return char === " " ? (
              <span key={ci} className="inline-block">&nbsp;</span>
            ) : (
              <span
                key={ci}
                className="inline-block text-orange transition-colors duration-150 ease-out hover:text-ink hover:-translate-y-3 hover:scale-110"
                style={{
                  animation: `letterIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay} both`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function InteractiveGraph() {
  const [pos, setPos] = useState({ x: 600, y: 150 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store refs to keep values fresh in requestAnimationFrame loop
  const stateRef = useRef({ isHovered, mousePos, time });
  stateRef.current = { isHovered, mousePos, time };

  useEffect(() => {
    let animId: number;
    const tick = () => {
      // Slower float time increment
      setTime((t) => t + 0.005);

      const current = stateRef.current;
      const parent = containerRef.current?.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: 1200, height: 300 };

      let targetX = 0;
      let targetY = 0;
      if (current.isHovered) {
        targetX = current.mousePos.x;
        targetY = current.mousePos.y;
      } else {
        // Slow organic floating orbit
        targetX = (rect.width / 2) + Math.sin(current.time * 0.8) * (rect.width * 0.35);
        targetY = (rect.height / 2) + Math.cos(current.time * 1.2) * (rect.height * 0.2);
      }

      setPos((prev) => {
        const ease = 0.08;
        return {
          x: prev.x + (targetX - prev.x) * ease,
          y: prev.y + (targetY - prev.y) * ease,
        };
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-x-0 top-0 bottom-[-100px] z-0 pointer-events-none overflow-hidden select-none">
      {/* High-lighted grid lines overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--orange) 75%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--orange) 75%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          animation: 'moveGrid 90s linear infinite',
          maskImage: `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, black 20%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, black 20%, transparent 100%)`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

const projects = [
  {
    no: "01",
    title: "KainPo",
    tags: ["React Native", "Supabase", "Gemini"],
    blurb: "A Mobile Application for Automated FEL- Based Filipino Meal Plan Optimization",
    bg: "var(--orange)",
    image: imgKainPo,
  },
  {
    no: "02",
    title: "Tilaok",
    tags: ["Next.Js", "Firebase", "SMS Gateway"],
    blurb: "A hybrid digital communication platform bridging Filipino farmers and the Department of Agriculture (DA) via real-time mobile app and SMS channels. Won 1st Runner-up at Technovation Summit.",
    bg: "var(--blue)",
    image: imgTilaok,
  },
  {
    no: "03",
    title: "TarShare",
    tags: ["Next.Js", "Firebase", "Gemini", "Vertex AI"],
    blurb: "An AI-powered civic platform empowering Filipinos to transform informal grievances into formal, actionable complaints. Built with Next.js and Firebase; utilized Gemini and Vertex AI.",
    bg: "var(--coral)",
    image: imgTarShare,
  },
  {
    no: "04",
    title: "Flexor",
    tags: ["Next.Js", "Gemini"],
    blurb: "A hackathon project webapp that aims to track budgeting and user spending pattern.",
    bg: "var(--coral)",
    image: imgFlexor,
  },
  {
    no: "05",
    title: "icSync",
    tags: ["Next.Js", "Firebase", "Shadcn"],
    blurb: "An Alumni Tracker and Relations Management System for the Institute of Computer Science UPLB that aims to strengthen alumni relations.",
    bg: "var(--coral)",
    image: imgIcSync,
  },
  {
    no: "06",
    title: "UPOU E-Bulletin",
    tags: ["React Native", "Laravel"],
    blurb: "A Block-based Rich Text Editor and Content Management System for UPOU Administration Staffs.",
    bg: "var(--coral)",
    image: imgUpou,
  },
];

const awards = [
  {
    title: "1st Runner-up",
    subtitle: "National Technovation Summit Hackathon, Cebu, Philippines",
    note: "Tilaok",
    year: "Aug 2025",
  },
  {
    title: "4th Runner-up",
    subtitle: "GDG-PUP Sparkfest 2025",
    note: "TarShare",
    year: "June 2025",
  },
  {
    title: "Best Research Paper Nominee for IT Category",
    subtitle: "ICS Undergraduate Research Symposium 2026",
    note: "KainPo",
    year: "2026",
  },
  {
    title: "University / College Scholar",
    subtitle: "Consistent University Scholar — GWA: 1.667, University of the Philippines Los Baños",
    note: "",
    year: "2021–2026",
  },
  {
    title: "JLSS DOST-SEI Merit Scholar",
    subtitle: "Science and Engineering Scholarship",
    note: "",
    year: "2024–2026",
  },
];

function Index() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden">
      {/* NAV */}
      <header className="px-6 md:px-12 p-3 m-2">
        <nav className="relative flex items-center justify-center py-4">

          {/* Centered Navigation */}
          <ul className="flex items-center gap-6 md:gap-10 text-base font-medium">
            <li><a href="#about" className="hover:text-orange hover:bg-orange/15 transition px-4 py-1.5 rounded-full">About</a></li>
            <li><a href="#work" className="hover:text-orange hover:bg-orange/15 transition px-4 py-1.5 rounded-full">Project</a></li>
            <li><a href="#contact" className="hover:text-orange hover:bg-orange/15 transition px-4 py-1.5 rounded-full">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative px-4 md:px-12 flex flex-col justify-center" style={{ minHeight: 'calc(90vh - 80px)' }}>
        <div className="absolute inset-x-0 top-0 bottom-[-100px] grid-paper opacity-70 pointer-events-none" aria-hidden />
        <InteractiveGraph />
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <InteractiveTitle />
          <SectionReveal delay={200}>
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
              <Link
                to="/resume"
                className="inline-block px-8 py-4 rounded-full border-2 border-transparent bg-orange text-cream font-semibold uppercase tracking-widest text-sm hover:translate-y-[-2px] transition"
              >
                Resume
              </Link>
              <a
                href="#contact"
                className="inline-block px-8 py-4 rounded-full border-2 border-ink text-ink font-semibold uppercase tracking-widest text-sm hover:bg-ink hover:text-cream hover:translate-y-[-2px] transition"
              >
                Contact Me
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* INTRO CARD */}
      <section className="pb-12">
        <div className="relative bg-blue text-cream overflow-hidden pt-8 md:pt-12 px-6 md:px-12 pb-0 md:pb-0 min-h-[480px] md:min-h-[600px] rounded-t-[50%_50px] md:rounded-t-[50%_100px] flex flex-col justify-end">
          <div className="relative w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-end">
            <div className="pb-8 md:pb-10">
              <SectionReveal>
                <h2 className="leading-none">
                  <img
                    src={nameCard}
                    alt="Ron Comia"
                    className="w-full max-w-[500px] pt-20 md:max-w-[640px] h-auto object-contain"
                  />
                </h2>
              </SectionReveal>
              <SectionReveal delay={80}>
                <p className="mt-2 text-cream font-bold text-2xl md:text-3xl leading-snug">
                  <span className="bg-orange text-cream px-2 py-0.5 inline-block mr-2 rounded text-xl md:text-2xl">Hello, I'm Ron!</span>
                  I design and build software that matters.
                </p>
              </SectionReveal>
              <SectionReveal delay={150}>
                <div className="mt-5 flex flex-col gap-1.5">
                  <div className="text-cream/50 text-xs uppercase tracking-widest">Education</div>
                  <div className="text-cream font-semibold text-lg">University of the Philippines – Los Baños</div>
                  <div className="text-cream/55 text-base">BS Computer Science</div>
                </div>
              </SectionReveal>
              <SectionReveal delay={220}>
                <a href="#about" className="mt-7 inline-flex items-center gap-3 text-base font-bold tracking-tight text-cream hover:text-yellow transition-colors group">
                  Get to know me more
                  <svg className="w-8 h-3 text-cream group-hover:translate-x-1.5 transition-transform" viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="8" x2="38" y2="8" />
                    <polyline points="32 2 38 8 32 14" />
                  </svg>
                </a>
              </SectionReveal>
            </div>
            <div className="hidden md:block absolute bottom-0 right-[-30px] md:right-[-60px] h-[360px] md:h-[520px] pointer-events-none">
              <SectionReveal delay={100} className="h-full">
                <img
                  src={profile}
                  alt="Ron Comia"
                  width={768}
                  height={2096}
                  className="h-full w-auto object-contain object-bottom pointer-events-auto"
                />
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="work" className="px-6 md:px-12 pb-24">
        <SectionReveal>
          <div className="max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display font-bold text-orange text-5xl md:text-7xl leading-none tracking-[-0.12em]">
                Fea<i>t</i>ured Pro<i>j</i>ects
              </h2>
            </div>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {projects.map((p, idx) => (
            <SectionReveal key={p.no} delay={idx * 60}>
              <button
                onClick={() => setSelectedProject(p)}
                className="group text-left w-full bg-blue rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition-transform duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                <div className="relative overflow-hidden h-64" style={{ background: p.bg }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 font-display text-sm bg-ink/70 text-cream px-3 py-0.5 rounded-full backdrop-blur-sm">
                    {p.no}
                  </span>
                </div>
                <div className="px-4 pt-3 pb-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-cream font-bold text-lg leading-snug">{p.title}</h3>
                    <div className="shrink-0 w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/50 text-sm group-hover:bg-orange group-hover:border-orange group-hover:text-cream transition-all duration-200">
                      ↗
                    </div>
                  </div>
                  <p className="text-cream/60 text-sm leading-relaxed mb-3 line-clamp-2">{p.blurb}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest bg-cream/10 text-cream/70 px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* AWARDS & RECOGNITIONS */}
      <section id="about" className="bg-orange text-cream py-24 px-6 md:px-12">
        <div className="w-full">
          <SectionReveal>
            <h2 className="font-display font-bold text-6xl md:text-8xl mb-16 leading-none tracking-[-0.10em]">
              A<i>w</i>ar<i>d</i>s &amp; Re<i>c</i>ogni<i>t</i>ions
            </h2>
          </SectionReveal>
          <div>
            {awards.map((a, i) => (
              <SectionReveal key={i} delay={i * 80}>
                <div className="flex items-start justify-between py-7 border-t border-cream/25 gap-8">
                  <div>
                    <div className="font-display font-bold text-xl md:text-2xl">{a.title}</div>
                    <p className="text-base md:text-lg text-cream/70 mt-1 leading-relaxed">{a.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {a.note && (
                      <span className="text-xs md:text-sm uppercase tracking-widest bg-cream/20 text-cream px-3.5 py-1 rounded-full inline-block mb-2 font-medium">
                        {a.note}
                      </span>
                    )}
                    <div className="text-cream/60 text-base md:text-lg font-medium">{a.year}</div>
                  </div>
                </div>
              </SectionReveal>
            ))}
            <div className="border-t border-cream/25" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="px-6 md:px-12 py-24">
        <div className="w-full grid md:grid-cols-12 gap-12 md:gap-16 items-center">
          <SectionReveal className="md:col-span-8">
            <div className="relative rounded-3xl overflow-hidden border border-ink/10 shadow-xl bg-cream select-none">
              <img
                src={designBoard}
                alt="Ron's Design Board"
                className="w-full h-auto object-cover select-none pointer-events-none"
                draggable="false"
              />
              <DraggableSticker src={sticker4} initialLeft={50.5} initialTop={23.5} width="20%" defaultRotation={4} delay="0s" alt="Caballero" />
              <DraggableSticker src={sticker3} initialLeft={65.1} initialTop={33.3} width="15%" defaultRotation={-2} delay="1.5s" alt="Universal Since 1895" />
              <DraggableSticker src={sticker5} initialLeft={90.1} initialTop={54.8} width="13%" defaultRotation={-5} delay="3.0s" alt="Skolar Para Sa Bayan" />
              <DraggableSticker src={sticker1} initialLeft={54.8} initialTop={82.8} width="18%" defaultRotation={6} delay="4.5s" alt="Sunflower Girl" />
              <DraggableSticker src={sticker2} initialLeft={69.6} initialTop={78.5} width="18%" defaultRotation={2} delay="6.0s" alt="Frog Boy" />
              <DraggableSticker src={sticker6} initialLeft={75.8} initialTop={24.5} width="18%" defaultRotation={-6} delay="7.5s" alt="On Cue Sargo Club" />
            </div>
          </SectionReveal>
          <div className="md:col-span-4 flex flex-col justify-center">
            <SectionReveal delay={100}>
              <h2 className="font-display font-bold text-orange text-6xl md:text-8xl leading-[0.9] tracking-[-0.10em]">
                Le<i>t</i>'s<br />Wor<i>k</i><br />To<i>g</i>ether<i>!</i>
              </h2>
            </SectionReveal>
            <SectionReveal delay={180}>
              <p className="mt-8 text-ink/70 max-w-sm">
                Currently taking on a few thoughtful projects for late 2025.
                Briefs, hellos and coffee invitations welcome.
              </p>
            </SectionReveal>
            <SectionReveal delay={260}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
                <ContactLink label="LinkedIn" value="linkedin.com/in/rgcomia" href="https://linkedin.com/in/rgcomia" />
                <ContactLink label="GitHub" value="github.com/denmt" href="https://github.com/denmt" />
                <ContactLink label="Email" value="crondennis@gmail.com" href="mailto:crondennis@gmail.com" />
              </div>
            </SectionReveal>
          </div>
        </div>
        <div className="w-full mt-20 pt-6 border-t border-ink/15 flex flex-wrap justify-between text-xs uppercase tracking-widest text-ink/60">
          <span>© 2026 Ron Dennis Comia</span>
        </div>
      </footer>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}

function DraggableSticker({
  src,
  initialLeft,
  initialTop,
  width,
  alt,
  defaultRotation = 0,
  delay = "0s",
}: {
  src: string;
  initialLeft: number;
  initialTop: number;
  width: string;
  alt: string;
  defaultRotation?: number;
  delay?: string;
}) {
  const [position, setPosition] = useState({ x: initialLeft, y: initialTop });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: initialLeft, y: initialTop });
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...position };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const parent = stickerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, positionStartRef.current.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100, positionStartRef.current.y + deltaYPercent));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    positionStartRef.current = { ...position };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const parent = stickerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, positionStartRef.current.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100, positionStartRef.current.y + deltaYPercent));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={stickerRef}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: width,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: isDragging ? 50 : 20,
        transform: isDragging
          ? `translate(-50%, -50%) scale(1.15) rotate(${defaultRotation + 6}deg)`
          : isHovered
            ? `translate(-50%, -50%) scale(1.08) rotate(${defaultRotation - 3}deg)`
            : undefined,
        filter: isDragging
          ? "drop-shadow(0 25px 15px rgba(0,0,0,0.35))"
          : isHovered
            ? "drop-shadow(0 15px 10px rgba(0,0,0,0.25))"
            : "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease",
        animation: isDragging || isHovered ? "none" : "stickerWiggleInvite 10s ease-in-out infinite",
        animationDelay: delay,
        "--rot": `${defaultRotation}deg`,
      } as React.CSSProperties}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="select-none active:scale-105"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain pointer-events-none select-none"
        draggable="false"
      />
    </div>
  );
}

function ContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} className="group block">
      <div className="font-display font-bold text-orange text-2xl mb-1">{label}</div>
      <div className="text-sm text-ink/70 group-hover:text-ink underline decoration-orange/40 underline-offset-4">
        {value}
      </div>
    </a>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: (typeof projects)[number];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" />
      <div
        className="relative bg-cream rounded-3xl w-full md:w-[75vw] max-w-[1440px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Project Header Image */}
        <div
          className="rounded-t-3xl w-full h-48 md:h-[300px] relative overflow-hidden"
          style={{ background: 'var(--blue)' }}
        >
          <div className="absolute inset-0 grid-paper opacity-20" />
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 opacity-20 text-cream"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="8" y="8" width="48" height="48" rx="4" />
                <circle cx="24" cy="24" r="6" />
                <path d="M8 40 l16-14 12 10 10-8 10 10" />
              </svg>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            {/* App Logo Placeholder */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-xl text-cream shadow-md bg-blue"
              >
                {project.title.substring(0, 2)}
              </div>
              <span className="font-display font-semibold text-lg text-ink/65 uppercase tracking-wider">
                {project.title} App
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center text-ink hover:bg-blue hover:text-cream transition text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-ink leading-tight">
            {project.title}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-widest px-3 py-1 rounded-full text-cream font-semibold bg-blue"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-6 text-ink/70 leading-relaxed text-lg">{project.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:crondennis@gmail.com?subject=Request%20Demo%20for%20${encodeURIComponent(project.title)}&body=Hi%20Ron,%0D%0A%0D%0AI%20would%20like%20to%20request%20a%20demo%20for%20the%20project:%20${encodeURIComponent(project.title)}.%0D%0A%0D%0AThanks!`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue text-blue hover:bg-blue hover:text-cream transition"
            >
              Request a Demo ✉
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
