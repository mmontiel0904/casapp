<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full font-sans">
      <!-- Table Header -->
      <thead>
        <tr class="bg-base-200">
          <th class="font-semibold text-sm">Task</th>
          <th class="font-semibold text-sm">Status</th>
          <th class="font-semibold text-sm">Priority</th>
          <th v-if="context === 'projectTasks'" class="font-semibold text-sm">Assignee</th>
          <th v-if="context === 'myTasks'" class="font-semibold text-sm">Created By</th>
          <th v-if="showProject" class="font-semibold text-sm">Project</th>
          <th class="font-semibold text-sm">Due Date</th>
          <th class="font-semibold text-sm text-right">Actions</th>
        </tr>
      </thead>
      
      <!-- Table Body -->
      <tbody>
        <!-- Inline Task Creator -->
        <InlineTaskCreator
          v-if="showInlineCreator"
          :show-project="showProject"
          :preselected-project-id="preselectedProjectId"
          @task-created="handleTaskCreated"
          @cancel="emit('cancelInlineCreator')"
        />
        
        <tr v-if="loading" class="hover">
          <td :colspan="showProject ? 7 : 6" class="text-center py-8">
            <div class="flex items-center justify-center gap-2">
              <span class="loading loading-spinner loading-sm"></span>
              <span class="text-base-content/70">Loading tasks...</span>
            </div>
          </td>
        </tr>
        
        <tr v-else-if="tasks.length === 0" class="hover">
          <td :colspan="showProject ? 7 : 6" class="text-center py-8">
            <div class="flex flex-col items-center gap-2 text-base-content/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div class="text-lg font-medium">No tasks found</div>
              <div class="text-sm">Create your first task to get started</div>
            </div>
          </td>
        </tr>
        
        <tr 
          v-else
          v-for="task in tasks" 
          :key="task.id"
          class="hover cursor-pointer"
          :class="{ 'bg-primary/5 border-l-4 border-l-primary': selectedTask?.id === task.id }"
          @click="$emit('select', task)"
        >
          <!-- Task Name & Description -->
          <td class="max-w-xs">
            <div class="font-medium text-sm truncate">{{ task.name }}</div>
            <div v-if="task.description" class="text-xs text-base-content/60 truncate mt-1">
              {{ task.description }}
            </div>
          </td>
          
          <!-- Status -->
          <td>
            <div :class="getStatusColor(task.status)" class="badge badge-sm font-sans">
              {{ getStatusDisplayName(task.status) }}
            </div>
          </td>
          
          <!-- Priority -->
          <td>
            <div :class="getPriorityColor(task.priority)" class="badge badge-sm font-sans">
              {{ getPriorityDisplayName(task.priority) }}
            </div>
            <div v-if="isOverdue(task)" class="badge badge-error badge-xs mt-1">
              Overdue
            </div>
          </td>
          
          <!-- Assignee (for project tasks) -->
          <td v-if="context === 'projectTasks'">
            <div v-if="task.assignee" class="flex items-center gap-2">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-6">
                  <span class="text-xs font-mono">{{ getAssigneeInitials(task.assignee) }}</span>
                </div>
              </div>
              <span class="text-sm truncate max-w-24">{{ getAssigneeName(task.assignee) }}</span>
            </div>
            <div v-else class="text-sm text-base-content/50">Unassigned</div>
          </td>

          <!-- Created By (for my tasks) -->
          <td v-if="context === 'myTasks'">
            <div v-if="task.creator" class="flex items-center gap-2">
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-6">
                  <span class="text-xs font-mono">{{ getCreatorInitials(task.creator) }}</span>
                </div>
              </div>
              <span class="text-sm truncate max-w-24">{{ getCreatorName(task.creator) }}</span>
            </div>
            <div v-else class="text-sm text-base-content/50">System</div>
          </td>
          
          <!-- Project (conditional) -->
          <td v-if="showProject">
            <div v-if="task.project" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span class="text-sm truncate max-w-32">{{ task.project.name }}</span>
            </div>
          </td>
          
          <!-- Due Date -->
          <td>
            <div v-if="task.dueDate" class="text-sm font-mono" :class="{ 'text-error': isOverdue(task) }">
              {{ formatDueDate(task.dueDate) }}
            </div>
            <div v-else class="text-sm text-base-content/50">No due date</div>
          </td>
          
          <!-- Actions -->
          <td class="text-right">
            <div class="dropdown dropdown-end" @click.stop>
              <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-40">
                <li>
                  <a @click="$emit('edit', task)" class="text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </a>
                </li>
                <li>
                  <a @click="$emit('assign', task)" class="text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Assign
                  </a>
                </li>
                <li><hr class="my-1"></li>
                <li>
                  <a @click="$emit('delete', task)" class="text-sm text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithPartialUser } from '../composables/useTasks'
import InlineTaskCreator from './InlineTaskCreator.vue'

interface Props {
  tasks: TaskWithPartialUser[]
  loading?: boolean
  selectedTask?: TaskWithPartialUser | null
  showProject?: boolean
  showInlineCreator?: boolean
  preselectedProjectId?: string
  context?: 'myTasks' | 'projectTasks' // New prop to determine table context
}

interface Emits {
  (e: 'select', task: TaskWithPartialUser): void
  (e: 'edit', task: TaskWithPartialUser): void
  (e: 'assign', task: TaskWithPartialUser): void
  (e: 'delete', task: TaskWithPartialUser): void
  (e: 'taskCreated', task: any): void
  (e: 'cancelInlineCreator'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showProject: false,
  showInlineCreator: false,
  preselectedProjectId: '',
  context: 'projectTasks'
})

const emit = defineEmits<Emits>()

// Event handlers
const handleTaskCreated = (task: any) => {
  emit('taskCreated', task)
}

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

const getCreatorInitials = (creator: any): string => {
  if (!creator) return '?'
  const firstName = creator.firstName || ''
  const lastName = creator.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  } else if (firstName) {
    return firstName[0].toUpperCase()
  } else if (lastName) {
    return lastName[0].toUpperCase()
  } else {
    return creator.email[0].toUpperCase()
  }
}

const getCreatorName = (creator: any): string => {
  if (!creator) return 'System'
  const firstName = creator.firstName || ''
  const lastName = creator.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return creator.email.split('@')[0]
  }
}

const isOverdue = (task: TaskWithPartialUser): boolean => {
  if (!task.dueDate) return false
  const now = new Date()
  const dueDate = new Date(task.dueDate)
  return dueDate < now && task.status !== 'completed'
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