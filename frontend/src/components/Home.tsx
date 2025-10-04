import { useEffect, useState } from "react";
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
  Divider,
  Stack,
} from "@mui/material";
import { getPlans } from "../plans/endpoints/getPlan";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("your");

  const { auth } = useAuth();

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

  const filteredPlans = plans.filter((plan) => {
    if (filter === "your") return true;
    if (filter === "friends") return true;
    return true;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Welcome
        </Typography>

        <PlansHeader />
      </Box>

      <Divider />

      {/* Filter Dropdown */}
      <Box sx={{ maxWidth: 240 }}>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 2,
          mt: 1,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredPlans.length > 0 ? (
          <Stack spacing={2}>
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onUpdate={loadPlans} // refresh after edit or delete
              />
            ))}
          </Stack>
        ) : (
          <Typography sx={{ mt: 4, textAlign: "center" }}>
            No plans available.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
