import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface SceneParams {
  clickedObject: Object3D | null;
  setClickedObject: React.Dispatch<React.SetStateAction<Object3D | null>>;
  colour: string;
  setColour: React.Dispatch<React.SetStateAction<string>>;
}

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
          console.log(e.object.receiveShadow);
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
            handleEmissive(e.object, 0xff0000); // Red highlight
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

export default function TestScene({
  clickedObject,
  setClickedObject,
  colour,
  setColour,
}: SceneParams) {
  return (
    <>
      <Canvas
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
          <spotLight intensity={1} position={[4, 2000, 4]} castShadow />
          <Model
            clickedObject={clickedObject}
            setClickedObject={setClickedObject}
            colour={colour}
            setColour={setColour}
          />
          <OrbitControls />
          <Environment preset="forest" background />
        </Suspense>
      </Canvas>
    </>
  );
}
