import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { useTeacherStore } from '../../store/teacherStore';
import { useAuthStore } from '../../store/authStore';
import { useCommonStore } from '../../store/commonStore';
import DeleteConfirmationDialog from '../components/dialogs/DeleteConfirmationDialog';
import AssignmentTable from '../components/AssignmentTable';
import CommonRankingTable from '../components/CommonRankingTable';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { 
    history, 
    isLoading,
    error,
    fetchHistory, 
    deleteHistoryRecord,
    fetchProfile,
  } = useTeacherStore();
  const {
    rankings,
    fetchRankings,
  } = useCommonStore();

  const [deletingId, setDeletingId] = useState(null);

  // Диалог подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  useEffect(() => {
    loadPointHistory();
    fetchRankings();
    fetchProfile();
  }, [fetchHistory, fetchRankings, fetchProfile]);

  const loadPointHistory = async () => {
    await fetchHistory(1, 10);
  };

  const handleDeleteAssignment = (historyId) => {
    setAssignmentToDelete(historyId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      setDeletingId(assignmentToDelete);
      const { err } = await deleteHistoryRecord(assignmentToDelete);
      
      if (!err) {
        // История автоматически обновляется в store
        loadPointHistory();
      }
      setDeletingId(null);
    }
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
  };

  // вспомогательные функции не используются, удалены

  return (
    <Box sx={{ minHeight: '100vh', pb: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4a1d63 0%, #343355 50%, #4a1d63 100%)',
          backdropFilter: 'blur(50px)',
          boxShadow: '0 20px 100px #4a1d63',
          p: 2,
          my: 2,
        }}
      >
        <Container maxWidth="sm">
          <Box display="flex" alignItems="center" mb={3}>
            <HistoryIcon sx={{ fontSize: 32, color: '#9266FF', mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 400 }}>
                Teacher Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A5984' }}>
                Welcome back, {user?.first_name} {user?.last_name}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ px: 2 }}>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Point History Section */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
          borderRadius: 2,
          border: '1px solid rgba(146, 102, 255, 0.2)',
        }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#F4F4FF', flexGrow: 1, fontWeight: 400 }}>
              Points Assignment History
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={loadPointHistory}
              disabled={isLoading}
              sx={{
                borderColor: 'rgba(146, 102, 255, 0.5)',
                color: '#9266FF',
                '&:hover': {
                  borderColor: '#9266FF',
                  background: 'rgba(146, 102, 255, 0.1)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#9266FF' }} />
            </Box>
          ) : !Array.isArray(history) || history.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: 'rgba(146, 102, 255, 0.1)',
                border: '1px solid rgba(146, 102, 255, 0.3)',
                color: '#F4F4FF'
              }}
            >
              No point assignments found. Start assigning points to students to see your history here.
            </Alert>
          ) : (
            <AssignmentTable
              assignments={history}
              onDelete={handleDeleteAssignment}
              isLoading={isLoading}
            />
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#9266FF' }} />
            </Box>
          ) : !Array.isArray(rankings) || rankings.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No rankings found.
              </Alert>
            ) : (
              <CommonRankingTable rankings={rankings} />
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
}
