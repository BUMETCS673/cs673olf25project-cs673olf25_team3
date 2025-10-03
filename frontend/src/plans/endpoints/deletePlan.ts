const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function deletePlan(planId: string, accessToken: string) {
  try {
    const response = await fetch(`${baseUrl}/api/plans/${planId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      let errorMessage: any;
      if (data && typeof data === "object") {
        errorMessage = data;
      } else {
        errorMessage = data?.message || data?.error || data?.detail || "Failed to delete plan";
      }
      return { errorMessage };
    }

    return { success: true };
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}

export { deletePlan };
