/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: dismissPlan, undismissPlan,getDismissedPlans; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/

const baseUrl = import.meta.env.VITE_API_BASE_URL;


/**
 * Dismiss a specific plan (hide it from feed)
 */
export async function dismissPlan(planId: string, accessToken: string): Promise<{ success: boolean; errorMessage: string | null }> {
  try {
    const response = await fetch(`${baseUrl}/api/plans/${planId}/dismiss`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 204) {
      return { success: true, errorMessage: null };
    }

    const data = await response.json();
    const errorMessage = data?.message || data?.error || data?.detail || "Failed to dismiss plan.";
    return { success: false, errorMessage };
  } catch {
    return { success: false, errorMessage: "Network error. Please try again." };
  }
}

/**
 * Undismiss a plan (make it visible again)
 */
export async function undismissPlan(planId: string, accessToken: string): Promise<{ success: boolean; errorMessage: string | null }> {
  try {
    const response = await fetch(`${baseUrl}/api/plans/${planId}/undismiss`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 204) {
      return { success: true, errorMessage: null };
    }

    const data = await response.json();
    const errorMessage = data?.message || data?.error || data?.detail || "Failed to undismiss plan.";
    return { success: false, errorMessage };
  } catch {
    return { success: false, errorMessage: "Network error. Please try again." };
  }
}

/**
 * Get all dismissed plans for the current user
 */
export async function getDismissedPlans(accessToken: string): Promise<{ data: any[] | null; errorMessage: string | null }> {
  try {
    const response = await fetch(`${baseUrl}/api/plans/dismissed`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.detail || "Failed to fetch dismissed plans.";
      return { data: null, errorMessage };
    }
    console.log('data', data)
    return { data: data || [], errorMessage: null };
  } catch {
    return { data: null, errorMessage: "Network error. Please try again." };
  }
}
