import { cn } from "@/lib/utils";
import type { CharacterPresentation } from "../hooks/useFirehose";
import type { FirehoseMessage } from "../types/conversation";

const formatTime = (timestamp?: number) => {
  if (!timestamp) {
    return "--:--:--";
  }
  return new Date(timestamp).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

type ChatOverlayProps = {
  messages: FirehoseMessage[];
  characters: CharacterPresentation[];
  className?: string;
};

export const ChatOverlay = ({ messages, characters, className }: ChatOverlayProps) => {
  const colorMap = new Map<string, string>();
  characters.forEach(({ config }) => {
    colorMap.set(config.id, config.accentColor);
  });

  return (
    <aside
      className={cn(
        "flex h-full flex-col gap-3 bg-slate-950/75 p-5 text-sm text-slate-200 backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Live Chat</h3>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => {
          const color = colorMap.get(message.from) ?? "#95a5a6";
          return (
            <div
              key={message.id}
              className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              style={{ borderColor: `${color}33` }}
            >
              <strong className="flex items-center gap-2 text-xs font-semibold" style={{ color }}>
                <span className="truncate">{message.from}</span>
                <time className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  {formatTime(message.timestamp)}
                </time>
              </strong>
              <span className="text-sm text-slate-100/80">{message.message}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
