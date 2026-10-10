import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";

export const CATALOG_URL = "https://inaciusburgerbar.sischef.shop/catalogo";
export const INSTAGRAM_URL = "https://www.instagram.com/inaciusburgerbar/";
export const WHATSAPP_NUMBER = "5546988048989";

/** Adds `.in` once the element enters the viewport. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    el.querySelectorAll(".reveal, .reveal-img, .wipe").forEach((n) => io.observe(n));
    if (el.matches(".reveal, .reveal-img, .wipe")) io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ children, className = "", delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "h2" | "p" }) {
  const ref = useReveal<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

function addRipple(e: MouseEvent<HTMLElement>) {
  const t = e.currentTarget;
  const r = t.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "ripple-dot";
  dot.style.left = `${e.clientX - r.left}px`;
  dot.style.top = `${e.clientY - r.top}px`;
  t.appendChild(dot);
  setTimeout(() => dot.remove(), 500);
}

export function OrderButton({ children = "Pedir agora", size = "md", className = "" }: { children?: ReactNode; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "px-4 py-2.5 text-[11px]", md: "px-6 py-4 text-xs", lg: "px-8 py-6 text-sm md:px-12 md:py-7 md:text-base" };
  return (
    <a href="/catalogo" data-cursor="PEDIR" onClick={addRipple} className={`btn-order ${sizes[size]} ${className}`}>
      <span>{children}</span>
      <ArrowRight className="size-4" aria-hidden />
    </a>
  );
}

/** Background giant word moving with scroll. */
export function GiantWord({ word, className = "" }: { word: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.parentElement!.getBoundingClientRect();
        el.style.transform = `translateX(${(r.top / window.innerHeight) * 12}%)`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute whitespace-nowrap font-display text-outline select-none text-[28vw] ${className}`}>
      {word}
    </div>
  );
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const t = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t?.dataset['cursor'] ?? "");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  if (!on) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream font-bold text-[10px] tracking-widest text-ink transition-all duration-200 ${label ? "size-16" : "size-3"}`}
      >
        {label}
      </div>
    </div>
  );
}
