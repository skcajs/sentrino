import { Paper } from "@mui/material";
import { useState } from "react";
import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
} from "three";
import { TextureLoader } from "three";

const textures = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];

const TexturePreview = ({
  textureName,
  isSelected,
  onClick,
}: {
  textureName: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 85,
        height: 85,
        backgroundImage: `url('/textures/${textureName}.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: isSelected ? "4px solid purple" : "4px solid transparent",
        "&:hover": {
          border: isSelected ? "4px solid purple" : "4px solid purple",
        },
      }}
      onClick={onClick}
    />
  );
};

interface TexturesProps {
  clickedObject: Object3D | null;
}

export default function Textures({ clickedObject }: TexturesProps) {
  const [texture, setTexture] = useState<string | null>(null);

  const handleClick = (textureName: string) => {
    setTexture(textureName);

    if (clickedObject instanceof Mesh) {
      const materials = Array.isArray(clickedObject.material)
        ? clickedObject.material
        : [clickedObject.material];

      const textureLoader = new TextureLoader();
      const loadedTexture = textureLoader.load(
        `/textures/${textureName}.jpg`,
        () => {
          // Once loaded, apply settings
          loadedTexture.wrapS = RepeatWrapping;
          loadedTexture.wrapT = RepeatWrapping;
          loadedTexture.repeat.set(1, 1);
          loadedTexture.anisotropy = 16;

          materials.forEach((mat) => {
            if (
              mat instanceof MeshStandardMaterial ||
              mat instanceof MeshBasicMaterial
            ) {
              mat.map = loadedTexture;
              mat.needsUpdate = true;
            }
          });
        }
      );
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {textures.map((textureName) => (
        <TexturePreview
          key={textureName}
          textureName={textureName}
          isSelected={texture === textureName}
          onClick={() => handleClick(textureName)}
        />
      ))}
    </div>
  );
}
