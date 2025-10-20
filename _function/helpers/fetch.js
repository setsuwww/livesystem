import { api } from "@/_lib/api";
import { toast } from "sonner";

const cache = new Map();
const CACHE_TTL = 1000 * 60;

function isEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b)}

/**
 * apiFetchData — helper universal buat API call
 *
 * @param {Object} options
 * @param {string} options.url - endpoint (tanpa /api prefix)
 * @param {string} [options.method=get] - get, post, put, patch, delete
 * @param {Object} [options.data] - request body / params
 * @param {Function} [options.onSuccess] - callback on success
 * @param {Function} [options.onError] - callback on error
 * @param {string} [options.successMessage] - toast success
 * @param {string} [options.errorMessage] - toast error
 * @param {boolean} [options.useCache=true] - aktifin cache utk GET
 */

export async function apiFetchData({
  url, method = "get", data,
  onSuccess, onError,
  successMessage, errorMessage,
  useCache = true,
}) {
  const cacheKey = `${method}-${url}-${data ? JSON.stringify(data) : ""}`;
  const now = Date.now();

  try { if (method === "get" && useCache) {
      const cached = cache.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_TTL) { return cached.data }
    }

    const response = method === "get"
      ? await api.get(url, { params: data })
        : await api[method](url, data);

    // Simpan cache kalau GET
    if (method === "get" && useCache) { cache.set(cacheKey, { data: response.data, timestamp: now }) }

    if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(response.data);

    return response.data;
  } 
  catch (err) { console.error("❌ apiFetchData error:", err);
    if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}
