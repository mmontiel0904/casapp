<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Task from Context
      </h3>

      <!-- Context Information -->
      <div class="mb-6 p-4 bg-base-200 rounded-lg">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold">{{ context?.title }}</h4>
            <p v-if="context?.description" class="text-sm text-base-content/70 mt-1">
              {{ context.description }}
            </p>
            <div v-if="context?.tags?.length" class="flex flex-wrap gap-1 mt-2">
              <div v-for="tag in context.tags" :key="tag" class="badge badge-sm">
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Task Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Task Name *</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter task name..."
            class="input input-bordered"
            :class="{ 'input-error': errors.name }"
            required
          />
          <label v-if="errors.name" class="label">
            <span class="label-text-alt text-error">{{ errors.name }}</span>
          </label>
        </div>

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
          </label>
          <textarea
            v-model="form.description"
            placeholder="Describe the task..."
            class="textarea textarea-bordered"
            rows="3"
          ></textarea>
        </div>

        <!-- Assignee -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Assignee</span>
          </label>
          <select v-model="form.assigneeId" class="select select-bordered">
            <option value="">Unassigned</option>
            <option 
              v-for="member in projectMembers" 
              :key="member.id" 
              :value="member.user?.id"
            >
              {{ member.user?.firstName }} {{ member.user?.lastName }} ({{ member.user?.email }})
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Due Date</span>
          </label>
          <input
            v-model="form.dueDate"
            type="datetime-local"
            class="input input-bordered"
          />
        </div>

        <!-- Priority -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Priority</span>
          </label>
          <select v-model="form.priority" class="select select-bordered">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </form>

      <div class="modal-action">
        <button 
          type="button" 
          class="btn btn-ghost" 
          @click="$emit('close')"
          :disabled="loading"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          @click="handleSubmit"
          :disabled="loading || !form.name.trim()"
          :class="{ 'loading': loading }"
        >
          <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import {
  useCreateTaskFromContextMutation,
  useProjectQuery,
  TaskPriority,
  type ProjectContext
} from '@/generated/graphql'

interface Props {
  isOpen: boolean
  context: ProjectContext | null
  projectId: string
}

interface Emits {
  (e: 'close'): void
  (e: 'success', task: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const feedback = useFeedback()

// State
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive({
  name: '',
  description: '',
  assigneeId: '',
  dueDate: '',
  priority: TaskPriority.Medium
})

// GraphQL
const { mutate: createTaskFromContext } = useCreateTaskFromContextMutation()
const { result: projectResult } = useProjectQuery({
  projectId: props.projectId
})

// Computed
const projectMembers = computed(() => projectResult.value?.project?.members || [])

// Watchers
watch(() => props.context, (context) => {
  if (context) {
    // Pre-fill form with context information
    form.name = `Task: ${context.title}`
    form.description = context.description || ''
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    errors.value = {}
  }
})

// Methods
const resetForm = () => {
  form.name = ''
  form.description = ''
  form.assigneeId = ''
  form.dueDate = ''
  form.priority = TaskPriority.Medium
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Task name is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm() || !props.context) return

  loading.value = true
  
  try {
    const input = {
      contextId: props.context.id,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      priority: form.priority
    }

    const result = await createTaskFromContext({ input })
    
    feedback.success(
      'Task Created', 
      `"${form.name}" has been created and linked to the context`
    )
    
    emit('success', result?.data?.createTaskFromContext)
    emit('close')
  } catch (error) {
    console.error('Error creating task from context:', error)
    feedback.error('Creation Failed', 'Failed to create the task')
  } finally {
    loading.value = false
  }
}
</script>
