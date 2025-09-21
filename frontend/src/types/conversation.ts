export type Emotion = "happy" | "sad" | "angry" | "neutral";

export type FirehoseMessage = {
  id: string;
  from: string;
  to: string[];
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
};

export type CharacterConfig = {
  id: string;
  name: string;
  accentColor: string;
  vrmUrl: string;
  initialPosition: [number, number, number];
  lookAt?: [number, number, number];
};

export type CharacterState = {
  id: string;
  lastMessage?: string;
  lastEmotion: Emotion;
  lastSpokenAt?: number;
};

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";
