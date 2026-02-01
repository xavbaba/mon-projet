const API_URL = "http://localhost:3000/api";

export interface AnalysisResult {
  id: string;
  name: string;
  epoch: string;
  usage: string;
  estimatedValue: string;
  description: string;
  imageUri: string;
  createdAt: string;
}

export async function analyzeImage(imageUri: string): Promise<AnalysisResult> {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "photo.jpg";
  formData.append("image", {
    uri: imageUri,
    name: filename,
    type: "image/jpeg",
  } as any);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status}`);
  }

  return response.json();
}

export async function getHistory(): Promise<AnalysisResult[]> {
  const response = await fetch(`${API_URL}/history`);
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.status}`);
  }
  return response.json();
}
