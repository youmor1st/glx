// src/services/api.js
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";
import { EXAMPLE_URL } from "../utils/url.js";

/**
 * Извлекает telegram_id из initData строки
 */
const extractTelegramIdFromInitData = (initData) => {
  try {
    if (!initData) return null;
    const params = new URLSearchParams(initData);
    const userParam = params.get("user");
    if (!userParam) return null;
    const userData = JSON.parse(decodeURIComponent(userParam));
    return userData?.id || null;
  } catch (error) {
    console.warn("Ошибка при извлечении telegram_id:", error);
    return null;
  }
};

/**
 * Получает Telegram ID из Telegram WebApp
 */
const getTelegramId = () => {
  try {
    const webApp = window?.Telegram?.WebApp;
    if (!webApp) {
      console.warn("⚠️ No Telegram WebApp found - using fallback ID for testing");
      return 123456789; // Fallback ID для тестирования
    }

    if (webApp.initDataUnsafe?.user?.id) {
      console.log("🔍 Found telegram_id in initDataUnsafe:", webApp.initDataUnsafe.user.id);
      return webApp.initDataUnsafe.user.id;
    }

    if (webApp.initData) {
      const telegramId = extractTelegramIdFromInitData(webApp.initData);
      if (telegramId) {
        console.log("🔍 Found telegram_id in initData:", telegramId);
        return telegramId;
      }
    }

    console.warn("⚠️ No Telegram ID found in WebApp - using fallback ID for testing");
    return 123456789; // Fallback ID для тестирования
  } catch (error) {
    console.warn("⚠️ Error getting Telegram ID:", error);
    return 123456789; // Fallback ID для тестирования
  }
};

const BASE_URL = import.meta.env.VITE_API_URL || EXAMPLE_URL;

/**
 * Универсальный HTTP-запрос
 */
const request = async (method, url, data = null, initDataToUse = null) => {
  try {
    const headers = { "Content-Type": "application/json" };

    // Добавляем токен
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    // Telegram данные
    let initDataFinal = initDataToUse || getCookie("initData");
    const urlParams = new URLSearchParams(window.location.search);
    const tgWebAppData = urlParams.get("tgWebAppData");
    if (!initDataFinal && tgWebAppData) initDataFinal = tgWebAppData;

    // Очищаем мокнутый initData
    if (initDataFinal?.includes("function()")) initDataFinal = null;

    // Добавляем Telegram ID только для login
    if (url === "/auth/login" && method === "POST") {
      const telegramId = getTelegramId();
      if (telegramId) headers["X-Telegram-User-ID"] = telegramId.toString();
      if (initDataFinal) headers["X-Telegram-Init-Data"] = initDataFinal;
    } else if (initDataFinal) {
      headers["x-init-data"] = initDataFinal;
    }

    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = body?.detail || body?.message || `Error ${res.status}`;
      if (method !== "GET") toast.error(message);
      return { ok: false, data: null, error: message };
    }

    return { ok: true, data: body, error: null };
  } catch (err) {
    if (method !== "GET") toast.error("Network error");
    return { ok: false, data: null, error: err.message };
  }
};

// Упрощенный API с поддержкой Telegram данных
export const api = {
  get: (url) => request("GET", url),
  post: async (url, data, initData = null, telegramId = null) => {
    const BASE_URL = import.meta.env.VITE_API_URL || "https://dem-1-w8zo.onrender.com";

    const headers = {
      "Content-Type": "application/json",
    };

    if (initData) headers["X-Telegram-Init-Data"] = initData;
    if (telegramId) headers["X-Telegram-User-ID"] = telegramId.toString();

    console.log("📤 Отправляем запрос", { 
      url, 
      headers, 
      data,
      hasInitData: !!initData,
      hasTelegramId: !!telegramId,
      telegramIdValue: telegramId
    });

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const text = await res.text();
    console.log("📩 Ответ:", text);
    return res.ok ? JSON.parse(text) : Promise.reject(text);
  },
  put: (url, data) => request("PUT", url, data),
  del: (url) => request("DELETE", url),
};

// Опционально — короткий apiWrapper для store:
export const apiWrapper = {
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  del: (url) => api.del(url),
};

// Экспорт по умолчанию для обратной совместимости
export default api;
