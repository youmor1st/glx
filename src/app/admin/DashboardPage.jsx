import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { useCommonStore } from '../../store/commonStore';
import CommonRankingTable from '../components/CommonRankingTable';

export function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthStore();
  const {
    dashboard,
    isLoading,
    error,
    fetchDashboard,
  } = useAdminStore();
  const {
    rankings,
    fetchRankings,
  } = useCommonStore();

  useEffect(() => {
    fetchDashboard();
    fetchRankings();
  }, [fetchDashboard, fetchRankings]);

  if (isLoading) {
    return (
      <Box
        sx={styles.loadingContainer}
      >
        <CircularProgress sx={{ color: '#9266FF' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 2 }}>
      {/* Header Section */}
      <Box
        sx={styles.headerSection}
      >
        <Container maxWidth="sm">
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={styles.avatar}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A5984' }}>
                Admin • @{user?.username}
              </Typography>
            </Box>
          </Box>

          {/* Statistics Card */}
          <Box display="flex" gap={3}>
            <Card sx={styles.totalStudentsCard}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" >
                  Total Students
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
                  {dashboard?.total_students || 0}
                </Typography>
                <Typography variant="body2">
                  Active: {dashboard?.active_students || 0}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={styles.totalStudentsCard}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" >
                  Total Teachers
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
                  {dashboard?.total_teachers || 0}
                </Typography>
                <Typography variant="body2">
                  Active: {dashboard?.active_teachers || 0}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ px: 2 }}>

        {/* Analytics Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={styles.analyticsTitle}>
            Analytics
          </Typography>
          <Card sx={styles.analyticsCard}>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={3}>
              <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: '#9266FF', fontWeight: 'bold' }}>
                      {dashboard?.total_assignments || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A5984' }}>
                      Total Assignments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                      {dashboard?.sum_positive_points || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A5984' }}>
                      Merits Points
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: '#FF5722', fontWeight: 'bold' }}>
                      {dashboard?.sum_negative_points || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A5984' }}>
                      Demerits Points
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            
          </Card>
        </Box>
        {/* Ranking Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={styles.analyticsTitle}>
            Ranking
          </Typography>
          <Card sx={styles.analyticsCard}>
            <CardContent sx={{ p: 2 }}>
              <CommonRankingTable rankings={rankings} />
            </CardContent>
          </Card>
        </Box>

        {/* Quick Settings removed (no actions) */}
      </Container>
    </Box>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
  },
  headerSection: {
    pt: 3,
    pb: 4,
    px: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    mr: 2,
    background: 'linear-gradient(135deg, #9266FF 0%, #6932EB 100%)',
    fontSize: '1.2rem',
  },
  analyticsTitle: {
    color: 'white',
    fontWeight: 600,
    mb: 2,
  },
  analyticsCard: {
    background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
    borderRadius: 2,
    border: '1px solid rgba(156, 39, 176, 0.2)',
  },
  totalStudentsCard: {
    width: '100%',
    background: 'linear-gradient(135deg, #9266FF 0%, #6932EB 100%)',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  }
}