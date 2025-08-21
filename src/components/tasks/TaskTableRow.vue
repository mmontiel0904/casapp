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
    <td class="py-4">
      <div class="max-w-[120px] sm:max-w-[200px] lg:max-w-xs">
        <div class="font-semibold text-sm text-base-content truncate leading-5" :title="task.name">
          {{ task.name }}
        </div>
        <div v-if="task.description" 
             class="text-xs text-base-content/60 truncate mt-1 leading-4 hidden sm:block" 
             :title="task.description">
          {{ task.description }}
        </div>
      </div>
    </td>
    
    <!-- Status -->
    <td class="py-4">
      <Chip :variant="getStatusVariant(task.status)" size="sm">
        {{ getStatusDisplayName(task.status) }}
      </Chip>
    </td>
    
    <!-- Priority -->
    <td class="py-4">
      <!-- Primary Priority -->
      <Chip :variant="getPriorityVariant(task.priority)" size="sm">
        {{ getPriorityDisplayName(task.priority) }}
      </Chip>
      
      <!-- Secondary Indicators -->
      <div class="flex flex-wrap gap-1 mt-1" v-if="hasSecondaryIndicators(task)">
        <Chip v-if="isOverdue(task)" variant="error" size="sm">
          <template #icon>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </template>
          <span class="hidden sm:inline">Overdue</span>
          <span class="sm:hidden">!</span>
        </Chip>
        <Chip v-if="isRecurringTask(task)" variant="info" size="sm">
          <template #icon>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </template>
          <span class="hidden sm:inline">{{ formatRecurrenceType(task?.recurrenceType) }}</span>
          <span class="sm:hidden">R</span>
        </Chip>
        <Chip v-if="isRecurringInstance(task)" variant="ghost" size="sm">
          <template #icon>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </template>
          <span class="hidden sm:inline">Recurring Instance</span>
          <span class="sm:hidden">I</span>
        </Chip>
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
        <span class="text-sm truncate max-w-16 sm:max-w-24" :title="getAssigneeName(task.assignee)">{{ getAssigneeName(task.assignee) }}</span>
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
        <span class="text-sm truncate max-w-16 sm:max-w-24" :title="getCreatorName(task.creator)">{{ getCreatorName(task.creator) }}</span>
      </div>
      <div v-else class="text-sm text-base-content/50">System</div>
    </td>
    
    <!-- Project (conditional) -->
    <td v-if="showProject" class="py-4">
      <div v-if="'project' in task && task.project" class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-sm truncate max-w-20 sm:max-w-32" :title="task.project.name">{{ task.project.name }}</span>
      </div>
    </td>
    
    <!-- Context -->
    <td class="py-4">
      <div class="text-sm text-base-content/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 110 2h-1l-.117 2.338A3 3 0 0112 9H8a3 3 0 01-2.883-2.662L5 4H4a1 1 0 110-2h3zm2.5 5a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
        Context loading...
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
        <label tabindex="0" class="btn btn-ghost btn-sm btn-square hover:bg-base-200 group-hover:bg-base-200/80 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </label>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-1 shadow-xl bg-base-100 rounded-xl w-44">
          <!-- Primary Action - View Details -->
          <li>
            <button @click="handleViewDetails" class="flex items-center gap-2 p-3 text-sm hover:bg-primary/10 rounded min-h-[44px] w-full">
              <svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="font-medium">View Details</span>
            </button>
          </li>
          
          <!-- Edit Action -->
          <li>
            <button @click="handleEdit" class="flex items-center gap-2 p-3 text-sm hover:bg-base-200 rounded min-h-[44px] w-full">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          </li>
          
          <!-- Quick Status Actions -->
          <li v-if="task.status !== TaskStatus.Completed">
            <button 
              @click="handleMarkComplete" 
              :disabled="props.completeLoading"
              class="flex items-center gap-2 p-3 text-sm hover:bg-success/10 rounded disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full"
            >
              <svg v-if="!props.completeLoading" class="h-4 w-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              <span v-if="props.completeLoading" class="loading loading-spinner loading-xs text-success flex-shrink-0"></span>
              <span>{{ props.completeLoading ? 'Completing...' : 'Mark Complete' }}</span>
            </button>
          </li>
          
          <!-- Divider -->
          <div class="divider my-1"></div>
          
          <!-- Destructive Action -->
          <li>
            <button @click="handleDelete" class="flex items-center gap-2 p-3 text-sm hover:bg-error/10 rounded text-error min-h-[44px] w-full">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { useTasks, type TaskItem } from '../../composables/useTasks'
import { TaskStatus } from '../../generated/graphql'
import Chip from '../ui/Chip.vue'

interface Props {
  task: TaskItem
  isSelected?: boolean
  isOnBoard?: boolean
  showProject?: boolean
  context?: 'projectTasks' | 'myTasks'
  completeLoading?: boolean
}

interface Emits {
  (e: 'viewDetails', task: TaskItem): void
  (e: 'edit', task: TaskItem): void
  (e: 'markComplete', task: TaskItem): void
  (e: 'delete', task: TaskItem): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  showProject: false,
  context: 'projectTasks',
  completeLoading: false
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

const getStatusVariant = (status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost' => {
  const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost'> = {
    'TODO': 'info',
    'IN_PROGRESS': 'warning', 
    'COMPLETED': 'success',
    'CANCELLED': 'error'
  }
  return variantMap[status] || 'neutral'
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

const getPriorityVariant = (priority: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost' => {
  const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost'> = {
    'LOW': 'neutral',
    'MEDIUM': 'info',
    'HIGH': 'warning',
    'URGENT': 'error'
  }
  return variantMap[priority] || 'neutral'
}

const isOverdue = (task: TaskItem): boolean => {
  if (!task.dueDate || task.status === TaskStatus.Completed) return false
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

// Helper to determine if task has secondary indicators
const hasSecondaryIndicators = (task: TaskItem): boolean => {
  return isOverdue(task) || isRecurringTask(task) || isRecurringInstance(task)
}
</script>