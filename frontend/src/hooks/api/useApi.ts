import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
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
const BASE_URL = import.meta.env.VITE_URL_PRODE || "https://localhost:8443";


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
  const navigate = useNavigate();
  

  const fetchData = useCallback(async (bodyOverride?: any) => {
	setLoading(true);
	setError(null);

	let token = istoken ? Cookies.get('token') : undefined;

	const finalBody = bodyOverride ?? body;

	const buildRequestOptions = (overrideToken?: string) => ({
	  method,
	  headers: {
		...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
		...(overrideToken ? { Authorization: `Bearer ${overrideToken}` } : {}),
		...headers,
	  },
	  body: finalBody
		? (finalBody instanceof FormData ? finalBody : JSON.stringify(finalBody))
		: undefined,
	});

	try {
	  const response = await fetch(BASE_URL + url, buildRequestOptions(token));
	  const result = await response.json();

	  if (!response.ok) {
		if (response.status === 401 && istoken) {
		  Cookies.remove('token');
		  const refreshToken = Cookies.get('refreshtoken');
		//   console.log("Refresh token", refreshToken);
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
				Cookies.set('token', newToken);
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

	  setData(result.data);
	  if (onSuccess) onSuccess(result.data);
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
