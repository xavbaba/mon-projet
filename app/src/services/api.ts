import { getAccessToken } from "./auth";

const API_URL = "http://localhost:3000/api";

export interface EbaySimilarItem {
  title: string;
  price: string;
  currency: string;
  date: string;
  link: string;
  imageUrl: string;
}

export interface AnalysisResult {
  id: string;
  name: string;
  epoch: string;
  usage: string;
  estimatedValue: string;
  description: string;
  similarItems: EbaySimilarItem[];
  imageUri: string;
  createdAt: string;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function analyzeImage(imageUri: string): Promise<AnalysisResult> {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "photo.jpg";
  formData.append("image", {
    uri: imageUri,
    name: filename,
    type: "image/jpeg",
  } as any);

  const headers = await authHeaders();

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status}`);
  }

  return response.json();
}

export async function getHistory(): Promise<AnalysisResult[]> {
  const headers = await authHeaders();

  const response = await fetch(`${API_URL}/history`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.status}`);
  }
  return response.json();
}
