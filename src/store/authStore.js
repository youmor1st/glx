// src/store/authStore.js
import { create } from "zustand";
import { initData, retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { api } from "../services/api";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies";
import toast from "react-hot-toast";

/**
 * Auth store — отвечает за Telegram авторизацию и хранение пользователя.
 * Работает даже после перезагрузки (initData из cookies).
 */

export const useAuthStore = create((set, get) => ({
  user: null,
  initData: getCookie("initData") || null,
  loading: false,
  error: null,

  /**
   * Инициализация через Telegram SDK
   */
  initTelegramAuth: async () => {
    try {
      const launchParams = retrieveLaunchParams();
      const tgInitData = launchParams?.initData || initData.raw;

      // Проверяем, что initData содержит реальные Telegram данные
      if (!tgInitData || tgInitData.includes('function()')) {
        console.warn("⚠️ No valid Telegram initData found - app might not be running in Telegram");
        return;
      }

      // ✅ сохраняем initData в cookies
      setCookie("initData", tgInitData);
      set({ initData: tgInitData });

      // Проверяем пользователя
      const { body, err } = await api.get("/auth/me");
      if (body && !err) {
        set({ user: body });
      } else {
        console.warn("Failed to fetch user data - user might need to login");
      }
    } catch (error) {
      console.warn("Telegram auth initialization failed:", error);
    }
  },

  /**
   * Универсальный вход через Telegram
   */
  login: async () => {
    try {
      set({ loading: true });
      
      // Получаем текущий initData из cookies или Telegram SDK
      const currentInitData = getCookie("initData");
      if (!currentInitData) {
        toast.error("No init data available");
        return;
      }

      const { body, err } = await api.post("/auth/login");

      if (body && !err) {
        // Обновляем initData если сервер вернул новый
        if (body.initData) {
          setCookie("initData", body.initData);
          set({ initData: body.initData });
        }
        set({ user: body.user || body });
        toast.success("Logged in successfully");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Login error");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Получить текущий профиль
   */
  fetchProfile: async () => {
    try {
      set({ loading: true });
      const { body, err } = await api.get("/auth/me");
      if (body && !err) {
        set({ user: body });
      } else {
        console.warn("Failed to fetch profile:", err);
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("fetchProfile error:", error);
      toast.error("Profile loading error");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Логин с username/password + Telegram ID
   */
  firstLogin: async (username, password) => {
    try {
      set({ loading: true, error: null });
      
      // Отправляем username, password + Telegram ID из initData
      const { body, err } = await api.post("/auth/login", { username, password });

      if (body && !err) {
        // Сохраняем access_token в localStorage для последующих запросов
        if (body.access_token) {
          localStorage.setItem('access_token', body.access_token);
        }
        
        set({ user: body.user || body, loading: false });
        toast.success("Logged in successfully");
        return { success: true, user: body.user || body };
      } else {
        set({ error: err?.message || "Login failed", loading: false });
        toast.error("Login failed");
        return { success: false, error: err?.message || "Login failed" };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Login error");
      return { success: false, error: error.message };
    }
  },

  /**
   * Проверка авторизации (для обновления user данных)
   */
  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const { body, err } = await api.get("/auth/me");
      
      if (body && !err) {
        // Если получили новый токен, сохраняем его
        if (body.access_token) {
          localStorage.setItem('access_token', body.access_token);
        }
        
        set({ user: body, loading: false });
        return { success: true, user: body };
      } else {
        // Если авторизация не удалась, очищаем токен
        localStorage.removeItem('access_token');
        set({ error: err?.message || "Auth check failed", loading: false });
        return { success: false, error: err?.message || "Auth check failed" };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  /**
   * Очистка ошибок
   */
  clearError: () => set({ error: null }),

  /**
   * Логаут (по кнопке)
   */
  logout: () => {
    deleteCookie("initData");
    localStorage.removeItem('access_token');
    set({ user: null, initData: null, error: null });
    toast.success("Logged out");
  },
}));
