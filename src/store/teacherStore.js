// src/store/teacherStore.js
import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./authStore";

export const useTeacherStore = create((set, get) => ({
  profile: null,
  history: [],
  isLoading: false,
  error: null,

  _resolveTeacherId: (teacherId) => {
    if (teacherId) return teacherId;
    return useAuthStore.getState()?.user?.id;
  },

  // === GET /teacher/me ===
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    const id = get()._resolveTeacherId();
    const { body, err } = await api.get(`/teacher/me`);
    if (!err) set({ profile: body });
    set({ isLoading: false });
    return body;
  },

  // === POST /workflow/assign ===
  assignPoints: async (assignmentData) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.post("/teachers/workflow/assign", assignmentData);
    set({ isLoading: false });
    return { body, err };
  },

  // === GET /teacher/me/history?page=1&size=5 ===
  fetchHistory: async (page = 1, size = 5) => {
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/teacher/me/history?page=${page}&size=${size}`);
    if (!err) set({ history: body || [] });
    set({ isLoading: false });
    return body;
  },

  // === GET /teacher/me/history/[assignmentid] ===
  fetchHistoryById: async (assignmentId) => {
    if (!assignmentId) return;
    set({ isLoading: true, error: null });
    const { body, err } = await api.get(`/teacher/me/history/${assignmentId}`);
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
}));
