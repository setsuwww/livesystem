import { api } from "@/lib/api";
import { toast } from "sonner";

const cache = {};
const cacheTimestamps = {};
const CACHE_TTL = 1000 * 60;

function isEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b) }

export async function fetch({
  url, method = "get", data,
  onSuccess, onError,
  successMessage, errorMessage,
  useCache = true,
}) {
  try { const now = Date.now();
    const lastFetch = cacheTimestamps[url] || 0;

    let res;

    if (method === "get") {
      if (useCache && cache[url] && now - lastFetch < CACHE_TTL) return cache[url];

      res = await api.get(url, { params: data });

      cache[url] = res.data;
      cacheTimestamps[url] = now;
    } 
    else { res = await api[method](url, data);
      delete cache[url];
      delete cacheTimestamps[url];
    }

    if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(res.data);

    return res.data;
  } 
  catch (err) { if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}

