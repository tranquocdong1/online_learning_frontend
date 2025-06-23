import React from 'react';
   import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
   import { ToastContainer } from 'react-toastify';
   import 'react-toastify/dist/ReactToastify.css';
   import AdminLoginPage from './pages/AdminLoginPage';

   function App() {
       return (
           <Router>
               <ToastContainer />
               <Routes>
                   <Route path="/admin/login" element={<AdminLoginPage />} />
                   <Route path="/" element={<div>Welcome to Online Learning System</div>} />
               </Routes>
           </Router>
       );
   }

   export default App;