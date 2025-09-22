// AI-generated: 60%
// Human-written: 40%
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./endpoints/auth";
import { useAuth } from "./AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, auth } = useAuth();
  const navigate = useNavigate();

  const isValid = username.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    if (auth.accessToken) {
      navigate("/home");
    }
  }, [auth.accessToken, navigate]);

  const handleLogin = async () => {
    setError("");
    const result = await loginUser({ username, password });

    if (result.errorMessage) {
      setError(result.errorMessage);
    } else {
      localStorage.setItem("access", result.access);
      localStorage.setItem("refresh", result.refresh);
      login(result.access, result.refresh)
      navigate("/home");
    }
  };

  return (
    <Box
      sx={{
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

          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          {/* Error message */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isValid}
            onClick={handleLogin}
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
