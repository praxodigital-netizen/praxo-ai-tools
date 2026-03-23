import { createEdgeSpark } from "@edgespark/client";
import "@edgespark/client/styles.css";

export const client = createEdgeSpark({ 
  baseUrl: import.meta.env.VITE_SUPABASE_URL 
});
