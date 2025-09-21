import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Group, MathUtils, Vector3 } from "three";
import type { CharacterPresentation } from "../hooks/useFirehose";
import { useVrm } from "../hooks/useVrm";
import { VRMExpressionPresetName } from "@pixiv/three-vrm";

const expressionMap: Record<string, VRMExpressionPresetName> = {
  happy: VRMExpressionPresetName.Happy,
  sad: VRMExpressionPresetName.Sad,
  angry: VRMExpressionPresetName.Angry,
  neutral: VRMExpressionPresetName.Neutral,
};

type AvatarProps = {
  presentation: CharacterPresentation;
  fallbackColor?: string;
};

const PlaceholderAvatar = ({ color }: { color: string }) => {
  const hue = useMemo(() => new Color(color), [color]);
  return (
    <mesh scale={[0.7, 1.3, 0.5]}>
      <boxGeometry args={[1, 1.6, 0.6]} />
      <meshStandardMaterial color={hue} metalness={0.2} roughness={0.6} />
    </mesh>
  );
};

export const Avatar = ({ presentation, fallbackColor = "#3498db" }: AvatarProps) => {
  const groupRef = useRef<Group>(null);
  const bouncePhase = useRef(Math.random() * Math.PI * 2);
  const { vrm, error } = useVrm(presentation.config.vrmUrl);
  const lookAtTarget = useMemo(() => {
    const target = presentation.config.lookAt;
    if (!target) {
      return null;
    }
    return new Vector3(target[0], target[1], target[2]);
  }, [presentation.config.lookAt]);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.position.set(
      presentation.config.initialPosition[0],
      presentation.config.initialPosition[1],
      presentation.config.initialPosition[2],
    );
  }, [presentation.config.initialPosition]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    bouncePhase.current += delta * (presentation.state.isSpeaking ? 6 : 1.8);
    const baseY = presentation.config.initialPosition[1];
    const amplitude = presentation.state.isSpeaking ? 0.12 : 0.04;
    group.position.y = baseY + Math.sin(bouncePhase.current) * amplitude;
    const targetRotation = presentation.state.isSpeaking ? 0.25 : 0;
    group.rotation.y = MathUtils.damp(group.rotation.y, targetRotation, 2, delta);

    if (vrm) {
      vrm.update(delta);
      const expression = expressionMap[presentation.state.lastEmotion];
      if (expression && vrm.expressionManager) {
        vrm.expressionManager.setValue(VRMExpressionPresetName.Neutral, 0.2);
        vrm.expressionManager.setValue(
          expression,
          MathUtils.clamp(0.5 + Math.sin(bouncePhase.current) * 0.25, 0, 1),
        );
      }
      if (lookAtTarget && vrm.lookAt) {
        vrm.lookAt.lookAt(lookAtTarget);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.05} />
      <pointLight
        position={[0, 1.8, 2]}
        intensity={presentation.state.isSpeaking ? 0.6 : 0.3}
        color={presentation.config.accentColor}
      />
      <spotLight
        position={[presentation.state.isSpeaking ? -0.5 : -1, 2.2, 1.3]}
        angle={MathUtils.degToRad(32)}
        penumbra={0.4}
        intensity={presentation.state.isSpeaking ? 1.1 : 0.6}
        color={presentation.config.accentColor}
        castShadow
      />
      {vrm && !error ? (
        <primitive object={vrm.scene} scale={[1.1, 1.1, 1.1]} />
      ) : (
        <PlaceholderAvatar color={presentation.config.accentColor ?? fallbackColor} />
      )}
    </group>
  );
};
