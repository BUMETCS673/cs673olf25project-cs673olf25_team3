/*
AI-generated code: 25% (Tool: ChatGPT; assisted with component structure and API integration)
Human-written code: 75% (logic flow, useEffect, state management, and event handling)

Notes:
- Core logic for fetching and toggling RSVP status is human-written.
- AI assistance was used for refining MUI component usage and JSX layout.
- Error handling and loading state were adapted manually.
- Final integration with AuthContext and endpoints was implemented by a human.
*/

import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { handleRSVP, getRSVPByPlan } from "../plans/endpoints/handleRSVP";
import { useAuth } from "../auth/AuthContext";

interface RSVPButtonProps {
  planId: string;
  initialRSVP?: boolean;
  onUpdate?: () => void;
}

export default function RSVPButton({ planId, initialRSVP = false, onUpdate }: RSVPButtonProps) {
  const { auth, user } = useAuth();
  const [rsvped, setRsvped] = useState(initialRSVP);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.accessToken || !planId || !user) return;

    const fetchRSVP = async () => {
      const { data } = await getRSVPByPlan(planId, auth?.accessToken ?? "");
      if (data) {
        const hasRSVPed = data?.some((r) => r.user_id === user.id);
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
      onUpdate?.();
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
