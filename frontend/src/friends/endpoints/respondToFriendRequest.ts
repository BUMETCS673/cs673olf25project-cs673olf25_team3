/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: addPlan; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/
const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function respondToFriendRequest(
  userID:String,
  action:String,
  accessToken: String
) {
  try {
    const response = await fetch(`${baseUrl}/api/friends/respond/${userID}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        action: `${action}`,
      },
    });

    const data = await response.json();

if (!response.ok) {
  let errorMessage: any;

  if (data && typeof data === "object") {
    errorMessage = data;
  } else {
    errorMessage = data?.message || data?.error || data?.detail || "Failed to respond to request";
  }

  return { errorMessage };
}
    return data;
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}

export { respondToFriendRequest };