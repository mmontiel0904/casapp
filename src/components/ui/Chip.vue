<template>
  <div 
    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200"
    :class="chipClasses"
  >
    <!-- Optional icon slot -->
    <slot name="icon" />
    
    <!-- Content -->
    <span class="whitespace-nowrap">
      <slot />
    </span>
    
    <!-- Optional action slot (close button, etc.) -->
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  soft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  soft: true
})

const chipClasses = computed(() => {
  const variants = {
    primary: props.soft ? 'bg-primary/10 text-primary' : 'bg-primary text-primary-content',
    secondary: props.soft ? 'bg-secondary/10 text-secondary' : 'bg-secondary text-secondary-content',
    success: props.soft ? 'bg-success/10 text-success' : 'bg-success text-success-content',
    warning: props.soft ? 'bg-warning/10 text-warning' : 'bg-warning text-warning-content',
    error: props.soft ? 'bg-error/10 text-error' : 'bg-error text-error-content',
    info: props.soft ? 'bg-info/10 text-info' : 'bg-info text-info-content',
    neutral: props.soft ? 'bg-base-200 text-base-content' : 'bg-neutral text-neutral-content',
    ghost: 'bg-transparent text-base-content/70 border border-base-300'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return `${variants[props.variant]} ${sizes[props.size]}`
})
</script>