import { api } from "@/lib/api";
import { toast } from "sonner";

const cache = {};
const cacheTimestamps = {};
const CACHE_TTL = 1000 * 60;

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function fetch({ url, method = "get", data, onSuccess, onError, successMessage, errorMessage, useCache = true }) {
  try {
    const now = Date.now();
    const lastFetch = cacheTimestamps[url] || 0;

    // Kalau GET dan ada cache
    if (method === "get" && useCache && cache[url]) {
      if (now - lastFetch < CACHE_TTL) { return cache[url] }

      const res = await api[method](url, data);

      if (!isEqual(res.data, cache[url])) { cache[url] = res.data;
        cacheTimestamps[url] = now;
      }

      return cache[url];
    }

    const res = await api[method](url, data);

    if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(res.data);

    if (method === "get" && useCache) { cache[url] = res.data;
      cacheTimestamps[url] = now;
    } 
    else if (["post", "put", "delete"].includes(method)) { delete cache[url];
      delete cacheTimestamps[url];
    }

    return res.data;
  } 
  catch (err) { if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}
