import { OrbitControls, Plane, Sky, useHelper } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { DirectionalLight, DirectionalLightHelper, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface SceneParams {
  clickedObject: Object3D | null;
  setClickedObject: React.Dispatch<React.SetStateAction<Object3D | null>>;
  colour: string;
  setColour: React.Dispatch<React.SetStateAction<string>>;
  sunPosition: number | [x: number, y: number, z: number] | Vector3;
}

const Terrain = () => {
  const height = useLoader(THREE.TextureLoader, "/textures/rolling_hills_heightmap2.png");
  const normals = useLoader(THREE.TextureLoader, "/textures/rolling_hills_normals.png");
  const colors = useLoader(THREE.TextureLoader, "/textures/rolling_hills_colour.png");

  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      args={[64, 64, 2048, 2048]}
    >
      <meshStandardMaterial
        attach="material"
        color="white"
        map={colors}
        metalness={0.2}
        normalMap={normals}
        displacementMap={height}
        displacementScale={15.0}
      />
    </Plane>

  );
};

const Model = ({ clickedObject, setClickedObject, setColour }: SceneParams) => {
  const gltf = useLoader(GLTFLoader, "./meshes/house.glb");

  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  function handleEmissive(object: Object3D, emissive: number) {
    object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material instanceof MeshStandardMaterial) {
          if (!mesh.userData.originalMaterial) {
            // Store the original material in userData so we can restore it later
            mesh.userData.originalMaterial = mesh.material;
            // Clone the material to handle unique objects
            // This is important to avoid modifying the original material
            // when multiple objects share the same material
            mesh.material = mesh.material.clone();
          }
          (mesh.material as MeshStandardMaterial).emissive.setHex(emissive);
        }
      }
    });
  }

  return (
    <>
      <primitive
        object={gltf.scene}
        scale={1.0}
        onClick={(e: ThreeEvent<Event>) => {
          e.object.receiveShadow = true;
          e.object.castShadow = true;
          e.stopPropagation();
          if (clickedObject !== e.object) {
            if (clickedObject) {
              handleEmissive(clickedObject, 0x000000);
            }
            setClickedObject(e.object);
            handleEmissive(e.object, 0x444444);

            // Set color only on click
            e.object.traverse((child) => {
              if ((child as Mesh).isMesh) {
                const material = (child as Mesh).material;
                if (material instanceof MeshStandardMaterial) {
                  setColour(material.color.getHexString());
                }
              }
            });
          } else {
            setClickedObject(null);
            handleEmissive(clickedObject, 0x000000);
          }
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (clickedObject !== e.object) {
            handleEmissive(e.object, 0x444444); // Red highlight
          }
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (clickedObject !== e.object) {
            handleEmissive(e.object, 0x000000); // Reset
          }
        }}
      />
    </>
  );
};

interface LightingProps {
  sunPosition: number | [x: number, y: number, z: number] | Vector3;
}

const Lighting = ({ sunPosition }: LightingProps) => {
  const dirLightRef = useRef<DirectionalLight>(null) as React.RefObject<DirectionalLight>;
  useHelper(dirLightRef, DirectionalLightHelper, 1, "red");

  return (
    <><ambientLight intensity={0.2} /><directionalLight
      intensity={3}
      color="white"
      position={sunPosition}
      castShadow
      shadow-bias={-0.00005}
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
      ref={dirLightRef}>
      <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
    </directionalLight></>
  );
};

export default function TestScene({
  clickedObject,
  setClickedObject,
  colour,
  setColour,
  sunPosition
}: SceneParams) {

  return (
    <>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
        onPointerMissed={(e) => {
          if (e.button === 0) {
            // reset the emissive
            if (clickedObject) {
              clickedObject.traverse((child) => {
                if ((child as Mesh).isMesh) {
                  const material = (child as Mesh).material;
                  if (material instanceof MeshStandardMaterial) {
                    material.emissive.setHex(0x000000);
                  }
                }
              });
            }

            // clear selection
            setClickedObject(null);
          }
        }}
      >

        <Suspense fallback={null}>
          <Sky distance={45000} sunPosition={sunPosition} inclination={1} azimuth={0.25} />
          <fog attach="fog" args={["white", 0, 26]} />
          <Lighting sunPosition={sunPosition} />
          <Model
            clickedObject={clickedObject}
            setClickedObject={setClickedObject}
            colour={colour}
            setColour={setColour}
            sunPosition={sunPosition}
          />
          <Terrain />
          <OrbitControls />
          {/* <Environment preset="forest" background /> */}
        </Suspense>
      </Canvas>
    </>
  );
}
