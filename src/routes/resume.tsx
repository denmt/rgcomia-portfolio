import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download } from "lucide-react";
import resumePhoto from "@/assets/resume_photo.png";
// @ts-ignore
import resumePdf from "@/assets/ResumeCV.pdf";

export const Route = createFileRoute("/resume")({
  component: ResumePage,
});

// Grid spotlight — auto-orbits across the full page only, no cursor tracking
function ResumeInteractiveGraph() {
  const [pos, setPos] = useState({ x: 400, y: 300 });
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    let animId: number;
    const tick = () => {
      setTime((t) => t + 0.007);
      const t = timeRef.current;
      const W = document.documentElement.scrollWidth || 1200;
      const H = document.documentElement.scrollHeight || 2000;
      // Wide Lissajous-style orbit across the full page
      const targetX = W * 0.5 + Math.sin(t * 0.7) * (W * 0.44);
      const targetY = H * 0.35 + Math.cos(t * 0.45) * (H * 0.30);
      setPos((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.04,
        y: prev.y + (targetY - prev.y) * 0.04,
      }));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none no-print">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--blue) 65%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--blue) 65%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
          animation: "moveGrid 90s linear infinite",
          maskImage: `radial-gradient(ellipse 220px 180px at ${pos.x}px ${pos.y}px, black 15%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(ellipse 220px 180px at ${pos.x}px ${pos.y}px, black 15%, transparent 100%)`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

// Per-item scroll reveal — slides up + fades in on viewport entry
function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.02,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className="reveal-item"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.99)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ResumePage() {
  return (
    <div className="relative min-h-screen text-ink p-6 md:p-12 print:bg-white print:text-black print:p-0 overflow-x-hidden">
      {/* Static ambient grid — always visible at low opacity */}
      <div
        className="fixed inset-0 grid-paper opacity-[0.55] pointer-events-none no-print"
        style={{ zIndex: 0 }}
        aria-hidden
      />
      {/* Interactive pointer-following / auto-orbiting grid spotlight */}
      <ResumeInteractiveGraph />

      {/* Printable page styling injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .reveal-item {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          section, .timeline-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* Floating control bar */}
      <div className="relative z-10 no-print max-w-7xl mx-auto mb-8 flex justify-between items-center bg-blue text-cream px-6 py-4 rounded-2xl shadow-lg">
        <Link to="/" className="font-display font-bold text-sm uppercase tracking-wider hover:text-yellow transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <a
          href={resumePdf}
          download="Ron_Dennis_Comia_Resume.pdf"
          className="bg-orange hover:bg-orange/85 transition-colors text-cream font-semibold px-5 py-2.5 rounded-full text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          Download PDF <Download className="w-4 h-4" />
        </a>
      </div>

      {/* Resume Container — semi-transparent so the grid bleeds through */}
      <div
        className="relative z-10 print-page max-w-7xl mx-auto border border-ink/10 rounded-3xl p-8 md:p-12 shadow-xl print:shadow-none print:border-none print:bg-white animate-fade-in"
        style={{ backgroundColor: 'oklch(0.965 0.035 90 / 0.72)' }}
      >

        {/* Header */}
        <ScrollReveal>
          <header className="border-b-2 border-blue/10 pb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={resumePhoto}
                alt="Ron Dennis G. Comia Profile"
                className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-2xl border-3 border-blue/20 shadow-md bg-cream"
              />
              <div className="text-center md:text-left">
                <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-blue tracking-tight leading-none">
                  Ron Dennis G. Comia
                </h1>
                <p className="mt-3 text-xl md:text-2xl font-semibold text-ink/80 tracking-wide">
                  Full-Stack Engineer &amp; UI/UX Designer
                </p>
              </div>
            </div>
            <div className="text-base text-ink/75 leading-relaxed text-center md:text-right font-medium self-center md:self-end">
              <div>Rosario, Batangas, 4225</div>
              <div>0935 908 0869</div>
              <div><a href="mailto:crondennis@gmail.com" className="hover:text-blue underline underline-offset-4 transition-colors">crondennis@gmail.com</a></div>
              <div><a href="https://github.com/denmt" target="_blank" rel="noreferrer" className="hover:text-blue underline underline-offset-4 transition-colors">github.com/denmt</a></div>
              <div><a href="https://linkedin.com/in/rgcomia" target="_blank" rel="noreferrer" className="hover:text-blue underline underline-offset-4 transition-colors">linkedin.com/in/rgcomia</a></div>
            </div>
          </header>
        </ScrollReveal>

        {/* Profile Summary */}
        <ScrollReveal delay={80}>
          <div className="mt-8 p-6 bg-blue/5 border border-blue/10 rounded-2xl text-lg md:text-xl text-ink/90 leading-relaxed font-medium">
            People-first leader and computer scientist who builds software that matters — from nutrition platforms and civic tools to farmer-government bridges. Combines full-stack development with creative leadership and community-driven thinking. Driven by challenges at the intersection of technology, accessibility, and real-world impact.
          </div>
        </ScrollReveal>

        {/* Two-Column Layout on Desktop, sequential columns on print/mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 print:block print:space-y-12">

          {/* LEFT COLUMN: Main Career Timeline */}
          <div className="lg:col-span-7 space-y-12 print:space-y-12">

            {/* Education Section */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Education
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={60}>
                <div className="timeline-item relative pl-8 pb-2 border-l-2 border-transparent ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">University of the Philippines – Los Baños</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">Bachelor of Science in Computer Science | GWA: 1.667</div>
                      <div className="text-base text-ink/80 mt-1">Expected Graduation: July 2026</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start">
                      2022 – Present
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Work Experience */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Work Experience
                </h2>
              </ScrollReveal>

              {/* Exp 1 */}
              <ScrollReveal delay={60}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">Full-Stack Developer / Tech Intern</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">University of the Philippines Open University – ICT Development Office</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start whitespace-nowrap">
                      June – Aug 2025
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Integrated a dynamic and modular content management system into the university's web platform, enabling administrators to create, manage, and replace static announcements with rich, interactive, and easily updatable content using PHP and React.</li>
                    <li>Collaborated with over 15 interns to develop meaningful projects supporting the university's digital transformation initiatives and enhancing online learning experiences.</li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* Exp 2 */}
              <ScrollReveal delay={80}>
                <div className="timeline-item relative pl-8 pb-2 border-l-2 border-transparent ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">Peer Tutor for Computer Science</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">University of the Philippines Los Baños – Learning Resource Center</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start">
                      2024 – 2026
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Conducted individual and group tutorial sessions for introductory BS Computer Science courses, supporting over 66 students within the first two months.</li>
                    <li>Created sample problems, practice exams, and instructional materials tailored to common student pain points in core CS subjects.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </section>

            {/* Organizational Experience */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Organizational Experience
                </h2>
              </ScrollReveal>

              {/* Org 1 */}
              <ScrollReveal delay={60}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">Marketing and Engagement Head</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">The Innovation Lab - Alliance of Computer Science Students - UPLB</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start whitespace-nowrap">
                      Dec 2025 – Mar 2026
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Pioneered and executed marketing plans for an end-to-end national hackathon, reaching 100+ participants and 20 competing teams.</li>
                    <li>Pioneered the hackathon's visual identity and online presence from scratch, growing to 470 organic followers and securing institutional partners including Burt Intelligence, TTBDO, and Limitless Lab.</li>
                    <li>Managed content creation, editing, and design processes, resulting in nearly 13.0K total views across all content formats.</li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* Org 2 */}
              <ScrollReveal delay={80}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">Publications Committee Head</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">UP Caballeros</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start">
                      2024 – 2025
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Led the publication team responsible for producing high-quality content and promotional materials, achieving 30.7K reach across social media and digital platforms.</li>
                    <li>Managed content creation, editing, and design processes for official publications and event promotions, resulting in nearly 180K total views across all content formats.</li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* Org 3 */}
              <ScrollReveal delay={100}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">Assistant Developer – Membership/Internals</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">Alliance of Computer Science Students – UPLB</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start">
                      2024 – 2025
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Oversaw the Membership and Internals Division, managing human resources and internal relations for over 300 members and alumni across a decade-old academic organization.</li>
                    <li>Redesigned and streamlined the member application process, which handled an average of nearly 100 applicants per term.</li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* Org 4 */}
              <ScrollReveal delay={120}>
                <div className="timeline-item relative pl-8 pb-2 border-l-2 border-transparent ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl md:text-2xl text-ink">UPLB Delegate – Scholars Leadership Camp</h3>
                      <div className="text-base md:text-lg text-blue font-semibold mt-1">DOST-SEI, Talisay, Batangas</div>
                    </div>
                    <span className="shrink-0 text-sm md:text-base font-semibold text-blue bg-blue/10 px-4 py-1.5 rounded-full self-start">
                      April 2025
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-5 mt-4 text-ink/80 text-base md:text-lg leading-relaxed space-y-2.5">
                    <li>Represented UPLB's DOST-SEI scholars at the regional stage, contributing to leadership and nation-building discussions alongside co-scholars from across Region IV-A.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </section>

          </div>

          {/* RIGHT COLUMN: Projects, Awards, and Tech Stack */}
          <div className="lg:col-span-5 space-y-12 print:space-y-12">

            {/* Selected Projects */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Selected Projects
                </h2>
              </ScrollReveal>

              {/* KainPo */}
              <ScrollReveal delay={60}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10 animate-pulse" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-ink">KainPo <span className="text-sm font-normal text-ink/60 block sm:inline sm:ml-1">| Lead</span></h3>
                      <div className="text-sm text-blue font-semibold mt-0.5">Mobile Application</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      In Dev
                    </span>
                  </div>
                  <p className="mt-3 text-ink/80 text-base leading-relaxed">
                    Developed a platform helping Filipinos meet nutrition needs via meal planning, tracking, and Registered Dietitians access. Rooted in Filipino food exchange lists.
                  </p>
                </div>
              </ScrollReveal>

              {/* Tilaok */}
              <ScrollReveal delay={80}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-ink">Tilaok <span className="text-sm font-normal text-ink/60 block sm:inline sm:ml-1">| Frontend</span></h3>
                      <div className="text-sm text-blue font-semibold mt-0.5">Mobile Application</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      Aug 2025
                    </span>
                  </div>
                  <p className="mt-3 text-ink/80 text-base leading-relaxed">
                    Bridged the communication gap between Filipino farmers and the Department of Agriculture, enabling real-time two-way messaging through React web app/SMS.
                  </p>
                </div>
              </ScrollReveal>

              {/* TarShare */}
              <ScrollReveal delay={100}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-ink">TarShare <span className="text-sm font-normal text-ink/60 block sm:inline sm:ml-1">| Frontend</span></h3>
                      <div className="text-sm text-blue font-semibold mt-0.5">Mobile Application</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      June 2025
                    </span>
                  </div>
                  <p className="mt-3 text-ink/80 text-base leading-relaxed">
                    Created a platform helping citizens turn informal grievances into formal complaints to local government, making civic justice accessible.
                  </p>
                </div>
              </ScrollReveal>

              {/* Flexor */}
              <ScrollReveal delay={120}>
                <div className="timeline-item relative pl-8 pb-10 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-ink">Flexor <span className="text-sm font-normal text-ink/60 block sm:inline sm:ml-1">| Frontend</span></h3>
                      <div className="text-sm text-blue font-semibold mt-0.5">Financial Visualization</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      Sept 2025
                    </span>
                  </div>
                  <p className="mt-3 text-ink/80 text-base leading-relaxed">
                    Interactive visualization platform combining interpretable models, category spending, and AI agents to help Filipinos plan finances.
                  </p>
                </div>
              </ScrollReveal>

              {/* ICSync */}
              <ScrollReveal delay={140}>
                <div className="timeline-item relative pl-8 pb-2 border-l-2 border-transparent ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-ink">ICSync <span className="text-sm font-normal text-ink/60 block sm:inline sm:ml-1">| Frontend</span></h3>
                      <div className="text-sm text-blue font-semibold mt-0.5">Alumni Tracker &amp; POS</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      Dec 2025
                    </span>
                  </div>
                  <p className="mt-3 text-ink/80 text-base leading-relaxed">
                    Centralized web system for tracking and managing alumni records for the Institute of Computer Science - CAS, UPLB.
                  </p>
                </div>
              </ScrollReveal>
            </section>

            {/* Awards & Recognitions */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Awards
                </h2>
              </ScrollReveal>

              {/* Award 1 */}
              <ScrollReveal delay={60}>
                <div className="timeline-item relative pl-8 pb-6 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="font-bold text-base md:text-lg text-ink">
                      1st Runner-up <span className="font-normal text-ink/60">— Technovation Hackathon, Cebu</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      2025
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Award 2 */}
              <ScrollReveal delay={80}>
                <div className="timeline-item relative pl-8 pb-6 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="font-bold text-base md:text-lg text-ink">
                      4th Runner-up <span className="font-normal text-ink/60">— GDG-PUP Sparkfest 2025</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      2025
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Award 3 */}
              <ScrollReveal delay={100}>
                <div className="timeline-item relative pl-8 pb-6 border-l-2 border-blue/20 ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="font-bold text-base md:text-lg text-ink">
                      Consistent University / College Scholar <span className="font-normal text-ink/60">— GWA: 1.667, UPLB</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      2021–26
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Award 4 */}
              <ScrollReveal delay={120}>
                <div className="timeline-item relative pl-8 pb-2 border-l-2 border-transparent ml-3">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue border-4 border-cream ring-4 ring-blue/10" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <span className="font-bold text-base md:text-lg text-ink">
                      JLSS DOST-SEI Merit Scholar
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-blue bg-blue/10 px-3 py-1 rounded-full self-start">
                      2024–26
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Core Technologies */}
            <section>
              <ScrollReveal>
                <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-widest text-blue border-b-2 border-blue/10 pb-3 mb-6">
                  Core Technologies
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-2 gap-4 text-sm md:text-base text-ink/80">
                <ScrollReveal delay={60}>
                  <div className="p-4 bg-blue/5 rounded-xl border border-blue/10">
                    <strong className="text-base text-blue block mb-1 font-display">Languages</strong>
                    Python, JS
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={80}>
                  <div className="p-4 bg-blue/5 rounded-xl border border-blue/10">
                    <strong className="text-base text-blue block mb-1 font-display">Web Frameworks</strong>
                    Next.js, React, Node.js
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={100}>
                  <div className="p-4 bg-blue/5 rounded-xl border border-blue/10">
                    <strong className="text-base text-blue block mb-1 font-display">AI / Database</strong>
                    RAG, Gemini, Supabase
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={120}>
                  <div className="p-4 bg-blue/5 rounded-xl border border-blue/10">
                    <strong className="text-base text-blue block mb-1 font-display">Tools</strong>
                    Git, Figma, Firebase
                  </div>
                </ScrollReveal>
              </div>
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}
