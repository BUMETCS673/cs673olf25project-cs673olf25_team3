const baseUrl = import.meta.env.VITE_API_BASE_URL;

async function getFriends(accessToken: string) {
  try {
    const response = await fetch(`${baseUrl}/api/friends/`, {
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
        errorMessage =
          data?.message || data?.error || data?.detail || "Failed to fetch friends";
      }

      return { errorMessage };
    }

    return data; // array of users
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}

export { getFriends };