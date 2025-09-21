import type { CharacterConfig } from "../types/conversation";

export const characterConfigs: CharacterConfig[] = [
  {
    id: "companion_kyoko",
    name: "Kyoko",
    accentColor: "#ff9f1c",
    vrmUrl: "/avatars/kyoko.vrm",
    initialPosition: [-1.1, -0.2, 0],
    lookAt: [0, 1.5, 3],
  },
  {
    id: "companion_aya",
    name: "Aya",
    accentColor: "#6c5ce7",
    vrmUrl: "/avatars/aya.vrm",
    initialPosition: [1.1, -0.2, 0],
    lookAt: [0, 1.5, 3],
  },
];

export const speakingWindowMs = 5200;
