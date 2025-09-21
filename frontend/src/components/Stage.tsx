import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import type { CharacterPresentation } from "../hooks/useFirehose";
import { Avatar } from "./Avatar";
import { LowerThirds } from "./LowerThirds";
import { cn } from "@/lib/utils";

type StageProps = {
  characters: CharacterPresentation[];
  controlPanel?: ReactNode;
  chatOverlay?: ReactNode;
  className?: string;
};

export const Stage = ({ characters, controlPanel, chatOverlay, className }: StageProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full items-stretch justify-center px-6 py-6",
        className,
      )}
    >
      <div className="relative flex-1 h-full min-h-[480px] overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(160deg,rgba(16,24,48,0.9),rgba(14,0,36,0.9))] shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <Canvas className="absolute inset-0 h-full w-full" camera={{ position: [0, 1.6, 3.6], fov: 42 }} shadows>
          <color attach="background" args={["#060612"]} />
          <fog attach="fog" args={["#020208", 4, 12]} />
          <directionalLight
            position={[0, 4, 2]}
            intensity={1}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <hemisphereLight args={["#a29bfe", "#2d3436", 0.45]} />
          <group position={[0, 0, 0]}>
            {characters.map((presentation) => (
              <Avatar key={presentation.config.id} presentation={presentation} />
            ))}
          </group>
          <ContactShadows position={[0, -0.6, 0]} scale={12} blur={1.8} opacity={0.6} far={4} />
          <Environment preset="city" />
        </Canvas>
        {controlPanel ? (
          <div className="pointer-events-none absolute right-6 top-6 hidden max-w-xs xl:block">
            {controlPanel}
          </div>
        ) : null}
        {chatOverlay ? (
          <div className="pointer-events-auto absolute right-6 top-1/2 hidden w-[320px] -translate-y-1/2 xl:block">
            {chatOverlay}
          </div>
        ) : null}
        <LowerThirds characters={characters} />
      </div>
    </div>
  );
};
