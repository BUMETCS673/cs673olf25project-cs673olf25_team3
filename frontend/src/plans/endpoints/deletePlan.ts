/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: deletePlan; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/
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
