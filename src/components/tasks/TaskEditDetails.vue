<template>
  <div class="p-6 space-y-6">
    <!-- Status and Priority Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Status Selection -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-sans font-semibold text-base">Status</span>
        </label>
        <select 
          v-model="form.status"
          class="select select-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200"
          @change="$emit('field-change', 'status', form.status)"
        >
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Priority Selection -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-sans font-semibold text-base">Priority</span>
        </label>
        <select 
          v-model="form.priority"
          class="select select-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200"
          @change="$emit('field-change', 'priority', form.priority)"
        >
          <option v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
            {{ priority.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Description -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-sans font-semibold text-base">Description</span>
        <span class="label-text-alt text-base-content/60">{{ form.description?.length || 0 }}/1000</span>
      </label>
      <textarea 
        v-model="form.description"
        class="textarea textarea-ghost bg-base-50 focus:bg-base-100 hover:bg-base-100 transition-all duration-200 resize-none"
        placeholder="Describe the task in detail..."
        rows="4"
        maxlength="1000"
        @input="$emit('field-change', 'description', form.description)"
      ></textarea>
    </div>

    <!-- Quick Status Actions -->
    <div v-if="showQuickActions" class="bg-base-50/50 rounded-xl p-4">
      <h4 class="text-lg font-sans font-semibold mb-4 text-base-content">Quick Actions</h4>
      <div class="flex flex-wrap gap-3">
          <!-- Mark Complete Button -->
          <button 
            v-if="form.status !== TaskStatus.Completed"
            @click="handleMarkComplete"
            class="btn btn-success btn-sm gap-2"
            :disabled="isCompleting"
          >
            <div v-if="isCompleting" class="loading loading-spinner loading-xs"></div>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ isCompleting ? 'Completing...' : 'Mark Complete' }}
          </button>

          <!-- Reopen Button -->
          <button 
            v-if="form.status === TaskStatus.Completed"
            @click="handleReopen"
            class="btn btn-warning btn-sm gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reopen Task
          </button>

          <!-- Priority Quick Set -->
          <div class="dropdown dropdown-top">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-2 bg-base-100 hover:bg-base-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-1 6v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m0 0V8a2 2 0 012-2h6a2 2 0 012 2v2"></path>
              </svg>
              Set Priority
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-xl z-[1] w-52 p-3 shadow-lg">
              <li v-for="priority in priorityOptions" :key="priority.value">
                <a @click="handlePriorityChange(priority.value)" 
                   class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                   :class="{ 'bg-primary/10 text-primary': form.priority === priority.value }">
                  <Chip :variant="getPriorityVariant(priority.value)" size="sm">
                    {{ priority.label }}
                  </Chip>
                </a>
              </li>
            </ul>
          </div>
        </div>
    </div>

    <!-- Completion Success Message -->
    <div v-if="showCompletionMessage" class="alert alert-success">
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <div class="font-semibold">Task Completed!</div>
        <div class="text-sm">{{ completionMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { TaskStatus, TaskPriority } from '../../generated/graphql'
import { type TaskItem } from '../../composables/useTasks'
import Chip from '../ui/Chip.vue'

interface Props {
  task?: TaskItem | null
  showQuickActions?: boolean
  isCompleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showQuickActions: true,
  isCompleting: false
})

const emit = defineEmits<{
  'field-change': [field: string, value: any]
  'mark-complete': []
  'reopen-task': []
}>()

// Form state
const form = reactive({
  status: TaskStatus.Todo,
  priority: TaskPriority.Medium,
  description: ''
})

// Completion feedback
const showCompletionMessage = ref(false)
const completionMessage = ref('')

// Watch for task changes to update form
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.status = newTask.status as TaskStatus
    form.priority = newTask.priority as TaskPriority
    form.description = newTask.description || ''
  }
}, { immediate: true })

// Status options
const statusOptions = computed(() => [
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.Completed, label: 'Completed' }
])

// Priority options
const priorityOptions = computed(() => [
  { value: TaskPriority.Low, label: 'Low' },
  { value: TaskPriority.Medium, label: 'Medium' },
  { value: TaskPriority.High, label: 'High' },
  { value: TaskPriority.Urgent, label: 'Urgent' }
])

// Get priority variant for chips
const getPriorityVariant = (priority: TaskPriority): 'neutral' | 'info' | 'warning' | 'error' => {
  const variants: Record<TaskPriority, 'neutral' | 'info' | 'warning' | 'error'> = {
    [TaskPriority.Low]: 'neutral',
    [TaskPriority.Medium]: 'info',
    [TaskPriority.High]: 'warning',
    [TaskPriority.Urgent]: 'error'
  }
  return variants[priority]
}

// Handle mark complete
const handleMarkComplete = async () => {
  emit('mark-complete')
  
  // Show completion feedback
  showCompletionMessage.value = true
  completionMessage.value = props.task?.recurrenceType && props.task.recurrenceType !== 'NONE' 
    ? 'Next recurring instance has been created!' 
    : 'Great job completing this task!'
  
  // Hide message after 3 seconds
  setTimeout(() => {
    showCompletionMessage.value = false
  }, 3000)
}

// Handle reopen task
const handleReopen = () => {
  form.status = TaskStatus.Todo
  emit('field-change', 'status', TaskStatus.Todo)
  emit('reopen-task')
}

// Handle priority change from dropdown
const handlePriorityChange = (priority: TaskPriority) => {
  form.priority = priority
  emit('field-change', 'priority', priority)
}
</script>