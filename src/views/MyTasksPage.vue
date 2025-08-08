<template>
  <div class="max-w-7xl mx-auto p-4 space-y-6">
    <!-- Integrated Task Toolbar -->
    <TaskToolbar
      title="My Tasks"
      :total-count="tasks.length"
      :overdue-count="overdueTasks.length"
      :urgent-count="urgentTasks.length"
      :view-mode="viewMode"
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
      @view-mode="setViewMode"
    />

      <!-- Task Views -->
      <div class="transition-all duration-200">
        <!-- Table View -->
        <TaskTableView
          v-if="viewMode === 'table'"
          :tasks="tasks"
          :loading="loading"
          :selected-task="selectedTask"
          :show-project="true"
          :show-inline-creator="showInlineCreator"
          context="myTasks"
          @select="handleTaskSelect"
          @edit="handleTaskEdit"
          @assign="handleTaskAssign"
          @delete="handleTaskDelete"
          @task-created="handleInlineTaskCreated"
          @cancel-inline-creator="showInlineCreator = false"
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
import { useTasks, type TaskWithPartialUser } from '../composables/useTasks'
import { usePermissions } from '../composables/usePermissions'
import TaskTableView from '../components/TaskTableView.vue'
import TaskKanbanView from '../components/TaskKanbanView.vue'
import TaskCreateModal from '../components/TaskCreateModal.vue'
import TaskToolbar from '../components/TaskToolbar.vue'
import TaskEditPanel from '../components/TaskEditPanel.vue'

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
  clearFilters,
  refetchTasks,
  removeTask
} = useTasks() // No projectId = standalone "My Tasks" view

// Permissions
const { canCreateTasks } = usePermissions()

// Local state
const selectedTask = ref<TaskWithPartialUser | null>(null)
const selectedTaskForEdit = ref<TaskWithPartialUser | null>(null)
const showCreateModal = ref(false)
const showInlineCreator = ref(false)
const showTaskEditPanel = ref(false)

// Event handlers
const handleTaskSelect = (task: TaskWithPartialUser) => {
  selectedTask.value = selectedTask.value?.id === task.id ? null : task
}

const handleTaskEdit = (task: TaskWithPartialUser) => {
  selectedTaskForEdit.value = task
  showTaskEditPanel.value = true
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
  // Open create task modal with pre-selected status from Kanban column
  console.log('Opening task creation modal with status:', status)
  showCreateModal.value = true
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