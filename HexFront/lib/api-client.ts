const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8888`;
  }
  return 'http://localhost:8888';
};

export const API_BASE_URL = getApiBaseUrl();

export async function fetchFromApi(endpoint: string, options: RequestInit = {}, accessHash?: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessHash) {
    headers['X-Access-Hash'] = accessHash;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth() {
  return fetchFromApi('/health');
}

export async function launchAnalysis(target: string, analysisType: string, accessHash?: string) {
  return fetchFromApi('/api/intelligence/analyze-target', {
    method: 'POST',
    body: JSON.stringify({
      target,
      analysis_type: analysisType,
    }),
  }, accessHash);
}
