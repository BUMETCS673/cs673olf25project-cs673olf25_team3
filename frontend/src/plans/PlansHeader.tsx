import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";


export default function PlansHeader({ setShowForm }: { setShowForm: (val: boolean) => void }) {
    const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "right",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",

      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          flexGrow: 1,
          textAlign: "center",
        }}
      >
        Add Plan
      </Typography>
      <IconButton
        color="primary"
        onClick={() => navigate("/plans/add")}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
