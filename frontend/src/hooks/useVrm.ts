import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Object3D, REVISION, ShaderMaterial } from "three";

type OnBeforeCompileArgs = Parameters<ShaderMaterial["onBeforeCompile"]>;
import type { VRM } from "@pixiv/three-vrm";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";

const patchSpotShadowChunk = (() => {
  const revision = Number.parseInt(REVISION, 10);
  if (Number.isNaN(revision) || revision < 180) {
    return undefined;
  }

  const patchMaterial = (material: ShaderMaterial) => {
    if (material.userData.__threeVrmSpotLightCompatApplied) {
      return;
    }
    const originalOnBeforeCompile = material.onBeforeCompile;
    material.onBeforeCompile = (...args: OnBeforeCompileArgs) => {
      originalOnBeforeCompile.apply(material, args);
      const [shader] = args;
      if (typeof shader.fragmentShader === "string" && shader.fragmentShader.indexOf("vSpotShadowCoord") !== -1) {
        shader.fragmentShader = shader.fragmentShader.split("vSpotShadowCoord").join("vSpotLightCoord");
      }
      if (typeof shader.vertexShader === "string" && shader.vertexShader.indexOf("vSpotShadowCoord") !== -1) {
        shader.vertexShader = shader.vertexShader.split("vSpotShadowCoord").join("vSpotLightCoord");
      }
    };
    material.userData.__threeVrmSpotLightCompatApplied = true;
    material.needsUpdate = true;
  };

  return (object: Object3D) => {
    object.traverse((node) => {
      const meshMaterial = (node as { material?: unknown }).material;
      if (!meshMaterial) {
        return;
      }
      const materials = Array.isArray(meshMaterial) ? meshMaterial : [meshMaterial];
      for (const item of materials) {
        if (item instanceof ShaderMaterial) {
          patchMaterial(item);
        }
      }
    });
  };
})();

export const useVrm = (url: string) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }
    let isMounted = true;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf) => {
        if (!isMounted) {
          return;
        }
        const loadedVrm = gltf.userData.vrm as VRM | undefined;
        if (!loadedVrm) {
          setError("VRMデータを読み込めませんでした");
          return;
        }
        VRMUtils.removeUnnecessaryVertices(loadedVrm.scene);
        VRMUtils.removeUnnecessaryJoints(loadedVrm.scene);
        patchSpotShadowChunk?.(loadedVrm.scene);
        loadedVrm.scene.traverse((object3d) => {
          object3d.frustumCulled = false;
        });
        setVrm(loadedVrm);
      },
      undefined,
      (loadError) => {
        if (!isMounted) {
          return;
        }
        if (loadError instanceof Error) {
          setError(loadError.message);
        } else {
          setError("VRMの読み込みに失敗しました");
        }
      },
    );

    return () => {
      isMounted = false;
      setVrm((prev) => {
        if (prev) {
          VRMUtils.deepDispose(prev.scene);
          prev.scene.removeFromParent();
        }
        return null;
      });
    };
  }, [url]);

  return { vrm, error };
};
