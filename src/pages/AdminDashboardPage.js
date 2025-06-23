import React from 'react';
   import { Typography, Box } from '@mui/material';

   const AdminDashboardPage = () => {
       return (
           <Box sx={{ p: 3 }}>
               <Typography variant="h4">Admin Dashboard</Typography>
               <Typography>Welcome to the admin panel!</Typography>
           </Box>
       );
   };

   export default AdminDashboardPage;