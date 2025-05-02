import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Suspense } from "react";
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

  function handleEmissive(object: Object3D, emissive: number) {
    if ((object as Mesh).isMesh) {
      const material = (object as Mesh).material;
      if (material instanceof MeshStandardMaterial) {
        material.emissive.setHex(emissive);
      }
    }
    // object.traverse((child) => {
    //   if ((child as Mesh).isMesh) {
    //     const material = (child as Mesh).material;
    //     if (material instanceof MeshStandardMaterial) {
    //       material.emissive.setHex(emissive);
    //     }
    //   }
    // });
  }

  return (
    <>
      <primitive
        object={gltf.scene}
        scale={1.0}
        onClick={(e: ThreeEvent<Event>) => {
          console.log(e.object);
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
            handleEmissive(e.object, 0x222222); // Red highlight
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
