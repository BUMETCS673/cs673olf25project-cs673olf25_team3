/*
AI-generated: 55% (Tool: ChatGPT; primarily MUI form layout, TextField, DateTimePicker components, Box layout, button styling, Typography headers, and spacing)
Human-written: 45% (logic: handleChange for form state, onSubmit for calling handleSubmit, error parsing and display, pre-filling form on edit, conditional navigation on success, and managing nested location fields)

Notes:

The structure, styling, and component usage were mostly AI-assisted.

Human contributions include the core form logic, dynamic field updates, handling submission with async API calls, error handling, and navigation control.

Validation error mapping from backend responses is entirely human-authored.
*/

import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { useNavigate } from "react-router-dom";
import { getProfile } from "./endpoints/getProfile"
import { updateProfile } from "./endpoints/updateProfile"
import { useAuth } from "../auth/AuthContext";

interface FormData {
  first_name: string;
  last_name: string;
  date_of_birth: Dayjs | null;
  bio: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
    if (auth.accessToken) {
      async function loadUserBio() {
        const result = await getProfile(auth.accessToken as string);
        if ("errorMessage" in result && result.errorMessage) {
          console.error(result.errorMessage);
        } else {
          setInitialData(result);
        }
      }
      loadUserBio();
    }
  }, [auth.accessToken]);

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    date_of_birth: null,
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name ||"",
        date_of_birth: initialData.date_of_birth ? dayjs(new Date(initialData.date_of_birth)).add(1, "day") : null,
        bio: initialData.bio || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string | PickerValue) => {
      setFormData({ ...formData, [field]: value });
  };

  const handleFormSubmit = async (formData: any) => {
    if (!auth.accessToken) return;

    let result;
    result = await updateProfile(formData, auth.accessToken);

    if (!result.errorMessage) {
      navigate('/profile/')
    } else {
      return result.errorMessage;
    }
  };



  const onSubmit = async () => {
    const result = await handleFormSubmit(formData);

    if (result) {
      const newErrors: Record<string, string> = {};
      if (typeof result === "object") {
        Object.entries(result).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            newErrors[field] = messages[0];
          } else if (typeof messages === "object" && messages !== null) {
            Object.entries(messages).forEach(([subField, subMsgs]) => {
              newErrors[subField] = Array.isArray(subMsgs) ? subMsgs[0] : String(subMsgs);
            });
          }
        });
      } else {
        newErrors["form"] = String(result);
      }
      setErrors(newErrors);
    } else {
      // success
      setErrors({});
      navigate('/profile/')
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          {"Edit Profile"}
        </Typography>

        <TextField
          label="First Name"
          value={formData.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.first_name}
          helperText={errors.first_name}
        />

        <TextField
          label="Last Name"
          value={formData.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.last_name}
          helperText={errors.titlast_namee}
        />

        <DateTimePicker
          label="Date of Birth"
          value={dayjs(formData.date_of_birth)}
          onChange={(newValue) => handleChange("date_of_birth", newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              error: !!errors.date_of_birth,
              helperText: errors.date_of_birth,
            },
          }}
          views={['year', 'month', 'day']}
        />

        <TextField
          label="Bio"
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.bio}
          helperText={errors.bio}
        />

        {errors.form && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.form}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={onSubmit}>
            Update
          </Button>
          <Button
          variant="outlined"
        >
          Cancel
        </Button>

        </Box>
      </Box>
    </LocalizationProvider>
  );
}
