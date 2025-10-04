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
