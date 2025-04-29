import { useState, useEffect, useCallback } from "react";
import useNavigation from "../useNavigation";
import Cookies from 'js-cookie';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseApiOptions<T> {
  method?: Method;
  body?: any;
  headers?: HeadersInit;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  immediate?: boolean;
  istoken?: boolean;
}

const BASE_URL = "https://localhost:8443";

export function useApi<T>(
  url: string,
  options: UseApiOptions<T>
) {
  const {
	method = "GET",
	body,
	headers = {},
	onSuccess,
	onError,
	immediate = true,
	istoken = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const fetchData = useCallback(async () => {
	setLoading(true);
	setError(null);

	let token = istoken ? Cookies.get('token') : undefined;

	const buildRequestOptions = (overrideToken?: string) => ({
	  method,
	  headers: {
		...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
		...(overrideToken ? { Authorization: `Bearer ${overrideToken}` } : {}),
		...headers,
	  },
	  body: body
		? (body instanceof FormData ? body : JSON.stringify(body))
		: undefined,
	});

	try {
	  const response = await fetch(BASE_URL + url, buildRequestOptions(token));
	  const result = await response.json();

	  if (!response.ok) {
		console.log("Response status", response.status);
		if (response.status === 401 && istoken) {
		  Cookies.remove('token');
		  const refreshToken = Cookies.get('refreshtoken');
		  console.log("Refresh token", refreshToken);
		  if (refreshToken) {
			const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
			  method: 'POST',
			  headers: {
				Authorization: `Bearer ${refreshToken}`,
			  },
			  body: undefined,
			});
			if (refreshResponse.ok) {
			  const refreshData = await refreshResponse.json();
			  const newToken = refreshData.token;
			  
			  if (newToken) {
				console.log("Nouveau token", newToken);
				Cookies.set('token', newToken);
				// Retry original request with new token
				const retryResponse = await fetch(BASE_URL + url, buildRequestOptions(newToken));
				const retryResult = await retryResponse.json();

				if (!retryResponse.ok) {
				  throw new Error(retryResult.message || 'Erreur après refresh');
				}
				setData(retryResult);
				if (onSuccess) onSuccess(retryResult);
				return;
			  }
			}
		  }
		  Cookies.remove('token');
		  Cookies.remove('refreshtoken');
			  navigate("/");
		  return;
		}
		throw new Error(result.message || 'Une erreur est survenue');
	  }

	  setData(result);
	  if (onSuccess) onSuccess(result);
	} catch (err) {
	  setError(err);
	  if (onError) onError(err);
	} finally {
	  setLoading(false);
	}
  }, [url, method, body, headers, onSuccess, onError, istoken]);

  useEffect(() => {
	if (immediate) {
	  fetchData();
	}
  }, [fetchData, immediate]);

  return { data, error, loading, refetch: fetchData };
}
