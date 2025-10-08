/*
AI-generated: 10% (boilerplate and error handling)
Human-written: 90% (all logic, endpoints, typing)
*/

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export interface RSVP {
  _id: string;
  plan_id: string;
  user_id: string;
  created_at: string;
}

/**
 * Add or remove RSVP for a plan
 * @param planId - ID of the plan
 * @param accessToken - JWT token
 * @param isRSVPed - true if the user already RSVPed (will delete)
 */
export async function handleRSVP(planId: string, accessToken: string, isRSVPed: boolean): Promise<{ success: boolean; errorMessage: string | null }> {
  if (!planId || !accessToken) {
    return { success: false, errorMessage: "Missing plan ID or access token." };
  }

  const endpoint = isRSVPed
    ? `${baseUrl}/api/rsvp/plan/${planId}/delete`
    : `${baseUrl}/api/rsvp/add`;

  const options: RequestInit = isRSVPed
    ? {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan_id: planId }),
      };

  try {
    const response = await fetch(endpoint, options);
    const data = await response.json().catch(() => ({})); // in case DELETE has no body

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.detail || "Failed to update RSVP.";
      return { success: false, errorMessage };
    }

    return { success: true, errorMessage: null };
  } catch (err) {
    console.error("RSVP request failed:", err);
    return { success: false, errorMessage: "Network error. Please try again." };
  }
}

/**
 * Get all RSVPs for a specific plan
 */
export async function getRSVPByPlan(planId: string, accessToken: string): Promise<{ data: RSVP[] | null; errorMessage: string | null }> {  
  try {
    const response = await fetch(`${baseUrl}/api/rsvp/plan/${planId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.detail || "Failed to fetch RSVPs for plan.";
      return { data: null, errorMessage };
    }

    return { data: data.data, errorMessage: null };
  } catch (err) {
    return { data: null, errorMessage: "Network error. Please try again." };
  }
}

/**
 * Get all RSVPs for a specific user
 */
export async function getRSVPByUser(userId: string, accessToken: string): Promise<{ data: RSVP[] | null; errorMessage: string | null }> {
  try {
    const response = await fetch(`${baseUrl}/api/rsvp/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.detail || "Failed to fetch user's RSVPs.";
      return { data: null, errorMessage };
    }

    return { data, errorMessage: null };
  } catch (err) {
    return { data: null, errorMessage: "Network error. Please try again." };
  }
}
