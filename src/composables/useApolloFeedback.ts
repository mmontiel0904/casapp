import { watch } from 'vue'
import { useFeedback } from './useFeedback'
import type { Ref } from 'vue'

// Apollo feedback integration
export function useApolloFeedback() {
  const feedback = useFeedback()

  // Auto-handle mutation feedback
  const handleMutation = (
    loading: Ref<boolean>,
    error: Ref<any>,
    onSuccess?: () => void,
    options?: {
      successTitle?: string
      successMessage?: string
      errorTitle?: string
      showSuccess?: boolean
    }
  ) => {
    const {
      successTitle = 'Success',
      successMessage = 'Operation completed successfully',
      errorTitle = 'Operation Failed',
      showSuccess = true
    } = options || {}

    // Watch for errors
    watch(error, (newError) => {
      if (newError) {
        feedback.fromApolloError(newError, errorTitle)
      }
    }, { immediate: true })

    // Watch loading state to detect successful completion
    let wasLoading = false
    watch(loading, (isLoading) => {
      if (wasLoading && !isLoading && !error.value) {
        // Operation just completed successfully
        if (showSuccess) {
          feedback.success(successTitle, successMessage, 3000)
        }
        onSuccess?.()
      }
      wasLoading = isLoading
    })
  }

  // Auto-handle query feedback (mainly for errors)
  const handleQuery = (
    error: Ref<any>,
    options?: {
      errorTitle?: string
      showNetworkErrors?: boolean
    }
  ) => {
    const {
      errorTitle = 'Failed to Load Data',
      showNetworkErrors = true
    } = options || {}

    watch(error, (newError) => {
      if (newError) {
        // Don't show feedback for every query error by default
        // Only show for network errors or critical failures
        if (showNetworkErrors && newError.networkError) {
          feedback.fromApolloError(newError, errorTitle)
        } else if (newError.graphQLErrors?.some((err: any) => err.extensions?.code === 'INTERNAL_ERROR')) {
          feedback.fromApolloError(newError, errorTitle)
        }
      }
    }, { immediate: true })
  }

  return {
    ...feedback,
    handleMutation,
    handleQuery
  }
}