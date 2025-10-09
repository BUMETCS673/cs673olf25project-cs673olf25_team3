/*
AI-generated: 30% (Tool: ChatGPT; primarily component structure, useEffect skeleton, Box layout, integration of AddPlanForm)
Human-written: 70% (logic: conditional fetching of plan data in edit mode, calling getPlanById, handling API errors, integrating addPlan and editPlan endpoints on submit, navigation to /home on success)

Notes:

AI contributed to the structural layout and useEffect setup.

Human contributions cover all functional logic for data fetching, edit vs add handling, API integration, state management, and navigation.

Prefilling the form and handling API error responses is human-authored.
*/

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddPlanForm from "./AddPlanForm";
import { getPlanById } from "./endpoints/getPlanById";
import { addPlan } from "./endpoints/addPlan";
import { editPlan } from "./endpoints/editPlan";
import { useAuth } from "../auth/AuthContext";

export default function UserBio() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();


  useEffect(() => {
    if (userId && auth.accessToken) {
      async function loadUserBio() {
        const result = await getUserById(planId as string, auth.accessToken as string);
        if ("errorMessage" in result && result.errorMessage) {
          console.error(result.errorMessage);
        } else {
          setInitialData(result);
        }
      }
      loadPlan();
    }
  }, [editMode, planId, auth.accessToken]);



  return (
  );
}
