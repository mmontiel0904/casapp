<template>
  <div class="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center w-full">
      <div class="flex items-center gap-2">
        <span class="loading loading-spinner loading-lg"></span>
        <span class="text-lg text-base-content/70 font-sans">Loading tasks...</span>
      </div>
    </div>
    
    <!-- Kanban Columns -->
    <div v-else class="flex gap-6 min-w-full">
      <!-- To Do Column -->
      <div class="flex-1 min-w-80">
        <div class="card bg-base-100 shadow-lg border border-base-300 rounded-lg h-full">
          <div class="card-body p-4">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="badge badge-ghost badge-lg font-sans">
                  To Do
                </div>
                <div class="badge badge-neutral badge-sm">
                  {{ tasksByStatus.todo.length }}
                </div>
              </div>
              <button 
                @click="$emit('createTask', 'todo')"
                class="btn btn-ghost btn-xs btn-circle"
                title="Add new task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <!-- Tasks -->
            <div class="space-y-3 overflow-y-auto max-h-96">
              <div v-if="tasksByStatus.todo.length === 0" class="text-center py-8 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div class="text-sm font-sans">No tasks to do</div>
              </div>
              
              <TaskCard
                v-for="task in tasksByStatus.todo"
                :key="task.id"
                :task="task"
                :selected="selectedTask?.id === task.id"
                :show-project="showProject"
                @select="$emit('select', task)"
                @edit="$emit('edit', task)"
                @assign="$emit('assign', task)"
                @delete="$emit('delete', task)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- In Progress Column -->
      <div class="flex-1 min-w-80">
        <div class="card bg-base-100 shadow-lg border border-base-300 rounded-lg h-full">
          <div class="card-body p-4">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="badge badge-warning badge-lg font-sans">
                  In Progress
                </div>
                <div class="badge badge-neutral badge-sm">
                  {{ tasksByStatus.in_progress.length }}
                </div>
              </div>
              <button 
                @click="$emit('createTask', 'in_progress')"
                class="btn btn-ghost btn-xs btn-circle"
                title="Add new task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <!-- Tasks -->
            <div class="space-y-3 overflow-y-auto max-h-96">
              <div v-if="tasksByStatus.in_progress.length === 0" class="text-center py-8 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div class="text-sm font-sans">No tasks in progress</div>
              </div>
              
              <TaskCard
                v-for="task in tasksByStatus.in_progress"
                :key="task.id"
                :task="task"
                :selected="selectedTask?.id === task.id"
                :show-project="showProject"
                @select="$emit('select', task)"
                @edit="$emit('edit', task)"
                @assign="$emit('assign', task)"
                @delete="$emit('delete', task)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Completed Column -->
      <div class="flex-1 min-w-80">
        <div class="card bg-base-100 shadow-lg border border-base-300 rounded-lg h-full">
          <div class="card-body p-4">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="badge badge-success badge-lg font-sans">
                  Completed
                </div>
                <div class="badge badge-neutral badge-sm">
                  {{ tasksByStatus.completed.length }}
                </div>
              </div>
              <button 
                @click="$emit('createTask', 'completed')"
                class="btn btn-ghost btn-xs btn-circle"
                title="Add new task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <!-- Tasks -->
            <div class="space-y-3 overflow-y-auto max-h-96">
              <div v-if="tasksByStatus.completed.length === 0" class="text-center py-8 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <div class="text-sm font-sans">No completed tasks</div>
              </div>
              
              <TaskCard
                v-for="task in tasksByStatus.completed"
                :key="task.id"
                :task="task"
                :selected="selectedTask?.id === task.id"
                :show-project="showProject"
                @select="$emit('select', task)"
                @edit="$emit('edit', task)"
                @assign="$emit('assign', task)"
                @delete="$emit('delete', task)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cancelled Column -->
      <div class="flex-1 min-w-80">
        <div class="card bg-base-100 shadow-lg border border-base-300 rounded-lg h-full">
          <div class="card-body p-4">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="badge badge-error badge-lg font-sans">
                  Cancelled
                </div>
                <div class="badge badge-neutral badge-sm">
                  {{ tasksByStatus.cancelled.length }}
                </div>
              </div>
              <button 
                @click="$emit('createTask', 'cancelled')"
                class="btn btn-ghost btn-xs btn-circle"
                title="Add new task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <!-- Tasks -->
            <div class="space-y-3 overflow-y-auto max-h-96">
              <div v-if="tasksByStatus.cancelled.length === 0" class="text-center py-8 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div class="text-sm font-sans">No cancelled tasks</div>
              </div>
              
              <TaskCard
                v-for="task in tasksByStatus.cancelled"
                :key="task.id"
                :task="task"
                :selected="selectedTask?.id === task.id"
                :show-project="showProject"
                @select="$emit('select', task)"
                @edit="$emit('edit', task)"
                @assign="$emit('assign', task)"
                @delete="$emit('delete', task)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import type { TaskWithPartialUser } from '../composables/useTasks'

interface Props {
  tasks: TaskWithPartialUser[]
  loading?: boolean
  selectedTask?: TaskWithPartialUser | null
  showProject?: boolean
}

interface Emits {
  (e: 'select', task: TaskWithPartialUser): void
  (e: 'edit', task: TaskWithPartialUser): void
  (e: 'assign', task: TaskWithPartialUser): void
  (e: 'delete', task: TaskWithPartialUser): void
  (e: 'createTask', status: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showProject: false
})

defineEmits<Emits>()

// Group tasks by status for Kanban columns
const tasksByStatus = computed(() => {
  const grouped = {
    todo: [] as TaskWithPartialUser[],
    in_progress: [] as TaskWithPartialUser[],
    completed: [] as TaskWithPartialUser[],
    cancelled: [] as TaskWithPartialUser[]
  }

  props.tasks.forEach(task => {
    const status = task.status as keyof typeof grouped
    if (grouped[status]) {
      grouped[status].push(task)
    }
  })

  return grouped
})
</script>

<style scoped>
/* Custom scrollbar for task columns */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.3);
}
</style>