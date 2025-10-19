// src/services/api.js
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";
import { EXAMPLE_URL } from "../utils/url.js";
import { 
  isDevMode, 
  generateMockInitData, 
  getSavedUsername
} from "../utils/devHelpers.js";



const BASE_URL = EXAMPLE_URL;

const request = async (method, url, data = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // ✅ добавляем initData или token из cookies
    const initData = getCookie("initData");
    let initDataToUse = initData;
    
    // Проверяем access_token из localStorage
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    // В dev режиме всегда генерируем новый initData, игнорируя URL
    if (isDevMode()) {
      const savedUsername = getSavedUsername();
      initDataToUse = generateMockInitData(savedUsername);
      
      // Dev режим: генерируем мок initData на основе сохраненного username
    } else if (!initDataToUse) {
      // В продакшн режиме проверяем URL параметры для реальных данных Telegram
      const urlParams = new URLSearchParams(window.location.search);
      const tgWebAppData = urlParams.get('tgWebAppData');
      
      if (tgWebAppData) {
        initDataToUse = tgWebAppData;
      }
    }

    if (initDataToUse) {
      headers["x-init-data"] = initDataToUse;
    }

    const options = {
    method,
      headers,
      // credentials: "include", // убираем из-за CORS проблем
    };

    // Если это POST запрос на /auth/login, добавляем initData в заголовки и тело
    if (method === "POST" && url === "/auth/login" && initDataToUse) {
      // Добавляем в заголовки
      headers["x-init-data"] = initDataToUse;
      headers["telegram-init-data"] = initDataToUse;
      headers["x-telegram-init-data"] = initDataToUse; // Еще один вариант
      
      // Также добавляем в тело запроса
      if (data) {
        data.initData = initDataToUse;
      }
    }

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
