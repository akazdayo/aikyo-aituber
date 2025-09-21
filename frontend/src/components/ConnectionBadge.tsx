import { cn } from "@/lib/utils";
import type { ConnectionState } from "../types/conversation";

type ConnectionBadgeProps = {
  state: ConnectionState;
};

const labelMap: Record<ConnectionState, string> = {
  connecting: "Connecting",
  connected: "Connected",
  disconnected: "Reconnecting",
  error: "Error",
};

const toneMap: Record<ConnectionState, string> = {
  connecting: "bg-amber-500/20 text-amber-300",
  connected: "bg-emerald-500/20 text-emerald-300",
  disconnected: "bg-orange-500/20 text-orange-300",
  error: "bg-rose-500/20 text-rose-300",
};

export const ConnectionBadge = ({ state }: ConnectionBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]",
        toneMap[state],
      )}
    >
      <span className="text-base leading-none">●</span>
      {labelMap[state]}
    </span>
  );
};
