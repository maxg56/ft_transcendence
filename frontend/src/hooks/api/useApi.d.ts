// useApi.d.ts
import { HeadersInit } from "node-fetch"; // si tu es en Node.js, sinon tu peux l'enlever
import { Dispatch, SetStateAction } from "react";

/**
 * Méthodes HTTP prises en charge
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Options disponibles pour le hook useApi
 */
export interface UseApiOptions<T> {
  method?: Method;
  body?: any;
  headers?: HeadersInit;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  immediate?: boolean;
  istoken?: boolean;
}

/**
 * Structure retournée par le hook useApi
 */
export interface UseApiReturn<T> {
  data: T | null;
  error: any;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les appels API avec options.
 * @param url URL relative à BASE_URL
 * @param options Paramètres de configuration du hook
 * @returns Données, état de chargement, erreurs, et une fonction pour relancer la requête
 */
export declare function useApi<T>(url: string, options: UseApiOptions<T>): UseApiReturn<T>;
