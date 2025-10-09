/*

AI-generated: 70% (Tool: ChatGPT; primarily MUI layout, Box, IconButton, Typography, styling, flex layout, padding, and hover effects)
Human-written: 30% (logic: useNavigate integration, defining the click handler for navigation to /plans/add)

Notes:

Most of the visual layout, spacing, styling, and Material-UI component structure were generated with AI assistance.

Human contributions: integrating React Router useNavigate and the onClick handler to navigate when the Add button is clicked.

This component is mostly presentational, with minor navigation logic handled by the human author.
*/

import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function PlansHeader() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 500,
          color: "text.primary",
          padding:'10px'
        }}
      >
        Add Plan
      </Typography>

      <IconButton
        color="primary"
        onClick={() => navigate("/plans/add")}
        size="small"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
