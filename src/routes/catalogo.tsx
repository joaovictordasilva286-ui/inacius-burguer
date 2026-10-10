import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CirclePlus, MapPin, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATALOG_URL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/components/site/primitives";
import hero from "@/assets/hero-burger.jpg";
import smash from "@/assets/smash.jpg";
import caramebacon from "@/assets/caramebacon.jpg";
import parmegiana from "@/assets/parmegiana.jpg";
import crispy from "@/assets/crispy.jpg";
import classico from "@/assets/classico.jpg";

export const Route = createFileRoute("/catalogo")({
  head: () => ({ meta: [{ title: "Cardápio | Inaciu's Burgerbar" }, { name: "description", content: "Peça burgers artesanais e smash da Inaciu's Burgerbar em Pato Branco." }] }),
  component: CatalogPage,
});

type Category = "Burgers" | "Smash" | "Porções" | "Bebidas";
type MenuItem = { id: string; category: Category; name: string; description: string; price: number; image?: string; tag?: string };
type CartItem = MenuItem & { qty: number };

const MENU: MenuItem[] = [
  { id: "inacius", category: "Burgers", name: "Inacius Burger", description: "Pão brioche, maionese da casa, burger 150g e queijo prato. Acompanha fritas.", price: 29.99, image: classico, tag: "O clássico" },
  { id: "abacaxi", category: "Burgers", name: "Inacius Abacaxi", description: "Burger 150g, queijo prato, bacon em fatias e abacaxi selado.", price: 37.99, image: hero },
  { id: "caramebacon", category: "Burgers", name: "Inacius Caramebacon", description: "Burger 150g, queijo, bacon em fatias e cebola caramelizada.", price: 36.99, image: caramebacon, tag: "Mais pedido" },
  { id: "cheddar-bacon", category: "Burgers", name: "Inacius Cheddar e Bacon", description: "Burger 150g, molho cheddar e farofa de bacon. Acompanha fritas.", price: 36.99, image: hero },
  { id: "crispy", category: "Burgers", name: "Inacius Crispy Bacon", description: "Burger 150g, queijo coalho chapeado, geleia de bacon e crispy.", price: 42.99, image: crispy },
  { id: "parmegiana", category: "Burgers", name: "Inacius Parmegiana", description: "Burger 150g empanado na panko, queijo coalho e molho especial.", price: 42.9, image: parmegiana, tag: "Promo" },
  { id: "smash-1", category: "Smash", name: "Smash 1.0", description: "Pão brioche, molho Inacius, smash 60g e cheddar.", price: 19.9, image: smash },
  { id: "smash-2", category: "Smash", name: "Smash 2.0", description: "Dois smash de 60g, cheddar e o molho da casa.", price: 24.9, image: smash, tag: "Viciante" },
  { id: "smash-3", category: "Smash", name: "Smash 3.0", description: "Três smash de 60g e três fatias de cheddar.", price: 29.9, image: smash },
  { id: "smash-melt", category: "Smash", name: "Smash Melt 2.0", description: "Dois smash, cheddar cremoso e cebola caramelizada.", price: 34.9, image: smash },
  { id: "smash-salada", category: "Smash", name: "Smash Salada Bacon 2.0", description: "Dois smash, bacon, alface, tomate e cheddar.", price: 34.9, image: smash },
  { id: "batata", category: "Porções", name: "Batata frita", description: "Porção dourada e crocante para dividir ou não.", price: 16, image: crispy },
  { id: "onion", category: "Porções", name: "Onion rings", description: "Anéis de cebola crocantes com molho da casa.", price: 18, image: crispy },
  { id: "combo-fritas", category: "Porções", name: "Fritas com cheddar e bacon", description: "Batata, cheddar cremoso e farofa de bacon.", price: 24, image: crispy, tag: "Para compartilhar" },
  { id: "coca", category: "Bebidas", name: "Coca-Cola lata", description: "350 ml gelada.", price: 6 },
  { id: "coca-zero", category: "Bebidas", name: "Coca-Cola zero lata", description: "350 ml gelada.", price: 6 },
  { id: "agua", category: "Bebidas", name: "Água mineral", description: "Com ou sem gás.", price: 4 },
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function CatalogPage() {
  const [category, setCategory] = useState<Category | "Todos">("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "retirada">("delivery");
  const [form, setForm] = useState({ name: "", phone: "", address: "", number: "", district: "", complement: "", payment: "Pix" });

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("inacius-cart") || "[]")); } catch { /* ignore invalid saved cart */ }
  }, []);
  useEffect(() => { localStorage.setItem("inacius-cart", JSON.stringify(cart)); }, [cart]);

  const add = (item: MenuItem) => {
    setCart((old) => {
      const found = old.find((x) => x.id === item.id);
      return found ? old.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...old, { ...item, qty: 1 }];
    });
    setOpen(true);
  };
  const change = (id: string, by: number) => setCart((old) => old.flatMap((x) => x.id !== id ? [x] : x.qty + by > 0 ? [{ ...x, qty: x.qty + by }] : []));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = category === "Todos" ? MENU : MENU.filter((item) => item.category === category);
  const finalize = () => {
    if (!cart.length || !form.name || !form.phone || (orderType === "delivery" && (!form.address || !form.number || !form.district))) return;
    const list = cart.map((item) => `• ${item.qty}x ${item.name} — ${money.format(item.price * item.qty)}`).join("%0A");
    const destination = orderType === "delivery" ? `Entrega: ${form.address}, ${form.number} — ${form.district}${form.complement ? ` (${form.complement})` : ""}` : "Retirada no balcão";
    const message = `Olá, Inaciu's! Quero fazer um pedido:%0A%0A${list}%0A%0ASubtotal: ${money.format(subtotal)}%0A${destination}%0ANome: ${form.name}%0ATelefone: ${form.phone}%0APagamento: ${form.payment}%0A%0APode me confirmar a taxa e o total?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <a href="/" className="flex items-center gap-3 font-display text-2xl" aria-label="Voltar para o início"><ArrowLeft className="size-4 text-cheddar" /> INACIU’S</a>
          <p className="hidden text-[10px] font-bold uppercase tracking-[.25em] text-steel sm:block">Cardápio da casa</p>
          <button onClick={() => setOpen(true)} className="btn-order px-4 py-3 text-[11px]" aria-label={`Abrir sacola, ${count} itens`}><ShoppingBag className="size-4" /><span>Sacola {count ? `(${count})` : ""}</span></button>
        </div>
      </header>

      <section className="grain relative overflow-hidden border-b border-border bg-ink">
        <img src={hero} alt="Burger artesanal Inaciu's" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/25" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[.35em] text-cheddar">Pedido online · Pato Branco</p>
          <h1 className="font-display text-[5.7rem] leading-[.78] sm:text-[8rem] md:text-[11rem]">A sua<br /><span className="text-cheddar">mordida.</span></h1>
          <p className="mt-7 max-w-md text-foreground/75">Monte seu pedido, informe entrega ou retirada e envie direto para a casa. Simples, rápido e sem perder a fome.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-16 md:flex-row md:items-end">
          <div><p className="text-[11px] font-bold uppercase tracking-[.35em] text-cheddar">O cardápio</p><h2 className="mt-3 font-display text-6xl md:text-8xl">Escolha sem<br />pressa. <span className="text-cheddar">Peça com fome.</span></h2></div>
          <a className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-cheddar" href={CATALOG_URL} target="_blank" rel="noreferrer">Abrir catálogo original <ArrowRight className="size-4" /></a>
        </div>
        <div className="sticky top-16 z-30 -mx-5 mb-10 overflow-x-auto border-y border-border bg-background/95 px-5 py-3 backdrop-blur-md md:top-20 md:-mx-8 md:px-8">
          <div className="flex min-w-max gap-2">{(["Todos", "Burgers", "Smash", "Porções", "Bebidas"] as const).map((name) => <button key={name} onClick={() => setCategory(name)} className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${category === name ? "border-cheddar bg-cheddar text-ink" : "border-border text-foreground/70 hover:border-cheddar"}`}>{name}</button>)}</div>
        </div>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={item.id} className={`group ${index % 3 === 1 ? "lg:mt-14" : ""}`}>
          <div className={`relative overflow-hidden bg-card ${item.image ? "aspect-[4/4.5]" : "aspect-[4/2.1]"}`}>
            {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_0%,rgba(242,161,58,.2),transparent_45%)]"><span className="font-display text-5xl text-cheddar/70">GELADA.</span></div>}
            {item.tag && <span className="absolute left-4 top-4 bg-cheddar px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-ink">{item.tag}</span>}
            <button onClick={() => add(item)} className="absolute bottom-4 right-4 grid size-12 place-items-center bg-cream text-ink shadow-xl transition-transform hover:scale-105" aria-label={`Adicionar ${item.name}`}><Plus className="size-5" /></button>
          </div>
          <div className="mt-5 flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-steel">{item.category}</p><h3 className="mt-1 font-display text-3xl">{item.name}</h3><p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.description}</p></div><p className="shrink-0 font-display text-2xl text-cheddar">{money.format(item.price)}</p></div>
        </article>)}</div>
      </section>

      <section className="border-t border-border bg-ink px-5 py-10 text-center md:px-8"><p className="text-sm text-foreground/65">Quer ver itens e opções atualizadas pela casa?</p><a href={CATALOG_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cheddar">Abrir catálogo Sischef <ArrowRight className="size-4" /></a></section>

      {open && <aside role="dialog" aria-modal="true" aria-label="Sua sacola" className="fixed inset-0 z-[70] flex justify-end">
        <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Fechar sacola" onClick={() => setOpen(false)} />
        <div className="relative flex h-full w-full max-w-xl flex-col bg-ink shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[.3em] text-cheddar">Seu pedido</p><h2 className="mt-1 font-display text-4xl">A sacola.</h2></div><button onClick={() => setOpen(false)} className="grid size-11 place-items-center border border-border"><X /></button></div>
          {!checkout ? <><div className="flex-1 overflow-y-auto px-6 py-4">{cart.length ? cart.map((item) => <div key={item.id} className="flex gap-4 border-b border-border py-5"><div className="grid size-16 shrink-0 place-items-center bg-card">{item.image ? <img src={item.image} alt="" className="size-full object-cover" /> : <CirclePlus className="text-cheddar" />}</div><div className="min-w-0 flex-1"><h3 className="font-display text-2xl">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{money.format(item.price)}</p><div className="mt-3 flex items-center gap-3"><button className="grid size-8 place-items-center border border-border" onClick={() => change(item.id, -1)} aria-label={`Diminuir ${item.name}`}><Minus className="size-3" /></button><span className="min-w-4 text-center text-sm font-bold">{item.qty}</span><button className="grid size-8 place-items-center border border-border" onClick={() => change(item.id, 1)} aria-label={`Aumentar ${item.name}`}><Plus className="size-3" /></button><button className="ml-auto text-steel hover:text-ketchup" onClick={() => change(item.id, -item.qty)} aria-label={`Remover ${item.name}`}><Trash2 className="size-4" /></button></div></div><p className="font-display text-xl text-cheddar">{money.format(item.price * item.qty)}</p></div>) : <div className="grid h-full min-h-72 place-items-center text-center"><div><ShoppingBag className="mx-auto size-8 text-cheddar" /><p className="mt-4 font-display text-3xl">Sua sacola está vazia.</p><p className="mt-2 text-sm text-muted-foreground">Escolha algo que vale a mordida.</p></div></div>}</div><div className="border-t border-border p-6"><div className="mb-5 flex justify-between font-display text-3xl"><span>Subtotal</span><span className="text-cheddar">{money.format(subtotal)}</span></div><button disabled={!cart.length} onClick={() => setCheckout(true)} className="btn-order w-full justify-center px-6 py-5 text-xs disabled:cursor-not-allowed disabled:opacity-40"><span>Continuar pedido</span><ArrowRight className="size-4" /></button></div></> : <div className="flex-1 overflow-y-auto px-6 py-6"><button className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-steel hover:text-cream" onClick={() => setCheckout(false)}><ArrowLeft className="size-4" /> Voltar à sacola</button><h3 className="font-display text-4xl">Entrega ou<br /><span className="text-cheddar">retirada?</span></h3><div className="mt-6 grid grid-cols-2 gap-3">{([['delivery','Entrega'],['retirada','Retirada']] as const).map(([key,label]) => <button key={key} onClick={() => setOrderType(key)} className={`border p-4 text-left ${orderType === key ? "border-cheddar bg-cheddar/10" : "border-border"}`}><Check className={`mb-5 size-4 ${orderType === key ? "text-cheddar" : "opacity-0"}`} /><span className="block font-display text-2xl">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{key === 'delivery' ? 'Informe o seu endereço' : 'Retire na casa'}</span></button>)}</div><div className="mt-8 grid gap-4"><Field label="Seu nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Como podemos te chamar?" /><Field label="WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="(46) 99999-9999" inputMode="tel" />{orderType === 'delivery' && <><Field label="Rua / Avenida" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Ex.: Av. Tupi" /><div className="grid grid-cols-[.7fr_1.3fr] gap-3"><Field label="Número" value={form.number} onChange={(v) => setForm({ ...form, number: v })} placeholder="123" /><Field label="Bairro" value={form.district} onChange={(v) => setForm({ ...form, district: v })} placeholder="Centro" /></div><Field label="Complemento (opcional)" value={form.complement} onChange={(v) => setForm({ ...form, complement: v })} placeholder="Apartamento, bloco, referência..." /></>}<label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[.25em] text-steel">Pagamento</span><div className="relative"><select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })} className="w-full appearance-none border border-border bg-card px-4 py-4 text-sm outline-none focus:border-cheddar"><option>Pix</option><option>Cartão na entrega</option><option>Dinheiro</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2" /></div></label></div><div className="mt-8 border-t border-border pt-6"><div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{money.format(subtotal)}</span></div><p className="mt-2 text-xs text-steel">A taxa de entrega e o total final serão confirmados pela casa.</p><button onClick={finalize} className="btn-order mt-5 w-full justify-center px-6 py-5 text-xs"><span>Enviar pedido no WhatsApp</span><ArrowRight className="size-4" /></button></div></div>}</div>
      </aside>}
    </main>
  );
}

function Field({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; inputMode?: "text" | "tel" }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[.25em] text-steel">{label}</span><input value={value} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-border bg-card px-4 py-4 text-sm outline-none transition-colors placeholder:text-steel focus:border-cheddar" /></label>;
}
