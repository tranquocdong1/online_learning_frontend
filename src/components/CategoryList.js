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
       TextField,
       Dialog,
       DialogActions,
       DialogContent,
       DialogContentText,
       DialogTitle,
       Typography,
   } from '@mui/material';
   import { Edit, Delete } from '@mui/icons-material';
   import { toast } from 'react-toastify';
   import api from '../services/api';

   const CategoryList = () => {
       const [categories, setCategories] = useState([]);
       const [totalPages, setTotalPages] = useState(1);
       const [currentPage, setCurrentPage] = useState(1);
       const [openDialog, setOpenDialog] = useState(false);
       const [dialogAction, setDialogAction] = useState('');
       const [selectedCategory, setSelectedCategory] = useState(null);
       const [formData, setFormData] = useState({ name: '', description: '' });
       const limit = 10;

       const fetchCategories = async () => {
           try {
               const response = await api.get('/admin/categories', {
                   params: { page: currentPage, limit },
               });
               setCategories(response.data.data);
               setTotalPages(response.data.pages);
           } catch (error) {
               toast.error(error.response?.data?.message || 'Failed to fetch categories');
           }
       };

       useEffect(() => {
           fetchCategories();
       }, [currentPage]);

       const handleOpenDialog = (action, category = null) => {
           setDialogAction(action);
           setSelectedCategory(category);
           setFormData(category ? { name: category.name, description: category.description || '' } : { name: '', description: '' });
           setOpenDialog(true);
       };

       const handleCloseDialog = () => {
           setOpenDialog(false);
           setSelectedCategory(null);
           setDialogAction('');
           setFormData({ name: '', description: '' });
       };

       const handleFormChange = (e) => {
           setFormData({ ...formData, [e.target.name]: e.target.value });
       };

       const handleSubmit = async () => {
           try {
               if (dialogAction === 'create') {
                   await api.post('/admin/categories', formData);
                   toast.success('Category created successfully');
               } else if (dialogAction === 'edit') {
                   await api.put(`/admin/categories/${selectedCategory.id}`, formData);
                   toast.success('Category updated successfully');
               } else if (dialogAction === 'delete') {
                   await api.delete(`/admin/categories/${selectedCategory.id}`);
                   toast.success('Category deleted successfully');
               }
               fetchCategories();
               handleCloseDialog();
           } catch (error) {
               toast.error(error.response?.data?.message || 'Action failed');
           }
       };

       const handlePageChange = (event, value) => {
           setCurrentPage(value);
       };

       return (
           <Box sx={{ p: 3 }}>
               <Typography variant="h5" gutterBottom>
                   Category Management
               </Typography>
               <Box sx={{ mb: 2 }}>
                   <Button
                       variant="contained"
                       color="primary"
                       onClick={() => handleOpenDialog('create')}
                   >
                       Add Category
                   </Button>
               </Box>
               <TableContainer component={Paper}>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>ID</TableCell>
                               <TableCell>Name</TableCell>
                               <TableCell>Description</TableCell>
                               <TableCell>Actions</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {categories.map((category) => (
                               <TableRow key={category.id}>
                                   <TableCell>{category.id}</TableCell>
                                   <TableCell>{category.name}</TableCell>
                                   <TableCell>{category.description || '-'}</TableCell>
                                   <TableCell>
                                       <IconButton
                                           onClick={() => handleOpenDialog('edit', category)}
                                           color="primary"
                                       >
                                           <Edit />
                                       </IconButton>
                                       <IconButton
                                           onClick={() => handleOpenDialog('delete', category)}
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
                       {dialogAction === 'create'
                           ? 'Create Category'
                           : dialogAction === 'edit'
                           ? 'Edit Category'
                           : 'Delete Category'}
                   </DialogTitle>
                   <DialogContent>
                       {dialogAction === 'delete' ? (
                           <DialogContentText>
                               Are you sure you want to delete the category "{selectedCategory?.name}"?
                           </DialogContentText>
                       ) : (
                           <>
                               <TextField
                                   label="Name"
                                   name="name"
                                   value={formData.name}
                                   onChange={handleFormChange}
                                   required
                                   fullWidth
                                   margin="normal"
                                   autoComplete="off"
                               />
                               <TextField
                                   label="Description"
                                   name="description"
                                   value={formData.description}
                                   onChange={handleFormChange}
                                   multiline
                                   rows={4}
                                   fullWidth
                                   margin="normal"
                                   autoComplete="off"
                               />
                           </>
                       )}
                   </DialogContent>
                   <DialogActions>
                       <Button onClick={handleCloseDialog}>Cancel</Button>
                       <Button onClick={handleSubmit} color="primary" autoFocus>
                           {dialogAction === 'delete' ? 'Delete' : 'Save'}
                       </Button>
                   </DialogActions>
               </Dialog>
           </Box>
       );
   };

   export default CategoryList;