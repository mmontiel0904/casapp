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
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="taskInfoExpanded = !taskInfoExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold text-base">Basic Information</span>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': taskInfoExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="taskInfoExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <div class="flex flex-col gap-4 md:flex-row md:gap-6">
                  <!-- Task Name -->
                  <div class="w-full">
                    <div class="form-control w-full">
                      <input 
                        v-model="form.name"
                        type="text"
                        class="input input-bordered input-lg w-full placeholder:text-base-content/60 focus:ring-2 focus:ring-primary/20"
                        placeholder="Task name*"
                        maxlength="255"
                        required
                      />
                    </div>
                  </div>
                  <!-- Status -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.status"
                        class="select select-bordered select-lg w-full focus:ring-2 focus:ring-primary/20"
                      >
                        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                          {{ status.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col gap-4 md:flex-row md:gap-6">
                  <!-- Description -->
                  <div class="w-full">
                    <div class="form-control w-full">
                      <textarea 
                        v-model="form.description"
                        class="textarea textarea-bordered textarea-lg w-full placeholder:text-base-content/60 focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Description"
                        rows="3"
                        maxlength="1000"
                      ></textarea>
                      <span class="text-xs text-base-content/60 mt-1">{{ form.description?.length || 0 }}/1000</span>
                    </div>
                  </div>
                  <!-- Priority -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.priority"
                        class="select select-bordered select-lg w-full focus:ring-2 focus:ring-primary/20"
                      >
                        <option v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
                          {{ priority.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Assignment & Scheduling -->
          <div class="card bg-base-50 border border-base-300">
            <div class="card-body p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="assignmentExpanded = !assignmentExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                  </svg>
                  <span class="font-semibold text-base">Assignment & Timeline</span>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': assignmentExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="assignmentExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <div class="flex flex-col gap-4 md:flex-row md:gap-6">
                  <!-- Assignee -->
                  <div class="w-full">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.assigneeId"
                        class="select select-bordered select-lg w-full focus:ring-2 focus:ring-primary/20"
                        :disabled="usersLoading"
                      >
                        <option value="">Unassigned</option>
                        <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                          {{ getUserDisplayName(user) }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <!-- Due Date -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <input 
                        v-model="form.dueDate"
                        type="date"
                        class="input input-bordered input-lg w-full focus:ring-2 focus:ring-primary/20"
                        :min="todayDate"
                      />
                    </div>
                  </div>
                </div>
                <!-- Project -->
                <div v-if="showProject" class="form-control w-full">
                  <select 
                    v-model="form.projectId"
                    class="select select-bordered select-lg w-full focus:ring-2 focus:ring-primary/20"
                    :disabled="projectsLoading"
                    required
                  >
                    <option value="">Select project</option>
                    <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Activity Log -->
          <div class="card bg-base-50 border border-base-300">
            <div class="card-body p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="activityExpanded = !activityExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold text-base">Activity Log</span>
                  <span class="badge badge-sm">{{ taskActivityCount }}</span>
                  <div v-if="isLoadingActivities" class="loading loading-spinner loading-sm"></div>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': activityExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="activityExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <!-- Activity Log -->
                <div class="max-h-64 overflow-y-auto space-y-3">
                  <div v-if="isLoadingActivities" class="flex justify-center py-4">
                    <div class="loading loading-spinner loading-md"></div>
                  </div>
                  <div v-else-if="taskActivities.length === 0" class="text-center py-4 text-base-content/60">
                    No activity yet
                  </div>
                  <div v-else v-for="activity in taskActivities" :key="activity.id" class="chat chat-start">
                    <div class="chat-image avatar">
                      <div class="w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span class="text-xs font-bold text-primary">{{ getUserInitials(activity.actor) }}</span>
                      </div>
                    </div>
                    <div class="chat-header text-xs text-base-content/60 mb-1">
                      {{ getUserName(activity.actor) }}
                      <time class="text-xs opacity-50 ml-2">{{ formatDate(activity.createdAt) }}</time>
                    </div>
                    <div class="chat-bubble chat-bubble-primary text-sm">
                      {{ activity.description || activity.actionType || 'Activity performed' }}
                    </div>
                    <div v-if="activity.changesJson" class="chat-footer text-xs text-base-content/60 mt-1">
                      <span class="badge badge-xs badge-outline">{{ activity.changesJson }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Add Comment Input -->
                <div class="divider text-sm">Add Comment</div>
                <div class="flex gap-2">
                  <input 
                    v-model="newComment"
                    type="text"
                    class="input input-bordered input-sm flex-1 placeholder:text-base-content/60"
                    placeholder="Add a comment..."
                    @keyup.enter="handleAddComment"
                    :disabled="isSubmittingComment"
                  />
                  <button 
                    class="btn btn-primary btn-sm"
                    @click="handleAddComment"
                    :disabled="!newComment.trim() || isSubmittingComment"
                  >
                    <div v-if="isSubmittingComment" class="loading loading-spinner loading-xs"></div>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
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
import { useMyProjectsQuery, useAllUsersQuery, useUpdateTaskMutation, useDeleteTaskMutation, useTaskWithActivitiesQuery, useAddCommentMutation, TaskPriority, TaskStatus, EntityType, type UpdateTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../generated/graphql'
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
const { mutate: addComment, loading: addCommentLoading } = useAddCommentMutation()
const feedback = useApolloFeedback()

// Data fetching
const { result: projectsResult, loading: projectsLoading } = useMyProjectsQuery({
  limit: 50,
  offset: 0
})

const { result: usersResult, loading: usersLoading } = useAllUsersQuery()

// Task activities data
const { result: taskActivitiesResult, loading: activitiesLoading, refetch: refetchActivities } = useTaskWithActivitiesQuery(
  computed(() => ({ 
    taskId: props.task?.id || '', 
    activityLimit: 20 
  })),
  {
    enabled: computed(() => !!props.task?.id && props.isOpen),
    fetchPolicy: 'cache-and-network'
  }
)

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

// Real activities from API
const taskActivities = computed(() => {
  return taskActivitiesResult.value?.task?.activities || []
})

const taskActivityCount = computed(() => {
  return taskActivitiesResult.value?.task?.activityCount || 0
})

const isLoadingActivities = computed(() => activitiesLoading.value)

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

// Expandable sections state
const taskInfoExpanded = ref(true)
const assignmentExpanded = ref(true)
const activityExpanded = ref(true)

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

// Helper to get user initials
const getUserInitials = (user: any): string => {
  if (!user) return 'U'
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (lastName) return lastName[0].toUpperCase()
  return user.email?.[0]?.toUpperCase() || 'U'
}

// Helper to get user display name
const getUserName = (user: any): string => {
  if (!user) return 'Unknown User'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email || 'Unknown User'
}

// Comment input state
const newComment = ref('')
const isSubmittingComment = computed(() => addCommentLoading.value)

// Handle adding a comment
const handleAddComment = async () => {
  if (!newComment.value.trim() || isSubmittingComment.value || !props.task?.id) return
  
  try {
    const result = await addComment({
      input: {
        content: newComment.value.trim(),
        entityId: props.task.id,
        entityType: EntityType.Task,
        mentions: [] // Add mentions functionality later if needed
      }
    })
    
    if (result?.data?.addComment) {
      // Clear the input after successful submission
      newComment.value = ''
      
      // Refetch activities to show the new comment
      await refetchActivities()
      
      feedback.success('Comment added successfully', 'Your comment has been posted')
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    feedback.error('Failed to add comment', 'Please try again')
  }
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