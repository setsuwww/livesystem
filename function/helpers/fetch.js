import { api } from "@/lib/api";
import { toast } from "sonner";

const cache = {};
const cacheTimestamps = {};
const CACHE_TTL = 1000 * 60;

export async function fetch({
  url,
  method = "get",
  data,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  useCache = true,
}) {
  try {
    if (method === "get" && useCache) {
      const now = Date.now();
      const lastFetch = cacheTimestamps[url] || 0;

      if (cache[url] && now - lastFetch < CACHE_TTL) {
        return cache[url];
      }
    }

    const res = await api[method](url, data);

    if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(res.data);

    // simpan cache kalau GET
    if (method === "get" && useCache) {
      cache[url] = res.data;
      cacheTimestamps[url] = Date.now();
    }

    return res.data;
  } catch (err) {
    if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}
