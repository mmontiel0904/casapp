<template>
  <tr class="bg-primary/5 border-2 border-primary/20">
    <!-- Task Name Input -->
    <td class="max-w-xs">
      <input
        ref="nameInput"
        v-model="form.name"
        type="text"
        class="input input-sm input-bordered w-full"
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
        class="select select-sm select-bordered w-full"
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
        class="select select-sm select-bordered w-full"
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

    <!-- Assignee Select -->
    <td>
      <select 
        v-model="form.assigneeId"
        class="select select-sm select-bordered w-full"
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

    <!-- Project Column (if shown) -->
    <td v-if="showProject">
      <select 
        v-model="form.projectId"
        class="select select-sm select-bordered w-full"
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

    <!-- Due Date -->
    <td>
      <input 
        v-model="form.dueDate"
        type="date" 
        class="input input-sm input-bordered w-full"
        :min="todayDate"
      />
    </td>

    <!-- Actions -->
    <td>
      <div class="flex gap-1 justify-end">
        <button
          type="button"
          :disabled="!form.name.trim() || (!showProject && !preselectedProjectId) || (showProject && !form.projectId) || isSubmitting"
          @click="handleSave"
          class="btn btn-primary btn-xs"
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
          class="btn btn-ghost btn-xs"
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
import { useMyProjectsQuery, useAllUsersQuery, useCreateTaskMutation, type CreateTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../generated/graphql'
import { TASK_PRIORITY, TASK_STATUS, type TaskPriority, type TaskStatus } from '../composables/useTasks'
import { useApolloFeedback } from '../composables/useApolloFeedback'

// Props & Emits
interface Props {
  showProject?: boolean
  preselectedProjectId?: string
  preselectedStatus?: string
}

const props = withDefaults(defineProps<Props>(), {
  showProject: true,
  preselectedProjectId: '',
  preselectedStatus: TASK_STATUS.TODO
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

// Form state
const form = ref<{
  name: string
  description: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assigneeId: string
}>({
  name: '',
  description: '',
  projectId: props.preselectedProjectId,
  status: (props.preselectedStatus as TaskStatus) || TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  dueDate: tomorrowDate.value,
  assigneeId: ''
})

const isSubmitting = ref(false)

// Priority and status options
const priorityOptions = computed(() => [
  { value: TASK_PRIORITY.LOW, label: 'Low' },
  { value: TASK_PRIORITY.MEDIUM, label: 'Medium' },
  { value: TASK_PRIORITY.HIGH, label: 'High' },
  { value: TASK_PRIORITY.URGENT, label: 'Urgent' }
])

const statusOptions = computed(() => [
  { value: TASK_STATUS.TODO, label: 'To Do' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' }
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
    dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
  }

  feedback.handleMutation(createLoading, createError, async () => {
    // Success callback
    emit('taskCreated', taskInput)
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

const handleCancel = () => {
  emit('cancel')
}

// Focus name input when component mounts
onMounted(async () => {
  await nextTick()
  nameInput.value?.focus()
})
</script>