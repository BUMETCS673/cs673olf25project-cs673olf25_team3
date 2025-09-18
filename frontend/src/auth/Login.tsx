import { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.trim() !== "" && password.trim() !== "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: 400, boxShadow: 6, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Login
          </Typography>

          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{ input: { style: { backgroundColor: "white" } } }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ input: { style: { backgroundColor: "white" } } }}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isValid}
          >
            Login
          </Button>

          {/* Sign Up Button */}
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            fullWidth
            sx={{ mt: 2, color: "black", borderColor: "black" }}
          >
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
