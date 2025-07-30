import { ref, computed } from 'vue'

// Feedback message types
export interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number // ms, null for persistent
  timestamp: Date
}

// Global feedback state
const messages = ref<FeedbackMessage[]>([])
let messageIdCounter = 0

export function useFeedback() {
  // Add a new feedback message
  const addMessage = (
    type: FeedbackMessage['type'],
    title: string,
    message: string,
    duration = 5000
  ): string => {
    const id = `feedback-${++messageIdCounter}-${Date.now()}`
    
    const feedbackMessage: FeedbackMessage = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    }
    
    messages.value.push(feedbackMessage)
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
    
    return id
  }

  // Remove a specific message
  const removeMessage = (id: string) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  // Clear all messages
  const clearAll = () => {
    messages.value = []
  }

  // Convenience methods for different message types
  const success = (title: string, message: string, duration?: number) => 
    addMessage('success', title, message, duration)
  
  const error = (title: string, message: string, duration?: number) => 
    addMessage('error', title, message, duration)
  
  const warning = (title: string, message: string, duration?: number) => 
    addMessage('warning', title, message, duration)
  
  const info = (title: string, message: string, duration?: number) => 
    addMessage('info', title, message, duration)

  // Apollo integration helpers
  const fromApolloError = (apolloError: any, customTitle?: string) => {
    const title = customTitle || 'Operation Failed'
    
    // Handle GraphQL errors
    if (apolloError.graphQLErrors?.length > 0) {
      const gqlError = apolloError.graphQLErrors[0]
      return error(title, gqlError.message)
    }
    
    // Handle network errors
    if (apolloError.networkError) {
      return error('Connection Error', 'Unable to connect to the server. Please try again.')
    }
    
    // Fallback for unknown errors
    return error(title, apolloError.message || 'An unexpected error occurred')
  }

  const fromApolloSuccess = (operation: string, customMessage?: string) => {
    return success(
      'Success',
      customMessage || `${operation} completed successfully`,
      3000
    )
  }

  return {
    // State
    messages: computed(() => messages.value),
    
    // Actions
    addMessage,
    removeMessage,
    clearAll,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    
    // Apollo integration
    fromApolloError,
    fromApolloSuccess
  }
}