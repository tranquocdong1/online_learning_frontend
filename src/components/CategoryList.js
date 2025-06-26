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
    Card,
    CardContent,
    Avatar,
    Container,
    Divider,
    Fade,
    Tooltip,
    alpha,
} from '@mui/material';
import { 
    Edit, 
    Delete, 
    Category as CategoryIcon, 
    Add,
    Folder,
    ArrowBack // Thêm import ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate
import api from '../services/api';

const CategoryList = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate
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

    const getDialogConfig = () => {
        switch (dialogAction) {
            case 'create':
                return {
                    title: 'Create New Category',
                    color: 'success',
                    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                };
            case 'edit':
                return {
                    title: 'Edit Category',
                    color: 'primary',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
            case 'delete':
                return {
                    title: 'Delete Category',
                    color: 'error',
                    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                };
            default:
                return {
                    title: 'Category',
                    color: 'primary',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Card 
                elevation={0} 
                sx={{ 
                    mb: 4,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 200,
                        height: 200,
                        background: alpha('#fff', 0.1),
                        borderRadius: '50%',
                        transform: 'translate(50%, -50%)'
                    }}
                />
                <CardContent sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Back">
                            <IconButton
                                onClick={() => navigate(-1)} // Quay lại trang trước
                                sx={{ 
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: alpha('#ffffff', 0.2)
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha('#fff', 0.2),
                                width: 56,
                                height: 56 
                            }}
                        >
                            <CategoryIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Category Management
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Organize and structure your content categories
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    {/* Add Category Button */}
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            All Categories
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog('create')}
                            sx={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                px: 3,
                                '&:hover': {
                                    opacity: 0.9,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Add Category
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Categories Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha('#f093fb', 0.05) }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category, index) => (
                                    <Fade in={true} timeout={300 + index * 100} key={category.id}>
                                        <TableRow 
                                            hover
                                            sx={{ 
                                                '&:hover': { 
                                                    bgcolor: alpha('#f093fb', 0.02) 
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    #{category.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 40, 
                                                            height: 40,
                                                            bgcolor: 'primary.main',
                                                        }}
                                                    >
                                                        <Folder />
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {category.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    colour="text.secondary"
                                                    sx={{
                                                        maxWidth: 300,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {category.description || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Tooltip title="Edit Category">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('edit', category)}
                                                            color="primary"
                                                            size="small"
                                                            sx={{ 
                                                                borderRadius: 1.5,
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)'
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Category">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('delete', category)}
                                                            color="error"
                                                            size="small"
                                                            sx={{ 
                                                                borderRadius: 1.5,
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)'
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {categories.length} of {totalPages * limit} categories
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: 500
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha(getDialogConfig().color === 'error' ? '#f44336' : 
                                              getDialogConfig().color === 'success' ? '#4caf50' : '#2196f3', 0.1),
                                color: getDialogConfig().color === 'error' ? '#f44336' : 
                                       getDialogConfig().color === 'success' ? '#4caf50' : '#2196f3',
                                width: 40,
                                height: 40
                            }}
                        >
                            {dialogAction === 'create' ? <Add /> : 
                             dialogAction === 'edit' ? <Edit /> : <Delete />}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {getDialogConfig().title}
                        </Typography>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3, minHeight: dialogAction === 'delete' ? 'auto' : 200 }}>
                    {dialogAction === 'delete' ? (
                        <DialogContentText sx={{ fontSize: '1rem' }}>
                            Are you sure you want to delete the category "<strong>{selectedCategory?.name}</strong>"?
                            <Typography component="div" sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
                                This action cannot be undone.
                            </Typography>
                        </DialogContentText>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Category Name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                placeholder="Enter a brief description of this category..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        color={getDialogConfig().color}
                        autoFocus
                        sx={{ 
                            borderRadius: 2,
                            background: dialogAction !== 'delete' ? getDialogConfig().gradient : undefined
                        }}
                    >
                        {dialogAction === 'delete' ? 'Delete' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CategoryList;