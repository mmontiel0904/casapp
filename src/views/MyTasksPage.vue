<template>
  <div class="max-w-7xl mx-auto p-4">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-base-content font-serif mb-2">My Tasks</h1>
            <p class="text-base-content/70 font-sans">Track and manage your assigned tasks across all projects</p>
          </div>
          
          <!-- Quick Stats -->
          <div class="stats stats-horizontal bg-base-100 shadow-sm">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="stat-title font-sans">Total Tasks</div>
              <div class="stat-value font-mono">{{ tasks.length }}</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-title font-sans">Overdue</div>
              <div class="stat-value font-mono text-error">{{ overdueTasks.length }}</div>
            </div>
            
            <div class="stat">
              <div class="stat-figure text-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="stat-title font-sans">Urgent</div>
              <div class="stat-value font-mono text-warning">{{ urgentTasks.length }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and View Toggle -->
      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <div class="flex-1">
          <TaskFilters
            @search="searchQuery = $event"
            @statusFilter="setStatusFilter"
            @priorityFilter="setPriorityFilter"
            @assigneeFilter="setAssigneeFilter"
            @quickFilter="handleQuickFilter"
            @clearFilters="clearFilters"
          />
        </div>
        
        <div class="flex-shrink-0">
          <TaskViewToggle
            :view-mode="viewMode"
            @toggle="setViewMode"
          />
        </div>
      </div>

      <!-- Task Views -->
      <div class="transition-all duration-200">
        <!-- Table View -->
        <TaskTableView
          v-if="viewMode === 'table'"
          :tasks="tasks"
          :loading="loading"
          :selected-task="selectedTask"
          :show-project="true"
          @select="handleTaskSelect"
          @edit="handleTaskEdit"
          @assign="handleTaskAssign"
          @delete="handleTaskDelete"
        />
        
        <!-- Kanban View -->
        <TaskKanbanView
          v-else
          :tasks="tasks"
          :loading="loading"
          :selected-task="selectedTask"
          :show-project="true"
          @select="handleTaskSelect"
          @edit="handleTaskEdit"
          @assign="handleTaskAssign"
          @delete="handleTaskDelete"
          @create-task="handleCreateTask"
        />
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" class="alert alert-error mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-sans">Failed to load tasks. Please try again.</span>
        <button @click="refetchTasks" class="btn btn-sm btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasks, type TaskWithPartialUser } from '../composables/useTasks'
import TaskFilters from '../components/TaskFilters.vue'
import TaskViewToggle from '../components/TaskViewToggle.vue'
import TaskTableView from '../components/TaskTableView.vue'
import TaskKanbanView from '../components/TaskKanbanView.vue'

// Initialize task management for "My Tasks" (no projectId)
const {
  tasks,
  loading,
  error,
  viewMode,
  searchQuery,
  overdueTasks,
  urgentTasks,
  setViewMode,
  setStatusFilter,
  setPriorityFilter,
  setAssigneeFilter,
  clearFilters,
  refetchTasks,
  removeTask
} = useTasks() // No projectId = standalone "My Tasks" view

// Local state
const selectedTask = ref<TaskWithPartialUser | null>(null)

// Event handlers
const handleTaskSelect = (task: TaskWithPartialUser) => {
  selectedTask.value = selectedTask.value?.id === task.id ? null : task
}

const handleTaskEdit = (task: TaskWithPartialUser) => {
  // TODO: Open task edit modal
  console.log('Edit task:', task.id)
}

const handleTaskAssign = (task: TaskWithPartialUser) => {
  // TODO: Open task assignment modal
  console.log('Assign task:', task.id)
}

const handleTaskDelete = async (task: TaskWithPartialUser) => {
  if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
    await removeTask(task.id)
  }
}

const handleCreateTask = (status: string) => {
  // TODO: Open create task modal with pre-selected status
  console.log('Create task with status:', status)
}

const handleQuickFilter = (filterType: string, active: boolean) => {
  if (filterType === 'overdue') {
    // TODO: Implement overdue filter logic
    console.log('Overdue filter:', active)
  } else if (filterType === 'myTasks') {
    // This is already "My Tasks" view, so this filter is always active
    console.log('My tasks filter:', active)
  }
}

// Initialize
onMounted(() => {
  // Tasks are automatically loaded by the composable
})
</script>