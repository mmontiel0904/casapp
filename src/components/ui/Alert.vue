<template>
  <div v-if="show" :class="alertClasses" role="alert">
    <!-- Icon -->
    <div class="flex-shrink-0">
      <component :is="iconComponent" class="h-5 w-5" />
    </div>
    
    <!-- Content -->
    <div class="ml-3 flex-1">
      <h4 v-if="title" :class="titleClasses">
        {{ title }}
      </h4>
      <div :class="messageClasses">
        <slot>{{ message }}</slot>
      </div>
    </div>
    
    <!-- Close button -->
    <div v-if="dismissible" class="ml-auto pl-3">
      <button
        type="button"
        :class="closeButtonClasses"
        @click="handleClose"
      >
        <span class="sr-only">Dismiss</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  type?: AlertType
  title?: string
  message?: string
  dismissible?: boolean
  show?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
  show: true
})

const emit = defineEmits<Emits>()

// Icons for different alert types
const icons = {
  success: () => h('svg', { 
    class: 'h-5 w-5', 
    fill: 'currentColor', 
    viewBox: '0 0 20 20' 
  }, [
    h('path', { 
      'fill-rule': 'evenodd', 
      d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
      'clip-rule': 'evenodd' 
    })
  ]),
  error: () => h('svg', { 
    class: 'h-5 w-5', 
    fill: 'currentColor', 
    viewBox: '0 0 20 20' 
  }, [
    h('path', { 
      'fill-rule': 'evenodd', 
      d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
      'clip-rule': 'evenodd' 
    })
  ]),
  warning: () => h('svg', { 
    class: 'h-5 w-5', 
    fill: 'currentColor', 
    viewBox: '0 0 20 20' 
  }, [
    h('path', { 
      'fill-rule': 'evenodd', 
      d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
      'clip-rule': 'evenodd' 
    })
  ]),
  info: () => h('svg', { 
    class: 'h-5 w-5', 
    fill: 'currentColor', 
    viewBox: '0 0 20 20' 
  }, [
    h('path', { 
      'fill-rule': 'evenodd', 
      d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
      'clip-rule': 'evenodd' 
    })
  ])
}

const iconComponent = computed(() => icons[props.type])

const alertClasses = computed(() => {
  const base = [
    'flex p-4 rounded-lg border',
    'transition-all duration-200'
  ]
  
  // Type-specific styles
  switch (props.type) {
    case 'success':
      base.push('bg-green-50 border-green-200 text-green-800')
      break
    case 'error':
      base.push('bg-red-50 border-red-200 text-red-800')
      break
    case 'warning':
      base.push('bg-yellow-50 border-yellow-200 text-yellow-800')
      break
    default:
      base.push('bg-blue-50 border-blue-200 text-blue-800')
  }
  
  return base.join(' ')
})

const titleClasses = computed(() => {
  const base = ['text-sm font-medium']
  
  switch (props.type) {
    case 'success':
      base.push('text-green-800')
      break
    case 'error':
      base.push('text-red-800')
      break
    case 'warning':
      base.push('text-yellow-800')
      break
    default:
      base.push('text-blue-800')
  }
  
  return base.join(' ')
})

const messageClasses = computed(() => {
  const base = ['text-sm']
  
  if (props.title) {
    base.push('mt-1')
  }
  
  switch (props.type) {
    case 'success':
      base.push('text-green-700')
      break
    case 'error':
      base.push('text-red-700')
      break
    case 'warning':
      base.push('text-yellow-700')
      break
    default:
      base.push('text-blue-700')
  }
  
  return base.join(' ')
})

const closeButtonClasses = computed(() => {
  const base = [
    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200'
  ]
  
  switch (props.type) {
    case 'success':
      base.push('text-green-500 hover:bg-green-100 focus:ring-green-600')
      break
    case 'error':
      base.push('text-red-500 hover:bg-red-100 focus:ring-red-600')
      break
    case 'warning':
      base.push('text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600')
      break
    default:
      base.push('text-blue-500 hover:bg-blue-100 focus:ring-blue-600')
  }
  
  return base.join(' ')
})

const handleClose = () => {
  emit('close')
}
</script>