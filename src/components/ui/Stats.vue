<template>
  <div class="stats-container">
    <!-- Grid Layout for multiple stats -->
    <div 
      v-if="Array.isArray(stats)" 
      class="grid gap-3"
      :class="gridClasses"
    >
      <div
        v-for="(stat, index) in stats"
        :key="stat.key || index"
        class="stat-item"
        :class="[
          // Base styling
          'bg-base-100 p-3 rounded-lg border border-base-300/50 transition-all duration-200',
          
          // Interactive hover effects
          interactive && 'hover:bg-base-200/50 hover:border-base-400/50 cursor-pointer hover:shadow-sm',
          
          // Size variants
          sizeClasses,
          
          // Color variants
          stat.variant && variantClasses[stat.variant]
        ]"
        @click="handleStatClick(stat, index)"
      >
        <!-- Icon and Value Row -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <!-- Dynamic icon -->
            <div 
              v-if="stat.icon" 
              class="p-1.5 rounded-md"
              :class="stat.iconBg || 'bg-primary/10'"
            >
              <component 
                :is="stat.icon" 
                class="w-4 h-4"
                :class="stat.iconColor || 'text-primary'"
              />
            </div>
            
            <!-- Value with smooth counter animation -->
            <div 
              class="text-2xl font-bold tabular-nums"
              :class="stat.valueColor || 'text-base-content'"
            >
              {{ formatValue(stat.value, stat.format) }}
            </div>
          </div>
          
          <!-- Trend indicator -->
          <div v-if="stat.trend !== undefined" class="flex items-center gap-1">
            <component 
              :is="getTrendIcon(stat.trend)" 
              class="w-4 h-4"
              :class="getTrendColor(stat.trend)"
            />
            <span 
              class="text-xs font-medium tabular-nums"
              :class="getTrendColor(stat.trend)"
            >
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
        </div>
        
        <!-- Label and Subtitle -->
        <div>
          <div 
            class="text-sm font-medium"
            :class="stat.labelColor || 'text-base-content/80'"
          >
            {{ stat.label }}
          </div>
          <div 
            v-if="stat.subtitle" 
            class="text-xs mt-0.5"
            :class="stat.subtitleColor || 'text-base-content/60'"
          >
            {{ stat.subtitle }}
          </div>
        </div>
        
        <!-- Optional progress bar -->
        <div v-if="stat.progress !== undefined" class="mt-2">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-base-content/60">Progress</span>
            <span class="text-xs font-medium">{{ stat.progress }}%</span>
          </div>
          <div class="w-full bg-base-300 rounded-full h-1.5">
            <div 
              class="h-1.5 rounded-full transition-all duration-500"
              :class="stat.progressColor || 'bg-primary'"
              :style="{ width: `${Math.min(Math.max(stat.progress || 0, 0), 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Single Stat Display -->
    <div 
      v-else-if="stats"
      class="single-stat p-4 bg-base-100 rounded-lg border border-base-300/50"
      :class="[
        interactive && 'hover:bg-base-200/50 cursor-pointer',
        sizeClasses
      ]"
      @click="handleStatClick(stats, 0)"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div 
            v-if="stats.icon"
            class="p-2 rounded-lg"
            :class="stats.iconBg || 'bg-primary/10'"
          >
            <component 
              :is="stats.icon" 
              class="w-6 h-6"
              :class="stats.iconColor || 'text-primary'"
            />
          </div>
          <div>
            <div 
              class="text-3xl font-bold tabular-nums"
              :class="stats.valueColor || 'text-base-content'"
            >
              {{ formatValue(stats.value, stats.format) }}
            </div>
            <div 
              class="text-sm font-medium mt-1"
              :class="stats.labelColor || 'text-base-content/80'"
            >
              {{ stats.label }}
            </div>
          </div>
        </div>
        
        <!-- Trend for single stat -->
        <div v-if="stats.trend !== undefined" class="text-right">
          <div class="flex items-center gap-1 justify-end mb-1">
            <component 
              :is="getTrendIcon(stats.trend)" 
              class="w-4 h-4"
              :class="getTrendColor(stats.trend)"
            />
            <span 
              class="text-sm font-medium tabular-nums"
              :class="getTrendColor(stats.trend)"
            >
              {{ Math.abs(stats.trend) }}%
            </span>
          </div>
          <div class="text-xs text-base-content/60">vs last period</div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="grid gap-3" :class="gridClasses">
      <div 
        v-for="i in (Array.isArray(stats) ? stats.length : 1)" 
        :key="i"
        class="animate-pulse"
      >
        <div class="bg-base-300 rounded-lg h-20"></div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="!stats && !loading" class="text-center py-8 text-base-content/60">
      <div class="text-sm">No statistics available</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Import icons (you can replace these with your preferred icon library)
const TrendingUpIcon = 'svg' // Replace with actual icon component
const TrendingDownIcon = 'svg' // Replace with actual icon component
const MinusIcon = 'svg' // Replace with actual icon component

export interface Stat {
  key?: string
  label: string
  value: number | string
  subtitle?: string
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'custom'
  trend?: number // Percentage change
  progress?: number // Progress percentage (0-100)
  icon?: any // Vue component
  iconColor?: string
  iconBg?: string
  valueColor?: string
  labelColor?: string
  subtitleColor?: string
  progressColor?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

interface Props {
  stats?: Stat | Stat[]
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  size: 'md',
  interactive: false
})

const emit = defineEmits<{
  statClick: [stat: Stat, index: number]
}>()

const gridClasses = computed(() => {
  const cols = Math.min(props.columns, Array.isArray(props.stats) ? props.stats.length : 1)
  return `grid-cols-1 sm:grid-cols-2 ${cols >= 3 ? 'lg:grid-cols-3' : ''} ${cols >= 4 ? 'xl:grid-cols-4' : ''}`
})

const sizeClasses = computed(() => {
  const sizeMap = {
    sm: 'text-sm',
    md: '',
    lg: 'text-lg'
  }
  return sizeMap[props.size]
})

const variantClasses = {
  success: 'border-success/20 bg-success/5',
  warning: 'border-warning/20 bg-warning/5',
  error: 'border-error/20 bg-error/5',
  info: 'border-info/20 bg-info/5',
  default: ''
}

const formatValue = (value: number | string, format?: string): string => {
  if (typeof value === 'string') return value
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    case 'percentage':
      return `${value}%`
    case 'duration':
      return `${value}h`
    case 'number':
    default:
      return new Intl.NumberFormat().format(value)
  }
}

const getTrendIcon = (trend: number) => {
  if (trend > 0) return TrendingUpIcon
  if (trend < 0) return TrendingDownIcon
  return MinusIcon
}

const getTrendColor = (trend: number): string => {
  if (trend > 0) return 'text-success'
  if (trend < 0) return 'text-error'
  return 'text-base-content/60'
}

const handleStatClick = (stat: Stat, index: number) => {
  if (props.interactive) {
    emit('statClick', stat, index)
  }
}
</script>