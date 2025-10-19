import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  List,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Rule as RuleIcon } from '@mui/icons-material';
import { useTeacherStore } from '../../store/teacherStore';
import { useCommonStore } from '../../store/commonStore';
import SearchBar from '../../components/layouts/SearchBar';
import CodeCard from '../../components/CodeCard';
import AssignStudentsDrawer from '../components/dialogs/AssignStudentsDrawer';

export function RulesPage() {
  const {
    isLoading,
    error,
    assignPoints,
  } = useTeacherStore();

  const {
    rules,
    classes,
    students,
    fetchRules,
    fetchClasses,
    fetchStudentsByClass,
  } = useCommonStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRules, setFilteredRules] = useState([]);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Загружаем правила и классы при монтировании
  useEffect(() => {
    fetchRules();
    fetchClasses();
  }, [fetchRules, fetchClasses]);
  // Фильтруем правила по поисковому запросу
  useEffect(() => {
    if (Array.isArray(rules)) {
      if (searchQuery.trim()) {
        const filtered = rules.filter(rule =>
          rule.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRules(filtered);
      } else {
        setFilteredRules(rules);
      }
    } else {
      setFilteredRules([]);
    }
  }, [rules, searchQuery]);

  // loadInitialData удалён, прямые вызовы в useEffect

  const handleRuleSelect = (rule) => {
    setSelectedRule(rule);
    setStudentsOpen(true);
  };

  const handleCloseStudentsDrawer = () => {
    setStudentsOpen(false);
    setSelectedRule(null);
  };

  const handleAssignToStudents = async ({ student_ids, rule_ids, comment }) => {
    if (!rule_ids?.length || !student_ids?.length) return;
    setIsAssigning(true);
    const { err } = await assignPoints({ student_ids, rule_ids, comment });
    if (!err) {
      setStudentsOpen(false);
      setSelectedRule(null);
    }
    setIsAssigning(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress sx={{ color: '#9266FF' }} />
      </Box>
    );
  }

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
            <RuleIcon sx={{ fontSize: 32, color: '#9266FF', mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 400 }}>
                Rules Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A5984' }}>
                Select a rule to assign points to students
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

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            placeholder="Search rules..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </Box>

        {/* Rules List */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
            borderRadius: 2,
            border: '1px solid rgba(146, 102, 255, 0.2)',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: '#F4F4FF', fontWeight: 400, mb: 2 }}>
              Discipline Rules ({filteredRules.length})
            </Typography>
            {filteredRules.length === 0 ? (
              <Box textAlign="center" py={3}>
                <RuleIcon sx={{ fontSize: 48, color: '#5A5984', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#5A5984' }}>
                  No rules found
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredRules.map((rule) => (
                  <li key={rule.id} style={{ listStyle: 'none' }}>
                    <CodeCard
                      rule={rule}
                      onSelect={() => handleRuleSelect(rule)} 
                      showActions={false}
                    />
                  </li>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Assign Students Drawer */}
      <AssignStudentsDrawer
        open={studentsOpen}
        onClose={handleCloseStudentsDrawer}
        rule={selectedRule}
        classes={classes}
        students={students}
        onLoadClasses={fetchClasses}
        onLoadClassStudents={fetchStudentsByClass}
        onSubmit={handleAssignToStudents}
        isSubmitting={isAssigning}
      />
    </Box>
  );
}
