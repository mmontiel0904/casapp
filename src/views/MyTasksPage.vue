<template>
  <div class="max-w-7xl mx-auto p-4 space-y-6">
    <!-- Integrated Task Toolbar -->
    <TaskToolbar
      title="My Tasks"
      :total-count="tasks.length"
      :overdue-count="overdueTasks.length"
      :urgent-count="urgentTasks.length"
      :loading="loading"
      :can-create-tasks="canCreateTasks"
      :active-filters="{ myTasks: false, overdue: false }"
      @add-task="showInlineCreator = !showInlineCreator"
      @refresh="refetchTasks"
      @export="handleExport"
      @search="searchQuery = $event"
      @status-filter="setStatusFilter"
      @priority-filter="setPriorityFilter"
      @quick-filter="handleQuickFilter"
      @clear-filters="clearFilters"
    />

      <!-- Task Views -->
      <div class="transition-all duration-200">
        <!-- Table View Only -->
        <TaskTableView
          :tasks="tasks"
          :loading="loading"
          :complete-loading="completeLoading"
          :selected-task="selectedTask"
          :show-project="true"
          :show-inline-creator="showInlineCreator"
          context="myTasks"
          @select="handleTaskSelect"
          @view-details="handleTaskViewDetails"
          @edit="handleTaskEdit"
          @assign="handleTaskAssign"
          @delete="handleTaskDelete"
          @mark-complete="handleTaskMarkComplete"
          @task-created="handleInlineTaskCreated"
          @cancel-inline-creator="showInlineCreator = false"
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

      <!-- Task Creation Modal -->
      <TaskCreateModal 
        :is-open="showCreateModal"
        @close="showCreateModal = false"
        @task-created="handleTaskCreated"
      />

      <!-- Task Edit Panel -->
      <TaskEditPanel
        :is-open="showTaskEditPanel"
        :task="selectedTaskForEdit"
        :show-project="true"
        @close="handleTaskEditClose"
        @saved="handleTaskEditSaved"
        @deleted="handleTaskEditDeleted"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasks, type TaskItem } from '../composables/useTasks'
import { usePermissions } from '../composables/usePermissions'
import TaskTableView from '../components/tasks/TaskTableView.vue'
import TaskCreateModal from '../components/modals/TaskCreateModal.vue'
import TaskToolbar from '../components/tasks/TaskToolbar.vue'
import TaskEditPanel from '../components/tasks/TaskEditPanel.vue'

// Initialize task management for "My Tasks" (no projectId)
const {
  tasks,
  loading,
  error,
  searchQuery,
  overdueTasks,
  urgentTasks,
  setStatusFilter,
  setPriorityFilter,
  clearFilters,
  refetchTasks,
  removeTask,
  completeTask,
  completeLoading
} = useTasks() // No projectId = standalone "My Tasks" view

// Permissions
const { canCreateTasks } = usePermissions()

// Local state
const selectedTask = ref<TaskItem | null>(null)
const selectedTaskForEdit = ref<TaskItem | null>(null)
const showCreateModal = ref(false)
const showInlineCreator = ref(false)
const showTaskEditPanel = ref(false)

// Event handlers
const handleTaskSelect = (task: TaskItem) => {
  selectedTask.value = selectedTask.value?.id === task.id ? null : task
}

const handleTaskViewDetails = (task: TaskItem) => {
  // Primary action - open detail view (same as edit for now, but can be different)
  selectedTaskForEdit.value = task
  showTaskEditPanel.value = true
  selectedTask.value = task // Also select the task for visual feedback
}

const handleTaskEdit = (task: TaskItem) => {
  selectedTaskForEdit.value = task
  showTaskEditPanel.value = true
}

const handleTaskMarkComplete = async (task: TaskItem) => {
  try {
    // Use the unified completeTask composable which handles recurrence automatically
    // The completeLoading state provides UI feedback automatically
    await completeTask(task.id)
  } catch (error) {
    console.error('Failed to mark task complete:', error)
  }
}

const handleTaskAssign = (task: TaskItem) => {
  // TODO: Open task assignment modal
  console.log('Assign task:', task.id)
}

const handleTaskDelete = async (task: TaskItem) => {
  if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
    await removeTask(task.id)
  }
}

const handleTaskCreated = async (task: any) => {
  // Task creation success is handled by the useTasks composable
  // The modal will close automatically and show success feedback
  console.log('Task created successfully:', task.name)
  await refetchTasks()
}

const handleInlineTaskCreated = async (task: any) => {
  // Inline task creation success
  console.log('Inline task created successfully:', task.name)
  showInlineCreator.value = false
  await refetchTasks()
}

const handleExport = () => {
  // TODO: Implement export functionality
  console.log('Export tasks requested')
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

const handleTaskEditClose = () => {
  showTaskEditPanel.value = false
  selectedTaskForEdit.value = null
}

const handleTaskEditSaved = async (updatedTask: any) => {
  console.log('Task saved successfully:', updatedTask)
  await refetchTasks()
  showTaskEditPanel.value = false
  selectedTaskForEdit.value = null
}

const handleTaskEditDeleted = async (taskId: string) => {
  console.log('Task deleted successfully:', taskId)
  await refetchTasks()
  showTaskEditPanel.value = false
  selectedTaskForEdit.value = null
}

// Initialize
onMounted(() => {
  // Tasks are automatically loaded by the composable
})
</script>