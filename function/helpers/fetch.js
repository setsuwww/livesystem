import { api } from "@/lib/api";
import { toast } from "sonner";

export async function fetch({
  url,
  method = "get",
  data,
  onSuccess,
  onError,
  successMessage,
  errorMessage
}) 
{
  try { const res = await api[method](url, data); if (successMessage) toast.success(successMessage);
    if (onSuccess) onSuccess(res.data);
    return res.data;
  } 
  catch (err) { if (errorMessage) toast.error(errorMessage);
    if (onError) onError(err);
    throw err;
  }
}
