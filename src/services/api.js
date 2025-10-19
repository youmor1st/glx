// src/services/api.js
import { getCookie } from "../utils/cookies";
import toast from "react-hot-toast";
import { EXAMPLE_URL } from "../utils/url.js";
import { 
  isDevMode, 
  generateMockInitData, 
  getSavedUsername
} from "../utils/devHelpers.js";
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
  const headers = {
    "Content-Type": "application/json",
  };

  // Если это запрос на /auth/login и есть initData — добавляем заголовки
  if (method === "POST" && url === "/auth/login" && initDataToUse) {
    // Основной заголовок, который ждёт бекенд
    headers["X-Telegram-Init-Data"] = initDataToUse;

    // Дополнительные заголовки (на всякий случай)
    headers["x-telegram-init-data"] = initDataToUse;
    headers["telegram-init-data"] = initDataToUse;

    // Извлекаем telegram_id из initData
    const telegramId = extractTelegramIdFromInitData(initDataToUse);
    if (telegramId) {
      headers["X-Telegram-User-ID"] = telegramId.toString();
      // дублировать в другие варианты нет смысла — достаточно одного правильного
    }

    // Добавляем в тело запроса (необязательно, но может помочь при отладке)
    if (data) {
      data.initData = initDataToUse;
      if (telegramId) {
        data.telegram_id = telegramId;
      }
    }
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка ${response.status}: ${errorText}`);
  }

  return response.json();
};

