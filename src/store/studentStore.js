// src/store/studentStore.js
import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./authStore";

export const useStudentStore = create((set, get) => ({
  profile: null,
  history: [],
  isLoading: false,
  error: null,

  // Вспомогательно: определить текущий studentId из authStore при отсутствии аргумента
  _resolveStudentId: (studentId) => {
    if (studentId) return studentId;
    return useAuthStore.getState()?.user?.id;
  },

  // === GET /students/[student_id] ===
  fetchProfile: async (studentId) => {
    set({ isLoading: true, error: null });
    const id = get()._resolveStudentId(studentId);
    const { body, err } = await api.get(`/students/${id}`);
    if (!err) set({ profile: body });
    set({ isLoading: false });
    return body;
  },

  // === GET /students/me/history?page=1&size=5 ===
  fetchHistory: async (page = 1, size = 5) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/students/me/history?page=${page}&size=${size}`);
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /students/me/history/[assignmentid] ===
  fetchHistoryById: async (assignmentId) => {
    if (!assignmentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/students/me/history/${assignmentId}`);
    set({ isLoading: false });
    return body;
  },
}));
