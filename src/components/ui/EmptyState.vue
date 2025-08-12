<template>
  <div class="empty-state-container flex flex-col items-center justify-center text-center" :class="containerClass">
    <!-- Illustration/Icon -->
    <div class="mb-8">
      <slot name="illustration">
        <!-- Custom icon with beautiful gradient background -->
        <div 
          class="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
          :class="iconBgClass"
        >
          <component 
            v-if="icon" 
            :is="icon" 
            class="w-12 h-12"
            :class="iconClass"
          />
          <div 
            v-else
            class="w-12 h-12 rounded-lg bg-current opacity-20"
          ></div>
        </div>
      </slot>
    </div>
    
    <!-- Content -->
    <div class="max-w-md mx-auto space-y-4">
      <!-- Title -->
      <h3 
        class="text-2xl font-bold"
        :class="titleClass"
      >
        <slot name="title">
          {{ title || 'Nothing here yet' }}
        </slot>
      </h3>
      
      <!-- Description -->
      <p 
        class="text-base leading-relaxed"
        :class="descriptionClass"
      >
        <slot name="description">
          {{ description || 'When you have content, it will appear here.' }}
        </slot>
      </p>
      
      <!-- Additional details -->
      <div v-if="$slots.details" class="text-sm space-y-2" :class="detailsClass">
        <slot name="details" />
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div v-if="$slots.actions || primaryAction || secondaryAction" class="mt-8 flex flex-col sm:flex-row gap-3 items-center">
      <slot name="actions">
        <!-- Primary Action -->
        <button
          v-if="primaryAction"
          @click="handlePrimaryAction"
          class="btn btn-primary"
          :class="primaryButtonClass"
        >
          <component v-if="primaryAction.icon" :is="primaryAction.icon" class="w-5 h-5 mr-2" />
          {{ primaryAction.label }}
        </button>
        
        <!-- Secondary Action -->
        <button
          v-if="secondaryAction"
          @click="handleSecondaryAction"
          class="btn btn-outline"
          :class="secondaryButtonClass"
        >
          <component v-if="secondaryAction.icon" :is="secondaryAction.icon" class="w-5 h-5 mr-2" />
          {{ secondaryAction.label }}
        </button>
      </slot>
    </div>
    
    <!-- Additional Content Slot -->
    <div v-if="$slots.extra" class="mt-6">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Action {
  label: string
  icon?: any
  handler?: () => void
}

interface Props {
  title?: string
  description?: string
  icon?: any
  variant?: 'default' | 'search' | 'error' | 'success' | 'warning' | 'create'
  size?: 'sm' | 'md' | 'lg'
  primaryAction?: Action
  secondaryAction?: Action
  containerClass?: string
  titleClass?: string
  descriptionClass?: string
  detailsClass?: string
  iconClass?: string
  iconBgClass?: string
  primaryButtonClass?: string
  secondaryButtonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const emit = defineEmits<{
  primaryAction: []
  secondaryAction: []
}>()

import { computed } from 'vue'

// Computed classes based on variant
const containerClass = computed(() => {
  const sizeMap = {
    sm: 'py-8 px-4',
    md: 'py-16 px-6',
    lg: 'py-24 px-8'
  }
  
  return `${sizeMap[props.size]} ${props.containerClass || ''}`
})

const iconBgClass = computed(() => {
  if (props.iconBgClass) return props.iconBgClass
  
  const variantMap = {
    default: 'bg-gradient-to-br from-base-300 to-base-200',
    search: 'bg-gradient-to-br from-info/20 to-info/10',
    error: 'bg-gradient-to-br from-error/20 to-error/10',
    success: 'bg-gradient-to-br from-success/20 to-success/10',
    warning: 'bg-gradient-to-br from-warning/20 to-warning/10',
    create: 'bg-gradient-to-br from-primary/20 to-secondary/10'
  }
  
  return variantMap[props.variant]
})

const iconClass = computed(() => {
  if (props.iconClass) return props.iconClass
  
  const variantMap = {
    default: 'text-base-content/40',
    search: 'text-info',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning',
    create: 'text-primary'
  }
  
  return variantMap[props.variant]
})

const titleClass = computed(() => {
  if (props.titleClass) return props.titleClass
  
  const variantMap = {
    default: 'text-base-content/80',
    search: 'text-base-content/80',
    error: 'text-error',
    success: 'text-success',
    warning: 'text-warning',
    create: 'text-base-content/80'
  }
  
  return variantMap[props.variant]
})

const descriptionClass = computed(() => {
  if (props.descriptionClass) return props.descriptionClass
  return 'text-base-content/60'
})

const detailsClass = computed(() => {
  if (props.detailsClass) return props.detailsClass
  return 'text-base-content/50'
})

const handlePrimaryAction = () => {
  if (props.primaryAction?.handler) {
    props.primaryAction.handler()
  }
  emit('primaryAction')
}

const handleSecondaryAction = () => {
  if (props.secondaryAction?.handler) {
    props.secondaryAction.handler()
  }
  emit('secondaryAction')
}
</script>

<style scoped>
@import 'vue';

.empty-state-container {
  min-height: 200px;
}
</style>