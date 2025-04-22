import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseApiOptions<TBody> {
  method?: Method;
  body?: TBody;
  skip?: boolean; // pour ne pas lancer automatiquement l'appel
  headers?: HeadersInit;
}

interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export function useApi<TResponse, TBody = unknown>(
  url: string,
  options: UseApiOptions<TBody> = {}
  
): UseApiResult<TResponse> {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const token = Cookies.get('token');

  useEffect(() => {
    if (options.skip) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Request failed');
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url, refetchIndex]);

  const refetch = () => setRefetchIndex((i) => i + 1);

  return { data, error, loading, refetch };
}
