import type { CharacterPresentation } from "../hooks/useFirehose";
import { cn } from "@/lib/utils";

const emotionLabel: Record<string, string> = {
  happy: "HAPPY",
  sad: "SAD",
  angry: "ANGRY",
  neutral: "NEUTRAL",
};

type LowerThirdsProps = {
  characters: CharacterPresentation[];
};

export const LowerThirds = ({ characters }: LowerThirdsProps) => {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap items-end justify-center gap-6">
      {characters.map(({ config, state }) => (
        <div
          key={config.id}
          className={cn(
            "flex min-w-[200px] flex-col gap-1.5 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-slate-100 shadow-[0_0_30px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300",
            state.isSpeaking && "-translate-y-2 border-white/40 shadow-[0_12px_32px_rgba(0,0,0,0.45)]",
          )}
          style={{ borderColor: state.isSpeaking ? `${config.accentColor}55` : undefined }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: config.accentColor }}>
              {config.name}
            </h2>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ backgroundColor: `${config.accentColor}33`, color: config.accentColor }}
            >
              {emotionLabel[state.lastEmotion] ?? "NEUTRAL"}
            </span>
          </div>
          <p className="text-xs text-slate-200/80">{state.lastMessage ?? "まだ準備中..."}</p>
        </div>
      ))}
    </div>
  );
};
