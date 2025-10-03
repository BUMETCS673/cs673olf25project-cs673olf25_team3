const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function editPlan(
  planId: string,
  planData: {
    title?: string;
    description?: string;
    location?: {
      name?: string;
      address1?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    };
    start_time?: string;
    end_time?: string;
  },
  accessToken: string
) {
  try {
    const response = await fetch(`${baseUrl}/api/plans/${planId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(planData),
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage: any;
      if (data && typeof data === "object") {
        errorMessage = data;
      } else {
        errorMessage = data?.message || data?.error || data?.detail || "Failed to update plan";
      }
      return { errorMessage };
    }

    return data;
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}

export { editPlan };
