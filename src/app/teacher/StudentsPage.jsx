import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Person, ArrowBack } from '@mui/icons-material';
import { useTeacherStore } from '../../store/teacherStore';
import { useCommonStore } from '../../store/commonStore';
import UserCard from '../../components/UserCard';
import ClassCard from '../../components/ClassCard';
import SearchBar from '../../components/layouts/SearchBar';
import { AssignRulesDrawer } from '../components/dialogs/AssignRulesDrawer';

export function StudentsPage() {
  const {
    isLoading: teacherLoading,
    error: teacherError,
    assignPoints,
  } = useTeacherStore();

  const {
    students,
    classes,
    isLoading: commonLoading,
    error: commonError,
    fetchStudents,
    fetchClasses,
    fetchStudentsByClass,
    fetchRules,
    rules,
    searchStudents,
    // selectedClass из стора тут не используется
  } = useCommonStore();

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInSearchMode, setIsInSearchMode] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState([]);
  const [assignComment, setAssignComment] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const isLoading = teacherLoading || commonLoading;
  const error = teacherError || commonError;

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [fetchClasses, fetchStudents]);

  // Загружаем студентов класса при выборе класса
  useEffect(() => {
    if (selectedClassId) {
      loadClassStudents();
    }
  }, [selectedClassId]);

  // Загружаем правила при открытии диалога
  useEffect(() => {
    if (rulesOpen && (!rules || rules.length === 0)) {
      fetchRules();
    }
  }, [rulesOpen, fetchRules, rules]);

  // Поиск студентов
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsInSearchMode(true);
        const result = await searchStudents(searchQuery);
        if (result) {
          setSearchResults(result);
        }
      } else {
        setIsInSearchMode(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchStudents]);

  // loadInitialData удалён, прямые вызовы в useEffect

  const loadClassStudents = async () => {
    if (selectedClassId) {
      await fetchStudentsByClass(selectedClassId);
    }
  };

  const handleClassSelect = (classId) => {
    setSelectedClassId(classId);
    setIsInSearchMode(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setIsInSearchMode(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudentIds([studentId]);
    setSelectedRuleIds([]);
    setAssignComment('');
    setRulesOpen(true);
  };

  const handleToggleRule = (ruleId) => {
    setSelectedRuleIds(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId) 
        : [...prev, ruleId]
    );
  };

  const handleAssignSubmit = async () => {
    if (selectedStudentIds.length === 0 || selectedRuleIds.length === 0) return;
    setIsAssigning(true);
    const { err } = await assignPoints({
      student_ids: selectedStudentIds,
      rule_ids: selectedRuleIds,
      comment: assignComment
    });
    if (!err) {
      handleCloseRulesDrawer();
      // Перезагружаем студентов для обновления баллов
      if (selectedClassId) {
        await fetchStudentsByClass(selectedClassId);
      } else {
        await fetchStudents();
      }
    }
    setIsAssigning(false);
  };

  const handleCloseRulesDrawer = () => {
    setRulesOpen(false);
    setSelectedStudentIds([]);
    setSelectedRuleIds([]);
    setAssignComment('');
  };

  // Определяем какие студенты показывать
  const studentsToShow = isInSearchMode ? searchResults : students;

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
            <Person sx={{ fontSize: 32, color: '#9266FF', mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 400 }}>
                Students Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#5A5984' }}>
                {selectedClassId ? 'Select students to assign points' : 'Select a class to view students'}
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
      {!selectedClassId && (
        <Box sx={{ mb: 3 }}>
          <SearchBar
            placeholder="Search students..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </Box>
      )}

        <Card sx={{ 
          background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
          borderRadius: 2,
          border: '1px solid rgba(146, 102, 255, 0.2)',
        }}>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#9266FF' }} />
            </Box>
          ) : selectedClassId ? (
            // Показываем студентов класса
            <>
              {/* Back button */}
              <Box sx={{ mb: 3 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleBackToClasses}
                  sx={{
                    color: '#9266FF',
                    '&:hover': {
                      backgroundColor: 'rgba(146, 102, 255, 0.1)'
                    }
                  }}
                >
                  Back to Classes
                </Button>
              </Box>

              {/* Students list */}
              {students.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    backgroundColor: 'rgba(146, 102, 255, 0.1)',
                    border: '1px solid rgba(146, 102, 255, 0.3)',
                    color: '#F4F4FF'
                  }}
                >
                  No students found in this class.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                  {students.map(student => (
                    <UserCard
                      key={student.id}
                      user={student}
                      type="student"
                      onClick={() => handleStudentClick(student.id)}
                      showActions={false}
                    />
                  ))}
                </Box>
              )}
            </>
          ) : isInSearchMode ? (
            // Показываем результаты поиска
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#5A5984' }}>
                  Search results for "{searchQuery}"
                </Typography>
              </Box>
              {searchResults.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    backgroundColor: 'rgba(146, 102, 255, 0.1)',
                    border: '1px solid rgba(146, 102, 255, 0.3)',
                    color: '#F4F4FF'
                  }}
                >
                  No students found matching your search.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                  {searchResults.map(student => (
                    <UserCard
                      key={student.id}
                      user={student}
                      type="student"
                      onClick={() => handleStudentClick(student.id)}
                      showActions={false}
                    />
                  ))}
                </Box>
              )}
            </>
          ) : (
            // Показываем список классов
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#5A5984' }}>
                  Select a class to view students
                </Typography>
              </Box>
              {classes.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    backgroundColor: 'rgba(146, 102, 255, 0.1)',
                    border: '1px solid rgba(146, 102, 255, 0.3)',
                    color: '#F4F4FF'
                  }}
                >
                  No classes found.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                  {classes.map(classItem => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onClick={() => handleClassSelect(classItem.id)}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </CardContent>
        </Card>
      </Container>

      {/* Assign Rules Drawer */}
      <AssignRulesDrawer
        open={rulesOpen}
        onClose={handleCloseRulesDrawer}
        rules={rules}
        selectedRuleIds={selectedRuleIds}
        onToggleRule={handleToggleRule}
        assignComment={assignComment}
        onCommentChange={setAssignComment}
        onSubmit={handleAssignSubmit}
        isSubmitting={isAssigning}
        selectedStudentName={selectedStudentIds.length === 1 ? 
          students.find(s => s.id === selectedStudentIds[0])?.first_name + ' ' + 
          students.find(s => s.id === selectedStudentIds[0])?.last_name : 
          selectedStudentIds.length > 1 ? `${selectedStudentIds.length} students` : ''
        }
      />
    </Box>
  );
}
