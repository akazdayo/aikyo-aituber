import { useCallback, useMemo, useState } from "react";
import { Stage } from "./components/Stage";
import { ChatOverlay } from "./components/ChatOverlay";
import { ConnectionBadge } from "./components/ConnectionBadge";
import { ControlPanel } from "./components/ControlPanel";
import { useFirehose } from "./hooks/useFirehose";
import { characterConfigs } from "./config/characters";
import "./styles/global.css";

export const App = () => {
  const { messages, characters, connectionState } = useFirehose();
  const [visibleCharacterIds, setVisibleCharacterIds] = useState<Set<string>>(
    () => new Set(characterConfigs.map((config) => config.id)),
  );

  const liveSince = useMemo(() => new Date(), []);
  const filteredCharacters = useMemo(
    () => characters.filter((character) => visibleCharacterIds.has(character.config.id)),
    [characters, visibleCharacterIds],
  );
  const filteredMessages = useMemo(
    () => messages.filter((message) => visibleCharacterIds.has(message.from)),
    [messages, visibleCharacterIds],
  );

  const handleToggleCharacter = useCallback((id: string, nextValue: boolean) => {
    setVisibleCharacterIds((prev) => {
      const next = new Set(prev);
      if (nextValue) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setVisibleCharacterIds(new Set(characterConfigs.map((config) => config.id)));
  }, []);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-[radial-gradient(circle_at_top,rgba(44,62,80,0.6),#05050d)] font-sans text-slate-100">
      <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-8 py-5 backdrop-blur-xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em]">AIVTuber Studio</h1>
          <span className="text-xs text-slate-400">powered by aikyo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            <span className="text-base leading-none">●</span>
            Live
          </span>
          <ConnectionBadge state={connectionState} />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Stage
          className="flex-1 min-w-0"
          characters={filteredCharacters}
          controlPanel={
            <ControlPanel
              characters={characters}
              visibleCharacterIds={visibleCharacterIds}
              connectionState={connectionState}
              onToggleCharacter={handleToggleCharacter}
              onResetFilters={handleResetFilters}
            />
          }
          chatOverlay={
            <ChatOverlay
              className="rounded-xl border border-white/10 bg-slate-950/80"
              messages={filteredMessages}
              characters={characters}
            />
          }
        />
        <div className="w-full max-w-[360px] overflow-y-auto border-l border-white/10 xl:hidden">
          <ChatOverlay messages={filteredMessages} characters={characters} />
        </div>
      </div>
      <footer className="flex items-center justify-between border-t border-white/10 bg-black/25 px-8 py-4 text-xs text-slate-300 backdrop-blur-xl">
        <span>On air since {liveSince.toLocaleString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span>
        <span className="text-slate-400">VRMアバターを /frontend/public/avatars に配置してください。</span>
      </footer>
    </div>
  );
};
