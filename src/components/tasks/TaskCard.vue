<template>
  <div 
    class="card bg-base-100 shadow-sm border border-base-300 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
    :class="{ 'ring-2 ring-primary ring-opacity-50': selected }"
    @click="$emit('select', task)"
  >
    <div class="card-body p-4">
      <!-- Task Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-base text-base-content truncate font-sans">
            {{ task.name }}
          </h3>
          <p 
            v-if="task.description" 
            class="text-sm text-base-content/70 mt-1 line-clamp-2 font-sans"
          >
            {{ task.description }}
          </p>
        </div>
        
        <!-- Task Actions Dropdown -->
        <div class="dropdown dropdown-end" @click.stop>
          <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-48">
            <li>
              <a @click="$emit('edit', task)" class="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Task
              </a>
            </li>
            <li>
              <a @click="$emit('assign', task)" class="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Assign Task
              </a>
            </li>
            <li><hr class="my-1"></li>
            <li>
              <a @click="$emit('delete', task)" class="flex items-center gap-2 text-sm text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Task
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Task Metadata -->
      <div class="flex items-center gap-2 mb-3">
        <!-- Status Badge -->
        <div :class="getStatusColor(task.status)" class="badge badge-sm font-sans">
          {{ getStatusDisplayName(task.status) }}
        </div>
        
        <!-- Priority Badge -->
        <div :class="getPriorityColor(task.priority)" class="badge badge-sm font-sans">
          {{ getPriorityDisplayName(task.priority) }}
        </div>
        
        <!-- Overdue Badge -->
        <div v-if="isOverdue" class="badge badge-error badge-sm font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Overdue
        </div>
        
        <!-- Recurrence Badge -->
        <div v-if="isRecurringTask" class="badge badge-info badge-sm font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getRecurrenceIcon(task?.recurrenceType)" />
          </svg>
          {{ formatRecurrenceType(task?.recurrenceType) }}
        </div>
        
        <!-- Recurring Instance Badge -->
        <div v-if="isRecurringInstance" class="badge badge-outline badge-sm font-sans">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Instance
        </div>
      </div>

      <!-- Project Info (for My Tasks view) -->
      <div v-if="task.project && showProject" class="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-sm text-base-content/70 font-sans">{{ task.project.name }}</span>
      </div>

      <!-- Task Footer -->
      <div class="flex items-center justify-between text-xs text-base-content/60">
        <!-- Assignee Info -->
        <div class="flex items-center gap-2">
          <div v-if="task.assignee" class="flex items-center gap-2">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-6">
                <span class="text-xs font-mono">{{ getAssigneeInitials(task.assignee) }}</span>
              </div>
            </div>
            <span class="font-sans">{{ getAssigneeName(task.assignee) }}</span>
          </div>
          <div v-else class="text-base-content/50 font-sans">Unassigned</div>
        </div>

        <!-- Due Date -->
        <div v-if="task.dueDate" class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="font-mono" :class="{ 'text-error': isOverdue }">
            {{ formatDueDate(task.dueDate) }}
          </span>
        </div>
      </div>

      <!-- Progress indicator for In Progress tasks -->
      <div v-if="task.status === TaskStatus.InProgress" class="mt-3">
        <div class="w-full bg-base-200 rounded-full h-1">
          <div class="bg-warning h-1 rounded-full" style="width: 60%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskWithPartialUser } from '../../composables/useTasks'
import { useRecurringTasks } from '../../composables/useRecurringTasks'
import { TaskStatus } from '../../generated/graphql'

interface Props {
  task: TaskWithPartialUser
  selected?: boolean
  showProject?: boolean
}

interface Emits {
  (e: 'select', task: TaskWithPartialUser): void
  (e: 'edit', task: TaskWithPartialUser): void
  (e: 'assign', task: TaskWithPartialUser): void
  (e: 'delete', task: TaskWithPartialUser): void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  showProject: false
})

defineEmits<Emits>()

// Recurring tasks functionality
const { 
  formatRecurrenceType, 
  getRecurrenceIcon, 
  isRecurringTask: checkIsRecurringTask, 
  isRecurringInstance: checkIsRecurringInstance 
} = useRecurringTasks()

// Computed properties
const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  const now = new Date()
  const dueDate = new Date(props.task.dueDate)
  return dueDate < now && props.task.status !== TaskStatus.Completed
})

// Recurrence computed properties
const isRecurringTask = computed(() => checkIsRecurringTask(props.task))
const isRecurringInstance = computed(() => checkIsRecurringInstance(props.task))

// Helper functions following FRONTEND_INTEGRATION.md patterns
const getStatusDisplayName = (status: string): string => {
  const names = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return names[status as keyof typeof names] || status
}

const getPriorityDisplayName = (priority: string): string => {
  const names = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High', 
    'urgent': 'Urgent'
  }
  return names[priority as keyof typeof names] || priority
}

const getPriorityColor = (priority: string): string => {
  const colors = {
    'low': 'badge-ghost',
    'medium': 'badge-info',
    'high': 'badge-warning',
    'urgent': 'badge-error'
  }
  return colors[priority as keyof typeof colors] || 'badge-ghost'
}

const getStatusColor = (status: string): string => {
  const colors = {
    'todo': 'badge-ghost',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'cancelled': 'badge-error'
  }
  return colors[status as keyof typeof colors] || 'badge-ghost'
}

const getAssigneeInitials = (assignee: any): string => {
  if (!assignee) return '?'
  const firstName = assignee.firstName || ''
  const lastName = assignee.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  } else if (firstName) {
    return firstName[0].toUpperCase()
  } else if (lastName) {
    return lastName[0].toUpperCase()
  } else {
    return assignee.email[0].toUpperCase()
  }
}

const getAssigneeName = (assignee: any): string => {
  if (!assignee) return 'Unassigned'
  const firstName = assignee.firstName || ''
  const lastName = assignee.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return assignee.email.split('@')[0]
  }
}

const formatDueDate = (dueDate: string): string => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0) return `${diffDays}d`
  return `${Math.abs(diffDays)}d ago`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>