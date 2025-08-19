import { api } from "@/lib/api";
import { toast } from "sonner";

type Method = "get" | "post" | "put" | "delete";

interface FetchOptions<T> {
  url: string;
  method?: Method;
  data?: any;
  onSuccess?: (res: T) => void;
  onError?: (err: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export async function fetch<T = any>({ url, method = "get", data, onSuccess, onError, successMessage, errorMessage }: FetchOptions<T>) 
{
  try { const res = await api[method]<T>(url, data); if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(res.data);
    return res.data;
  } 
  catch (err) { if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}
