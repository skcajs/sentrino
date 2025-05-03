import { Vector3 } from "three";
import { Slider, Box } from "@mui/material";

interface SunDailProps {
    setSunPosition: React.Dispatch<React.SetStateAction<number | [x: number, y: number, z: number] | Vector3>>;
}

export default function SunDial({ setSunPosition }: SunDailProps) {
    const handleSliderChange = (_: Event, value: number) => {
        const time = value;
        const angle = (time / 24) * 2 * Math.PI;

        const x = 10 * Math.sin(angle);                   // East-west movement
        const y = 10 * Math.sin(angle - Math.PI / 2);     // Height: peak at noon
        const z = -10 * Math.cos(angle);

        console.log(x, y, z);// North-south or depth

        setSunPosition([x, y, z]);
    };

    return (
        <Box
            sx={{
                left: 64,
                right: 314,
                bottom: 32,
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 4,
                paddingRight: 4,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 12,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >

                <Slider
                    defaultValue={12}
                    min={0}
                    max={24}
                    step={0.1}
                    onChange={handleSliderChange}
                    sx={{ flexGrow: 1 }}
                />

            </Box>
        </Box>
    );
}