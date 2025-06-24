import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography gutterBottom>Welcome to the admin panel!</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/categories")}
        >
          Manage Categories
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/courses")}
        >
          Manage Courses
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
