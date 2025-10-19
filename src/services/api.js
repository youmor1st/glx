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

    // Если это запрос на /auth/login и есть initData — добавляем заголовки
    if (method === "POST" && url === "/auth/login" && initDataToUseFinal) {
      // Основной заголовок, который ждёт бекенд
      headers["X-Telegram-Init-Data"] = initDataToUseFinal;

      // Дополнительные заголовки (на всякий случай)
      headers["x-telegram-init-data"] = initDataToUseFinal;
      headers["telegram-init-data"] = initDataToUseFinal;

      // Извлекаем telegram_id из initData
      const telegramId = extractTelegramIdFromInitData(initDataToUseFinal);
      if (telegramId) {
        headers["X-Telegram-User-ID"] = telegramId.toString();
        // дублировать в другие варианты нет смысла — достаточно одного правильного
      }

      // Добавляем в тело запроса (необязательно, но может помочь при отладке)
      if (data) {
        data.initData = initDataToUseFinal;
        if (telegramId) {
          data.telegram_id = telegramId;
        }
      }
    } else if (initDataToUseFinal) {
      // Для других запросов добавляем стандартный заголовок
      headers["x-init-data"] = initDataToUseFinal;
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

// Унифицированный объект API
export const api = {
  get: (url) => request("GET", url),
  post: (url, data) => request("POST", url, data),
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