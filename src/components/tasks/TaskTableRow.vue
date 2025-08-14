<template>
  <tr 
    class="group cursor-pointer transition-all duration-200 border-b border-base-200 hover:bg-base-100 hover:shadow-sm h-18"
    :class="{ 
      'bg-primary/8 border-l-4 border-l-primary shadow-sm': isSelected,
      'hover:bg-primary/4': !isSelected
    }"
    @click="$emit('viewDetails', task)"
  >
    <!-- Task Name & Description -->
    <td class="max-w-xs py-4">
      <div class="font-semibold text-sm text-base-content truncate leading-5">{{ task.name }}</div>
      <div v-if="task.description" class="text-xs text-base-content/60 truncate mt-1 leading-4">
        {{ task.description }}
      </div>
    </td>
    
    <!-- Status -->
    <td class="py-4">
      <div :class="getStatusColor(task.status)" class="badge badge-sm font-sans">
        {{ getStatusDisplayName(task.status) }}
      </div>
    </td>
    
    <!-- Priority -->
    <td class="py-4">
      <div :class="getPriorityColor(task.priority)" class="badge badge-sm font-sans">
        {{ getPriorityDisplayName(task.priority) }}
      </div>
      <div v-if="isOverdue(task)" class="badge badge-error badge-xs mt-1">
        Overdue
      </div>
      <div v-if="isRecurringTask(task)" class="badge badge-info badge-xs mt-1">
        {{ formatRecurrenceType(task?.recurrenceType) }}
      </div>
      <div v-if="isRecurringInstance(task)" class="badge badge-outline badge-xs mt-1">
        Instance
      </div>
    </td>
    
    <!-- Assignee (for project tasks) -->
    <td v-if="context === 'projectTasks'" class="py-4">
      <div v-if="task.assignee" class="flex items-center gap-2">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-7">
            <span class="text-xs font-mono">{{ getAssigneeInitials(task.assignee) }}</span>
          </div>
        </div>
        <span class="text-sm truncate max-w-24">{{ getAssigneeName(task.assignee) }}</span>
      </div>
      <div v-else class="text-sm text-base-content/50">Unassigned</div>
    </td>

    <!-- Created By (for my tasks) -->
    <td v-if="context === 'myTasks'" class="py-4">
      <div v-if="task.creator" class="flex items-center gap-2">
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-7">
            <span class="text-xs font-mono">{{ getCreatorInitials(task.creator) }}</span>
          </div>
        </div>
        <span class="text-sm truncate max-w-24">{{ getCreatorName(task.creator) }}</span>
      </div>
      <div v-else class="text-sm text-base-content/50">System</div>
    </td>
    
    <!-- Project (conditional) -->
    <td v-if="showProject" class="py-4">
      <div v-if="task.project" class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-sm truncate max-w-32">{{ task.project.name }}</span>
      </div>
    </td>
    
    <!-- Due Date -->
    <td class="py-4">
      <div v-if="task.dueDate" class="text-sm font-mono" :class="{ 'text-error font-semibold': isOverdue(task) }">
        {{ formatDueDate(task.dueDate) }}
      </div>
      <div v-else class="text-sm text-base-content/50">No due date</div>
    </td>
    
    <!-- Actions -->
    <td class="text-right py-4">
      <div class="dropdown dropdown-end" @click.stop>
        <label tabindex="0" class="btn btn-ghost btn-sm btn-square hover:bg-base-200 group-hover:bg-base-200/80">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-1 shadow-xl bg-base-100 border border-base-300 rounded-lg w-44">
          <!-- Primary Action - View Details -->
          <li>
            <button @click="handleViewDetails" class="flex items-center gap-2 p-2 text-sm hover:bg-primary/10 rounded">
              <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="font-medium">View Details</span>
            </button>
          </li>
          
          <!-- Edit Action -->
          <li>
            <button @click="handleEdit" class="flex items-center gap-2 p-2 text-sm hover:bg-base-200 rounded">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          </li>
          
          <!-- Quick Status Actions -->
          <li v-if="task.status !== 'COMPLETED'">
            <button @click="handleMarkComplete" class="flex items-center gap-2 p-2 text-sm hover:bg-success/10 rounded">
              <svg class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              <span>Mark Complete</span>
            </button>
          </li>
          
          <!-- Divider -->
          <div class="divider my-1"></div>
          
          <!-- Destructive Action -->
          <li>
            <button @click="handleDelete" class="flex items-center gap-2 p-2 text-sm hover:bg-error/10 rounded text-error">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useTasks, type TaskWithPartialUser } from '../../composables/useTasks'

interface Props {
  task: TaskWithPartialUser
  isSelected?: boolean
  showProject?: boolean
  context?: 'myTasks' | 'projectTasks'
}

interface Emits {
  (e: 'viewDetails', task: TaskWithPartialUser): void
  (e: 'edit', task: TaskWithPartialUser): void
  (e: 'markComplete', task: TaskWithPartialUser): void
  (e: 'delete', task: TaskWithPartialUser): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  showProject: false,
  context: 'projectTasks'
})

const emit = defineEmits<Emits>()

// Unified tasks functionality - includes all recurring task helpers
const { 
  formatRecurrenceType, 
  isRecurringTask, 
  isRecurringInstance 
} = useTasks()

// Event handlers with dropdown closing
const closeDropdown = () => {
  setTimeout(() => {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement.closest('.dropdown')) {
      activeElement.blur()
    }
    
    document.querySelectorAll('.dropdown label[tabindex="0"]').forEach(label => {
      (label as HTMLElement).blur()
    })
  }, 0)
}

const handleViewDetails = () => {
  closeDropdown()
  emit('viewDetails', props.task)
}

const handleEdit = () => {
  closeDropdown()
  emit('edit', props.task)
}

const handleMarkComplete = () => {
  closeDropdown()
  emit('markComplete', props.task)
}

const handleDelete = () => {
  closeDropdown()
  emit('delete', props.task)
}

// Helper functions (copied from TaskTableView)
const getStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'TODO': 'badge-info',
    'IN_PROGRESS': 'badge-warning',
    'COMPLETED': 'badge-success',
    'CANCELLED': 'badge-error'
  }
  return colorMap[status] || 'badge-neutral'
}

const getPriorityDisplayName = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent'
  }
  return priorityMap[priority] || priority
}

const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    'LOW': 'badge-neutral',
    'MEDIUM': 'badge-info',
    'HIGH': 'badge-warning',
    'URGENT': 'badge-error'
  }
  return colorMap[priority] || 'badge-neutral'
}

const isOverdue = (task: TaskWithPartialUser): boolean => {
  if (!task.dueDate || task.status === 'COMPLETED') return false
  return new Date(task.dueDate) < new Date()
}

const getAssigneeInitials = (assignee: any): string => {
  if (!assignee) return '??'
  const firstName = assignee.firstName || ''
  const lastName = assignee.lastName || ''
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`
  if (firstName) return firstName.substring(0, 2)
  if (assignee.email) return assignee.email.substring(0, 2).toUpperCase()
  return '??'
}

const getAssigneeName = (assignee: any): string => {
  if (!assignee) return 'Unknown'
  const firstName = assignee.firstName || ''
  const lastName = assignee.lastName || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  return fullName || assignee.email || 'Unknown'
}

const getCreatorInitials = (creator: any): string => {
  if (!creator) return '??'
  const firstName = creator.firstName || ''
  const lastName = creator.lastName || ''
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`
  if (firstName) return firstName.substring(0, 2)
  if (creator.email) return creator.email.substring(0, 2).toUpperCase()
  return '??'
}

const getCreatorName = (creator: any): string => {
  if (!creator) return 'Unknown'
  const firstName = creator.firstName || ''
  const lastName = creator.lastName || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  return fullName || creator.email || 'Unknown'
}

const formatDueDate = (dueDate: string): string => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  
  return date.toLocaleDateString()
}
</script>