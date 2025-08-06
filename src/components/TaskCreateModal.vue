<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box bg-base-100 shadow-xl rounded-lg max-w-lg">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-base-content font-serif">Create New Task</h2>
        <button @click="closeModal" class="btn btn-ghost btn-sm btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Task Creation Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Task Name -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Task Name</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input 
            v-model="form.name"
            type="text" 
            class="input input-bordered input-primary focus:ring-2"
            placeholder="Enter task name"
            required
            maxlength="255"
          />
        </div>

        <!-- Task Description -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Description</span>
          </label>
          <textarea 
            v-model="form.description"
            class="textarea textarea-bordered textarea-primary focus:ring-2 resize-none"
            placeholder="Describe the task (optional)"
            rows="3"
            maxlength="1000"
          ></textarea>
        </div>

        <!-- Project Selection -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Project</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <select 
            v-model="form.projectId"
            class="select select-bordered select-primary focus:ring-2"
            required
          >
            <option value="">Select a project</option>
            <option 
              v-for="project in availableProjects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
          <div v-if="projectsLoading" class="label">
            <span class="label-text-alt">
              <span class="loading loading-spinner loading-xs"></span>
              Loading projects...
            </span>
          </div>
        </div>

        <!-- Priority Selection -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Priority</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label 
              v-for="priority in priorityOptions" 
              :key="priority.value"
              class="label cursor-pointer border rounded-lg p-3 hover:bg-base-200 transition-colors"
              :class="{ 'border-primary bg-primary/10': form.priority === priority.value }"
            >
              <input 
                v-model="form.priority"
                type="radio" 
                :value="priority.value"
                class="radio radio-primary radio-sm"
              />
              <span class="label-text font-sans ml-2">
                <span class="badge badge-sm mr-1" :class="priority.colorClass">{{ priority.label }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Status Selection -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Initial Status</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label 
              v-for="status in statusOptions" 
              :key="status.value"
              class="label cursor-pointer border rounded-lg p-3 hover:bg-base-200 transition-colors"
              :class="{ 'border-primary bg-primary/10': form.status === status.value }"
            >
              <input 
                v-model="form.status"
                type="radio" 
                :value="status.value"
                class="radio radio-primary radio-sm"
              />
              <span class="label-text font-sans ml-2">
                <span class="badge badge-sm mr-1" :class="status.colorClass">{{ status.label }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Due Date -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Due Date</span>
          </label>
          <input 
            v-model="form.dueDate"
            type="datetime-local" 
            class="input input-bordered input-primary focus:ring-2"
          />
        </div>

        <!-- Assignee Selection -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text font-sans font-medium">Assignee</span>
          </label>
          <select 
            v-model="form.assigneeId"
            class="select select-bordered select-primary focus:ring-2"
          >
            <option value="">Leave unassigned</option>
            <option 
              v-for="user in availableUsers" 
              :key="user.id" 
              :value="user.id"
            >
              {{ getUserDisplayName(user) }}
            </option>
          </select>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4 border-t border-base-300">
          <button 
            type="submit"
            class="btn btn-primary flex-1 rounded-lg"
            :disabled="isSubmitting || !form.name || !form.projectId"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Task' }}
          </button>
          
          <button 
            type="button"
            @click="closeModal"
            class="btn btn-ghost rounded-lg"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Modal backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery } from '../generated/graphql'
import { useTasks, TASK_PRIORITY, TASK_STATUS, type TaskPriority, type TaskStatus } from '../composables/useTasks'
import { useFeedback } from '../composables/useFeedback'
import type { CreateTaskInput, MyProjectsQuery, AllUsersQuery } from '../generated/graphql'

// Props & Emits
interface Props {
  isOpen?: boolean
  preselectedStatus?: string
  preselectedProjectId?: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  preselectedStatus: '',
  preselectedProjectId: ''
})

const emit = defineEmits<{
  close: []
  taskCreated: [task: any]
}>()

// Component refs
const modal = ref<HTMLDialogElement>()

// Task management
const { createNewTask, createLoading } = useTasks()

// Feedback system (for potential manual feedback)
const { error: showError } = useFeedback()

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
  dueDate: '',
  assigneeId: ''
})

const isSubmitting = ref(false)

// Data fetching
const { result: projectsResult, loading: projectsLoading } = useMyProjectsQuery({
  limit: 50,
  offset: 0
})

const { result: usersResult } = useAllUsersQuery()

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

// Priority options with Material Design 3 styling
const priorityOptions = computed(() => [
  { 
    value: TASK_PRIORITY.LOW, 
    label: 'Low', 
    colorClass: 'badge-ghost' 
  },
  { 
    value: TASK_PRIORITY.MEDIUM, 
    label: 'Medium', 
    colorClass: 'badge-info' 
  },
  { 
    value: TASK_PRIORITY.HIGH, 
    label: 'High', 
    colorClass: 'badge-warning' 
  },
  { 
    value: TASK_PRIORITY.URGENT, 
    label: 'Urgent', 
    colorClass: 'badge-error' 
  }
])

// Status options with consistent styling
const statusOptions = computed(() => [
  { 
    value: TASK_STATUS.TODO, 
    label: 'To Do', 
    colorClass: 'badge-ghost' 
  },
  { 
    value: TASK_STATUS.IN_PROGRESS, 
    label: 'In Progress', 
    colorClass: 'badge-warning' 
  }
  // Note: Completed and Cancelled are typically not initial states for new tasks
])

// Helper functions
const getUserDisplayName = (user: AllUsersQuery['allUsers'][0]): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    projectId: props.preselectedProjectId,
    status: (props.preselectedStatus as TaskStatus) || TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    assigneeId: ''
  }
}

// Modal management
const openModal = () => {
  modal.value?.showModal()
}

const closeModal = () => {
  if (!isSubmitting.value) {
    modal.value?.close()
    emit('close')
    resetForm()
  }
}

// Form submission
const handleSubmit = async () => {
  if (!form.value.name || !form.value.projectId || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    // Prepare task input following GraphQL schema
    const taskInput: CreateTaskInput = {
      name: form.value.name,
      description: form.value.description || undefined,
      projectId: form.value.projectId,
      priority: form.value.priority,
      assigneeId: form.value.assigneeId || undefined,
      dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
    }

    const success = await createNewTask(taskInput)

    if (success) {
      emit('taskCreated', taskInput)
      closeModal()
    } else {
      showError('Task Creation Failed', 'Unable to create task. Please try again.')
    }
  } catch (error) {
    console.error('Task creation failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Watch for prop changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    openModal()
  }
})

watch(() => props.preselectedProjectId, (projectId) => {
  if (projectId) {
    form.value.projectId = projectId
  }
})

watch(() => props.preselectedStatus, (status) => {
  if (status) {
    form.value.status = status as TaskStatus
  }
})

// Public methods
defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped>
/* Custom focus states for better accessibility */
.input:focus,
.textarea:focus,
.select:focus {
  outline: 2px solid oklch(var(--p));
  outline-offset: 2px;
}

/* Enhanced radio button styling */
.radio:checked {
  background-image: radial-gradient(currentColor 40%, transparent 40%);
}

/* Smooth transitions for interactive elements */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal backdrop styling */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>