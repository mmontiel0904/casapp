<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-slate-200">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-slate-900">
          {{ title }}
        </h3>
      </slot>
    </div>
    
    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200 bg-slate-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: false
})

const cardClasses = computed(() => {
  const base = [
    'bg-white rounded-lg overflow-hidden',
    'transition-all duration-200'
  ]
  
  // Variant styles
  switch (props.variant) {
    case 'outlined':
      base.push('border border-slate-200')
      break
    case 'elevated':
      base.push('shadow-lg border border-slate-100')
      break
    default:
      base.push('shadow-sm border border-slate-200')
  }
  
  // Hover effect
  if (props.hover) {
    base.push('hover:shadow-md hover:border-slate-300 cursor-pointer')
  }
  
  return base.join(' ')
})

const contentClasses = computed(() => {
  const base = []
  
  // Padding styles
  switch (props.padding) {
    case 'none':
      // No padding
      break
    case 'sm':
      base.push('p-4')
      break
    case 'lg':
      base.push('p-8')
      break
    default:
      base.push('p-6')
  }
  
  return base.join(' ')
})
</script>