// src/stores/commonStore.js
import { create } from "zustand";
import api from "../services/api";

export const useCommonStore = create((set, get) => ({
  classes: [],
  students: [],
  rules: [],
  rankings: [],
  selectedClass: null,
  selectedStudent: null,
  selectedRule: null,
  isLoading: false,
  error: null,

  // === GET /classes ===
  fetchClasses: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/classes");
    if (!err) set({ classes: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /classes/[class_id] ===
  fetchClassById: async (classId) => {
    if (!classId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/classes/${classId}`);
    if (!err) set({ selectedClass: body });
    set({ isLoading: false });
    return body;
  },

  // === GET /students ===
  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/students");
    if (!err) set({ students: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /students/[studentid] ===
  fetchStudentById: async (studentId) => {
    if (!studentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/students/${studentId}`);
    if (!err) set({ selectedStudent: body });
    set({ isLoading: false });
    return body;
  },

  // === GET /classes/[classid]/students ===
  fetchStudentsByClass: async (classId) => {
    if (!classId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/classes/${classId}/students`);
    if (!err) set({ students: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /rules ===
  fetchRules: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/rules");
    if (!err) set({ rules: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /rules/[rulesid] ===
  fetchRuleById: async (ruleId) => {
    if (!ruleId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/rules/${ruleId}`);
    if (!err) set({ selectedRule: body });
    set({ isLoading: false });
    return body;
  },

  // === GET /students/search?q=Иван ===
  searchStudents: async (query) => {
    if (!query || query.trim() === "") return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/students/search?q=${encodeURIComponent(query)}`);
    if (!err) set({ students: body || [] });
    set({ isLoading: false });
    return body;
  },
  // === GET /ranking ===
  fetchRankings: async () => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get("/ranking");
    if (!err) set({ rankings: body || [] });
    set({ isLoading: false });
    return body;
  },
}));
