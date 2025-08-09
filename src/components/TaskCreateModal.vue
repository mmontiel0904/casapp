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

        <!-- Project Selection with Quick Create -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Project</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          
          <div class="flex gap-2">
            <select 
              v-model="form.projectId"
              class="select select-bordered select-primary focus:ring-2 flex-1"
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
            
            <!-- Quick Create Project Button -->
            <button 
              type="button"
              @click="showProjectCreateModal = true"
              class="btn btn-outline btn-primary"
              title="Create new project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <div v-if="projectsLoading" class="label">
            <span class="label-text-alt">
              <span class="loading loading-spinner loading-xs"></span>
              Loading projects...
            </span>
          </div>
        </div>

        <!-- Form Grid Layout - Two Columns for Compact Design -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Priority Selection -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-sans font-medium">Priority</span>
            </label>
            <select 
              v-model="form.priority"
              class="select select-bordered select-primary focus:ring-2"
            >
              <option 
                v-for="priority in priorityOptions" 
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </option>
            </select>
          </div>

          <!-- Status Selection -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-sans font-medium">Initial Status</span>
            </label>
            <select 
              v-model="form.status"
              class="select select-bordered select-primary focus:ring-2"
            >
              <option 
                v-for="status in statusOptions" 
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Due Date and Assignee Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Due Date -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-sans font-medium">Due Date</span>
            </label>
            <input 
              v-model="form.dueDate"
              type="date" 
              class="input input-bordered input-primary focus:ring-2"
              :min="todayDate"
            />
            <div class="label">
              <span class="label-text-alt">Defaults to tomorrow if empty</span>
            </div>
          </div>

          <!-- Assignee Selection -->
          <div class="form-control">
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

  <!-- Nested Project Creation Modal -->
  <ProjectCreateModal 
    :is-open="showProjectCreateModal"
    @close="showProjectCreateModal = false"
    @project-created="handleProjectCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery, useCreateTaskMutation, TaskPriority, TaskStatus, type CreateTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'
import ProjectCreateModal from './ProjectCreateModal.vue'

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

// Task management - use Apollo directly for better control
const { mutate: createTask, loading: createLoading, error: createError } = useCreateTaskMutation()

// Automatic Apollo feedback
const feedback = useApolloFeedback()

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
  status: (props.preselectedStatus as TaskStatus) || TaskStatus.Todo,
  priority: TaskPriority.Medium,
  dueDate: (() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })(), // Default to tomorrow
  assigneeId: ''
})

const isSubmitting = ref(false)

// Project creation modal state
const showProjectCreateModal = ref(false)

// Data fetching
const { result: projectsResult, loading: projectsLoading, refetch: refetchProjects } = useMyProjectsQuery({
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
    value: TaskPriority.Low, 
    label: 'Low', 
    colorClass: 'badge-ghost' 
  },
  { 
    value: TaskPriority.Medium, 
    label: 'Medium', 
    colorClass: 'badge-info' 
  },
  { 
    value: TaskPriority.High, 
    label: 'High', 
    colorClass: 'badge-warning' 
  },
  { 
    value: TaskPriority.Urgent, 
    label: 'Urgent', 
    colorClass: 'badge-error' 
  }
])

// Status options with consistent styling
const statusOptions = computed(() => [
  { 
    value: TaskStatus.Todo, 
    label: 'To Do', 
    colorClass: 'badge-ghost' 
  },
  { 
    value: TaskStatus.InProgress, 
    label: 'In Progress', 
    colorClass: 'badge-warning' 
  }
  // Note: Completed and Cancelled are typically not initial states for new tasks
])

// Date helpers
const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const tomorrowDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

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
    status: (props.preselectedStatus as TaskStatus) || TaskStatus.Todo,
    priority: TaskPriority.Medium,
    dueDate: tomorrowDate.value, // Default to tomorrow
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

// Form submission with Apollo automatic feedback
const handleSubmit = async () => {
  if (!form.value.name || !form.value.projectId || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  // Prepare task input following GraphQL schema
  const taskInput: CreateTaskInput = {
    name: form.value.name,
    description: form.value.description || undefined,
    projectId: form.value.projectId,
    priority: form.value.priority,
    assigneeId: form.value.assigneeId || undefined,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
  }

  // Use Apollo feedback system for automatic success/error handling
  feedback.handleMutation(createLoading, createError, async () => {
    // Success callback - task was created successfully
    emit('taskCreated', taskInput)
    isSubmitting.value = false
    closeModal()
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

// Project creation handler
const handleProjectCreated = async (project: any) => {
  try {
    // Refresh the projects list to include the new project
    await refetchProjects({
      limit: 50,
      offset: 0
    })
    
    // Wait for reactive updates
    await nextTick()
    
    // Auto-select the newly created project in the task form
    form.value.projectId = project.id
    
    // Close the project creation modal
    showProjectCreateModal.value = false
  } catch (error) {
    console.error('Error handling project creation:', error)
    // Project was still created successfully, just log the integration error
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