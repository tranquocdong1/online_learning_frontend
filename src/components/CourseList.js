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
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Avatar,
    Container,
    Divider,
    Fade,
    Tooltip,
    alpha,
    Chip,
} from '@mui/material';
import { 
    Edit, 
    Delete, 
    Settings,
    School,
    Add,
    Image as ImageIcon,
    Category as CategoryIcon,
    ArrowBack // Thêm import ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        status: 'active',
        thumbnail: null,
    });
    const limit = 50;
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const response = await api.get('/admin/courses', {
                params: { page: currentPage, limit },
            });
            console.log('API response:', response.data);
            setCourses(response.data.data);
            setTotalPages(response.data.pages);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch courses');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/admin/categories', {
                params: { page: 1, limit: 100 },
            });
            setCategories(response.data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to fetch categories'
            );
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [currentPage]);

    const handleOpenDialog = (action, course = null) => {
        setDialogAction(action);
        setSelectedCourse(course);
        setFormData(
            course
                ? {
                      title: course.title,
                      description: course.description || '',
                      category_id: course.category_id,
                      status: course.status,
                      thumbnail: null,
                  }
                : {
                      title: '',
                      description: '',
                      category_id: '',
                      status: 'active',
                      thumbnail: null,
                  }
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCourse(null);
        setDialogAction('');
        setFormData({
            title: '',
            description: '',
            category_id: '',
            status: 'active',
            thumbnail: null,
        });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, thumbnail: e.target.files[0] });
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category_id', formData.category_id);
            console.log('FormData status:', formData.status);
            formDataToSend.append('status', formData.status);
            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }

            if (dialogAction === 'create') {
                await api.post('/admin/courses', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Course created successfully');
            } else if (dialogAction === 'edit') {
                await api.put(`/admin/courses/${selectedCourse.id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Course updated successfully');
            } else if (dialogAction === 'delete') {
                await api.delete(`/admin/courses/${selectedCourse.id}`);
                toast.success('Course deleted successfully');
            }
            fetchCourses();
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
                    title: 'Create New Course',
                    color: 'success',
                    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                };
            case 'edit':
                return {
                    title: 'Edit Course',
                    color: 'primary',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
            case 'delete':
                return {
                    title: 'Delete Course',
                    color: 'error',
                    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                };
            default:
                return {
                    title: 'Course',
                    color: 'primary',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
        }
    };

    const getStatusChip = (status) => {
        return (
            <Chip
                label={status}
                size="small"
                color={status === 'active' ? 'success' : 'default'}
                sx={{
                    borderRadius: 2,
                    fontWeight: 'medium',
                    textTransform: 'capitalize'
                }}
            />
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Card 
                elevation={0} 
                sx={{ 
                    mb: 4,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
                            <School sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Course Management
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Create, edit, and monitor course content and progress
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    {/* Add Course Button */}
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            All Courses
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
                            Add Course
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Courses Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha('#4facfe', 0.05) }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Course</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Thumbnail</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Actions</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Content</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses.map((course, index) => (
                                    <Fade in={true} timeout={300 + index * 100} key={course.id}>
                                        <TableRow 
                                            hover
                                            sx={{ 
                                                '&:hover': { 
                                                    bgcolor: alpha('#4facfe', 0.02) 
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    #{course.id}
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
                                                        <School />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {course.title}
                                                        </Typography>
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.secondary"
                                                            sx={{
                                                                maxWidth: 200,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                display: 'block'
                                                            }}
                                                        >
                                                            {course.description || 'No description'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {course.Category?.name || '-'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {course.thumbnail ? (
                                                    <Avatar
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        variant="rounded"
                                                        sx={{ 
                                                            width: 50, 
                                                            height: 50,
                                                            borderRadius: 2
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{ 
                                                            width: 50, 
                                                            height: 50,
                                                            bgcolor: 'grey.100',
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <ImageIcon sx={{ color: 'grey.400' }} />
                                                    </Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusChip(course.status)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Tooltip title="Edit Course">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('edit', course)}
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
                                                    <Tooltip title="Delete Course">
                                                        <IconButton
                                                            onClick={() => handleOpenDialog('delete', course)}
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
                                            <TableCell align="center">
                                                <Tooltip title="Manage Content">
                                                    <IconButton
                                                        onClick={() =>
                                                            navigate(`/admin/courses/${course.id}/content`)
                                                        }
                                                        color="secondary"
                                                        size="small"
                                                        sx={{ 
                                                            borderRadius: 1.5,
                                                            bgcolor: alpha('#9c27b0', 0.1),
                                                            '&:hover': {
                                                                transform: 'scale(1.1)',
                                                                bgcolor: alpha('#9c27b0', 0.2)
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <Settings fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
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
                            Showing {courses.length} of {totalPages * limit} courses
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
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: 600
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
                <DialogContent sx={{ pt: 3, pb: 3, minHeight: dialogAction === 'delete' ? 'auto' : 400, overflowY: 'auto' }}>
                    {dialogAction === 'delete' ? (
                        <DialogContentText sx={{ fontSize: '1rem' }}>
                            Are you sure you want to delete the course "<strong>{selectedCourse?.title}</strong>"?
                            <Typography component="div" sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
                                This action cannot be undone and will remove all associated content.
                            </Typography>
                        </DialogContentText>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Course Title"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                autoComplete="off"
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
                                autoComplete="off"
                                variant="outlined"
                                placeholder="Enter a detailed description of this course..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleFormChange}
                                    required
                                    label="Category"
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select Category</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                    required
                                    label="Status"
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="hidden">Hidden</MenuItem>
                                </Select>
                            </FormControl>
                            <Box>
                                <Button 
                                    variant="contained" 
                                    component="label"
                                    startIcon={<ImageIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    Upload Thumbnail
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {formData.thumbnail && (
                                    <Typography sx={{ mt: 1, color: 'success.main', fontSize: '0.875rem' }}>
                                        ✓ Selected: {formData.thumbnail.name}
                                    </Typography>
                                )}
                            </Box>
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

export default CourseList;