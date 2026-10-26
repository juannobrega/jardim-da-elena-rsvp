import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import bg from "@/assets/garden-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jardim da Elena · Confirme sua presença" },
      { name: "description", content: "Chá de bebê da Elena — 02 de novembro às 17h no Salão Algo Tão Doce. Confirme sua presença." },
      { property: "og:title", content: "Jardim da Elena · Chá de bebê" },
      { property: "og:description", content: "Elena está chegando! Confirme sua presença no chá de bebê." },
    ],
  }),
  component: Index,
});

function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden>
      <path d="M20 16C14 2 2 2 3 10s9 7 17 6c-8 2-14 5-12 11s10 2 12-11z" fill="currentColor" opacity=".55" />
      <path d="M20 16C26 2 38 2 37 10s-9 7-17 6c8 2 14 5 12 11s-10 2-12-11z" fill="currentColor" opacity=".4" />
    </svg>
  );
}

function Index() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [companions, setCompanions] = useState<{ name: string; relation: string }[]>([]);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Por favor, informe seu nome.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Informe seu WhatsApp com DDD.");
    if (attending === null) return setError("Conte pra gente se você vem 💗");
    const list = attending ? companions.filter((c) => c.name.trim()) : [];
    if (list.some((c) => !c.relation.trim())) return setError("Informe o grau de parentesco de cada acompanhante.");
    setError("");
    setStatus("sending");
    const { error } = await supabase.from("rsvp_responses").insert({
      name: name.trim().slice(0, 120),
      attending,
      adults: attending ? 1 + list.length : 0,
      children: 0,
      companions: list.slice(0, 20).map((c) => ({ name: c.name.trim().slice(0, 120), relation: c.relation.trim().slice(0, 60) })),
      phone: phone.trim().slice(0, 30),
      message: message.trim().slice(0, 500) || null,
    });
    if (error) {
      setStatus("error");
      setError("Não foi possível enviar. Tente novamente.");
    } else setStatus("done");
  }

  const field = "glass-input w-full rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img src={bg} alt="" width={1920} height={1280} className="fixed inset-0 -z-10 h-full w-full object-cover" />
      <Butterfly className="animate-float absolute left-[8%] top-[18%] w-12 text-primary" />
      <Butterfly className="animate-float absolute right-[10%] top-[40%] w-9 text-sage [animation-delay:2s]" />

      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-14 text-center">
        <p className="animate-rise font-display text-sm uppercase tracking-[0.4em] text-primary">Chá de bebê</p>
        <h1 className="animate-rise font-display text-5xl font-medium tracking-wide text-primary sm:text-6xl">Jardim da Elena</h1>
        <p className="animate-rise mt-4 font-script text-7xl text-primary sm:text-8xl [animation-delay:.15s]">Elena</p>
        <p className="animate-rise -mt-2 font-script text-3xl text-foreground [animation-delay:.25s]">está chegando!</p>

        <div className="animate-rise glass mt-8 w-full rounded-[2rem] p-6 [animation-delay:.35s]">
          <p className="font-script text-2xl text-muted-foreground">Venha celebrar conosco</p>
          <div className="mt-3 grid grid-cols-3 divide-x divide-primary/20">
            <div><p className="font-display text-3xl text-primary">02</p><p className="text-xs uppercase tracking-widest text-muted-foreground">novembro</p></div>
            <div><p className="font-display text-3xl text-primary">17h</p><p className="text-xs uppercase tracking-widest text-muted-foreground">horário</p></div>
            <div><p className="font-display text-xl leading-9 text-primary">Algo tão doce</p><p className="text-xs uppercase tracking-widest text-muted-foreground">salão de festas</p></div>
          </div>
        </div>

        <section className="animate-rise glass mt-6 w-full rounded-[2rem] p-6 text-left sm:p-8 [animation-delay:.45s]">
          {status === "done" ? (
            <div className="py-8 text-center">
              <p className="font-script text-5xl text-primary">Obrigada!</p>
              <p className="mt-3 text-foreground">
                {attending ? "Sua presença está confirmada. Mal podemos esperar para te ver no jardim da Elena 🌸" : "Sentiremos sua falta! Obrigada por avisar com carinho 💗"}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-center font-display text-3xl text-primary">Confirme sua presença</h2>
              <input className={field} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
              <input className={field} type="tel" placeholder="Seu WhatsApp com DDD" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((v) => (
                  <button type="button" key={String(v)} onClick={() => setAttending(v)}
                    className={`rounded-2xl px-4 py-3 font-medium transition ${attending === v ? "btn-bloom" : "glass-input text-foreground hover:bg-primary/10"}`}>
                    {v ? "Estarei lá 🌷" : "Não poderei ir"}
                  </button>
                ))}
              </div>
              {attending && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Quem vai com você?</p>
                  {companions.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input className={`${field} flex-[3]`} placeholder="Nome do acompanhante" value={c.name} maxLength={120}
                        onChange={(e) => setCompanions(companions.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                      <input className={`${field} flex-[2]`} placeholder="Parentesco" value={c.relation} maxLength={60} list="relations"
                        onChange={(e) => setCompanions(companions.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)))} />
                      <button type="button" aria-label="Remover acompanhante" onClick={() => setCompanions(companions.filter((_, j) => j !== i))}
                        className="glass-input shrink-0 rounded-2xl px-4 text-primary hover:bg-primary/10">×</button>
                    </div>
                  ))}
                  <datalist id="relations">
                    {["Esposo(a)", "Filho(a)", "Pai", "Mãe", "Irmão(ã)", "Avô(ó)", "Tio(a)", "Primo(a)", "Sobrinho(a)", "Namorado(a)", "Amigo(a)"].map((r) => <option key={r} value={r} />)}
                  </datalist>
                  {companions.length < 20 && (
                    <button type="button" onClick={() => setCompanions([...companions, { name: "", relation: "" }])}
                      className="w-full rounded-2xl border border-dashed border-primary/40 py-3 text-primary transition hover:bg-primary/10">
                      + Adicionar acompanhante
                    </button>
                  )}
                </div>
              )}
              <textarea className={`${field} min-h-24 resize-none`} placeholder="Deixe um recadinho para a Elena (opcional)" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
              {error && <p className="text-center text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={status === "sending"} className="btn-bloom w-full rounded-full py-4 text-lg font-semibold transition hover:scale-[1.02] disabled:opacity-60">
                {status === "sending" ? "Enviando..." : "Confirmar"}
              </button>
            </form>
          )}
        </section>
        <p className="mt-8 font-script text-2xl text-muted-foreground">com amor 🌸</p>
      </div>
    </main>
  );
}
