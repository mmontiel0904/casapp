<template>
  <!-- Enhanced Task Edit Panel -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-hidden"
    @click.self="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-base-content/20 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Side Panel -->
    <div class="absolute right-0 top-0 h-full w-full max-w-4xl bg-base-100 shadow-2xl transform transition-transform ease-in-out duration-300 flex flex-col">
      <!-- Enhanced Header -->
      <TaskEditHeader
        :task="task"
        :has-unsaved-changes="hasUnsavedChanges"
        :assignee-name="assigneeName"
        :project-name="projectName"
        @name-change="handleNameChange"
      />
      
      <!-- Close Button -->
      <button 
        @click="$emit('close')"
        class="absolute top-4 right-4 z-10 btn btn-ghost btn-square btn-sm hover:bg-base-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Tab Navigation -->
      <div class="border-b border-base-300">
        <div class="tabs tabs-lifted tabs-lg px-6">
          <a 
            class="tab tab-lg" 
            :class="{ 'tab-active': activeTab === 'details' }"
            @click="activeTab = 'details'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Details
          </a>
          <a 
            class="tab tab-lg" 
            :class="{ 'tab-active': activeTab === 'schedule' }"
            @click="activeTab = 'schedule'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v16a2 2 0 002 2z"></path>
            </svg>
            Schedule
          </a>
          <a 
            class="tab tab-lg relative" 
            :class="{ 'tab-active': activeTab === 'activity' }"
            @click="activeTab = 'activity'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Activity
            <div v-if="taskActivityCount > 0" class="badge badge-neutral badge-sm ml-1">{{ taskActivityCount }}</div>
          </a>
          <a 
            v-if="(task as any)?.contextId || (task as any)?.context"
            class="tab tab-lg" 
            :class="{ 'tab-active': activeTab === 'context' }"
            @click="activeTab = 'context'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Context
          </a>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Details Tab -->
        <TaskEditDetails
          v-show="activeTab === 'details'"
          :task="task"
          :is-completing="completeLoading"
          @field-change="handleFieldChange"
          @mark-complete="handleMarkComplete"
          @reopen-task="handleReopenTask"
        />

        <!-- Schedule Tab -->
        <TaskEditSchedule
          v-show="activeTab === 'schedule'"
          :task="task"
          :show-project="showProject"
          :available-projects="availableProjects"
          :available-users="availableUsers"
          :projects-loading="projectsLoading"
          :users-loading="usersLoading"
          :recurring-instances-count="recurringInstancesCount"
          @field-change="handleFieldChange"
          @view-parent="$emit('viewParent', $event)"
          @manage-instances="handleManageInstances"
        />

        <!-- Activity Tab -->
        <TaskEditActivity
          v-show="activeTab === 'activity'"
          :task="task"
          :activities="taskActivities"
          :is-loading-activities="isLoadingActivities"
          :total-activity-count="taskActivityCount"
          :is-submitting-comment="isSubmittingComment"
          @add-comment="handleAddComment"
          @refresh-activities="refetchActivities"
        />

        <!-- Context Tab -->
        <div v-show="activeTab === 'context'" class="p-6">
          <div v-if="(task as any)?.context">
            <TaskContextView :context="(task as any).context" />
          </div>
          <div v-else-if="(task as any)?.contextId" class="text-center py-8">
            <div class="loading loading-spinner loading-lg"></div>
            <p class="mt-4 text-base-content/60">Loading context information...</p>
            <!-- TODO: Add context query by contextId -->
          </div>
          <div v-else class="text-center py-8 text-base-content/50">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No context information available</p>
          </div>
        </div>
      </div>
        
      <!-- Smart Save Footer -->
      <div class="border-t border-base-300 bg-base-50">
        <div class="flex items-center justify-between p-6">
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
              v-if="hasUnsavedChanges"
              @click="handleSave"
              class="btn btn-primary gap-2"
              :disabled="!hasValidChanges || isSubmitting"
              :class="{ 'loading': isSubmitting }"
            >
              <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <div v-else class="flex items-center text-sm text-success gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              All changes saved
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery, useUpdateTaskMutation, useDeleteTaskMutation, useAssignTaskMutation, useTaskWithActivitiesQuery, useAddCommentMutation, TaskPriority, TaskStatus, RecurrenceType, EntityType, type UpdateTaskInput, type AssignTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../../generated/graphql'
import { useTasks, type TaskItem } from '../../composables/useTasks'
import { useApolloFeedback } from '../../composables/useApolloFeedback'
import TaskEditHeader from './TaskEditHeader.vue'
import TaskEditDetails from './TaskEditDetails.vue'
import TaskEditSchedule from './TaskEditSchedule.vue'
import TaskEditActivity from './TaskEditActivity.vue'
import TaskContextView from './TaskContextView.vue'

// Props & Emits
interface Props {
  isOpen?: boolean
  task?: TaskItem | null
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
  viewParent: [taskId: string]
}>()

// Apollo mutations
const { mutate: updateTask, loading: updateLoading } = useUpdateTaskMutation()
const { mutate: assignTask, loading: assignLoading } = useAssignTaskMutation()
const { mutate: deleteTask, loading: deleteLoading, error: deleteError } = useDeleteTaskMutation()
const { mutate: addComment, loading: addCommentLoading } = useAddCommentMutation()
const feedback = useApolloFeedback()

// Auth (only needed for components that use it)
// const { currentUser } = useAuth()

// Unified tasks functionality - includes recurrence helpers and completion mutation
const { 
  recurringInstancesCount,
  completeTask,
  completeLoading
} = useTasks(undefined, props.task?.id)

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

// UI State
const activeTab = ref('details')

// Form state with change tracking
const form = reactive({
  name: '',
  description: '',
  status: TaskStatus.Todo,
  priority: TaskPriority.Medium,
  assigneeId: '',
  projectId: '',
  dueDate: '',
  recurrenceType: RecurrenceType.None,
  recurrenceDay: null as number | null
})

// Track original form values for change detection
const originalForm = ref<typeof form | null>(null)

// Change tracking
const hasUnsavedChanges = computed(() => {
  if (!originalForm.value) return false
  
  return (
    form.name !== originalForm.value.name ||
    form.description !== originalForm.value.description ||
    form.status !== originalForm.value.status ||
    form.priority !== originalForm.value.priority ||
    form.assigneeId !== originalForm.value.assigneeId ||
    form.projectId !== originalForm.value.projectId ||
    form.dueDate !== originalForm.value.dueDate ||
    form.recurrenceType !== originalForm.value.recurrenceType ||
    form.recurrenceDay !== originalForm.value.recurrenceDay
  )
})

const hasValidChanges = computed(() => {
  return form.name.trim().length > 0
})

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

const taskActivities = computed(() => {
  return taskActivitiesResult.value?.task?.activities || []
})

const taskActivityCount = computed(() => {
  return taskActivitiesResult.value?.task?.activityCount || 0
})

const isLoadingActivities = computed(() => activitiesLoading.value)
const isSubmittingComment = computed(() => addCommentLoading.value)
const isSubmitting = computed(() => updateLoading.value || assignLoading.value || deleteLoading.value)

// const isRecurringTask = computed(() => checkIsRecurringTask(props.task))
// const isRecurringInstance = computed(() => checkIsRecurringInstance(props.task))

// Helper properties for header
const assigneeName = computed(() => {
  if (!form.assigneeId) return ''
  const assignee = availableUsers.value.find(u => u.id === form.assigneeId)
  return assignee ? getUserDisplayName(assignee) : ''
})

const projectName = computed(() => {
  if (!form.projectId) return ''
  const project = availableProjects.value.find(p => p.id === form.projectId)
  return project?.name || ''
})

// Helper functions
const getUserDisplayName = (user: AllUsersQuery['allUsers'][0]): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}

// Form management
const resetForm = () => {
  if (props.task) {
    const formData = {
      name: props.task.name || '',
      description: props.task.description || '',
      status: (props.task.status as TaskStatus) || TaskStatus.Todo,
      priority: (props.task.priority as TaskPriority) || TaskPriority.Medium,
      assigneeId: props.task.assigneeId || '',
      projectId: props.task.projectId || '',
      dueDate: props.task.dueDate ? new Date(props.task.dueDate).toISOString().split('T')[0] : '',
      recurrenceType: (props.task?.recurrenceType as RecurrenceType) || RecurrenceType.None,
      recurrenceDay: props.task?.recurrenceDay || null
    }
    Object.assign(form, formData)
    originalForm.value = { ...formData }
  }
}

// Handle field changes from child components
const handleFieldChange = (field: string, value: any) => {
  ;(form as any)[field] = value
}

// Handle name change with auto-save
const handleNameChange = async (newName: string) => {
  if (!props.task || !originalForm.value) return
  
  if (newName !== originalForm.value.name && newName.trim()) {
    try {
      await updateTask({ 
        input: { 
          taskId: props.task.id, 
          name: newName.trim() 
        } 
      })
      originalForm.value.name = newName
      form.name = newName
      feedback.success('Task Updated', 'Task name updated successfully')
    } catch (error) {
      form.name = originalForm.value.name
      feedback.error('Update Failed', 'Could not update task name')
    }
  }
}

// Handle mark complete (integrated with MyTasksPage completeTask)
const handleMarkComplete = async () => {
  if (!props.task) return
  
  try {
    await completeTask(props.task.id)
    // Update form status
    form.status = TaskStatus.Completed
    if (originalForm.value) {
      originalForm.value.status = TaskStatus.Completed
    }
    feedback.success('Task Completed', `"${props.task.name}" has been completed`)
    emit('saved', { taskId: props.task.id, status: TaskStatus.Completed })
  } catch (error) {
    console.error('Task completion failed:', error)
    feedback.error('Completion Failed', 'Could not mark task as complete')
  }
}

// Handle reopen task
const handleReopenTask = () => {
  form.status = TaskStatus.Todo
  if (originalForm.value) {
    originalForm.value.status = TaskStatus.Todo
  }
}

// Handle manage instances
const handleManageInstances = () => {
  // TODO: Implement instances management modal
  feedback.info('Coming Soon', 'Instance management feature is under development')
}

// Helper to detect which fields have changed
const getChangedFields = (): UpdateTaskInput => {
  if (!originalForm.value || !props.task) {
    return { taskId: props.task?.id || '' }
  }
  
  const changes: UpdateTaskInput = {
    taskId: props.task.id
  }
  
  // Only include fields that have actually changed
  if (form.name !== originalForm.value.name) {
    changes.name = form.name.trim()
  }
  if (form.description !== originalForm.value.description) {
    changes.description = form.description || undefined
  }
  if (form.status !== originalForm.value.status) {
    changes.status = form.status
  }
  if (form.priority !== originalForm.value.priority) {
    changes.priority = form.priority
  }
  if (form.dueDate !== originalForm.value.dueDate) {
    changes.dueDate = form.dueDate ? new Date(form.dueDate).toISOString() : undefined
  }
  if (form.recurrenceType !== originalForm.value.recurrenceType) {
    changes.recurrenceType = form.recurrenceType
  }
  if (form.recurrenceDay !== originalForm.value.recurrenceDay) {
    changes.recurrenceDay = form.recurrenceDay
  }
  
  return changes
}

// Smart save handler
const handleSave = async () => {
  if (!props.task || !hasValidChanges.value) return

  const changes = getChangedFields()
  const assigneeChanged = originalForm.value && form.assigneeId !== originalForm.value.assigneeId
  const projectChanged = originalForm.value && form.projectId !== originalForm.value.projectId
  
  // Check if any actual fields changed (exclude taskId from count)
  const changedFields = Object.keys(changes).filter(key => key !== 'taskId')
  if (changedFields.length === 0 && !assigneeChanged && !projectChanged) {
    return
  }

  try {
    const promises: Promise<any>[] = []

    // If status changed to Completed, call the recurrence-aware mutation instead
    if (changes.status === TaskStatus.Completed && originalForm.value && originalForm.value.status !== TaskStatus.Completed) {
      await handleMarkComplete()
      delete changes.status
    }

    // Handle remaining regular task updates
    if (Object.keys(changes).length > 1) { // More than just taskId
      promises.push(updateTask({ input: changes }))
    }

    // Handle assignee changes separately
    if (assigneeChanged) {
      const assignInput: AssignTaskInput = {
        taskId: props.task.id,
        assigneeId: form.assigneeId || undefined
      }
      promises.push(assignTask({ input: assignInput }))
    }

    // Execute all mutations
    await Promise.all(promises)
    
    // Update original form to reflect saved changes
    if (originalForm.value) {
      Object.assign(originalForm.value, form)
    }
    
    feedback.success('Task Updated', `"${form.name}" has been updated successfully`)
    emit('saved', { ...changes, assigneeId: form.assigneeId, projectId: form.projectId })
    
  } catch (error) {
    console.error('Task update failed:', error)
    feedback.error('Update Failed', 'Could not save task changes')
  }
}

// Handle delete
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

// Handle adding a comment
const handleAddComment = async (content: string) => {
  if (!content.trim() || !props.task?.id) return
  
  try {
    const result = await addComment({
      input: {
        content: content.trim(),
        entityId: props.task.id,
        entityType: EntityType.Task,
        mentions: []
      }
    })
    
    if (result?.data?.addComment) {
      await refetchActivities()
      feedback.success('Comment added successfully', 'Your comment has been posted')
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    feedback.error('Failed to add comment', 'Please try again')
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
    activeTab.value = 'details' // Reset to details tab
  }
})
</script>