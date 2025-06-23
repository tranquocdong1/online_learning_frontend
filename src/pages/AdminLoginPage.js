import React from 'react';
   import AdminLogin from '../components/AdminLogin';
   import { useNavigate } from 'react-router-dom';

   const AdminLoginPage = () => {
       const navigate = useNavigate();

       const handleLogin = () => {
           navigate('/admin/dashboard'); // Redirect after login
       };

       return <AdminLogin onLogin={handleLogin} />;
   };

   export default AdminLoginPage;