 
import * as React from "react";
import { useCallback } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

export default function AccuracyView(score) {
  const [progress, setProgress] = React.useState(0);
  const recievedValue = parseFloat(score) * 100;
  
  var percentage = parseInt(recievedValue, 10);

  const incrementTimer = useCallback(() => {
    setProgress((prevProgress) => prevProgress + 1);
  }, []);

  React.useEffect(() => {
    if (progress === percentage) {
      return;
    }
    const timeoutFunction = setInterval(incrementTimer, 20);
    return () => clearInterval(timeoutFunction);
  }, [incrementTimer, progress, percentage]);

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", padding:"20px"}}
    >
      <CircularProgress
        determinate
        value={progress}
        color="success" 
        sx={{
          "--CircularProgress-trackThickness": "20px",
          "--CircularProgress-progressThickness": "20px",
          "--CircularProgress-size": "150px"
        }}>{percentage}%
      </CircularProgress>
    </Box>
  );
}
