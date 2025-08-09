<template>
  <!-- Task Edit Side Panel -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-hidden"
    @click.self="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-base-content/20 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Side Panel -->
    <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-base-100 shadow-2xl transform transition-transform ease-in-out duration-300 flex flex-col">
      <!-- Panel Header -->
      <div class="flex items-center justify-between p-6 border-b border-base-300 bg-gradient-to-r from-base-100 to-base-50">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-primary/10 rounded-lg">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-base-content">Edit Task</h2>
            <p class="text-sm text-base-content/60">Update task details and status</p>
          </div>
        </div>
        
        <button 
          @click="$emit('close')"
          class="btn btn-ghost btn-square btn-sm hover:bg-base-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Form Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- Task Information -->
          <div class="card bg-base-50 border border-base-300">
            <div class="card-body p-4">
              <h3 class="card-title text-base mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Basic Information
              </h3>
              
              <!-- Task Name -->
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text font-medium">Task Name</span>
                  <span class="label-text-alt text-error">*</span>
                </label>
                <input 
                  v-model="form.name"
                  type="text" 
                  class="input input-bordered focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter task name"
                  maxlength="255"
                  required
                />
              </div>
              
              <!-- Description -->
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <textarea 
                  v-model="form.description"
                  class="textarea textarea-bordered focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Describe the task..."
                  rows="4"
                  maxlength="1000"
                ></textarea>
                <div class="label">
                  <span class="label-text-alt">{{ form.description?.length || 0 }}/1000 characters</span>
                </div>
              </div>
              
              <!-- Status and Priority Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Status</span>
                  </label>
                  <select 
                    v-model="form.status"
                    class="select select-bordered focus:ring-2 focus:ring-primary/20"
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
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Priority</span>
                  </label>
                  <select 
                    v-model="form.priority"
                    class="select select-bordered focus:ring-2 focus:ring-primary/20"
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
              </div>
            </div>
          </div>
          
          <!-- Assignment & Scheduling -->
          <div class="card bg-base-50 border border-base-300">
            <div class="card-body p-4">
              <h3 class="card-title text-base mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                </svg>
                Assignment & Timeline
              </h3>
              
              <!-- Assignee and Due Date Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Assignee</span>
                  </label>
                  <select 
                    v-model="form.assigneeId"
                    class="select select-bordered focus:ring-2 focus:ring-primary/20"
                    :disabled="usersLoading"
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
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Due Date</span>
                  </label>
                  <input 
                    v-model="form.dueDate"
                    type="date" 
                    class="input input-bordered focus:ring-2 focus:ring-primary/20"
                    :min="todayDate"
                  />
                </div>
              </div>
              
              <!-- Project (if context allows) -->
              <div class="form-control mt-4" v-if="showProject">
                <label class="label">
                  <span class="label-text font-medium">Project</span>
                </label>
                <select 
                  v-model="form.projectId"
                  class="select select-bordered focus:ring-2 focus:ring-primary/20"
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
              </div>
            </div>
          </div>
          
          <!-- Task Activity/History Section -->
          <div class="card bg-base-50 border border-base-300">
            <div class="card-body p-4">
              <h3 class="card-title text-base mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Task Details
              </h3>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-base-content/60">Created:</span>
                    <span class="font-mono">{{ formatDate(task?.createdAt) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-base-content/60">Updated:</span>
                    <span class="font-mono">{{ formatDate(task?.updatedAt) }}</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-base-content/60">Creator:</span>
                    <span>{{ getCreatorName(task?.creator) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-base-content/60">ID:</span>
                    <span class="font-mono text-xs">{{ task?.id?.slice(0, 8) }}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panel Footer - Actions -->
        <div class="flex items-center justify-between p-6 border-t border-base-300 bg-base-50">
          <div class="flex gap-3">
            <button 
              @click="handleDelete"
              class="btn btn-error btn-outline gap-2"
              :disabled="isSubmitting"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Task
            </button>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="$emit('close')"
              class="btn btn-ghost"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button 
              @click="handleSave"
              class="btn btn-primary gap-2"
              :disabled="!form.name.trim() || isSubmitting"
              :class="{ 'loading': isSubmitting }"
            >
              <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery, useUpdateTaskMutation, useDeleteTaskMutation, TaskPriority, TaskStatus, type UpdateTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../generated/graphql'
import { type TaskWithPartialUser } from '../composables/useTasks'
import { useApolloFeedback } from '../composables/useApolloFeedback'

// Props & Emits
interface Props {
  isOpen?: boolean
  task?: TaskWithPartialUser | null
  showProject?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  task: null,
  showProject: true
})

const emit = defineEmits<{
  close: []
  saved: [task: any]
  deleted: [taskId: string]
}>()

// Apollo mutations
const { mutate: updateTask, loading: updateLoading, error: updateError } = useUpdateTaskMutation()
const { mutate: deleteTask, loading: deleteLoading, error: deleteError } = useDeleteTaskMutation()
const feedback = useApolloFeedback()

// Data fetching
const { result: projectsResult, loading: projectsLoading } = useMyProjectsQuery({
  limit: 50,
  offset: 0
})

const { result: usersResult, loading: usersLoading } = useAllUsersQuery()

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isSubmitting = computed(() => updateLoading.value || deleteLoading.value)

// Form state
const form = ref<{
  name: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  projectId: string
  dueDate: string
}>({
  name: '',
  description: '',
  status: TaskStatus.Todo,
  priority: TaskPriority.Medium,
  assigneeId: '',
  projectId: '',
  dueDate: ''
})

// Options
const statusOptions = computed(() => [
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.Completed, label: 'Completed' }
])

const priorityOptions = computed(() => [
  { value: TaskPriority.Low, label: 'Low' },
  { value: TaskPriority.Medium, label: 'Medium' },
  { value: TaskPriority.High, label: 'High' },
  { value: TaskPriority.Urgent, label: 'Urgent' }
])

// Helper functions
const getUserDisplayName = (user: AllUsersQuery['allUsers'][0]): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}

const getCreatorName = (creator: any): string => {
  if (!creator) return 'System'
  const fullName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim()
  return fullName || creator.email
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Form management
const resetForm = () => {
  if (props.task) {
    form.value = {
      name: props.task.name || '',
      description: props.task.description || '',
      status: (props.task.status as TaskStatus) || TaskStatus.Todo,
      priority: (props.task.priority as TaskPriority) || TaskPriority.Medium,
      assigneeId: props.task.assigneeId || '',
      projectId: props.task.projectId || '',
      dueDate: props.task.dueDate ? new Date(props.task.dueDate).toISOString().split('T')[0] : ''
    }
  }
}

// Actions
const handleSave = async () => {
  if (!props.task || !form.value.name.trim()) return

  const updateInput: UpdateTaskInput = {
    taskId: props.task.id,
    name: form.value.name.trim(),
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
  }

  feedback.handleMutation(updateLoading, updateError, async () => {
    emit('saved', updateInput)
    emit('close')
  }, {
    successTitle: 'Task Updated',
    successMessage: `"${form.value.name}" has been updated successfully`,
    errorTitle: 'Update Failed'
  })

  try {
    await updateTask({ input: updateInput })
  } catch (error) {
    console.error('Task update failed:', error)
  }
}

const handleDelete = async () => {
  if (!props.task) return

  if (!confirm(`Are you sure you want to delete "${props.task.name}"? This action cannot be undone.`)) {
    return
  }

  feedback.handleMutation(deleteLoading, deleteError, async () => {
    emit('deleted', props.task!.id)
    emit('close')
  }, {
    successTitle: 'Task Deleted',
    successMessage: `"${props.task.name}" has been deleted`,
    errorTitle: 'Delete Failed'
  })

  try {
    await deleteTask({ taskId: props.task.id })
  } catch (error) {
    console.error('Task delete failed:', error)
  }
}

// Watch for task changes
watch(() => props.task, () => {
  resetForm()
}, { immediate: true })

// Watch for panel open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>