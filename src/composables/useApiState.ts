import { ref, computed, type Ref } from 'vue'
import { ApiResult, type ApiError } from '../services/api'

// Reactive state management for API operations
export interface ApiState<T> {
  data: Ref<T | null>
  error: Ref<ApiError | null>
  loading: Ref<boolean>
  isSuccess: Ref<boolean>
  isError: Ref<boolean>
  isLoading: Ref<boolean>
}

// Create reactive API state
export function useApiState<T>(): ApiState<T> {
  const data = ref<T | null>(null)
  const error = ref<ApiError | null>(null)
  const loading = ref(false)

  const isSuccess = computed(() => !!data.value && !error.value && !loading.value)
  const isError = computed(() => !!error.value)
  const isLoading = computed(() => loading.value)

  return {
    data: data as Ref<T | null>,
    error,
    loading,
    isSuccess,
    isError,
    isLoading
  }
}

// Execute API operations with reactive state
export function useApiOperation<T>() {
  const state = useApiState<T>()

  const execute = async (operation: () => Promise<ApiResult<T>>): Promise<ApiResult<T>> => {
    state.loading.value = true
    state.error.value = null
    state.data.value = null

    try {
      const result = await operation()
      
      if (result.isSuccess) {
        state.data.value = result.data!
        state.error.value = null
      } else if (result.isError) {
        state.error.value = result.error!
        state.data.value = null
      }
      
      return result
    } catch (error) {
      const apiError: ApiError = {
        message: 'Operation failed',
        code: 'OPERATION_ERROR',
        timestamp: new Date().toISOString(),
        details: { error }
      }
      
      state.error.value = apiError
      state.data.value = null
      
      return ApiResult.error(apiError)
    } finally {
      state.loading.value = false
    }
  }

  const reset = () => {
    state.data.value = null
    state.error.value = null
    state.loading.value = false
  }

  return {
    ...state,
    execute,
    reset
  }
}

// Specialized composable for authentication operations
export function useAuthOperation() {
  const operation = useApiOperation<any>()
  
  return {
    ...operation,
    // Add auth-specific methods if needed
    clearAuthData: () => {
      operation.reset()
      // Could also clear localStorage, tokens, etc.
    }
  }
}

// For handling lists/collections
export function useApiList<T>() {
  const items = ref<T[]>([])
  const error = ref<ApiError | null>(null)
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)

  const isSuccess = computed(() => items.value.length > 0 && !error.value && !loading.value)
  const isError = computed(() => !!error.value)
  const isLoading = computed(() => loading.value)
  const isEmpty = computed(() => items.value.length === 0 && !loading.value && !error.value)

  const setItems = (newItems: T[]) => {
    // Clear array and set new items
    while (items.value.length) {
      items.value.pop()
    }
    for (const item of newItems) {
      items.value.push(item as any)
    }
    error.value = null
  }

  const addItems = (newItems: T[]) => {
    for (const item of newItems) {
      items.value.push(item as any)
    }
    error.value = null
  }

  const setError = (apiError: ApiError) => {
    error.value = apiError
  }

  const reset = () => {
    items.value = []
    error.value = null
    loading.value = false
    hasMore.value = true
    page.value = 1
  }

  return {
    items,
    error,
    loading,
    hasMore,
    page,
    isSuccess,
    isError,
    isLoading,
    isEmpty,
    setItems,
    addItems,
    setError,
    reset
  }
}