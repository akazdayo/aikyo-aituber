import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CharacterPresentation } from "@/hooks/useFirehose";
import type { ConnectionState } from "@/types/conversation";
import { cn } from "@/lib/utils";

const connectionTone: Record<ConnectionState, string> = {
  connecting: "text-amber-400",
  connected: "text-emerald-400",
  disconnected: "text-orange-400",
  error: "text-rose-400",
};

type ControlPanelProps = {
  characters: CharacterPresentation[];
  visibleCharacterIds: Set<string>;
  connectionState: ConnectionState;
  onToggleCharacter: (id: string, nextValue: boolean) => void;
  onResetFilters: () => void;
};

export const ControlPanel = ({
  characters,
  visibleCharacterIds,
  connectionState,
  onToggleCharacter,
  onResetFilters,
}: ControlPanelProps) => {
  const enabledCount = useMemo(() => {
    let count = 0;
    visibleCharacterIds.forEach((id) => {
      if (characters.some((character) => character.config.id === id)) {
        count += 1;
      }
    });
    return count;
  }, [characters, visibleCharacterIds]);

  return (
    <Card className="pointer-events-auto w-[280px] border-white/15 bg-slate-950/80 text-slate-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">Live Controls</CardTitle>
        <CardDescription className="text-[10px] text-slate-400">
          Tailwind CSS v4 + shadcn/ui integration
        </CardDescription>
        <div className="flex items-center justify-between rounded-md border border-white/15 bg-slate-900/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          <span>Connection</span>
          <span className={cn("text-xs", connectionTone[connectionState])}>{connectionState}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Visible Characters
          </p>
          <div className="space-y-2">
            {characters.map(({ config }) => {
              const isEnabled = visibleCharacterIds.has(config.id);
              return (
                <div
                  key={config.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: config.accentColor }}
                    />
                    <div className="flex flex-col">
                      <Label htmlFor={`toggle-${config.id}`} className="text-xs font-medium text-slate-100">
                        {config.name}
                      </Label>
                      <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">
                        {config.id}
                      </span>
                    </div>
                  </div>
                  <Switch
                    id={`toggle-${config.id}`}
                    checked={isEnabled}
                    onCheckedChange={(value) => onToggleCharacter(config.id, value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Active count
          </span>
          <span className="text-sm font-semibold text-slate-100">{enabledCount}</span>
        </div>
        <Button className="w-full" variant="outline" onClick={onResetFilters}>
          Reset visibility
        </Button>
      </CardContent>
    </Card>
  );
};
