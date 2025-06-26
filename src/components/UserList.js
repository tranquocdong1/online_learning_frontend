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
    Card,
    CardContent,
    Chip,
    InputLabel,
    FormControl,
    Divider,
    Container,
    Fade,
    Tooltip,
    alpha,
} from '@mui/material';
import { Lock, LockOpen, Delete, FilterList, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserList = () => {
    const navigate = useNavigate();
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'locked':
                return 'error';
            default:
                return 'default';
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Card 
                elevation={0} 
                sx={{ 
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3
                }}
            >
                <CardContent sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Back">
                            <IconButton
                                onClick={() => navigate(-1)}
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
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                User Management
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Manage and monitor all user accounts in your system
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Box sx={{ 
                        mb: 3, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterList color="action" />
                            <Typography variant="h6" color="text.secondary">
                                Filters
                            </Typography>
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status Filter"
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">All Users</MenuItem>
                                <MenuItem value="active">Active Users</MenuItem>
                                <MenuItem value="locked">Locked Users</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha('#667eea', 0.05) }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Full Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <Fade in={true} timeout={300 + index * 100} key={user.id}>
                                        <TableRow 
                                            hover
                                            sx={{ 
                                                '&:hover': { 
                                                    bgcolor: alpha('#667eea', 0.02) 
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    #{user.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {user.username}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {user.full_name || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.status}
                                                    color={getStatusColor(user.status)}
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: 'medium',
                                                        textTransform: 'capitalize',
                                                        minWidth: 70
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Tooltip title={user.status === 'active' ? 'Lock User' : 'Unlock User'}>
                                                        <IconButton
                                                            onClick={() => handleLockToggle(user)}
                                                            color={user.status === 'active' ? 'warning' : 'success'}
                                                            size="small"
                                                            sx={{ 
                                                                borderRadius: 1.5,
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)'
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {user.status === 'active' ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            onClick={() => handleDelete(user)}
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

                    <Box sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {users.length} of {totalPages * limit} users
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

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {dialogAction === 'delete' ? 'Delete User' : dialogAction === 'lock' ? 'Lock User' : 'Unlock User'}
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3 }}>
                    <DialogContentText sx={{ fontSize: '1rem' }}>
                        Are you sure you want to <strong>{dialogAction}</strong> the user "<strong>{selectedUser?.username}</strong>"?
                        {dialogAction === 'delete' && (
                            <Typography component="div" sx={{ mt: 2, color: 'error.main', fontSize: '0.875rem' }}>
                                This action cannot be undone.
                            </Typography>
                        )}
                    </DialogContentText>
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
                        onClick={handleConfirmAction} 
                        variant="contained"
                        color={dialogAction === 'delete' ? 'error' : 'primary'}
                        autoFocus
                        sx={{ borderRadius: 2 }}
                    >
                        Confirm {dialogAction}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserList;