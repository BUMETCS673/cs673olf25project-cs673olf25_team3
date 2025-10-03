import { Card, CardContent, CardHeader, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../auth/AuthContext";
import { deletePlan } from "../plans/endpoints/deletePlan";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Plan {
  _id: string;
  title: string;
  description: string;
  location: {
    name?: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
  };
  start_time: string;
  end_time: string;
  created_by: string;
}

export default function PlanCard({ plan, onUpdate }: { plan: Plan; onUpdate?: () => void }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!auth.accessToken) return;
    setDeleting(true);
    const result = await deletePlan(plan._id, auth.accessToken);
    setDeleting(false);
    if (!result.errorMessage) {
      onUpdate?.();
      setOpenDelete(false);
    } else {
      alert(result.errorMessage);
    }
  };

  const handleEdit = () => {
    navigate(`/plans/edit/${plan._id}`);
  };

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3, width: "50%" }}>
        <CardHeader
          title={plan.title}
          subheader={`${new Date(plan.start_time).toLocaleString()} - ${new Date(plan.end_time).toLocaleString()}`}
          action={
            <Box>
              <IconButton aria-label="edit plan" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete plan" onClick={() => setOpenDelete(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          <Typography variant="body1" gutterBottom>{plan.description}</Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              📍 {plan.location.name ? plan.location.name + ", " : ""}
              {plan.location.address1}, {plan.location.city}, {plan.location.state} {plan.location.zipcode}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Plan</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{plan.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} disabled={deleting}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
