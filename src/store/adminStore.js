// src/store/adminStore.js
import { create } from "zustand";
import api from "../services/api";

export const useAdminStore = create((set, get) => ({
  dashboard: null,
  rankings: [],
  history: [],
  teachers: [],
  students: [],
  rules: [],
  teacherStats: [],
  isLoading: false,
  error: null,

  // === GET /admin/dashboard ===
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/admin/dashboard");
    if (!err) set({ dashboard: body });
    set({ isLoading: false });
    return body;
  },

  // === POST /admin/students ===
  createStudent: async (studentData) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.post("/admin/students", studentData);
    set({ isLoading: false });
    return { body, err };
  },

  // === POST /admin/teachers ===
  createTeacher: async (teacherData) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.post("/admin/teachers", teacherData);
    set({ isLoading: false });
    return { body, err };
  },

  // === POST /admin/rules ===
  createRule: async (ruleData) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.post("/admin/rules", ruleData);
    set({ isLoading: false });
    return { body, err };
  },

  // === PUT /admin/students/[studentid] ===
  updateStudent: async (studentId, studentData) => {
    if (!studentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.put(`/admin/students/${studentId}`, studentData);
    set({ isLoading: false });
    return { body, err };
  },

  // === PUT /admin/teachers/[teacherid] ===
  updateTeacher: async (teacherId, teacherData) => {
    if (!teacherId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.put(`/admin/teachers/${teacherId}`, teacherData);
    set({ isLoading: false });
    return { body, err };
  },

  // === PUT /admin/rules/[ruleid] ===
  updateRule: async (ruleId, ruleData) => {
    if (!ruleId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.put(`/admin/rules/${ruleId}`, ruleData);
    set({ isLoading: false });
    return { body, err };
  },

  // === DELETE /admin/students/[studentid] ===
  deleteStudent: async (studentId) => {
    if (!studentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.del(`/admin/students/${studentId}`);
    set({ isLoading: false });
    return { body, err };
  },

  // === DELETE /admin/teachers/[teacherid] ===
  deleteTeacher: async (teacherId) => {
    if (!teacherId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.del(`/admin/teachers/${teacherId}`);
    set({ isLoading: false });
    return { body, err };
  },

  // === DELETE /admin/rules/[ruleid] ===
  deleteRule: async (ruleId) => {
    if (!ruleId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.del(`/admin/rules/${ruleId}`);
    set({ isLoading: false });
    return { body, err };
  },

  // === GET /teachers/search?q=Иван ===
  searchTeachers: async (query) => {
    if (!query || query.trim() === "") return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/teachers/search?q=${encodeURIComponent(query)}`);
    if (!err) set({ teachers: body || [] });
    set({ isLoading: false });
    return body;
  },
  
  // === GET /teachers ===
  fetchTeachers: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/admin/teachers");
    if (!err) set({ teachers: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === POST /workflow/assign ===
  assignPoints: async (assignmentData) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.post("admin/workflow/assign", assignmentData);
    set({ isLoading: false });
    return { body, err };
  },

  // === GET /admin/history ===
  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/admin/history");
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /admin/history/[assignmentid] ===
  fetchHistoryById: async (assignmentId) => {
    if (!assignmentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/admin/history/${assignmentId}`);
    set({ isLoading: false });
    return body;
  },

  // === GET /admin/history/[studentid] ===
  fetchHistoryByStudent: async (studentId) => {
    if (!studentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/admin/history/${studentId}`);
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /admin/history/[teacherid] ===
  fetchHistoryByTeacher: async (teacherId) => {
    if (!teacherId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/admin/history/${teacherId}`);
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /admin/history/[ruleid] ===
  fetchHistoryByRule: async (ruleId) => {
    if (!ruleId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/admin/history/${ruleId}`);
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === DELETE /admin/history/[history_id] ===
  deleteHistoryRecord: async (historyId) => {
    if (!historyId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.del(`/admin/history/${historyId}`);
    set({ isLoading: false });
    return { body, err };
  },

  // === GET /admin/stats/teachers ===
  fetchTeacherStats: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/admin/stats/teachers");
    if (!err) set({ teacherStats: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /admin/ranking ===
  fetchAdminRanking: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/admin/ranking");
    if (!err) set({ rankings: body || [] });
    set({ isLoading: false });
    return body;
  },
}));
