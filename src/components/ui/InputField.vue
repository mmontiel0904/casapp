<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-slate-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative input-field-container">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Error icon -->
      <div 
        v-if="hasError" 
        class="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none"
      >
        <svg 
          class="text-red-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          width="20"
          height="20"
        >
          <path 
            fill-rule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="hasError" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
    
    <!-- Helper text -->
    <p v-else-if="helper" class="mt-2 text-sm text-slate-500">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helper?: string
  variant?: 'default' | 'filled'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'default'
})

const emit = defineEmits<Emits>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)

const hasError = computed(() => !!props.error)

const inputClasses = computed(() => {
  let classes = [
    'block w-full px-3 py-2.5 text-sm rounded-lg border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50'
  ]
  
  // Add right padding for error icon
  if (hasError.value) {
    classes.push('pr-10')
  }
  
  // Variant styles
  if (props.variant === 'filled') {
    classes.push('bg-slate-50')
  } else {
    classes.push('bg-white')
  }
  
  // State-specific styles
  if (hasError.value) {
    classes.push(
      'border-red-300 text-red-900 placeholder-red-400',
      'focus:ring-red-200 focus:border-red-500'
    )
  } else {
    classes.push(
      'border-slate-300 text-slate-900 placeholder-slate-400',
      'focus:ring-blue-200 focus:border-blue-500',
      'hover:border-slate-400'
    )
  }
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>