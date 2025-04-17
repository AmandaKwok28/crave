import { API_URL } from "@/env";
import { PdfResponse } from "./types";

export const fetchPdfContent= async (content:string): Promise<PdfResponse> => {
  const response = await fetch(`${API_URL}/pdf-text`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }

  const data: PdfResponse = await response.json();
  return data;
};