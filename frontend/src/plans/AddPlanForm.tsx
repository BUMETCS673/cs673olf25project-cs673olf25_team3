import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  description: string;
  location: {
    name: string;
    address1: string;
    city: string;
    state: string;
    zipcode: string;
  };
  start_time: Dayjs | null;
  end_time: Dayjs | null;
}

interface AddPlanFormProps {
  initialData?: any; // edit data
  editMode?: boolean;
  handleSubmit: (formData: any) => Promise<any>;
}

export default function AddPlanForm({
  initialData,
  editMode = false,
  handleSubmit,
}: AddPlanFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: {
      name: "",
      address1: "",
      city: "",
      state: "",
      zipcode: "",
    },
    start_time: null,
    end_time: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        location: {
          name: initialData.location?.name || "",
          address1: initialData.location?.address1 || "",
          city: initialData.location?.city || "",
          state: initialData.location?.state || "",
          zipcode: initialData.location?.zipcode || "",
        },
        start_time: initialData.start_time ? dayjs(initialData.start_time) : null,
        end_time: initialData.end_time ? dayjs(initialData.end_time) : null,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string | PickerValue) => {
    if (["name", "address1", "city", "state", "zipcode"].includes(field)) {
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const onSubmit = async () => {
    const result = await handleSubmit(formData);

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
      navigate('/home')
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          {editMode ? "Edit Plan" : "Add Plan"}
        </Typography>

        <TextField
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          fullWidth
          margin="normal"
          multiline
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Location Name"
          value={formData.location.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Address"
          value={formData.location.address1}
          onChange={(e) => handleChange("address1", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.address1}
          helperText={errors.address1}
        />

        <TextField
          label="City"
          value={formData.location.city}
          onChange={(e) => handleChange("city", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.city}
          helperText={errors.city}
        />

        <TextField
          label="State"
          value={formData.location.state}
          onChange={(e) => handleChange("state", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.state}
          helperText={errors.state}
        />

        <TextField
          label="Zipcode"
          value={formData.location.zipcode}
          onChange={(e) => handleChange("zipcode", e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.zipcode}
          helperText={errors.zipcode}
        />

        <DateTimePicker
          label="Start Time"
          value={formData.start_time}
          onChange={(newValue) => handleChange("start_time", newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              error: !!errors.start_time,
              helperText: errors.start_time,
            },
          }}
        />

        <DateTimePicker
          label="End Time"
          value={formData.end_time}
          onChange={(newValue) => handleChange("end_time", newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              error: !!errors.end_time,
              helperText: errors.end_time,
            },
          }}
        />

        {errors.form && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.form}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={onSubmit}>
            {editMode ? "Update" : "Save"}
          </Button>
          <Button
          variant="outlined"
          onClick={() => {
            console.log('what the hell')
            navigate('/home')
          }}
        >
          Cancel
        </Button>

        </Box>
      </Box>
    </LocalizationProvider>
  );
}
