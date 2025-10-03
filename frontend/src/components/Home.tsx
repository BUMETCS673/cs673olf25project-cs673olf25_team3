import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlansHeader from "../plans/PlansHeader";
import PlanCard from "../plans/PlanCard";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { getPlans } from "../plans/endpoints/getPlan";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("your");

  const { auth } = useAuth();
  const navigate = useNavigate();

  // Load plans from API
  const loadPlans = async () => {
    if (!auth.accessToken) return;
    setLoading(true);
    const result = await getPlans(auth.accessToken);
    if (!result.errorMessage) {
      setPlans(result);
    } else {
      console.error(result.errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, [auth.accessToken]);

  // TODO: add correct logic once API is working
  const filteredPlans = plans.filter((plan) => {
    if (filter === "your") return true;
    if (filter === "friends") return true;
    return true;
  });

  return (
    <>
      {/* PlansHeader */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, pr: 2 }}>
        <PlansHeader setShowForm={() => navigate("/plans/add")} />
      </Box>

      {/* Filter Dropdown */}
      <Box sx={{ mt: 2, mb: 2, maxWidth: 200, ml: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="plan-filter-label">Filter Plans</InputLabel>
          <Select
            labelId="plan-filter-label"
            value={filter}
            label="Filter Plans"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="your">Your Plans</MenuItem>
            <MenuItem value="friends">Friends’ Plans</MenuItem>
            <MenuItem value="all">All Plans</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Plan Cards */}
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onUpdate={loadPlans} // refresh after edit or delete
            />
          ))
        ) : (
          <Typography sx={{ mt: 4 }}>No plans available.</Typography>
        )}
      </Box>
    </>
  );
}
