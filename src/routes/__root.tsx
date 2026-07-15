import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import websiteLogo from "../assets/website_logo.png";
import nameCard from "../assets/name_card.png";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

// ── Loading / Intro Screen ────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // Logo revealed → hold → slide up and reveal page
    const holdTimer = setTimeout(() => setPhase("out"), 1600);
    return () => clearTimeout(holdTimer);
  }, []);

  useEffect(() => {
    if (phase === "out") {
      // Wait for slide-up animation to finish then unmount
      const done = setTimeout(onDone, 800);
      return () => clearTimeout(done);
    }
  }, [phase, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--cream)",
        animation: phase === "out" ? "loaderFadeOut 0.75s ease-in-out forwards" : undefined,
        overflow: "hidden",
      }}
    >
      {/* Subtle ambient grid on dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--orange) 18%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--orange) 18%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <img
        src={nameCard}
        alt="Ron Comia"
        style={{
          width: "clamp(180px, 30vw, 420px)",
          height: "auto",
          objectFit: "contain",
          animation: "logoReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Loading bar */}
      <div
        style={{
          marginTop: "2.5rem",
          width: "clamp(80px, 12vw, 140px)",
          height: "2px",
          borderRadius: "999px",
          backgroundColor: "color-mix(in oklab, var(--cream) 15%, transparent)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          animation: "logoReveal 0.5s ease 0.5s both",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--orange)",
            borderRadius: "999px",
            transformOrigin: "left",
            animation: "loaderBar 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
          }}
        />
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ron Dennis Comia" },
      {
        name: "description",
        content:
          "Portfolio of Ron Comia — designer and multidisciplinary maker building bold, human-first work.",
      },
      { name: "author", content: "Ron Comia" },
      { property: "og:title", content: "Ron Comia — Designing for the People" },
      {
        property: "og:description",
        content: "Portfolio of Ron Comia — designer and multidisciplinary maker.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: websiteLogo, type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-262SQDW9T3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-262SQDW9T3');
            `,
          }}
        />
        {/* Loading bar keyframe — needs to live in a style tag since it references a CSS custom prop */}
        <style>{`
          @keyframes loaderBar {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
