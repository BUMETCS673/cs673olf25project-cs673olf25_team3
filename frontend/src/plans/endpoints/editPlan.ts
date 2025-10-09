/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: editPlan; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/
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
