import {Box } from "@mui/material";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
        Welcome home
    </Box>
  );
}

export default Home;