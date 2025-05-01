import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";
import MeshColourPicker from "./MeshColourPicker";
import { Object3D } from "three";
import Textures from "./Textures";

interface FaceEditorProps {
  clickedObject: Object3D | null;
  colour: string;
  setColour: React.Dispatch<React.SetStateAction<string>>;
}

export default function FaceEditor({
  clickedObject,
  colour,
  setColour,
}: FaceEditorProps) {
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="title">
          <Box>
            <Typography>Face Editor</Typography>
          </Box>
        </ListItem>
        <Divider sx={{ backgroundColor: "grey.800" }} />

        <ListItem>
          <Box sx={{ fontStyle: "italic", color: "grey.500" }}>
            <ListItemText primary={`Hue`} />
            <MeshColourPicker
              clickedObject={clickedObject}
              colour={colour}
              setColour={setColour}
            />
          </Box>
        </ListItem>
        <Divider />
        <ListItem>
          <Box sx={{ fontStyle: "italic", color: "grey.500" }}>
            <ListItemText primary={`Texture`} />
            <Textures clickedObject={clickedObject} />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}
