import { ref, computed } from 'vue'
import { 
  useMyAssignedTasksQuery,
  useProjectTasksQuery,
  useProjectTaskStatsQuery,
  useTaskRecurringInstancesQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useAssignTaskMutation,
  useDeleteTaskMutation,
  useCompleteTaskWithRecurrenceMutation,
  TaskStatus,
  TaskPriority,
  RecurrenceType,
  type CreateTaskInput,
  type UpdateTaskInput,
  type ProjectTaskStatsQuery,
  type Task
} from '../generated/graphql'
import { useApolloFeedback } from './useApolloFeedback'

// ========== TYPES & INTERFACES ==========

/**
 * Recurrence form data structure for task creation/editing
 */
export interface RecurrenceForm {
  recurrenceType: RecurrenceType
  recurrenceDay?: number | null
  isRecurring: boolean
}

/**
 * Analytics data for recurring tasks overview
 */
export interface RecurringTaskAnalytics {
  activeRecurring: number
  completionRate: number
  monthlyInstances: number
  patternDistribution: Record<string, number>
  upcomingInstances: Array<{
    taskId: string
    name: string
    dueDate: Date
    recurrenceType: RecurrenceType
  }>
}

/**
 * Unified task type that includes all possible fields from different query results
 * Based on the latest GraphQL schema with full recurrence support
 */
export type TaskWithPartialUser = {
  id: any
  name: string
  description?: string | null
  projectId: any
  status: TaskStatus
  priority: TaskPriority
  dueDate?: any
  createdAt: any
  updatedAt: any
  
  // Recurrence fields - following TASK_SYSTEM_INTEGRATION.md patterns
  isRecurring?: boolean
  recurrenceType?: RecurrenceType
  recurrenceDay?: number | null
  parentTaskId?: any
  nextDueDate?: any
  
  // Assignment fields
  assigneeId?: any
  creatorId?: any
  assignee?: { id: any; email: string; firstName?: string | null; lastName?: string | null } | null
  creator?: { id: any; email: string; firstName?: string | null; lastName?: string | null } | null
  
  // Project context (from MyAssignedTasksQuery)
  project?: { id: any; name: string } | null
  
  // Parent-child relationships for recurring tasks
  parentTask?: { id: any; name: string } | null
  recurringInstances?: Array<{
    id: any
    name: string
    status: TaskStatus
    dueDate?: any
    createdAt: any
  }>
}

export type TaskStats = ProjectTaskStatsQuery['projectTaskStats']

// Use GraphQL generated enums directly for perfect type alignment
export const TASK_STATUS = TaskStatus
export const TASK_PRIORITY = TaskPriority
export const RECURRENCE_TYPE = RecurrenceType

// Task view modes - table only (following component reorganization)
export const TASK_VIEW_MODE = {
  TABLE: 'table'
} as const

export type TaskViewMode = typeof TASK_VIEW_MODE[keyof typeof TASK_VIEW_MODE]

/**
 * Enhanced Unified Task Management Composable
 * 
 * Combines functionality from useTasks.ts and useRecurringTasks.ts
 * Follows TASK_SYSTEM_INTEGRATION.md and FRONTEND_INTEGRATION.md patterns
 * 
 * Features:
 * - Task CRUD operations with Apollo integration
 * - Recurring task management and analytics
 * - Filtering, search, and view management
 * - Type-safe enum usage throughout
 * - Unified error handling and feedback
 * 
 * @param projectId - Optional project ID for project-specific tasks
 * @param taskId - Optional specific task ID for recurring instance queries
 */
export function useTasks(projectId?: string, taskId?: string) {
  const feedback = useApolloFeedback()
  
  // ========== LOCAL STATE ==========
  const viewMode = ref<TaskViewMode>(TASK_VIEW_MODE.TABLE)
  const selectedStatus = ref<TaskStatus | ''>('')
  const selectedPriority = ref<TaskPriority | ''>('')
  const selectedAssignee = ref<string>('')
  const searchQuery = ref('')

  // ========== QUERY VARIABLES ==========
  
  // My Tasks Query variables (no projectId needed)
  const myTasksVars = computed(() => ({
    status: selectedStatus.value || undefined,
    limit: 50,
    offset: 0
  }))

  // Project Tasks Query variables (projectId required)
  const projectTasksVars = computed(() => ({
    projectId: projectId!,
    status: selectedStatus.value || undefined,
    assigneeId: selectedAssignee.value || undefined,
    limit: 50,
    offset: 0
  }))

  // ========== QUERIES ==========
  
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
    computed(() => ({ projectId: projectId! })),
    { enabled: !!projectId }
  )

  // Recurring instances query for specific task
  const { result: instancesResult, loading: instancesLoading } = taskId 
    ? useTaskRecurringInstancesQuery(
        computed(() => ({ taskId, limit: 10 })),
        { enabled: computed(() => !!taskId) }
      )
    : { result: ref(null), loading: ref(false) }

  // ========== MUTATIONS ==========
  
  const { mutate: createTask, loading: createLoading, error: createError } = useCreateTaskMutation()
  const { mutate: updateTask, loading: updateLoading, error: updateError } = useUpdateTaskMutation()
  const { mutate: assignTask, loading: assignLoading, error: assignError } = useAssignTaskMutation()
  const { mutate: deleteTask, loading: deleteLoading, error: deleteError } = useDeleteTaskMutation()
  const { mutate: completeTaskWithRecurrence, loading: completeLoading, error: completeError } = useCompleteTaskWithRecurrenceMutation()

  // ========== COMPUTED PROPERTIES ==========
  
  // Unified tasks from either my tasks or project tasks
  const tasks = computed((): TaskWithPartialUser[] => {
    if (projectId) {
      return (projectTasksQuery.result.value?.projectTasks || []) as TaskWithPartialUser[]
    } else {
      return (myTasksQuery.result.value?.myAssignedTasks || []) as TaskWithPartialUser[]
    }
  })

  // Task statistics (only available for project context)
  const taskStats = computed((): TaskStats | null => {
    return projectStatsQuery.result.value?.projectTaskStats || null
  })

  // Recurring instances for specific task
  const recurringInstances = computed(() => 
    instancesResult.value?.task?.recurringInstances || []
  )

  const recurringInstancesCount = computed(() => 
    recurringInstances.value.length
  )

  // Combined loading state
  const loading = computed(() => {
    if (projectId) {
      return projectTasksQuery.loading.value || projectStatsQuery.loading.value
    } else {
      return myTasksQuery.loading.value
    }
  })

  // Combined error state
  const error = computed(() => {
    if (projectId) {
      return projectTasksQuery.error.value || projectStatsQuery.error.value
    } else {
      return myTasksQuery.error.value
    }
  })

  // Filtered tasks based on search and filters
  const filteredTasks = computed(() => {
    let filtered = tasks.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (selectedStatus.value) {
      filtered = filtered.filter(task => task.status === selectedStatus.value)
    }

    // Priority filter
    if (selectedPriority.value) {
      filtered = filtered.filter(task => task.priority === selectedPriority.value)
    }

    // Assignee filter (only for project context)
    if (selectedAssignee.value && projectId) {
      filtered = filtered.filter(task => task.assigneeId === selectedAssignee.value)
    }

    return filtered
  })

  // Task groupings for better organization
  const tasksByPriority = computed(() => {
    const groups: Record<TaskPriority, TaskWithPartialUser[]> = {
      [TaskPriority.Urgent]: [],
      [TaskPriority.High]: [],
      [TaskPriority.Medium]: [],
      [TaskPriority.Low]: []
    }

    filteredTasks.value.forEach(task => {
      groups[task.priority].push(task)
    })

    return groups
  })

  const overdueTasks = computed(() => {
    const now = new Date()
    return filteredTasks.value.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== TaskStatus.Completed
    )
  })

  const urgentTasks = computed(() => 
    filteredTasks.value.filter(task => task.priority === TaskPriority.Urgent)
  )

  // ========== RECURRING TASK HELPERS ==========
  
  /**
   * Get day name from day number (1-7 for weekly recurrence)
   */
  const getDayName = (day?: number | null): string => {
    if (!day) return 'Monday'
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[day] || 'Monday'
  }

  /**
   * Get ordinal suffix for day number (1st, 2nd, 3rd, etc.)
   */
  const getOrdinal = (day?: number | null): string => {
    if (!day) return '1st'
    if (day >= 11 && day <= 13) return `${day}th`
    switch (day % 10) {
      case 1: return `${day}st`
      case 2: return `${day}nd`
      case 3: return `${day}rd`
      default: return `${day}th`
    }
  }

  /**
   * Format recurrence description for display
   */
  const formatRecurrenceDescription = (type: RecurrenceType, day?: number | null): string => {
    switch (type) {
      case RecurrenceType.Daily:
        return 'Repeats every day'
      case RecurrenceType.Weekdays:
        return 'Repeats Monday through Friday'
      case RecurrenceType.Weekly:
        return `Repeats every ${getDayName(day)}`
      case RecurrenceType.Monthly:
        return `Repeats on the ${getOrdinal(day)} of each month`
      case RecurrenceType.None:
      default:
        return 'No recurrence'
    }
  }

  /**
   * Format recurrence type for display
   */
  const formatRecurrenceType = (type?: RecurrenceType): string => {
    switch (type) {
      case RecurrenceType.Daily:
        return 'Daily'
      case RecurrenceType.Weekdays:
        return 'Weekdays'
      case RecurrenceType.Weekly:
        return 'Weekly'
      case RecurrenceType.Monthly:
        return 'Monthly'
      default:
        return ''
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'No date'
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  /**
   * Check if task is a recurring task (parent)
   */
  const isRecurringTask = (task: any): boolean => {
    return task?.isRecurring === true
  }

  /**
   * Check if task is a recurring instance (child)
   */
  const isRecurringInstance = (task: any): boolean => {
    return !!task?.parentTaskId
  }

  /**
   * Get SVG icon path for recurrence type
   */
  const getRecurrenceIcon = (type?: RecurrenceType): string => {
    switch (type) {
      case RecurrenceType.Daily:
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      case RecurrenceType.Weekly:
        return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      case RecurrenceType.Monthly:
        return 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      default:
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    }
  }

  /**
   * Get upcoming recurring task instances
   */
  const getUpcomingInstances = (tasks: Task[]): Array<{
    taskId: string
    name: string
    dueDate: Date
    recurrenceType: RecurrenceType
  }> => {
    return tasks
      .filter(task => task.isRecurring && task.nextDueDate)
      .map(task => ({
        taskId: task.id,
        name: task.name,
        dueDate: new Date(task.nextDueDate!),
        recurrenceType: task.recurrenceType
      }))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  /**
   * Calculate recurring task analytics
   */
  const getRecurringAnalytics = (tasks: Task[]): RecurringTaskAnalytics => {
    const recurringTasks = tasks.filter(task => task.isRecurring)
    const instances = tasks.filter(task => task.parentTaskId)
    
    const completedInstances = instances.filter(task => task.status === TaskStatus.Completed)
    const completionRate = instances.length > 0 
      ? Math.round((completedInstances.length / instances.length) * 100)
      : 0

    // Get instances created this month
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyInstances = instances.filter(task => 
      new Date(task.createdAt) >= monthStart
    ).length

    // Pattern distribution
    const patternDistribution: Record<string, number> = {}
    recurringTasks.forEach(task => {
      const type = task.recurrenceType
      patternDistribution[type] = (patternDistribution[type] || 0) + 1
    })

    return {
      activeRecurring: recurringTasks.length,
      completionRate,
      monthlyInstances,
      patternDistribution,
      upcomingInstances: getUpcomingInstances(recurringTasks)
    }
  }

  /**
   * Validate recurrence data for task creation/editing
   */
  const validateRecurrenceData = (type: RecurrenceType, day?: number | null): boolean => {
    switch (type) {
      case RecurrenceType.Weekly:
        return day !== null && day !== undefined && day >= 1 && day <= 7
      case RecurrenceType.Monthly:
        return day !== null && day !== undefined && day >= 1 && day <= 31
      case RecurrenceType.Daily:
      case RecurrenceType.Weekdays:
      case RecurrenceType.None:
        return true
      default:
        return false
    }
  }

  // ========== DISPLAY HELPERS ==========
  
  /**
   * Get display name for task status
   */
  const getStatusDisplayName = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Todo:
        return 'To Do'
      case TaskStatus.InProgress:
        return 'In Progress'
      case TaskStatus.Completed:
        return 'Completed'
      case TaskStatus.Cancelled:
        return 'Cancelled'
      default:
        return status
    }
  }

  /**
   * Get display name for task priority
   */
  const getPriorityDisplayName = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low:
        return 'Low'
      case TaskPriority.Medium:
        return 'Medium'
      case TaskPriority.High:
        return 'High'
      case TaskPriority.Urgent:
        return 'Urgent'
      default:
        return priority
    }
  }

  /**
   * Get color class for task priority
   */
  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low:
        return 'text-green-600 bg-green-50'
      case TaskPriority.Medium:
        return 'text-blue-600 bg-blue-50'
      case TaskPriority.High:
        return 'text-orange-600 bg-orange-50'
      case TaskPriority.Urgent:
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  /**
   * Get color class for task status
   */
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Todo:
        return 'text-gray-600 bg-gray-50'
      case TaskStatus.InProgress:
        return 'text-blue-600 bg-blue-50'
      case TaskStatus.Completed:
        return 'text-green-600 bg-green-50'
      case TaskStatus.Cancelled:
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // ========== ACTION FUNCTIONS ==========
  
  /**
   * Create a new task with feedback integration
   */
  const createNewTask = async (input: CreateTaskInput) => {
    return feedback.handleMutation(createLoading, createError, async () => {
      const result = await createTask({ input })
      
      // Refetch relevant queries
      if (projectId) {
        await projectTasksQuery.refetch()
        await projectStatsQuery.refetch()
      } else {
        await myTasksQuery.refetch()
      }
      
      return result
    }, {
      successTitle: 'Task Created',
      successMessage: `"${input.name}" has been created successfully`,
      errorTitle: 'Failed to Create Task'
    })
  }

  /**
   * Update an existing task with feedback integration
   */
  const updateExistingTask = async (taskId: string, input: UpdateTaskInput) => {
    return feedback.handleMutation(updateLoading, updateError, async () => {
      const result = await updateTask({ input: { ...input, taskId } })
      
      // Refetch relevant queries
      if (projectId) {
        await projectTasksQuery.refetch()
        await projectStatsQuery.refetch()
      } else {
        await myTasksQuery.refetch()
      }
      
      return result
    }, {
      successTitle: 'Task Updated',
      successMessage: 'Task has been updated successfully',
      errorTitle: 'Failed to Update Task'
    })
  }

  /**
   * Assign task to user with feedback integration
   */
  const assignTaskToUser = async (taskId: string, assigneeId: string) => {
    return feedback.handleMutation(assignLoading, assignError, async () => {
      const result = await assignTask({ input: { taskId, assigneeId } })
      
      // Refetch relevant queries
      if (projectId) {
        await projectTasksQuery.refetch()
      } else {
        await myTasksQuery.refetch()
      }
      
      return result
    }, {
      successTitle: 'Task Assigned',
      successMessage: 'Task has been assigned successfully',
      errorTitle: 'Failed to Assign Task'
    })
  }

  /**
   * Complete a task with automatic recurrence handling
   * Follows TASK_SYSTEM_INTEGRATION.md patterns for recurring tasks
   */
  const completeTask = async (taskId: string) => {
    return feedback.handleMutation(completeLoading, completeError, async () => {
      const result = await completeTaskWithRecurrence({ taskId })
      
      // Refetch relevant queries to show updated data
      if (projectId) {
        await projectTasksQuery.refetch()
        await projectStatsQuery.refetch()
      } else {
        await myTasksQuery.refetch()
      }
      
      // If taskId is provided, refetch instances as well
      if (taskId && instancesResult.value) {
        // The recurring instances query will automatically update
      }
      
      return result
    }, {
      successTitle: 'Task Completed',
      successMessage: 'Task completed successfully',
      errorTitle: 'Failed to Complete Task'
    })
  }

  /**
   * Delete a task with feedback integration
   */
  const removeTask = async (taskId: string) => {
    return feedback.handleMutation(deleteLoading, deleteError, async () => {
      const result = await deleteTask({ taskId })
      
      // Refetch relevant queries
      if (projectId) {
        await projectTasksQuery.refetch()
        await projectStatsQuery.refetch()
      } else {
        await myTasksQuery.refetch()
      }
      
      return result
    }, {
      successTitle: 'Task Deleted',
      successMessage: 'Task has been deleted successfully',
      errorTitle: 'Failed to Delete Task'
    })
  }

  /**
   * Manually refetch tasks and stats
   */
  const refetchTasks = async () => {
    if (projectId) {
      await Promise.all([
        projectTasksQuery.refetch(),
        projectStatsQuery.refetch()
      ])
    } else {
      await myTasksQuery.refetch()
    }
  }

  // ========== FILTER CONTROLS ==========
  
  /**
   * Set view mode (currently only table supported)
   */
  const setViewMode = (mode: TaskViewMode) => {
    viewMode.value = mode
  }

  /**
   * Set status filter using type-safe enum
   */
  const setStatusFilter = (status: TaskStatus | '') => {
    selectedStatus.value = status
  }

  /**
   * Set priority filter using type-safe enum
   */
  const setPriorityFilter = (priority: TaskPriority | '') => {
    selectedPriority.value = priority
  }

  /**
   * Set assignee filter
   */
  const setAssigneeFilter = (assigneeId: string) => {
    selectedAssignee.value = assigneeId
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    selectedStatus.value = ''
    selectedPriority.value = ''
    selectedAssignee.value = ''
    searchQuery.value = ''
  }

  // ========== RETURN UNIFIED API ==========
  
  return {
    // ========== CORE DATA ==========
    tasks,
    taskStats,
    loading,
    error,
    filteredTasks,

    // ========== RECURRING TASKS ==========
    recurringInstances,
    recurringInstancesCount,
    instancesLoading,

    // ========== SEARCH & FILTERS ==========
    searchQuery,
    selectedStatus,
    selectedPriority,
    selectedAssignee,

    // ========== TASK GROUPINGS ==========
    tasksByPriority,
    overdueTasks,
    urgentTasks,

    // ========== TASK ACTIONS ==========
    createNewTask,
    updateExistingTask,
    assignTaskToUser,
    completeTask,
    removeTask,
    refetchTasks,

    // ========== RECURRING TASK HELPERS ==========
    formatRecurrenceDescription,
    formatRecurrenceType,
    formatDate,
    isRecurringTask,
    isRecurringInstance,
    getRecurrenceIcon,
    getUpcomingInstances,
    getRecurringAnalytics,
    validateRecurrenceData,
    getDayName,
    getOrdinal,

    // ========== DISPLAY HELPERS ==========
    getStatusDisplayName,
    getPriorityDisplayName,
    getPriorityColor,
    getStatusColor,

    // ========== VIEW CONTROLS ==========
    viewMode,
    setViewMode,

    // ========== FILTER CONTROLS ==========
    setStatusFilter,
    setPriorityFilter,
    setAssigneeFilter,
    clearFilters,

    // ========== LOADING STATES ==========
    createLoading,
    updateLoading,
    assignLoading,
    completeLoading,
    deleteLoading,

    // ========== ENUMS & CONSTANTS ==========
    TASK_STATUS,
    TASK_PRIORITY,
    RECURRENCE_TYPE,
    TASK_VIEW_MODE
  }
}
