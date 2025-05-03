import { AppBar, Box, Drawer, Toolbar } from "@mui/material";
import "./AppLayout.css";
import TestScene from "../scenes/TestScene";
import { Object3D, Vector3 } from "three";
import { useState } from "react";
import FaceEditor from "./FaceEditor";
import SunDial from "./SunDial";

export default function AppLayout() {
  const [clickedObject, setClickedObject] = useState<Object3D | null>(null);
  const [colour, setColour] = useState("#aabbcc");

  const [sunPosition, setSunPosition] = useState<
    number | [x: number, y: number, z: number] | Vector3
  >([0, 10, 10]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "none",
        }}
      >
        <Toolbar className="toolbar">
          <img src="./logo.png" style={{ height: 48 }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ height: "calc(100vh - 64px)", width: "100vw" }}>
        <Toolbar />
        <TestScene
          clickedObject={clickedObject}
          setClickedObject={setClickedObject}
          colour={colour}
          setColour={setColour}
          sunPosition={sunPosition}
        />

        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <br />
          <Toolbar />
          <FaceEditor
            clickedObject={clickedObject}
            colour={colour}
            setColour={setColour}
          />
          <br />
          <Box sx={{ position: "absolute", width: "100%" }}></Box>
        </Drawer>

        <SunDial setSunPosition={setSunPosition} />
      </Box>
    </>
  );
}
