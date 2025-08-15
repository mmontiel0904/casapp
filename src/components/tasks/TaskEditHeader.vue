<template>
  <div class="bg-gradient-to-r from-primary/3 to-secondary/3">
    <div class="p-6">
      <div class="flex items-start gap-4">
        <!-- Task Status Badge -->
        <div class="flex flex-col items-center gap-2">
          <Chip :variant="statusVariant" size="md">
            {{ statusLabel }}
          </Chip>
          <Chip v-if="isRecurringTask" variant="info" size="sm">
            {{ formatRecurrenceType(task?.recurrenceType) }}
          </Chip>
          <Chip v-if="isRecurringInstance" variant="ghost" size="sm">
            Instance
          </Chip>
        </div>

        <!-- Task Name and Metadata -->
        <div class="flex-1 min-w-0">
          <input 
            v-model="localTaskName"
            type="text"
            class="bg-transparent text-2xl font-serif font-bold w-full p-2 focus:outline-none focus:bg-base-50/50 rounded-lg transition-all duration-200 placeholder:text-base-content/40"
            placeholder="Task name"
            maxlength="255"
            @blur="$emit('name-change', localTaskName)"
          />
          
          <!-- Task Metadata -->
          <div class="flex flex-wrap gap-4 mt-2 text-sm text-base-content/70">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Created {{ formatRelativeTime(task?.createdAt) }}</span>
            </div>
            
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Updated {{ formatRelativeTime(task?.updatedAt) }}</span>
            </div>

            <div v-if="task?.assigneeId && assigneeName" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Assigned to {{ assigneeName }}</span>
            </div>

            <div v-if="task?.dueDate" class="flex items-center gap-1" :class="dueDateClass">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2z"></path>
              </svg>
              <span>Due {{ formatRelativeTime(task?.dueDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Priority Indicator -->
        <div class="flex flex-col items-center gap-2">
          <Chip :variant="priorityVariant" size="md">
            {{ priorityLabel }}
          </Chip>
          <div v-if="task?.projectId" class="text-xs text-base-content/60 text-center">
            {{ projectName }}
          </div>
        </div>
      </div>

      <!-- Unsaved Changes Indicator -->
      <div v-if="hasUnsavedChanges" class="mt-4 p-4 bg-warning/8 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-warning">You have unsaved changes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TaskStatus, TaskPriority } from '../../generated/graphql'
import { useTasks, type TaskItem } from '../../composables/useTasks'
import Chip from '../ui/Chip.vue'

interface Props {
  task?: TaskItem | null
  hasUnsavedChanges?: boolean
  assigneeName?: string
  projectName?: string
}

const props = withDefaults(defineProps<Props>(), {
  hasUnsavedChanges: false,
  assigneeName: '',
  projectName: ''
})

defineEmits<{
  'name-change': [name: string]
}>()

// Local task name for immediate UI updates
const localTaskName = ref(props.task?.name || '')

// Watch for task changes to update local name
watch(() => props.task?.name, (newName) => {
  if (newName !== undefined) {
    localTaskName.value = newName
  }
})

// Use tasks composable for recurrence helpers
const { 
  formatRecurrenceType, 
  isRecurringTask: checkIsRecurringTask, 
  isRecurringInstance: checkIsRecurringInstance 
} = useTasks()

// Computed properties for display
const isRecurringTask = computed(() => checkIsRecurringTask(props.task))
const isRecurringInstance = computed(() => checkIsRecurringInstance(props.task))

const statusLabel = computed(() => {
  const statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.Todo]: 'To Do',
    [TaskStatus.InProgress]: 'In Progress', 
    [TaskStatus.Completed]: 'Completed',
    [TaskStatus.Cancelled]: 'Cancelled'
  }
  return statusLabels[props.task?.status as TaskStatus] || 'Unknown'
})

const statusVariant = computed(() => {
  const variants: Record<TaskStatus, 'neutral' | 'info' | 'success' | 'error'> = {
    [TaskStatus.Todo]: 'neutral',
    [TaskStatus.InProgress]: 'info',
    [TaskStatus.Completed]: 'success',
    [TaskStatus.Cancelled]: 'error'
  }
  return variants[props.task?.status as TaskStatus] || 'neutral'
})

const priorityLabel = computed(() => {
  const priorityLabels: Record<TaskPriority, string> = {
    [TaskPriority.Low]: 'Low',
    [TaskPriority.Medium]: 'Medium',
    [TaskPriority.High]: 'High',
    [TaskPriority.Urgent]: 'Urgent'
  }
  return priorityLabels[props.task?.priority as TaskPriority] || 'Medium'
})

const priorityVariant = computed(() => {
  const variants: Record<TaskPriority, 'neutral' | 'info' | 'warning' | 'error'> = {
    [TaskPriority.Low]: 'neutral',
    [TaskPriority.Medium]: 'info',
    [TaskPriority.High]: 'warning',
    [TaskPriority.Urgent]: 'error'
  }
  return variants[props.task?.priority as TaskPriority] || 'neutral'
})

const dueDateClass = computed(() => {
  if (!props.task?.dueDate) return ''
  
  const dueDate = new Date(props.task.dueDate)
  const now = new Date()
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) return 'text-error' // Overdue
  if (diffInDays <= 1) return 'text-warning' // Due soon
  return 'text-base-content/70' // Normal
})

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
</script>