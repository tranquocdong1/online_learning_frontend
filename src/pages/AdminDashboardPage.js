import React from 'react';
   import { Typography, Box, Button } from '@mui/material';
   import { useNavigate } from 'react-router-dom';

   const AdminDashboardPage = () => {
       const navigate = useNavigate();

       return (
           <Box sx={{ p: 3 }}>
               <Typography variant="h4" gutterBottom>
                   Admin Dashboard
               </Typography>
               <Typography gutterBottom>Welcome to the admin panel!</Typography>
               <Button
                   variant="contained"
                   color="primary"
                   onClick={() => navigate('/admin/users')}
                   sx={{ mt: 2 }}
               >
                   Manage Users
               </Button>
           </Box>
       );
   };

   export default AdminDashboardPage;