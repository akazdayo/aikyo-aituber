import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { VRM } from "@pixiv/three-vrm";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";

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
