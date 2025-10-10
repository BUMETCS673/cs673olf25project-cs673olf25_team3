/*

AI-generated code: 10% (Tool: Cursor, ChatGPT adapted/modified; error handling and data mapping
Human-written code: 80% (functions: addPlan; classes: none; )

Notes:
- Most of the code is human-written with AI assistance for boilerplate/fetch patterns.
- All functions are written/modified by humans.
- Base URL setup and export statements are human-written.

*/
import dayjs, { Dayjs } from "dayjs";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const formatDate = (dateString: Dayjs) => {
     const selectedDate = dateString
     let toReturn = selectedDate.year() +"-"+ String(selectedDate.month()+1).padStart(2, '0') + "-"+ String(selectedDate.date()).padStart(2, '0');
     return toReturn  
  } 

async function updateProfile(
  profileDate:{
    first_name: string;
    last_name: string;
    date_of_birth: Dayjs | string;
    bio: string;
  },
  accessToken: String
) {
  try {
    profileDate.date_of_birth = formatDate(<Dayjs>profileDate.date_of_birth)
    const response = await fetch(`${baseUrl}/api/profile/update/`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileDate)
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

export { updateProfile };