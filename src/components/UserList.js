import React, { useState, useEffect } from 'react';
   import {
       Table,
       TableBody,
       TableCell,
       TableContainer,
       TableHead,
       TableRow,
       Paper,
       Button,
       IconButton,
       Pagination,
       Box,
       Select,
       MenuItem,
       Dialog,
       DialogActions,
       DialogContent,
       DialogContentText,
       DialogTitle,
       Typography,
   } from '@mui/material';
   import { Lock, LockOpen, Delete } from '@mui/icons-material';
   import { toast } from 'react-toastify';
   import api from '../services/api';

   const UserList = () => {
       const [users, setUsers] = useState([]);
       const [totalPages, setTotalPages] = useState(1);
       const [currentPage, setCurrentPage] = useState(1);
       const [statusFilter, setStatusFilter] = useState('');
       const [openDialog, setOpenDialog] = useState(false);
       const [dialogAction, setDialogAction] = useState('');
       const [selectedUser, setSelectedUser] = useState(null);

       const limit = 10;

       const fetchUsers = async () => {
           try {
               const response = await api.get('/admin/users', {
                   params: { page: currentPage, limit, status: statusFilter || undefined },
               });
               setUsers(response.data.data);
               setTotalPages(response.data.pages);
           } catch (error) {
               toast.error(error.response?.data?.message || 'Failed to fetch users');
           }
       };

       useEffect(() => {
           fetchUsers();
       }, [currentPage, statusFilter]);

       const handleLockToggle = (user) => {
           setSelectedUser(user);
           setDialogAction(user.status === 'active' ? 'lock' : 'unlock');
           setOpenDialog(true);
       };

       const handleDelete = (user) => {
           setSelectedUser(user);
           setDialogAction('delete');
           setOpenDialog(true);
       };

       const handleConfirmAction = async () => {
           try {
               if (dialogAction === 'delete') {
                   await api.delete(`/admin/users/${selectedUser.id}`);
                   toast.success('User deleted successfully');
               } else {
                   await api.patch(`/admin/users/${selectedUser.id}/lock`);
                   toast.success(`User ${dialogAction}ed successfully`);
               }
               fetchUsers();
               setOpenDialog(false);
           } catch (error) {
               toast.error(error.response?.data?.message || 'Action failed');
           }
       };

       const handleCloseDialog = () => {
           setOpenDialog(false);
           setSelectedUser(null);
           setDialogAction('');
       };

       const handlePageChange = (event, value) => {
           setCurrentPage(value);
       };

       return (
           <Box sx={{ p: 3 }}>
               <Typography variant="h5" gutterBottom>
                   User Management
               </Typography>
               <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                   <Select
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                       displayEmpty
                       sx={{ minWidth: 120 }}
                   >
                       <MenuItem value="">All</MenuItem>
                       <MenuItem value="active">Active</MenuItem>
                       <MenuItem value="locked">Locked</MenuItem>
                   </Select>
               </Box>
               <TableContainer component={Paper}>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>ID</TableCell>
                               <TableCell>Username</TableCell>
                               <TableCell>Email</TableCell>
                               <TableCell>Full Name</TableCell>
                               <TableCell>Status</TableCell>
                               <TableCell>Actions</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {users.map((user) => (
                               <TableRow key={user.id}>
                                   <TableCell>{user.id}</TableCell>
                                   <TableCell>{user.username}</TableCell>
                                   <TableCell>{user.email}</TableCell>
                                   <TableCell>{user.full_name || '-'}</TableCell>
                                   <TableCell>{user.status}</TableCell>
                                   <TableCell>
                                       <IconButton
                                           onClick={() => handleLockToggle(user)}
                                           color={user.status === 'active' ? 'error' : 'success'}
                                       >
                                           {user.status === 'active' ? <Lock /> : <LockOpen />}
                                       </IconButton>
                                       <IconButton
                                           onClick={() => handleDelete(user)}
                                           color="error"
                                       >
                                           <Delete />
                                       </IconButton>
                                   </TableCell>
                               </TableRow>
                           ))}
                       </TableBody>
                   </Table>
               </TableContainer>
               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                   <Pagination
                       count={totalPages}
                       page={currentPage}
                       onChange={handlePageChange}
                       color="primary"
                   />
               </Box>
               <Dialog open={openDialog} onClose={handleCloseDialog}>
                   <DialogTitle>
                       {dialogAction === 'delete' ? 'Delete User' : dialogAction === 'lock' ? 'Lock User' : 'Unlock User'}
                   </DialogTitle>
                   <DialogContent>
                       <DialogContentText>
                           Are you sure you want to {dialogAction} the user "{selectedUser?.username}"?
                       </DialogContentText>
                   </DialogContent>
                   <DialogActions>
                       <Button onClick={handleCloseDialog}>Cancel</Button>
                       <Button onClick={handleConfirmAction} color="primary" autoFocus>
                           Confirm
                       </Button>
                   </DialogActions>
               </Dialog>
           </Box>
       );
   };

   export default UserList;