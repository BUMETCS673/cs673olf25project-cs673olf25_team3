import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { handleRSVP, getRSVPByPlan } from "../plans/endpoints/handleRSVP";
import { useAuth } from "../auth/AuthContext";

interface RSVPButtonProps {
  planId: string;
  initialRSVP?: boolean;
  onUpdate?: () => void; // optional callback after RSVP change
}

export default function RSVPButton({ planId, initialRSVP = false, onUpdate }: RSVPButtonProps) {
  const { auth, user } = useAuth();
  const [rsvped, setRsvped] = useState(initialRSVP);
  const [loading, setLoading] = useState(false);

  // Optional: fetch initial RSVP state from backend
  useEffect(() => {
    if (!auth.accessToken || !planId || !user) return;

    const fetchRSVP = async () => {
      const { data } = await getRSVPByPlan(planId, auth?.accessToken ?? "");
      if (data) {
        const hasRSVPed = data.some((r) => r.user_id === user.id);
        setRsvped(hasRSVPed);
      }
    };

    fetchRSVP();
  }, [auth.accessToken, planId, user]);

  const handleClick = async () => {
    if (!auth.accessToken) return;

    setLoading(true);
    const result = await handleRSVP(planId, auth.accessToken, rsvped);
    setLoading(false);

    if (result.success) {
      setRsvped(!rsvped);
      onUpdate?.(); // refresh plans if needed
    } else {
      alert(result.errorMessage);
    }
  };

  return (
    <Tooltip title={rsvped ? "Cancel RSVP" : "RSVP to plan"}>
      <span>
        <IconButton
          aria-label={rsvped ? "Cancel RSVP" : "RSVP"}
          onClick={handleClick}
          disabled={loading}
        >
          {rsvped ? <EventBusyIcon color="error" /> : <EventAvailableIcon color="primary" />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
