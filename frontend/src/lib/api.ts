import { API_URL } from "./utils";

export interface PredictRequest {
  year: number;
  precipitation: number;
  maxtemp: number;
  mintemp: number;
  avgtemp: number;
  specifichumidity: number;
  relativehumidity: number;
  surfacepressure: number;
  dewpoints: number;
  minwindspeed: number;
  maxwindspeed: number;
  cloudcoverage: number;
  nitrogen: number;
  phosphorus: number;
  pottasium: number;
  ph: number;
  ndvi: number;
}

export interface PredictResponse {
  prediction: number;
  confidence: number;
}

export async function fetchPredict(
  body: PredictRequest
): Promise<PredictResponse> {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail || "Prediction failed");
  }
  return res.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("API unavailable");
  return res.json();
}
