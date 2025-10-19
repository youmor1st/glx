// src/services/api.js
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";
import { EXAMPLE_URL } from "../utils/url.js";

/**
 * Извлекает telegram_id из initData строки
 * @param {string} initData - строка initData от Telegram
 * @returns {number|null} telegram_id или null
 */
const extractTelegramIdFromInitData = (initData) => {
  try {
    if (!initData) return null;

    // Разбираем строку initData
    const params = new URLSearchParams(initData);
    const userParam = params.get("user");

    if (userParam) {
      const userData = JSON.parse(decodeURIComponent(userParam));
      return userData?.id || null;
    }

    return null;
  } catch (error) {
    console.warn("Ошибка при извлечении telegram_id из initData:", error);
    return null;
  }
};

/**
 * Получает Telegram ID из Telegram WebApp
 * @returns {number|null} telegram_id или null
 */
const getTelegramId = () => {
  try {
    // Проверяем, есть ли Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Пытаемся получить ID из initDataUnsafe
      if (webApp.initDataUnsafe && webApp.initDataUnsafe.user && webApp.initDataUnsafe.user.id) {
        console.log("🔍 Found telegram_id in initDataUnsafe:", webApp.initDataUnsafe.user.id);
        return webApp.initDataUnsafe.user.id;
      }
      
      // Пытаемся получить ID из initData
      if (webApp.initData) {
        const telegramId = extractTelegramIdFromInitData(webApp.initData);
        if (telegramId) {
          console.log("🔍 Found telegram_id in initData:", telegramId);
          return telegramId;
        }
      }
    }
    
    console.warn("⚠️ No Telegram WebApp found or no user ID available");
    return null;
  } catch (error) {
    console.warn("⚠️ Error getting Telegram ID:", error);
    return null;
  }
};

const BASE_URL = EXAMPLE_URL;

/**
 * Универсальный HTTP-запрос
 */
const request = async (method, url, data = null, initDataToUse = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // ✅ добавляем initData или token из cookies
    const initData = getCookie("initData");
    let initDataToUseFinal = initDataToUse || initData;
    
    // Проверяем access_token из localStorage
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    // Проверяем URL параметры для реальных данных Telegram
    if (!initDataToUseFinal) {
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      
      if (tgWebAppData) {
        initDataToUseFinal = tgWebAppData;
      }
    }

    // Проверяем, что initData содержит реальные Telegram данные, а не мок
    if (initDataToUseFinal && initDataToUseFinal.includes('function()')) {
      console.warn("⚠️ Invalid initData detected, clearing it");
      initDataToUseFinal = null;
    }

    // Если это запрос на /auth/login — добавляем Telegram данные
    if (method === "POST" && url === "/auth/login") {
      // Получаем реальный Telegram ID
      const telegramId = getTelegramId();
      
      if (telegramId) {
        headers["X-Telegram-User-ID"] = telegramId.toString();
        console.log("🔍 Using real telegram_id:", telegramId);
        
        // Добавляем в тело запроса
        if (data) {
          data.telegram_id = telegramId;
        }
      } else {
        console.warn("⚠️ No Telegram ID available - request will fail if backend requires it");
      }
      
      // Добавляем initData если есть
      if (initDataToUseFinal) {
        headers["X-Telegram-Init-Data"] = initDataToUseFinal;
        headers["x-telegram-init-data"] = initDataToUseFinal;
        headers["telegram-init-data"] = initDataToUseFinal;
        
        if (data) {
          data.initData = initDataToUseFinal;
        }
      }
    } else if (initDataToUseFinal) {
      // Для других запросов добавляем стандартный заголовок
      headers["x-init-data"] = initDataToUseFinal;
    }

    // Отладочная информация для логина
    if (method === "POST" && url === "/auth/login") {
      console.log("🔍 Login request headers:", headers);
      console.log("🔍 Login request body:", data);
    }


    const options = {
      method,
      headers,
      // credentials: "include", // убираем из-за CORS проблем
    };

    if (data) options.body = JSON.stringify(data);

    const res = await fetch(`${BASE_URL}${url}`, options);

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = body?.message || `Request failed: ${res.status}`;
      // ❗ не разлогиниваем пользователя
      if (method !== "GET") toast.error(errMsg);
      return { body: null, err: errMsg };
    }

    return { body, err: null };
  } catch (err) {
    if (method !== "GET") toast.error("Network error");
    return { body: null, err };
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

    console.log("📤 Отправляем запрос", { url, headers, data });

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