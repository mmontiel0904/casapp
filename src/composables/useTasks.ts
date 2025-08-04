import { ref, computed } from 'vue'
import { 
  useMyAssignedTasksQuery,
  useProjectTasksQuery,
  useProjectTaskStatsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useAssignTaskMutation,
  useDeleteTaskMutation,
  type CreateTaskInput,
  type UpdateTaskInput,
  type AssignTaskInput,
  type MyAssignedTasksQuery,
  type ProjectTasksQuery,
  type ProjectTaskStatsQuery
} from '../generated/graphql'
import { useApolloFeedback } from './useApolloFeedback'

// Define proper task types based on actual GraphQL query results
export type MyAssignedTask = MyAssignedTasksQuery['myAssignedTasks'][0]
export type ProjectTask = ProjectTasksQuery['projectTasks'][0]

// Create a unified type that includes all possible fields from both query results  
export type TaskWithPartialUser = {
  id: any
  name: string
  description?: string | null
  projectId: any
  status: string
  priority: string
  dueDate?: any
  createdAt: any
  updatedAt: any
  // Fields that are only present in ProjectTasksQuery
  assigneeId?: any
  creatorId?: any
  assignee?: { id: any; email: string; firstName?: string | null; lastName?: string | null } | null
  // Fields that are present in both queries 
  creator?: { id: any; email: string; firstName?: string | null; lastName?: string | null } | null
  // Field that is only present in MyAssignedTasksQuery
  project?: { id: any; name: string } | null
}

export type TaskStats = ProjectTaskStatsQuery['projectTaskStats']

// Task status and priority constants following API schema
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]
export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY]

// Task view modes
export const TASK_VIEW_MODE = {
  TABLE: 'table',
  KANBAN: 'kanban'
} as const

export type TaskViewMode = typeof TASK_VIEW_MODE[keyof typeof TASK_VIEW_MODE]

/**
 * Enhanced Task Management Composable
 * Handles both standalone (myAssignedTasks) and project-based (projectTasks) views
 * Following FRONTEND_INTEGRATION.md patterns
 */
export function useTasks(projectId?: string) {
  const feedback = useApolloFeedback()
  
  // Local state
  const viewMode = ref<TaskViewMode>(TASK_VIEW_MODE.TABLE)
  const selectedStatus = ref<string>('')
  const selectedPriority = ref<string>('')
  const selectedAssignee = ref<string>('')
  const searchQuery = ref('')

  // Query variables for My Tasks (no projectId needed)
  const myTasksVars = computed(() => ({
    status: selectedStatus.value || undefined,
    limit: 50,
    offset: 0
  }))

  // Query variables for Project Tasks (projectId required)
  const projectTasksVars = computed(() => ({
    projectId: projectId!,
    status: selectedStatus.value || undefined,
    assigneeId: selectedAssignee.value || undefined,
    limit: 50,
    offset: 0
  }))

  // Conditional queries based on context
  const myTasksQuery = useMyAssignedTasksQuery(
    myTasksVars,
    { enabled: !projectId } // Only enable for "My Tasks" view
  )

  const projectTasksQuery = useProjectTasksQuery(
    projectTasksVars,
    { enabled: !!projectId } // Only enable for project-specific view
  )

  const projectStatsQuery = useProjectTaskStatsQuery(
    () => ({ projectId: projectId! }),
    { enabled: !!projectId }
  )

  // Mutations
  const { mutate: createTask, loading: createLoading, error: createError } = useCreateTaskMutation()
  const { mutate: updateTask, loading: updateLoading, error: updateError } = useUpdateTaskMutation()
  const { mutate: assignTask, loading: assignLoading, error: assignError } = useAssignTaskMutation()
  const { mutate: deleteTask, loading: deleteLoading, error: deleteError } = useDeleteTaskMutation()

  // Computed properties with proper typing
  const tasks = computed((): TaskWithPartialUser[] => {
    if (projectId) {
      return projectTasksQuery.result.value?.projectTasks || []
    }
    return myTasksQuery.result.value?.myAssignedTasks || []
  })

  const taskStats = computed((): TaskStats | null => {
    return projectStatsQuery.result.value?.projectTaskStats || null
  })

  const loading = computed(() => {
    if (projectId) {
      return projectTasksQuery.loading.value
    }
    return myTasksQuery.loading.value
  })

  const error = computed(() => {
    if (projectId) {
      return projectTasksQuery.error.value
    }
    return myTasksQuery.error.value
  })

  // Filtered and searched tasks
  const filteredTasks = computed(() => {
    let filtered = tasks.value

    // Filter by priority
    if (selectedPriority.value) {
      filtered = filtered.filter((task: TaskWithPartialUser) => task.priority === selectedPriority.value)
    }

    // Search by name/description
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter((task: TaskWithPartialUser) => 
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  // Tasks grouped by status for Kanban view
  const tasksByStatus = computed(() => {
    const grouped = {
      [TASK_STATUS.TODO]: [] as TaskWithPartialUser[],
      [TASK_STATUS.IN_PROGRESS]: [] as TaskWithPartialUser[],
      [TASK_STATUS.COMPLETED]: [] as TaskWithPartialUser[],
      [TASK_STATUS.CANCELLED]: [] as TaskWithPartialUser[]
    }

    filteredTasks.value.forEach((task: TaskWithPartialUser) => {
      const status = task.status as TaskStatus
      if (grouped[status]) {
        grouped[status].push(task)
      }
    })

    return grouped
  })

  // Priority-based filtering
  const tasksByPriority = computed(() => {
    const grouped = {
      [TASK_PRIORITY.URGENT]: [] as TaskWithPartialUser[],
      [TASK_PRIORITY.HIGH]: [] as TaskWithPartialUser[],
      [TASK_PRIORITY.MEDIUM]: [] as TaskWithPartialUser[],
      [TASK_PRIORITY.LOW]: [] as TaskWithPartialUser[]
    }

    filteredTasks.value.forEach((task: TaskWithPartialUser) => {
      const priority = task.priority as TaskPriority
      if (grouped[priority]) {
        grouped[priority].push(task)
      }
    })

    return grouped
  })

  // Overdue tasks calculation
  const overdueTasks = computed(() => {
    const now = new Date()
    return filteredTasks.value.filter((task: TaskWithPartialUser) => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== TASK_STATUS.COMPLETED
    )
  })

  // High priority incomplete tasks
  const urgentTasks = computed(() => 
    filteredTasks.value.filter((task: TaskWithPartialUser) => 
      task.priority === TASK_PRIORITY.URGENT && 
      task.status !== TASK_STATUS.COMPLETED
    )
  )

  // Helper functions
  const getStatusDisplayName = (status: string): string => {
    const names = {
      [TASK_STATUS.TODO]: 'To Do',
      [TASK_STATUS.IN_PROGRESS]: 'In Progress',
      [TASK_STATUS.COMPLETED]: 'Completed',
      [TASK_STATUS.CANCELLED]: 'Cancelled'
    }
    return names[status as TaskStatus] || status
  }

  const getPriorityDisplayName = (priority: string): string => {
    const names = {
      [TASK_PRIORITY.LOW]: 'Low',
      [TASK_PRIORITY.MEDIUM]: 'Medium', 
      [TASK_PRIORITY.HIGH]: 'High',
      [TASK_PRIORITY.URGENT]: 'Urgent'
    }
    return names[priority as TaskPriority] || priority
  }

  const getPriorityColor = (priority: string): string => {
    const colors = {
      [TASK_PRIORITY.LOW]: 'badge-ghost',
      [TASK_PRIORITY.MEDIUM]: 'badge-info',
      [TASK_PRIORITY.HIGH]: 'badge-warning',
      [TASK_PRIORITY.URGENT]: 'badge-error'
    }
    return colors[priority as TaskPriority] || 'badge-ghost'
  }

  const getStatusColor = (status: string): string => {
    const colors = {
      [TASK_STATUS.TODO]: 'badge-ghost',
      [TASK_STATUS.IN_PROGRESS]: 'badge-warning',
      [TASK_STATUS.COMPLETED]: 'badge-success',
      [TASK_STATUS.CANCELLED]: 'badge-error'
    }
    return colors[status as TaskStatus] || 'badge-ghost'
  }

  // Actions
  const createNewTask = async (input: CreateTaskInput): Promise<boolean> => {
    try {
      const result = await createTask({ input })
      const newTask = result?.data?.createTask
      
      if (newTask) {
        feedback.success('Task Created', `"${newTask.name}" has been created successfully`)
        // Refetch tasks to update the list
        await refetchTasks()
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to create task:', err)
      return false
    }
  }

  const updateExistingTask = async (input: UpdateTaskInput): Promise<boolean> => {
    try {
      const result = await updateTask({ input })
      const updatedTask = result?.data?.updateTask
      
      if (updatedTask) {
        feedback.success('Task Updated', 'Task has been updated successfully')
        await refetchTasks()
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to update task:', err)
      return false
    }
  }

  const assignTaskToUser = async (input: AssignTaskInput): Promise<boolean> => {
    try {
      const result = await assignTask({ input })
      const assignedTask = result?.data?.assignTask
      
      if (assignedTask) {
        const assigneeName = assignedTask.assignee 
          ? `${assignedTask.assignee.firstName || ''} ${assignedTask.assignee.lastName || ''}`.trim() || assignedTask.assignee.email
          : 'Unassigned'
        
        feedback.success('Task Assigned', `Task assigned to ${assigneeName}`)
        await refetchTasks()
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to assign task:', err)
      return false
    }
  }

  const removeTask = async (taskId: string): Promise<boolean> => {
    try {
      await deleteTask({ taskId })
      feedback.success('Task Deleted', 'Task has been deleted successfully')
      await refetchTasks()
      return true
    } catch (err) {
      console.error('Failed to delete task:', err)
      return false
    }
  }

  const refetchTasks = async () => {
    if (projectId) {
      await projectTasksQuery.refetch()
      await projectStatsQuery.refetch?.()
    } else {
      await myTasksQuery.refetch()
    }
  }

  // View mode toggle
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === TASK_VIEW_MODE.TABLE 
      ? TASK_VIEW_MODE.KANBAN 
      : TASK_VIEW_MODE.TABLE
  }

  const setViewMode = (mode: TaskViewMode) => {
    viewMode.value = mode
  }

  // Filter actions
  const setStatusFilter = (status: string) => {
    selectedStatus.value = status
  }

  const setPriorityFilter = (priority: string) => {
    selectedPriority.value = priority
  }

  const setAssigneeFilter = (assigneeId: string) => {
    selectedAssignee.value = assigneeId
  }

  const clearFilters = () => {
    selectedStatus.value = ''
    selectedPriority.value = ''
    selectedAssignee.value = ''
    searchQuery.value = ''
  }

  // Setup Apollo feedback for queries with enhanced permission error handling
  if (!projectId) {
    // My Tasks query feedback - includes permission error detection
    feedback.handleQuery(myTasksQuery.error, {
      errorTitle: 'Failed to Load My Tasks',
      showPermissionErrors: true,
      showNetworkErrors: true
    })
  } else {
    // Project Tasks query feedback - includes permission error detection
    feedback.handleQuery(projectTasksQuery.error, {
      errorTitle: 'Failed to Load Project Tasks',
      showPermissionErrors: true,
      showNetworkErrors: true
    })
    
    // Project Stats query feedback - includes permission error detection
    feedback.handleQuery(projectStatsQuery.error, {
      errorTitle: 'Failed to Load Project Statistics',
      showPermissionErrors: true,
      showNetworkErrors: true
    })
  }

  // Setup Apollo feedback for mutations
  feedback.handleMutation(createLoading, createError, () => {}, {
    errorTitle: 'Failed to Create Task'
  })

  feedback.handleMutation(updateLoading, updateError, () => {}, {
    errorTitle: 'Failed to Update Task'
  })

  feedback.handleMutation(assignLoading, assignError, () => {}, {
    errorTitle: 'Failed to Assign Task'
  })

  feedback.handleMutation(deleteLoading, deleteError, () => {}, {
    errorTitle: 'Failed to Delete Task'
  })

  return {
    // Constants
    TASK_STATUS,
    TASK_PRIORITY,
    TASK_VIEW_MODE,

    // State
    tasks: filteredTasks,
    taskStats,
    loading,
    error,
    viewMode,
    searchQuery,

    // Grouped data
    tasksByStatus,
    tasksByPriority,
    overdueTasks,
    urgentTasks,

    // Filters
    selectedStatus,
    selectedPriority,
    selectedAssignee,

    // Actions
    createNewTask,
    updateExistingTask,
    assignTaskToUser,
    removeTask,
    refetchTasks,

    // View controls
    toggleViewMode,
    setViewMode,

    // Filter controls
    setStatusFilter,
    setPriorityFilter,
    setAssigneeFilter,
    clearFilters,

    // Helper functions
    getStatusDisplayName,
    getPriorityDisplayName,
    getPriorityColor,
    getStatusColor,

    // Loading states for individual operations
    createLoading,
    updateLoading,
    assignLoading,
    deleteLoading
  }
}