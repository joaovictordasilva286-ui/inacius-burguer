import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Star, MapPin, Clock, Bike, ShoppingBag, Instagram, MessageCircle } from "lucide-react";
import { CATALOG_URL, INSTAGRAM_URL, OrderButton, Reveal, GiantWord, Cursor, useReveal, WHATSAPP_NUMBER } from "@/components/site/primitives";
import hero from "@/assets/hero-burger.jpg";
import smash from "@/assets/smash.jpg";
import brioche from "@/assets/brioche.jpg";
import chapa from "@/assets/chapa.jpg";
import caramebacon from "@/assets/caramebacon.jpg";
import parmegiana from "@/assets/parmegiana.jpg";
import crispy from "@/assets/crispy.jpg";
import classico from "@/assets/classico.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inaciu's Burgerbar | Hamburgueria artesanal em Francisco Beltrão – PR" },
      { name: "description", content: "Burger artesanal e smash em Francisco Beltrão. Pão brioche, blends de 150g e combinações da casa. Delivery, retirada e refeição no local." },
      { name: "keywords", content: "hamburgueria em Francisco Beltrão, burger artesanal em Francisco Beltrão, delivery de hambúrguer Francisco Beltrão, smash burger" },
      { property: "og:title", content: "Inaciu's Burgerbar — Não é só um burger." },
      { property: "og:description", content: "Hamburgueria artesanal em Francisco Beltrão – PR. Delivery e retirada." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Inaciu's Burgerbar",
          servesCuisine: "Hambúrguer artesanal",
          address: { "@type": "PostalAddress", streetAddress: "Av. Julio Assis Cavalheiro", addressLocality: "Francisco Beltrão", postalCode: "85601-274", addressRegion: "PR", addressCountry: "BR" },
          telephone: "+55 46 98804-8989",
          url: "https://inaciusburger.com.br",
          hasMenu: CATALOG_URL,
          sameAs: [INSTAGRAM_URL],
        }),
      },
    ],
  }),
  component: Index,
});

const NAV = [
  ["Início", "#inicio"],
  ["Favoritos", "#favoritos"],
  ["Cardápio", "/catalogo"],
  ["A experiência", "#experiencia"],
  ["Avaliações", "#avaliacoes"],
  ["Localização", "#localizacao"],
] as const;

// Preços ilustrativos — substituir pelos valores reais do catálogo.
const BURGERS = [
  { name: "Inacius Burger", desc: "O clássico da casa. Blend 150g, cheddar, salada e molho especial.", price: "32,90", img: classico },
  { name: "Inacius Caramebacon", desc: "Bacon caramelizado, cebola na manteiga e cheddar derretido.", price: "38,90", img: caramebacon },
  { name: "Inacius Cheddar e Bacon", desc: "Cheddar cremoso escorrendo e bacon em tiras generosas.", price: "36,90", img: hero },
  { name: "Inacius Crispy Bacon", desc: "Bacon crocante em flocos sobre molho de cheddar.", price: "37,90", img: crispy },
  { name: "Inacius Parmegiana", desc: "Empanado crocante, molho de tomate e muçarela gratinada.", price: "36,90", img: parmegiana },
  { name: "Smash 2.0", desc: "Dois smash de borda crocante, queijo, picles e cebola.", price: "29,90", img: smash },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "bg-ink/90 backdrop-blur-md border-b border-border" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <a href="#inicio" className="animate-neon font-display text-2xl tracking-wide md:text-3xl" aria-label="Inaciu's Burgerbar — início">
          INACIU’S<span className="ml-1.5 hidden align-middle font-sans sm:inline text-[9px] font-bold tracking-[0.3em] text-cheddar">BURGERBAR</span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/70 transition-colors hover:text-cheddar">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <OrderButton size="sm" />
          <button className="grid size-10 place-items-center lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border px-5 pb-8 pt-4 lg:hidden" aria-label="Menu mobile">
          {NAV.map(([l, h], i) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="animate-rise block border-b border-border py-4 font-display text-4xl" style={{ animationDelay: `${i * 40}ms` }}>
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const on = () => {
      if (img.current) img.current.style.transform = `translateY(${window.scrollY * 0.15}px) scale(${1 + window.scrollY * 0.0002})`;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section id="inicio" className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <div className="animate-hero-zoom absolute inset-0" style={{ animationDelay: "150ms" }}>
        <img ref={img} src={hero} alt="Burger artesanal com cheddar derretido e bacon" width={1920} height={1088} className="h-full w-full object-cover object-[70%_center] will-change-transform" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/70 md:to-transparent" />
      <div aria-hidden className="pointer-events-none absolute right-[30%] top-[25%] size-64 rounded-full bg-cream/10 blur-3xl animate-smoke" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-32 md:px-8 md:pb-24">
        <p className="animate-rise mb-6 text-[11px] font-bold uppercase tracking-[0.35em] text-cheddar" style={{ animationDelay: "300ms" }}>
          Burger artesanal · Francisco Beltrão – PR
        </p>
        <h1 className="font-display text-[22vw] md:text-[10.5rem]">
          <span className="animate-rise block" style={{ animationDelay: "400ms" }}>Não é só</span>
          <span className="animate-rise block text-cheddar" style={{ animationDelay: "550ms" }}>um burger.</span>
        </h1>
        <p className="animate-rise mt-6 max-w-md text-base text-foreground/80 md:text-lg" style={{ animationDelay: "700ms" }}>
          Pão brioche, burgers artesanais e combinações que fazem a fome perder a paciência.
        </p>
        <ul className="animate-rise mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-widest text-foreground/70" style={{ animationDelay: "800ms" }}>
          <li className="flex items-center gap-1.5"><Star className="size-3.5 fill-cheddar text-cheddar" /> 5.0 em avaliações</li>
          <li>Retirada rápida</li>
          <li>Delivery em Francisco Beltrão</li>
        </ul>
        <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "950ms" }}>
          <OrderButton />
          <a href="#favoritos" className="btn-ghost-line px-6 py-4 text-xs">Ver os favoritos</a>
        </div>
      </div>
    </section>
  );
}

function Favorites() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="favoritos" className="relative overflow-hidden bg-background py-24 md:py-36">
      <GiantWord word="Mordida" className="top-10 -left-10" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <p className="reveal mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-cheddar">Os favoritos da casa</p>
            <h2 className="font-display text-6xl md:text-9xl">
              <span className="wipe">Escolha sua</span>
              <br />
              <span className="wipe text-cheddar">mordida.</span>
            </h2>
          </div>
          <p className="reveal max-w-xs text-muted-foreground">Seis assinaturas que viraram motivo de volta. Toque, escolha e peça.</p>
        </div>
        <div id="cardapio" className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {BURGERS.map((b, i) => (
            <a
              key={b.name}
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="VER"
              className={`reveal group block ${i % 2 === 1 ? "md:mt-16" : ""} ${i % 3 === 1 ? "lg:mt-24" : "lg:mt-0"}`}
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <div className="reveal-img relative aspect-[4/5] overflow-hidden bg-card transition-transform duration-500 group-hover:-translate-y-1.5">
                <img src={b.img} alt={b.name} loading="lazy" width={1024} height={1280} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] group-hover:rotate-1" />
                <span className="absolute left-4 top-4 font-display text-5xl text-cream/90">0{i + 1}</span>
                <span className="btn-order absolute bottom-4 right-4 px-4 py-2.5 text-[11px] md:translate-y-3 md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <span>Pedir este</span>
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl transition-colors group-hover:text-cheddar">{b.name}</h3>
                  <p className="mt-2 max-w-[18rem] text-sm text-muted-foreground">{b.desc}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="block text-[10px] uppercase tracking-widest text-steel">a partir de</span>
                  <span className="font-display text-2xl text-cheddar">R$ {b.price}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const ref = useReveal<HTMLDivElement>();
  const items = [
    { t: "Pão brioche", d: "Macio, dourado e preparado para segurar a mordida.", img: brioche },
    { t: "Burger artesanal", d: "Carne de qualidade, sabor e ponto certo.", img: chapa },
    { t: "Combinações da casa", d: "Ingredientes que fogem do óbvio.", img: caramebacon },
  ];
  return (
    <section id="experiencia" className="relative overflow-hidden bg-cream py-24 text-ink md:py-36">
      <div ref={ref} className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="reveal font-display text-6xl md:text-[8.5rem]">
          Feito para sujar a mão.
          <br />
          <span className="text-ketchup">E ficar na memória.</span>
        </h2>
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-6">
          {items.map((it, i) => (
            <div key={it.t} className={`reveal ${i === 1 ? "md:mt-20" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="reveal-img aspect-[4/5] overflow-hidden">
                <img src={it.img} alt={it.t} loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
              </div>
              <div className="mt-5 flex gap-4 border-t-2 border-ink pt-4">
                <span className="font-display text-2xl text-ketchup">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-3xl">{it.t}</h3>
                  <p className="mt-1 text-sm text-ink/70">{it.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Versus() {
  const [side, setSide] = useState<"a" | "s" | null>(null);
  const opts = [
    { k: "a" as const, title: "Artesanais", d: "Burgers de 150g, mais altos, intensos e completos.", hover: "Alto. Intenso. Completo.", img: hero },
    { k: "s" as const, title: "Smash", d: "Mais diretos, crocantes, rápidos e viciantes.", hover: "Crocante. Rápido. Viciante.", img: smash },
  ];
  return (
    <section className="bg-ink">
      <div className="px-5 pt-24 text-center md:pt-32">
        <Reveal as="h2" className="font-display text-6xl md:text-9xl">
          Artesanal <span className="text-cheddar">ou</span> smash?
        </Reveal>
      </div>
      <div className="mt-12 flex flex-col md:mt-16 md:h-[80vh] md:flex-row" onMouseLeave={() => setSide(null)}>
        {opts.map((o) => {
          const active = side === o.k;
          const dim = side !== null && !active;
          return (
            <div
              key={o.k}
              onMouseEnter={() => setSide(o.k)}
              onClick={() => setSide(o.k)}
              className={`grain relative flex h-[70vh] items-end overflow-hidden transition-[flex] duration-700 md:h-auto ${active ? "md:flex-[1.6]" : "md:flex-1"}`}
            >
              <img src={o.img} alt={o.title} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${active ? "scale-105 brightness-100" : dim ? "brightness-[0.35] grayscale" : "brightness-75"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="relative z-10 p-6 md:p-12">
                <h3 className={`font-display text-7xl transition-colors md:text-8xl ${active ? "text-cheddar" : ""}`}>{o.title}</h3>
                <p className="mt-3 max-w-sm text-foreground/85">{active ? o.hover : o.d}</p>
                <OrderButton className="mt-6">Quero escolher o meu</OrderButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Social() {
  const shots = [classico, crispy, chapa, parmegiana, brioche, smash, caramebacon, hero];
  return (
    <section id="avaliacoes" className="relative overflow-hidden bg-background py-24 md:py-36">
      <GiantWord word="Fome" className="-top-6 right-0" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[1.2fr_1fr] md:items-end md:px-8">
        <Reveal as="h2" className="font-display text-7xl md:text-[9rem]">
          Quem prova,<br /><span className="text-cheddar">volta.</span>
        </Reveal>
        <Reveal className="flex items-end gap-4" delay={150}>
          <span className="font-display text-[9rem] leading-none text-cheddar md:text-[12rem]">5.0</span>
          <div className="pb-6">
            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-5 fill-cheddar text-cheddar" />)}</div>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">5,0 no Google · 8 avaliações</p>
          </div>
        </Reveal>
      </div>
      <div className="relative mx-auto mt-16 grid max-w-7xl gap-px bg-border px-5 md:grid-cols-3 md:px-8">
        {[
          ["Camila Beraldo de Almeida Fischer", "Melhor hambúrguer da cidade!"],
          ["Hendrica Vitória Fortes Veiga", "Lugar muito bom, ambiente agradável e comida ótima! Com certeza vale a pena conhecer."],
          ["Maria Eduarda Toledo Beltrame", "Ambiente agradável, comida boa e atendimento bom."],
        ].map(([name, quote], i) => (
          <Reveal key={name} delay={i * 90} className="bg-background p-8">
            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-3.5 fill-cheddar text-cheddar" />)}</div>
            <p className="mt-4 text-lg text-foreground/70 italic">“{quote}”</p>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">— {name}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-24">
        <div className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-4 px-5 md:flex-row md:items-end md:px-8">
          <p className="text-xl text-foreground/80">Acompanhe a fome em tempo real.<br /><strong className="font-display text-4xl text-cream">@inaciusburgerbar</strong></p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-line self-start px-6 py-4 text-xs md:self-auto">
            <Instagram className="size-4" /> Ver Instagram
          </a>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {[...shots, ...shots].map((s, i) => (
              <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-cursor="VER" aria-label="Ver no Instagram" className="group relative size-44 shrink-0 overflow-hidden md:size-56">
                <img src={s} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/60 text-xs font-bold uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                  <Instagram className="size-6" /> Ver no Instagram
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Location() {
  const info = [
    { icon: MapPin, t: "Endereço", d: "Av. Julio Assis Cavalheiro · Francisco Beltrão – PR · 85601-274" },
    { icon: Clock, t: "Horários", d: "Fechado agora · abre às 18:00" },
    { icon: Bike, t: "Delivery", d: "Entrega, retirada e refeição no local" },
    { icon: ShoppingBag, t: "Retirada", d: "Peça online e retire no balcão" },
  ];
  return (
    <section id="localizacao" className="bg-ink py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-8">
        <div>
          <Reveal as="h2" className="font-display text-6xl md:text-8xl">Onde a<br /><span className="text-cheddar">chapa esquenta.</span></Reveal>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {info.map(({ icon: I, t, d }) => (
              <li key={t} className="flex gap-5 py-5">
                <I className="mt-0.5 size-5 shrink-0 text-cheddar" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">{t}</p>
                  <p className="mt-1 text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <OrderButton />
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-ghost-line px-6 py-4 text-xs">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
        <Reveal className="min-h-[360px] overflow-hidden border border-border" delay={150}>
          <iframe
            title="Mapa — Inaciu's Burgerbar em Francisco Beltrão"
            src="https://www.google.com/maps?q=Av.+Julio+Assis+Cavalheiro,+Francisco+Beltr%C3%A3o,+PR,+85601-274&output=embed"
            className="h-full min-h-[360px] w-full grayscale invert-[0.92] contrast-[0.9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="grain relative flex min-h-[90svh] items-center overflow-hidden bg-ink">
      <img src={smash} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 text-center md:px-8">
        <Reveal as="h2" className="font-display text-[17vw] md:text-[10rem]">
          A fome já decidiu.<br /><span className="text-cheddar">Agora é só pedir.</span>
        </Reveal>
        <Reveal delay={200} className="mt-12">
          <OrderButton size="lg">Abrir cardápio e pedir agora</OrderButton>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-ink px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-xs uppercase tracking-widest text-steel md:flex-row md:items-center">
        <span className="font-display text-2xl normal-case text-cream">INACIU’S</span>
        <span>Hamburgueria artesanal · Francisco Beltrão – PR</span>
        <span>© {new Date().getFullYear()} Inaciu’s Burgerbar</span>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none">
      <Cursor />
      <Nav />
      <Hero />
      <Favorites />
      <Experience />
      <Versus />
      <Social />
      <Location />
      <FinalCta />
      <Footer />
    </main>
  );
}
