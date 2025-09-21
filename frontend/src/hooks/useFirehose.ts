import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { characterConfigs, speakingWindowMs } from "../config/characters";
import type {
  CharacterConfig,
  CharacterState,
  ConnectionState,
  Emotion,
  FirehoseMessage,
} from "../types/conversation";

const MessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.array(z.string()),
  message: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type UseFirehoseOptions = {
  endpoint?: string;
  maxMessages?: number;
};

type CharacterPresentation = {
  config: CharacterConfig;
  state: CharacterState & { isSpeaking: boolean };
};

const KNOWN_EMOTIONS: Emotion[] = ["happy", "sad", "angry", "neutral"];

const getEmotionFromMetadata = (metadata?: Record<string, unknown>): Emotion => {
  if (!metadata) {
    return "neutral";
  }
  const emotion = metadata["emotion"];
  if (typeof emotion === "string" && KNOWN_EMOTIONS.includes(emotion as Emotion)) {
    return emotion as Emotion;
  }
  return "neutral";
};

export const useFirehose = (
  { endpoint, maxMessages = 75 }: UseFirehoseOptions = {},
) => {
  const url = endpoint ?? import.meta.env.VITE_FIREHOSE_URL ?? "ws://localhost:8080";
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [messages, setMessages] = useState<FirehoseMessage[]>([]);
  const [characterStates, setCharacterStates] = useState<Record<string, CharacterState>>(() => {
    const initialEntries = characterConfigs.map((config) => [
      config.id,
      {
        id: config.id,
        lastEmotion: "neutral" as Emotion,
      } satisfies CharacterState,
    ]);
    return Object.fromEntries(initialEntries);
  });
  const reconnectTimer = useRef<number | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let shouldReconnect = true;

    const connect = () => {
      if (ws) {
        ws.close();
      }
      setConnectionState("connecting");
      ws = new WebSocket(url);

      ws.onopen = () => {
        setConnectionState("connected");
      };

      ws.onerror = () => {
        setConnectionState("error");
      };

      ws.onclose = () => {
        setConnectionState((prev) => (prev === "error" ? "error" : "disconnected"));
        if (shouldReconnect) {
          if (reconnectTimer.current) {
            window.clearTimeout(reconnectTimer.current);
          }
          reconnectTimer.current = window.setTimeout(connect, 2000);
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const parsed = MessageSchema.safeParse(payload);
          if (!parsed.success) {
            return;
          }
          const message = parsed.data;
          const firehoseMessage: FirehoseMessage = {
            ...message,
            timestamp: Date.now(),
          };

          setMessages((prev) => {
            const next = [...prev, firehoseMessage];
            if (next.length > maxMessages) {
              next.splice(0, next.length - maxMessages);
            }
            return next;
          });

          setCharacterStates((prev) => {
            const existing = prev[message.from] ?? {
              id: message.from,
              lastEmotion: "neutral" as Emotion,
            } satisfies CharacterState;
            const emotion = getEmotionFromMetadata(message.metadata as Record<string, unknown> | undefined);
            return {
              ...prev,
              [message.from]: {
                ...existing,
                lastMessage: message.message,
                lastEmotion: emotion,
                lastSpokenAt: Date.now(),
              },
            } satisfies Record<string, CharacterState>;
          });
        } catch (error) {
          console.warn("Failed to parse firehose payload", error);
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
      }
      ws?.close();
    };
  }, [url, maxMessages]);

  const derivedStates: CharacterPresentation[] = useMemo(() => {
    const now = Date.now();
    return characterConfigs.map((config) => {
      const state = characterStates[config.id];
      const lastSpokenAt = state?.lastSpokenAt;
      const isSpeaking = lastSpokenAt ? now - lastSpokenAt < speakingWindowMs : false;
      return {
        config,
        state: {
          id: config.id,
          lastMessage: state?.lastMessage,
          lastEmotion: state?.lastEmotion ?? "neutral",
          lastSpokenAt,
          isSpeaking,
        },
      } satisfies CharacterPresentation;
    });
  }, [characterStates]);

  return {
    connectionState,
    messages,
    characters: derivedStates,
  };
};

export type { CharacterPresentation };
