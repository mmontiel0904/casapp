<template>
  <div class="processing-status-tracker">
    <div v-if="statuses.length === 0" class="text-center py-4 text-base-content/60">
      <span class="text-sm">No processing activity yet</span>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="status in statuses" 
        :key="status.id"
        class="status-item"
      >
        <!-- Status card -->
        <div 
          class="alert shadow-sm border"
          :class="{
            'alert-info border-info/20': status.status === 'pending',
            'alert-warning border-warning/20': status.status === 'processing', 
            'alert-success border-success/20': status.status === 'completed',
            'alert-error border-error/20': status.status === 'error'
          }"
        >
          <!-- Status icon -->
          <div class="flex-shrink-0">
            <!-- Pending -->
            <svg v-if="status.status === 'pending'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <!-- Processing -->
            <span v-else-if="status.status === 'processing'" class="loading loading-spinner loading-sm"></span>
            
            <!-- Completed -->
            <svg v-else-if="status.status === 'completed'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            
            <!-- Error -->
            <svg v-else-if="status.status === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <!-- Status content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium">{{ status.message }}</p>
                <p v-if="status.detail" class="text-xs opacity-80 mt-1">
                  {{ status.detail }}
                </p>
              </div>

              <!-- Progress indicator -->
              <div v-if="status.progress !== undefined" class="flex-shrink-0 ml-4">
                <div class="text-xs font-medium">{{ Math.round(status.progress) }}%</div>
                <progress 
                  class="progress progress-primary w-16 h-2" 
                  :value="status.progress" 
                  max="100"
                ></progress>
              </div>

              <!-- Timestamp -->
              <div v-if="status.timestamp" class="flex-shrink-0 ml-4 text-xs opacity-60">
                {{ formatTime(status.timestamp) }}
              </div>
            </div>
          </div>

          <!-- Action buttons for errors -->
          <div v-if="status.status === 'error' && status.retryable" class="flex-shrink-0">
            <button 
              @click="retryStatus(status.id)"
              class="btn btn-ghost btn-xs"
              :disabled="isRetrying"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>

        <!-- Substeps for complex operations -->
        <div v-if="status.substeps && status.substeps.length > 0" class="ml-8 mt-2 space-y-2">
          <div 
            v-for="substep in status.substeps" 
            :key="substep.id"
            class="flex items-center space-x-3 text-sm"
          >
            <div class="flex-shrink-0">
              <span v-if="substep.status === 'pending'" class="w-2 h-2 bg-base-300 rounded-full"></span>
              <span v-else-if="substep.status === 'processing'" class="loading loading-spinner loading-xs"></span>
              <span v-else-if="substep.status === 'completed'" class="w-2 h-2 bg-success rounded-full"></span>
              <span v-else-if="substep.status === 'error'" class="w-2 h-2 bg-error rounded-full"></span>
            </div>
            <span class="text-base-content/70">{{ substep.message }}</span>
            <span v-if="substep.progress !== undefined" class="text-xs text-base-content/50">
              {{ Math.round(substep.progress) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Overall progress summary -->
    <div v-if="overallProgress !== undefined" class="mt-6 pt-4 border-t border-base-300">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Overall Progress</span>
        <span class="text-sm text-base-content/70">{{ Math.round(overallProgress) }}%</span>
      </div>
      <progress 
        class="progress progress-primary w-full" 
        :value="overallProgress" 
        max="100"
      ></progress>
    </div>

    <!-- Action buttons -->
    <div v-if="showActions" class="flex justify-end space-x-2 mt-4 pt-4 border-t border-base-300">
      <button 
        v-if="canCancel"
        @click="cancelProcessing"
        class="btn btn-ghost btn-sm"
        :disabled="isCancelling"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cancel
      </button>
      
      <button 
        v-if="canClear"
        @click="clearStatuses"
        class="btn btn-ghost btn-sm"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ProcessingSubstep {
  id: string
  message: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
}

export interface ProcessingStatus {
  id: string
  message: string
  detail?: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  timestamp?: Date
  retryable?: boolean
  substeps?: ProcessingSubstep[]
}

interface Props {
  statuses: ProcessingStatus[]
  showActions?: boolean
  canCancel?: boolean
  canClear?: boolean
}

interface Emits {
  (e: 'retry', statusId: string): void
  (e: 'cancel'): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  canCancel: false,
  canClear: true
})

const emit = defineEmits<Emits>()

const isRetrying = computed(() => {
  return props.statuses.some(s => s.status === 'processing' && s.id.includes('retry'))
})

const isCancelling = computed(() => {
  return props.statuses.some(s => s.message.includes('Cancelling'))
})

const overallProgress = computed(() => {
  if (props.statuses.length === 0) return undefined
  
  const completedCount = props.statuses.filter(s => s.status === 'completed').length
  const totalCount = props.statuses.length
  
  if (completedCount === totalCount) return 100
  
  // Calculate weighted progress including partial progress
  let totalProgress = 0
  for (const status of props.statuses) {
    if (status.status === 'completed') {
      totalProgress += 100
    } else if (status.progress !== undefined) {
      totalProgress += status.progress
    }
  }
  
  return totalProgress / totalCount
})

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}

const retryStatus = (statusId: string) => {
  emit('retry', statusId)
}

const cancelProcessing = () => {
  emit('cancel')
}

const clearStatuses = () => {
  emit('clear')
}
</script>

<style scoped>
.status-item {
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateX(0.25rem);
  transition: all 0.3s ease;
}

.progress {
  transition: all 0.5s ease;
}
</style>

<script lang="ts">
export default {
  name: 'ProcessingStatusTracker'
}
</script>
