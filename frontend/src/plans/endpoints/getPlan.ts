/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: getPlans; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/
import { getUserById } from "../../users/endpoints/getUserById";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function getPlans(accessToken: string, filter: boolean, userId?: string) {
  try {
    const response = await fetch(`${baseUrl}/api/plans/?friends=${filter}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage;

      if (data && typeof data === "object") {
        errorMessage = data.message || data.error || data.detail || JSON.stringify(data);
      } else {
        errorMessage = "Failed to fetch plans";
      }

      return { data: null, errorMessage };
    }

    const enrichedPlans = await Promise.all(
      data.map(async (plan: any) => {
        let showEdit = false;
        let userData = null;

        if (plan.created_by) {
          userData = await getUserById(plan.created_by, accessToken);

          if (!userData.errorMessage && userId === plan.created_by) {
            showEdit = true;
          }
        }

        return {
          ...plan,
          user: userData || null,
          showEdit,
        };
      })
    );

return { data: enrichedPlans, errorMessage: null };
  } catch (err) {
    return { data: null, errorMessage: "Network error. Please try again." };
  }
}

export { getPlans };
