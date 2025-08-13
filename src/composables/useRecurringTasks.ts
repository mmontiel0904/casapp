import { computed, ref } from 'vue'
import { RecurrenceType, useTaskRecurringInstancesQuery, type Task } from '../generated/graphql'

export interface RecurrenceForm {
  recurrenceType: RecurrenceType
  recurrenceDay?: number | null
  isRecurring: boolean
}

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

export function useRecurringTasks(taskId?: string) {
  // Query for recurring instances if taskId is provided
  const { result: instancesResult, loading: instancesLoading } = taskId 
    ? useTaskRecurringInstancesQuery(
        computed(() => ({ taskId, limit: 10 })),
        { enabled: computed(() => !!taskId) }
      )
    : { result: ref(null), loading: ref(false) }

  const recurringInstances = computed(() => 
    instancesResult.value?.task?.recurringInstances || []
  )

  const recurringInstancesCount = computed(() => 
    recurringInstances.value.length
  )

  // Helper functions
  const getDayName = (day?: number | null): string => {
    if (!day) return 'Monday'
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days[day] || 'Monday'
  }

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

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'No date'
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const isRecurringTask = (task: any): boolean => {
    return task?.isRecurring === true
  }

  const isRecurringInstance = (task: any): boolean => {
    return !!task?.parentTaskId
  }

  const getRecurrenceIcon = (type?: RecurrenceType): string => {
    // Return SVG path or icon class based on recurrence type
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

  const getRecurringAnalytics = (tasks: Task[]): RecurringTaskAnalytics => {
    const recurringTasks = tasks.filter(task => task.isRecurring)
    const instances = tasks.filter(task => task.parentTaskId)
    
    const completedInstances = instances.filter(task => task.status === 'COMPLETED')
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

  return {
    // Data
    recurringInstances,
    recurringInstancesCount,
    instancesLoading,
    
    // Helpers
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
    getOrdinal
  }
}