const baseUrl = import.meta.env.VITE_API_BASE_URL;

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

async function getPlanById(planId: string, accessToken: string) {
  try {
    const response = await fetch(`${baseUrl}/api/plans/${planId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage: any;
      if (data && typeof data === "object") {
        errorMessage = data;
      } else {
        errorMessage = data?.message || data?.error || data?.detail || "Failed to fetch plan";
      }
      return { errorMessage };
    }

    return data as Plan;
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}

export { getPlanById, Plan };
