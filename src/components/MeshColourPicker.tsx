import { HexColorPicker } from "react-colorful";
import { Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D } from "three";

interface MeshColourPickerProps {
  clickedObject: Object3D | null;
  colour: string;
  setColour: React.Dispatch<React.SetStateAction<string>>;
}

export default function MeshColourPicker({
  clickedObject,
  colour,
  setColour,
}: MeshColourPickerProps) {
  const handleObjectColour = () => {
    if (clickedObject instanceof Mesh) {
      const materials = Array.isArray(clickedObject.material)
        ? clickedObject.material
        : [clickedObject.material];

      materials.forEach((mat) => {
        if (
          mat instanceof MeshStandardMaterial ||
          mat instanceof MeshBasicMaterial
        ) {
          mat.color.set(colour);
        }
      });
    }
  };

  return (
    <>
      <HexColorPicker
        color={colour}
        onChange={(newColour) => {
          setColour(newColour);
          handleObjectColour();
        }}
      />
      <br />
    </>
  );
}
