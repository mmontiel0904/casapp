<template>
  <Teleport to="body">
    <!-- Global feedback container - positioned fixed top-right with higher z-index -->
    <div class="fixed top-4 right-4 z-[9999] space-y-1.5 max-w-xs pointer-events-none">
      <TransitionGroup 
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="translate-x-full opacity-0"
        leave-to-class="translate-x-full opacity-0"
        move-class="transition-transform duration-300 ease"
        tag="div"
        class="space-y-1.5"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="getAlertClasses(message.type)"
          class="shadow-md transform transition-all duration-300 pointer-events-auto py-2 px-3"
          role="alert"
        >
          <!-- Alert icon -->
          <div class="flex-shrink-0">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconSvg(message.type)" />
            </svg>
          </div>
          
          <!-- Alert content -->
          <div class="flex-1 min-w-0">
            <div class="font-medium text-xs">{{ message.title }}</div>
            <div class="text-xs opacity-90">{{ message.message }}</div>
          </div>
          
          <!-- Close button -->
          <button 
            @click="removeMessage(message.id)"
            class="btn btn-ghost btn-xs btn-circle ml-1 flex-shrink-0 h-6 w-6 min-h-6"
            aria-label="Dismiss"
          >
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useFeedback } from '../composables/useFeedback'

const { messages, removeMessage } = useFeedback()

// Get DaisyUI alert classes based on message type (soft style + compact)
const getAlertClasses = (type: string) => {
  const baseClasses = 'alert alert-soft max-w-full text-sm'
  
  switch (type) {
    case 'success':
      return `${baseClasses} alert-success`
    case 'error':  
      return `${baseClasses} alert-error`
    case 'warning':
      return `${baseClasses} alert-warning`
    case 'info':
    default:
      return `${baseClasses} alert-info`
  }
}

// Get appropriate SVG content for each message type
const getIconSvg = (type: string) => {
  const icons = {
    success: 'M5 13l4 4L19 7',
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  
  return icons[type as keyof typeof icons] || icons.info
}
</script>

