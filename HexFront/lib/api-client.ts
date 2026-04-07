export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth() {
  return fetchFromApi('/health');
}

export async function launchAnalysis(target: string, analysisType: string) {
  return fetchFromApi('/api/intelligence/analyze-target', {
    method: 'POST',
    body: JSON.stringify({
      target,
      analysis_type: analysisType,
    }),
  });
}
