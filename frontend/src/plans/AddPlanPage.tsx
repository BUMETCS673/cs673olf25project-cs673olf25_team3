import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddPlanForm from "./AddPlanForm";
import { getPlanById } from "./endpoints/getPlanById";
import { addPlan } from "./endpoints/addPlan";
import { editPlan } from "./endpoints/editPlan";
import { useAuth } from "../auth/AuthContext";

export default function AddPlanPage({ editMode = false }) {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (editMode && planId && auth.accessToken) {
      async function loadPlan() {
        const result = await getPlanById(planId as string, auth.accessToken as string);
        if ("errorMessage" in result && result.errorMessage) {
          console.error(result.errorMessage);
        } else {
          setInitialData(result);
        }
      }
      loadPlan();
    }
  }, [editMode, planId, auth.accessToken]);

  const handleFormSubmit = async (formData: any) => {
    if (!auth.accessToken) return;

    let result;
    if (editMode && planId) {
      result = await editPlan(planId, formData, auth.accessToken);
    } else {
      result = await addPlan(formData, auth.accessToken);
    }

    if (!result.errorMessage) {
      navigate("/home"); // redirect to home after success
    } else {
      return result.errorMessage;
    }
  };

  return (
    <AddPlanForm
      initialData={initialData?.data}
      editMode={editMode}
      handleSubmit={handleFormSubmit}
    />
  );
}
