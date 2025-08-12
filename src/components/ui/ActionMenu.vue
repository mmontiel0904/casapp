<template>
  <div class="dropdown dropdown-end">
    <!-- Trigger Button -->
    <div 
      tabindex="0" 
      role="button" 
      class="btn btn-ghost btn-square btn-sm group"
      :class="[
        triggerClass,
        // Hover states
        'hover:bg-base-200 focus:bg-base-200',
        // Animation
        'transition-all duration-200'
      ]"
    >
      <slot name="trigger">
        <!-- Default three dots trigger -->
        <svg 
          class="w-5 h-5 text-base-content/60 group-hover:text-base-content transition-colors" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <ul 
      tabindex="0" 
      class="dropdown-content z-[1] menu menu-sm p-2 shadow-lg bg-base-100 rounded-box border border-base-300 min-w-52"
      :class="menuClass"
    >
      <!-- Menu Items -->
      <li v-for="(action, index) in visibleActions" :key="action.key || index">
        <!-- Regular Action -->
        <a
          v-if="!action.divider"
          @click="handleActionClick(action, index)"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
          :class="[
            // Base styles
            'hover:bg-base-200 focus:bg-base-200',
            
            // Disabled state
            action.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            
            // Variant styles
            getActionClasses(action),
            
            // Custom classes
            action.class
          ]"
        >
          <!-- Icon -->
          <component 
            v-if="action.icon" 
            :is="action.icon" 
            class="w-4 h-4 flex-shrink-0"
            :class="getIconClasses(action)"
          />
          
          <!-- Label -->
          <span class="flex-1 text-sm font-medium">
            {{ action.label }}
          </span>
          
          <!-- Badge/Count -->
          <div 
            v-if="action.badge" 
            class="badge badge-sm"
            :class="action.badgeClass || 'badge-neutral'"
          >
            {{ action.badge }}
          </div>
          
          <!-- Keyboard shortcut -->
          <kbd 
            v-if="action.shortcut" 
            class="kbd kbd-sm opacity-60"
          >
            {{ action.shortcut }}
          </kbd>
        </a>
        
        <!-- Divider -->
        <div v-else class="divider my-1"></div>
      </li>
      
      <!-- Empty State -->
      <li v-if="!visibleActions.length" class="px-3 py-6 text-center">
        <span class="text-sm text-base-content/40">No actions available</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ActionItem {
  key?: string
  label?: string
  icon?: any
  handler?: (item?: any) => void | Promise<void>
  disabled?: boolean
  hidden?: boolean
  divider?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  badge?: string | number
  badgeClass?: string
  shortcut?: string
  class?: string
  confirm?: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
  }
}

interface Props {
  actions: ActionItem[]
  item?: any // The item this menu relates to
  triggerClass?: string
  menuClass?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  action: [action: ActionItem, item: any]
}>()

const visibleActions = computed(() => {
  return props.actions.filter(action => !action.hidden)
})

const getActionClasses = (action: ActionItem): string => {
  const variantMap = {
    default: '',
    primary: 'text-primary hover:bg-primary/10 focus:bg-primary/10',
    secondary: 'text-secondary hover:bg-secondary/10 focus:bg-secondary/10',
    success: 'text-success hover:bg-success/10 focus:bg-success/10',
    warning: 'text-warning hover:bg-warning/10 focus:bg-warning/10',
    error: 'text-error hover:bg-error/10 focus:bg-error/10',
    info: 'text-info hover:bg-info/10 focus:bg-info/10'
  }
  
  return variantMap[action.variant || 'default']
}

const getIconClasses = (action: ActionItem): string => {
  const variantMap = {
    default: 'text-base-content/60',
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  }
  
  return variantMap[action.variant || 'default']
}

const handleActionClick = async (action: ActionItem, _index: number) => {
  if (action.disabled) return
  
  // Handle confirmation dialog
  if (action.confirm) {
    const confirmed = window.confirm(`${action.confirm.title}\n\n${action.confirm.message}`)
    if (!confirmed) return
  }
  
  // Execute handler
  if (action.handler) {
    try {
      await action.handler(props.item)
    } catch (error) {
      console.error('Action handler error:', error)
    }
  }
  
  // Emit action event
  emit('action', action, props.item)
  
  // Close dropdown by removing focus
  const activeElement = document.activeElement as HTMLElement
  if (activeElement) {
    activeElement.blur()
  }
}
</script>

<style scoped>
/* Custom dropdown animation */
.dropdown-content {
  animation: dropdownFade 0.2s ease-out;
  transform-origin: top;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Focus ring for accessibility */
.dropdown > *:focus-visible {
  outline: 2px solid hsl(var(--p));
  outline-offset: 2px;
}

/* Smooth hover transitions */
.menu li > * {
  transition: all 0.2s ease;
}

/* Better keyboard navigation */
.menu li > *:focus {
  background-color: hsl(var(--b2));
}
</style>