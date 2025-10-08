/**
 * Custom Hooks for API calls
 * Các hooks tái sử dụng để fetch và manage data
 */

import { useState, useEffect, useCallback } from 'react';
import type { SearchParams, PaginatedResponse, ApiResponse } from '@/lib/types';

// ============ Generic Fetch Hook ============
export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFn();
        
        if (!cancelled && response.success && response.data) {
          setData(response.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Đã xảy ra lỗi');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

// ============ Paginated Fetch Hook ============
export function usePaginatedFetch<T>(
  fetchFn: (params: SearchParams) => Promise<PaginatedResponse<T>>,
  initialParams: SearchParams = { page: 1, limit: 10 }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetch = useCallback(async (searchParams: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn(searchParams);
      
      if (response.success && response.data) {
        setData(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch(params);
  }, [params, fetch]);

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  const setSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const refresh = () => {
    fetch(params);
  };

  return {
    data,
    loading,
    error,
    pagination,
    params,
    setPage,
    setLimit,
    setSearch,
    setParams,
    refresh,
  };
}

// ============ Mutation Hook ============
export function useMutation<T, P = any>(
  mutateFn: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(
    async (params: P) => {
      try {
        setLoading(true);
        setError(null);
        const response = await mutateFn(params);
        
        if (response.success && response.data) {
          setData(response.data);
          return response.data;
        } else {
          throw new Error(response.message || 'Mutation failed');
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Đã xảy ra lỗi';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutateFn]
  );

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, loading, error, data, reset };
}

// ============ Async State Hook ============
export function useAsync<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (promise: Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await promise;
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Đã xảy ra lỗi';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
}

// ============ Debounce Hook ============
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ Local Storage Hook ============
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
