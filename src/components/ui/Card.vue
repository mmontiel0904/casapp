<template>
  <div 
    class="card group relative overflow-hidden transition-all duration-300 ease-out"
    :class="[
      // Base DaisyUI classes with Material Design 3 enhancements
      'bg-base-100 border border-base-300',
      
      // Size variants
      sizeClasses,
      
      // Interactive states with beautiful hover effects
      interactive && [
        'hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2',
        'hover:border-primary/40 cursor-pointer',
        'active:scale-[0.98] active:shadow-md'
      ],
      
      // Selection state
      selected && 'ring-2 ring-primary ring-offset-2 bg-primary/5 border-primary/50',
      
      // Loading state
      loading && 'animate-pulse opacity-75',
      
      // Custom classes
      cardClass
    ]"
    @click="handleClick"
  >
    <!-- Subtle gradient overlay for depth -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Card Image/Icon Header with stunning gradients -->
    <div v-if="$slots.image || icon" class="relative">
      <slot name="image">
        <div 
          v-if="icon" 
          class="flex items-center justify-center h-32 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden"
        >
          <!-- Animated background pattern -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_70%)]"></div>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,119,198,0.1),transparent_70%)]"></div>
          
          <component :is="icon" class="w-12 h-12 text-primary relative z-10 drop-shadow-sm" />
        </div>
      </slot>
      
      <!-- Status Badge with enhanced styling -->
      <div v-if="status" class="absolute top-3 right-3 z-20">
        <div class="badge backdrop-blur-sm" :class="[statusClass, 'shadow-lg border-0']">
          {{ status }}
        </div>
      </div>
    </div>

    <div class="card-body relative z-10" :class="bodyClass">
      <!-- Enhanced Header Section -->
      <div v-if="$slots.header || title || subtitle" class="mb-4">
        <slot name="header">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h2 
                v-if="title" 
                class="card-title text-base-content group-hover:text-primary transition-colors duration-300 font-semibold text-lg leading-tight"
              >
                {{ title }}
                <div v-if="badge" class="badge badge-sm ml-2 shadow-sm" :class="badgeClass">
                  {{ badge }}
                </div>
              </h2>
              <p 
                v-if="subtitle" 
                class="text-sm text-base-content/70 mt-2 leading-relaxed max-w-prose"
              >
                {{ subtitle }}
              </p>
            </div>
            
            <!-- Quick Actions with smooth reveal -->
            <div 
              v-if="$slots.quickActions" 
              class="ml-4 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              <slot name="quickActions" />
            </div>
          </div>
        </slot>
      </div>

      <!-- Main Content with proper spacing -->
      <div v-if="$slots.default" class="flex-1 space-y-3">
        <slot />
      </div>

      <!-- Beautiful Stats/Metrics Section -->
      <div v-if="$slots.stats" class="mt-6 p-4 bg-base-200/50 rounded-lg border border-base-300/50">
        <slot name="stats" />
      </div>

      <!-- Enhanced Footer/Actions Section -->
      <div v-if="$slots.actions || $slots.footer" class="card-actions justify-end mt-6 pt-4 border-t border-base-200">
        <slot name="footer">
          <slot name="actions" />
        </slot>
      </div>
    </div>

    <!-- Loading skeleton overlay -->
    <div v-if="loading" class="absolute inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-30">
      <div class="loading loading-spinner loading-md text-primary"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  badge?: string
  badgeClass?: string
  status?: string
  statusClass?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  selected?: boolean
  loading?: boolean
  cardClass?: string
  bodyClass?: string
  icon?: any // Vue component for icon
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  interactive: true,
  badgeClass: 'badge-primary',
  statusClass: 'badge-success'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = computed(() => {
  const sizeMap = {
    xs: 'card-compact shadow-sm text-sm',
    sm: 'card-compact shadow-sm',
    md: 'shadow-md',
    lg: 'card-normal shadow-lg',
    xl: 'card-normal shadow-xl'
  }
  return sizeMap[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (props.interactive && !props.loading) {
    emit('click', event)
  }
}
</script>