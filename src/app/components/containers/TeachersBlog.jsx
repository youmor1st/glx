    import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  List,
  Button,
  CircularProgress,
} from '@mui/material';
import { School, Add } from '@mui/icons-material';
import { useAdminStore } from '../../../store/adminStore';
import { useCommonStore } from '../../../store/commonStore';
import UserCard from '../../../components/UserCard';
import SearchBar from '../../../components/layouts/SearchBar';
import AddUserDialog from '../dialogs/AddUserDialog';
import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog';

export function TeachersBlog() {
  const {
    isLoading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    fetchTeachers,
  } = useAdminStore();
  
  const [teachers, setTeachers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userType, setUserType] = useState('teacher');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Локальное состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Загружаем учителей при монтировании компонента
  useEffect(() => {
    const loadTeachers = async () => {
      const result = await fetchTeachers();
      if (result && Array.isArray(result)) {
        setTeachers(result);
      }
    };
    loadTeachers();
  }, [fetchTeachers]);

  // Поиск учителей
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const searchTeachersData = async () => {
        const result = await searchTeachers(searchQuery.trim());
        if (result && Array.isArray(result)) {
          setTeachers(result);
        }
      };
      searchTeachersData();
    } else if (searchQuery.trim().length === 0) {
      // Если поиск очищен, загружаем всех учителей
      const loadAllTeachers = async () => {
        const result = await fetchTeachers();
        if (result && Array.isArray(result)) {
          setTeachers(result);
        }
      };
      loadAllTeachers();
    }
  }, [searchQuery, searchTeachers, fetchTeachers]);

  const handleOpenDialog = (user = null, type = 'teacher') => {
    // Закрываем другие drawer'ы перед открытием нового
    if (deleteDialogOpen) setDeleteDialogOpen(false);
    
    setUserType(type);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      password: '',
    });
  };

  const handleSubmit = async () => {
    let result;
    if (editingUser) {
      result = await updateTeacher(editingUser.id, formData);
    } else {
      result = await createTeacher(formData);
    }
    
    if (!result.err) {
      handleCloseDialog();
      
      // После успешного сохранения обновляем список учителей
      const loadTeachers = async () => {
        const result = await fetchTeachers();
        if (result && Array.isArray(result)) {
          setTeachers(result);
        }
      };
      loadTeachers();
    }
  };

  const handleDelete = (userId, type) => {
    // Закрываем другие drawer'ы перед открытием нового
    if (dialogOpen) setDialogOpen(false);
    
    setUserToDelete({ id: userId, type });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete && userToDelete.type === 'teacher') {
      const result = await deleteTeacher(userToDelete.id);
      
      if (!result.err) {
        // После успешного удаления обновляем список учителей
        const loadTeachers = async () => {
          const result = await fetchTeachers();
          if (result && Array.isArray(result)) {
            setTeachers(result);
          }
        };
        loadTeachers();
      }
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const teachersToShow = teachers || [];


  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography sx={{ color: 'red' }}>Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </Box>

      <Card
        sx={{
          background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
          borderRadius: 2,
          border: '1px solid rgba(156, 39, 176, 0.2)',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Teachers ({teachersToShow.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog(null, 'teacher')}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5e35b1 0%, #8e24aa 100%)' }
              }}
            >
              Add Teacher
            </Button>
          </Box>
        {isLoading ? (
          <Box textAlign="center" py={3}>
            <CircularProgress sx={{ color: '#9266FF' }} />
          </Box>
        ) : teachersToShow.length === 0 ? (
          <Box textAlign="center" py={3}>
            <School sx={{ fontSize: 48, color: '#666', mb: 2 }} />
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
              No teachers found
            </Typography>
          </Box>
        ) : (
          <List>
            {teachersToShow.map((teacher) => (
              <li key={teacher.id} style={{ listStyle: 'none' }}>
                <UserCard
                  user={teacher}
                  type="teacher"
                  onEdit={() => handleOpenDialog(teacher, 'teacher')}
                  onDelete={() => handleDelete(teacher.id, 'teacher')}
                />
              </li>
            ))}
          </List>
        )}
      </CardContent>
    </Card>

    {/* Add/Edit Teacher Dialog */}
    <AddUserDialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      onSubmit={handleSubmit}
      editingUser={editingUser}
      userType={userType}
      formData={formData}
      setFormData={setFormData}
    />

    {/* Delete Confirmation Dialog */}
    <DeleteConfirmationDialog
      open={deleteDialogOpen}
      onClose={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Delete Teacher"
      message={`Are you sure you want to delete this teacher? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
    />
    </>
  );
}
