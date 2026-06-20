import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/orientadora")({
  head: () => ({
    meta: [{ title: "IA Orientadora — Vida em Eixo" }],
  }),
  component: Orientadora,
});

function Orientadora() {
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    (async () => {
      const { data: conv } = await supabase
        .from("ai_conversations")
        .select("id")
        .maybeSingle();
      if (!conv) {
        setInitialMessages([]);
        return;
      }
      const { data: msgs } = await supabase
        .from("ai_messages")
        .select("id, role, content, parts, created_at")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true });
      setInitialMessages(
        (msgs ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          parts: m.parts ?? [{ type: "text", text: m.content }],
        })) as UIMessage[],
      );
    })();
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: () => ({ Authorization: `Bearer ${token ?? ""}` }),
      }),
    [token],
  );

  if (initialMessages === null || token === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando IA...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
        <AppHeader />
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar ao dashboard
        </Link>
        <Chat transport={transport} initialMessages={initialMessages} endRef={endRef} inputRef={inputRef} />
      </div>
    </div>
  );
}

function Chat({
  transport,
  initialMessages,
  endRef,
  inputRef,
}: {
  transport: DefaultChatTransport<UIMessage>;
  initialMessages: UIMessage[];
  endRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const { messages, sendMessage, status, error } = useChat({
    id: "single",
    messages: initialMessages,
    transport,
  });
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, endRef]);

  async function send(text: string) {
    if (!text.trim() || isLoading) return;
    setInput("");
    await sendMessage({ text: text.trim() });
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const quick = [
    "O que está mais desequilibrado em mim esta semana?",
    "Me ajude a definir uma microação para meu pilar mais crítico",
    "Quero refletir sobre meu check-in semanal",
  ];

  return (
    <div className="mt-4 rounded-3xl bg-card border border-border/60 shadow-sm flex flex-col h-[70vh]">
      <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2">
        <PhChat size={24} weight="light" className="text-[color:var(--primary)]" />
        <div>
          <h1 className="text-lg font-bold">IA Orientadora</h1>
          <p className="text-xs text-muted-foreground">
            Sua assistente de autogestão. Não substitui terapia, médico ou consultor financeiro.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            Olá! Estou aqui para te ajudar a enxergar sua vida como um sistema vivo e transformar reflexão em pequenas ações. Por onde começamos?
          </div>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-foreground"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-2">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="flex justify-start">
            <div className="bg-secondary/60 rounded-2xl px-4 py-2.5 text-sm text-muted-foreground">
              Pensando…
            </div>
          </div>
        )}
        {error && (
          <div className="text-xs text-[color:var(--critical)]">
            Erro ao falar com a IA. Tente novamente em instantes.
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border/60 px-5 py-3">
        {messages.length === 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs rounded-full border border-border bg-background px-3 py-1.5 hover:bg-secondary"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Escreva sua reflexão ou pergunta…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}