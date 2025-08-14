<template>
  <div>
    <!-- Mobile Card Layout -->
    <div class="block md:hidden space-y-3">
      <!-- Mobile Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="flex items-center gap-2">
          <span class="loading loading-spinner loading-sm"></span>
          <span class="text-base-content/70">Loading tasks...</span>
        </div>
      </div>
      
      <!-- Mobile Empty State -->
      <div v-else-if="tasks.length === 0" class="text-center py-8">
        <div class="flex flex-col items-center gap-2 text-base-content/60">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div class="text-lg font-medium">No tasks found</div>
          <div class="text-sm">Create your first task to get started</div>
        </div>
      </div>
      
      <!-- Mobile Task Cards -->
      <div v-else class="space-y-3">
        <!-- Inline Task Creator for Mobile -->
        <div v-if="showInlineCreator" class="card bg-base-100 border-2 border-dashed border-primary/30">
          <div class="card-body p-4">
            <InlineTaskCreator
              :show-project="showProject"
              :preselected-project-id="preselectedProjectId"
              @task-created="handleTaskCreated"
              @cancel="emit('cancelInlineCreator')"
            />
          </div>
        </div>
        
        <!-- Task Cards -->
        <TaskMobileCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :is-selected="selectedTask?.id === task.id"
          :show-project="showProject"
          :context="context"
          @view-details="emit('viewDetails', $event)"
          @edit="emit('edit', $event)"
          @mark-complete="emit('markComplete', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>

    <!-- Desktop Table Layout -->
    <div class="hidden md:block overflow-x-auto">
      <table class="table w-full font-sans">
        <!-- Table Header -->
        <thead>
          <tr class="bg-base-200/50 border-b border-base-300">
            <th class="font-semibold text-sm text-base-content/80 py-4">Task</th>
            <th class="font-semibold text-sm text-base-content/80 py-4">Status</th>
            <th class="font-semibold text-sm text-base-content/80 py-4">Priority</th>
            <th v-if="context === 'projectTasks'" class="font-semibold text-sm text-base-content/80 py-4">Assignee</th>
            <th v-if="context === 'myTasks'" class="font-semibold text-sm text-base-content/80 py-4">Created By</th>
            <th v-if="showProject" class="font-semibold text-sm text-base-content/80 py-4">Project</th>
            <th class="font-semibold text-sm text-base-content/80 py-4">Due Date</th>
            <th class="font-semibold text-sm text-base-content/80 py-4 text-right">Actions</th>
          </tr>
        </thead>
        
        <!-- Table Body -->
        <tbody>
          <!-- Inline Task Creator -->
          <InlineTaskCreator
            v-if="showInlineCreator"
            :show-project="showProject"
            :preselected-project-id="preselectedProjectId"
            @task-created="handleTaskCreated"
            @cancel="emit('cancelInlineCreator')"
          />
          
          <!-- Loading State -->
          <tr v-if="loading" class="hover">
            <td :colspan="getColumnCount" class="text-center py-8">
              <div class="flex items-center justify-center gap-2">
                <span class="loading loading-spinner loading-sm"></span>
                <span class="text-base-content/70">Loading tasks...</span>
              </div>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-else-if="tasks.length === 0" class="hover">
            <td :colspan="getColumnCount" class="text-center py-8">
              <div class="flex flex-col items-center gap-2 text-base-content/60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div class="text-lg font-medium">No tasks found</div>
                <div class="text-sm">Create your first task to get started</div>
              </div>
            </td>
          </tr>
          
          <!-- Task Rows -->
          <TaskTableRow
            v-else
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            :is-selected="selectedTask?.id === task.id"
            :show-project="showProject"
            :context="context"
            @view-details="emit('viewDetails', $event)"
            @edit="emit('edit', $event)"
            @mark-complete="emit('markComplete', $event)"
            @delete="emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskWithPartialUser } from '../../composables/useTasks'
import TaskMobileCard from './TaskMobileCard.vue'
import TaskTableRow from './TaskTableRow.vue'
import InlineTaskCreator from './InlineTaskCreator.vue'

interface Props {
  tasks: TaskWithPartialUser[]
  loading?: boolean
  selectedTask?: TaskWithPartialUser | null
  showProject?: boolean
  showInlineCreator?: boolean
  preselectedProjectId?: string
  context?: 'myTasks' | 'projectTasks'
}

interface Emits {
  (e: 'select', task: TaskWithPartialUser): void
  (e: 'viewDetails', task: TaskWithPartialUser): void
  (e: 'edit', task: TaskWithPartialUser): void
  (e: 'assign', task: TaskWithPartialUser): void
  (e: 'delete', task: TaskWithPartialUser): void
  (e: 'markComplete', task: TaskWithPartialUser): void
  (e: 'taskCreated', task: any): void
  (e: 'cancelInlineCreator'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showProject: false,
  showInlineCreator: false,
  preselectedProjectId: '',
  context: 'projectTasks'
})

const emit = defineEmits<Emits>()

// Computed properties
const getColumnCount = computed(() => {
  let count = 6 // Task, Status, Priority, Due Date, Actions + context-specific column
  if (props.showProject) count += 1
  return count
})

// Event handlers
const handleTaskCreated = (task: any) => {
  emit('taskCreated', task)
}
</script>