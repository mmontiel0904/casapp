<template>
  <tr class="bg-primary/5 border-2 border-primary/20">
    <!-- Task Name Input -->
    <td class="max-w-[120px] sm:max-w-[200px] lg:max-w-xs">
      <input
        ref="nameInput"
        v-model="form.name"
        type="text"
        class="input input-sm input-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
        placeholder="Enter task name..."
        maxlength="255"
        @keydown.enter="handleSave"
        @keydown.escape="handleCancel"
        @keydown.tab="$event.preventDefault(); focusNextField()"
      />
    </td>

    <!-- Status Select -->
    <td>
      <select 
        v-model="form.status"
        class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
      >
        <option 
          v-for="status in statusOptions" 
          :key="status.value"
          :value="status.value"
        >
          {{ status.label }}
        </option>
      </select>
    </td>

    <!-- Priority Select -->
    <td>
      <select 
        v-model="form.priority"
        class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
      >
        <option 
          v-for="priority in priorityOptions" 
          :key="priority.value"
          :value="priority.value"
        >
          {{ priority.label }}
        </option>
      </select>
    </td>

    <!-- Assignee Select (for project tasks) / Creator (for my tasks) -->
    <td v-if="context === 'projectTasks'">
      <select 
        v-model="form.assigneeId"
        class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
        :disabled="usersLoading"
      >
        <option value="">Unassigned</option>
        <option 
          v-for="user in availableUsers" 
          :key="user.id" 
          :value="user.id"
        >
          {{ getUserDisplayName(user) }}
        </option>
      </select>
      <div v-if="usersLoading" class="text-xs text-base-content/60 mt-1">
        <span class="loading loading-spinner loading-xs"></span>
        Loading users...
      </div>
      <div v-if="usersError" class="text-xs text-error mt-1">
        Error loading users
      </div>
    </td>
    <td v-else-if="context === 'myTasks'" class="py-4">
      <span class="text-sm text-base-content/70">You</span>
    </td>

    <!-- Project Column (if shown) -->
    <td v-if="showProject">
      <select 
        v-model="form.projectId"
        class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
        :disabled="projectsLoading"
        required
      >
        <option value="">Select project</option>
        <option 
          v-for="project in availableProjects" 
          :key="project.id" 
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
    </td>

    <!-- Due Date + Recurrence -->
    <td>
      <div class="space-y-2">
        <input 
          v-model="form.dueDate"
          type="date" 
          class="input input-sm input-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full min-h-[44px] md:min-h-0"
            :min="todayDate"
        />
        <!-- Recurrence Selector -->
        <RecurrenceSelector 
          v-model:recurrence-type="form.recurrenceType"
          v-model:recurrence-day="form.recurrenceDay"
          size="sm"
          compact
        />
      </div>
    </td>

    <!-- Actions -->
    <td class="text-right">
      <div class="flex gap-1 justify-end">
        <button
          type="button"
          :disabled="!form.name.trim() || (!showProject && !preselectedProjectId) || (showProject && !form.projectId) || isSubmitting"
          @click="handleSave"
          class="btn btn-primary btn-xs min-h-[44px] md:min-h-0"
          :class="{ 'loading': isSubmitting }"
        >
          <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ isSubmitting ? '' : 'Save' }}
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-ghost btn-xs min-h-[44px] md:min-h-0"
          :disabled="isSubmitting"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery, useCreateTaskMutation, TaskPriority, TaskStatus, RecurrenceType, type CreateTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../../generated/graphql'
import { useApolloFeedback } from '../../composables/useApolloFeedback'
import { useAuth } from '../../composables/useAuth'
import RecurrenceSelector from './RecurrenceSelector.vue'

// Props & Emits
interface Props {
  showProject?: boolean
  preselectedProjectId?: string
  preselectedStatus?: string
  context?: 'myTasks' | 'projectTasks'
}

const props = withDefaults(defineProps<Props>(), {
  showProject: true,
  preselectedProjectId: '',
  preselectedStatus: TaskStatus.Todo,
  context: 'projectTasks'
})

const emit = defineEmits<{
  taskCreated: [task: any]
  cancel: []
}>()

// Component refs
const nameInput = ref<HTMLInputElement>()

// Apollo mutations
const { mutate: createTask, loading: createLoading, error: createError } = useCreateTaskMutation()
const feedback = useApolloFeedback()

// Auth state
const { currentUser } = useAuth()

// Data fetching
const { result: projectsResult, loading: projectsLoading } = useMyProjectsQuery({
  limit: 50,
  offset: 0
})

const { result: usersResult, loading: usersLoading, error: usersError } = useAllUsersQuery()

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

// Date helpers
const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const tomorrowDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Default assignee based on context
const defaultAssigneeId = computed(() => {
  if (props.context === 'myTasks' && currentUser.value?.id) {
    return currentUser.value.id
  }
  return ''
})

// Form state with recurrence support
const form = ref<{
  name: string
  description: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assigneeId: string
  recurrenceType: RecurrenceType
  recurrenceDay: number | null
}>({
  name: '',
  description: '',
  projectId: props.preselectedProjectId,
  status: (props.preselectedStatus as TaskStatus) || TaskStatus.Todo,
  priority: TaskPriority.Medium,
  dueDate: tomorrowDate.value,
  assigneeId: defaultAssigneeId.value,
  recurrenceType: RecurrenceType.None,
  recurrenceDay: null
})

const isSubmitting = ref(false)

// Priority and status options
const priorityOptions = computed(() => [
  { value: TaskPriority.Low, label: 'Low' },
  { value: TaskPriority.Medium, label: 'Medium' },
  { value: TaskPriority.High, label: 'High' },
  { value: TaskPriority.Urgent, label: 'Urgent' }
])

const statusOptions = computed(() => [
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' }
])

// Helper functions
const getUserDisplayName = (user: AllUsersQuery['allUsers'][0]): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}

const focusNextField = () => {
  // Simple tab navigation - can be enhanced
  const selects = document.querySelectorAll('select')
  if (selects.length > 0) {
    ;(selects[0] as HTMLSelectElement).focus()
  }
}

// Form submission
const handleSave = async () => {
  if (!form.value.name.trim() || isSubmitting.value) {
    return
  }

  // Project validation
  const projectId = props.showProject ? form.value.projectId : props.preselectedProjectId
  if (!projectId) {
    return
  }

  isSubmitting.value = true

  const taskInput: CreateTaskInput = {
    name: form.value.name.trim(),
    description: form.value.description || undefined,
    projectId,
    priority: form.value.priority,
    assigneeId: form.value.assigneeId || undefined,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined,
    recurrenceType: form.value.recurrenceType,
    recurrenceDay: form.value.recurrenceDay
  }

  feedback.handleMutation(createLoading, createError, async () => {
    // Success callback
    emit('taskCreated', taskInput)
    resetForm()
    isSubmitting.value = false
  }, {
    successTitle: 'Task Created',
    successMessage: `"${form.value.name}" has been created successfully`,
    errorTitle: 'Task Creation Failed'
  })

  try {
    await createTask({ input: taskInput })
  } catch (error) {
    console.error('Task creation failed:', error)
    isSubmitting.value = false
  }
}

// Reset form to initial values
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    projectId: props.preselectedProjectId,
    status: (props.preselectedStatus as TaskStatus) || TaskStatus.Todo,
    priority: TaskPriority.Medium,
    dueDate: tomorrowDate.value,
    assigneeId: defaultAssigneeId.value,
    recurrenceType: RecurrenceType.None,
    recurrenceDay: null
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

// Focus name input when component mounts
onMounted(async () => {
  await nextTick()
  nameInput.value?.focus()
})
</script>