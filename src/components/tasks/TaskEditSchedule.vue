<template>
  <div class="p-6 space-y-6">
    <!-- Assignment and Due Date -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Assignee Selection -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-sans font-semibold text-base">Assigned To</span>
          <span v-if="usersLoading" class="loading loading-spinner loading-xs"></span>
        </label>
        <select 
          v-model="form.assigneeId"
          class="select select-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200"
          :disabled="usersLoading"
          @change="$emit('field-change', 'assigneeId', form.assigneeId)"
        >
          <option value="">Unassigned</option>
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ getUserDisplayName(user) }}
          </option>
        </select>
      </div>

      <!-- Due Date -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-sans font-semibold text-base">Due Date</span>
          <span v-if="form.dueDate && isDueSoon" class="label-text-alt text-warning">Due soon!</span>
          <span v-if="form.dueDate && isOverdue" class="label-text-alt text-error">Overdue</span>
        </label>
        <input 
          v-model="form.dueDate"
          type="date"
          class="input input-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200"
          :class="dueDateInputClass"
          :min="todayDate"
          @change="$emit('field-change', 'dueDate', form.dueDate)"
        />
      </div>
    </div>

    <!-- Project Selection (if enabled) -->
    <div v-if="showProject" class="form-control">
      <label class="label">
        <span class="label-text font-sans font-semibold text-base">Project</span>
        <span class="label-text-alt text-error">*</span>
      </label>
      <select 
        v-model="form.projectId"
        class="select select-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200"
        :disabled="projectsLoading"
        required
        @change="$emit('field-change', 'projectId', form.projectId)"
      >
        <option value="">Select project</option>
        <option v-for="project in availableProjects" :key="project.id" :value="project.id">
          {{ project.name }}
        </option>
      </select>
    </div>

    <!-- Recurrence Section -->
    <div class="bg-base-50/50 rounded-xl">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <h4 class="card-title text-lg font-sans font-semibold">Recurrence Settings</h4>
          </div>
          
          <div class="flex gap-2">
            <Chip v-if="isRecurringTask" variant="info" size="sm">
              {{ formatRecurrenceType(task?.recurrenceType) }}
            </Chip>
            <Chip v-if="isRecurringInstance" variant="ghost" size="sm">
              Instance
            </Chip>
          </div>
        </div>

        <!-- Warning for Recurring Instances -->
        <div v-if="isRecurringInstance" class="alert alert-warning mb-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <div class="font-semibold">Recurring Task Instance</div>
            <div class="text-sm">Recurrence settings are managed by the parent task.</div>
          </div>
          <button 
            v-if="task?.parentTaskId" 
            @click="$emit('view-parent', task.parentTaskId)" 
            class="btn btn-warning btn-sm"
          >
            View Parent Task
          </button>
        </div>

        <!-- Recurrence Settings (for non-instances) -->
        <div v-if="!isRecurringInstance">
          <RecurrenceSelector 
            v-model:recurrence-type="form.recurrenceType"
            v-model:recurrence-day="form.recurrenceDay"
            @update:recurrence-type="$emit('field-change', 'recurrenceType', $event)"
            @update:recurrence-day="$emit('field-change', 'recurrenceDay', $event)"
          />
          
          <!-- Recurring Instances Info -->
          <div v-if="isRecurringTask && recurringInstancesCount > 0" class="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span class="font-semibold text-info">Active Instances</span>
              <Chip variant="info" size="sm">{{ recurringInstancesCount }}</Chip>
            </div>
            <p class="text-sm text-base-content/70 mb-3">
              This task has {{ recurringInstancesCount }} active instance{{ recurringInstancesCount !== 1 ? 's' : '' }}.
              Recurrence changes will only affect future instances.
            </p>
            <button @click="$emit('manage-instances')" class="btn btn-info btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
              Manage Instances
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment Change Notification -->
    <div v-if="showAssignmentChange" class="alert alert-info">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <div class="font-semibold">Assignment Updated</div>
        <div class="text-sm">{{ assignmentChangeMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { RecurrenceType, type MyProjectsQuery, type AllUsersQuery } from '../../generated/graphql'
import { useTasks, type TaskItem } from '../../composables/useTasks'
import RecurrenceSelector from './RecurrenceSelector.vue'
import Chip from '../ui/Chip.vue'

interface Props {
  task?: TaskItem | null
  showProject?: boolean
  availableProjects?: MyProjectsQuery['myProjects']
  availableUsers?: AllUsersQuery['allUsers']
  projectsLoading?: boolean
  usersLoading?: boolean
  recurringInstancesCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showProject: true,
  availableProjects: () => [],
  availableUsers: () => [],
  projectsLoading: false,
  usersLoading: false,
  recurringInstancesCount: 0
})

defineEmits<{
  'field-change': [field: string, value: any]
  'view-parent': [taskId: string]
  'manage-instances': []
}>()

// Form state
const form = reactive({
  assigneeId: '',
  projectId: '',
  dueDate: '',
  recurrenceType: RecurrenceType.None,
  recurrenceDay: null as number | null
})

// Assignment change feedback
const showAssignmentChange = ref(false)
const assignmentChangeMessage = ref('')

// Use tasks composable for recurrence helpers
const { 
  formatRecurrenceType, 
  isRecurringTask: checkIsRecurringTask, 
  isRecurringInstance: checkIsRecurringInstance 
} = useTasks()

// Watch for task changes to update form
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.assigneeId = newTask.assigneeId || ''
    form.projectId = newTask.projectId || ''
    form.dueDate = newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''
    form.recurrenceType = newTask.recurrenceType as RecurrenceType || RecurrenceType.None
    form.recurrenceDay = newTask.recurrenceDay || null
  }
}, { immediate: true })

// Watch for assignment changes
watch(() => form.assigneeId, (newAssigneeId, oldAssigneeId) => {
  if (oldAssigneeId !== undefined && newAssigneeId !== oldAssigneeId) {
    const assigneeName = newAssigneeId 
      ? getUserDisplayName(props.availableUsers?.find(u => u.id === newAssigneeId))
      : 'Unassigned'
    
    assignmentChangeMessage.value = `Task assigned to ${assigneeName}`
    showAssignmentChange.value = true
    
    setTimeout(() => {
      showAssignmentChange.value = false
    }, 3000)
  }
})

// Computed properties
const isRecurringTask = computed(() => checkIsRecurringTask(props.task))
const isRecurringInstance = computed(() => checkIsRecurringInstance(props.task))

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isDueSoon = computed(() => {
  if (!form.dueDate) return false
  const dueDate = new Date(form.dueDate)
  const now = new Date()
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays >= 0 && diffInDays <= 2
})

const isOverdue = computed(() => {
  if (!form.dueDate) return false
  const dueDate = new Date(form.dueDate)
  const now = new Date()
  return dueDate < now
})

const dueDateInputClass = computed(() => {
  if (isOverdue.value) return 'bg-error/10 focus:bg-error/20 hover:bg-error/20'
  if (isDueSoon.value) return 'bg-warning/10 focus:bg-warning/20 hover:bg-warning/20'
  return ''
})

// Helper functions
const getUserDisplayName = (user?: AllUsersQuery['allUsers'][0]): string => {
  if (!user) return 'Unknown User'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}
</script>