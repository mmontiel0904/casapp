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

    // Watch for errors with intelligent handling
    watch(error, (newError) => {
      if (newError) {
        // Use the enhanced error categorization from the feedback system
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
      showPermissionErrors?: boolean
    }
  ) => {
    const {
      errorTitle = 'Failed to Load Data',
      showNetworkErrors = true,
      showPermissionErrors = true
    } = options || {}

    watch(error, (newError) => {
      if (newError) {
        // Use the enhanced error categorization system
        // Let the feedback system handle intelligent error categorization
        if (newError.networkError && showNetworkErrors) {
          feedback.fromApolloError(newError, errorTitle)
        } else if (newError.graphQLErrors?.length > 0) {
          // Let the intelligent categorizer decide how to handle the error
          const shouldShowError = newError.graphQLErrors.some((err: any) => {
            const message = err.message?.toLowerCase() || ''
            const code = err.extensions?.code || ''
            
            // Show permission errors if enabled
            const isPermissionError = message.includes('permission') || 
                                    message.includes('forbidden') || 
                                    code === 'FORBIDDEN'
            if (isPermissionError && !showPermissionErrors) {
              return false
            }
            
            // Show other errors (validation, server errors, etc.)
            return true
          })
          
          if (shouldShowError) {
            feedback.fromApolloError(newError, errorTitle)
          }
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