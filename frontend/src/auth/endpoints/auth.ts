// AI-generated: 10%
// Human-written: 90%
async function registerUser({ username, email, password, confirmPassword }) {
  try {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirm: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errors: string[] = [];
      for (const key in data) {
        if (Array.isArray(data[key])) {
          data[key].forEach(msg => errors.push(`${key}: ${msg}`));
        } else {
          errors.push(`${key}: ${data[key]}`);
        }
      }

      return { errors };
    }
    return {
      access: data.access,
      refresh: data.refresh,
    };
  } catch (err) {
    return { errors: ["Network error. Please try again."] };
  }
}


async function loginUser({ username, password }) {
  try {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || data.detail || "Login failed";
      return { errorMessage };
    }

    return {
      access: data.access,
      refresh: data.refresh,
    };
  } catch (err) {
    return { errorMessage: "Network error. Please try again." };
  }
}


export { registerUser, loginUser};
