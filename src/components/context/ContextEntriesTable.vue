<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h3 class="card-title mb-4">Context Entries</h3>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-4">
        <!-- Search -->
        <div class="form-control flex-1 min-w-64">
          <div class="input-group">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search contexts..."
              class="input input-bordered flex-1"
            />
            <button class="btn btn-square">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="form-control">
          <select v-model="filters.categoryId" class="select select-bordered">
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div class="form-control">
          <select v-model="filters.typeId" class="select select-bordered">
            <option value="">All Types</option>
            <option 
              v-for="type in contextTypes" 
              :key="type.id" 
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="form-control">
          <select v-model="filters.status" class="select select-bordered">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div v-if="contextsLoading" class="space-y-2">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-16 bg-base-300 rounded"></div>
        </div>
      </div>

      <div v-else-if="contexts?.length" class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th class="w-1/4">Title</th>
              <th class="w-1/6">Category</th>
              <th class="w-1/8">Type</th>
              <th class="w-1/4">Tags</th>
              <th class="w-1/8">Created</th>
              <th class="w-1/12">Status</th>
              <th class="w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="context in contexts" :key="context.id">
              <td>
                <div class="font-medium">{{ context.title }}</div>
                <div v-if="context.description" class="text-sm text-base-content/70 truncate max-w-xs">
                  {{ context.description }}
                </div>
              </td>
              <td>
                <div v-if="context.category" class="flex items-center space-x-2">
                  <div 
                    class="w-3 h-3 rounded-full" 
                    :style="{ backgroundColor: context.category.color }"
                  ></div>
                  <span>{{ context.category.name }}</span>
                </div>
                <span v-else class="text-base-content/50">Uncategorized</span>
              </td>
              <td>
                <div v-if="context.contextType" class="badge badge-outline">
                  {{ context.contextType.name }}
                </div>
              </td>
              <td>
                <div v-if="context.tags?.length || editingTags[context.id]" class="flex flex-wrap gap-1">
                  <!-- Editing Mode -->
                  <div v-if="editingTags[context.id]" class="w-full">
                    <div class="flex flex-wrap gap-1 mb-2">
                      <div 
                        v-for="(tag, index) in editingTags[context.id]" 
                        :key="index" 
                        class="badge badge-sm gap-1"
                      >
                        {{ tag }}
                        <button 
                          @click="removeTag(context.id, index)"
                          class="text-error hover:text-error-focus"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <input
                        v-model="newTagInput[context.id]"
                        type="text"
                        placeholder="Add tag..."
                        class="input input-xs input-bordered flex-1"
                        @keyup.enter="addTag(context.id)"
                        @keyup.escape="cancelEditTags(context.id)"
                      />
                      <button 
                        @click="addTag(context.id)"
                        class="btn btn-xs btn-primary"
                        :disabled="!newTagInput[context.id]?.trim()"
                      >
                        Add
                      </button>
                      <button 
                        @click="saveTagChanges(context)"
                        class="btn btn-xs btn-success"
                      >
                        Save
                      </button>
                      <button 
                        @click="cancelEditTags(context.id)"
                        class="btn btn-xs btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  <!-- Display Mode -->
                  <template v-else>
                    <div 
                      v-for="tag in context.tags?.slice(0, 3)" 
                      :key="tag" 
                      class="badge badge-sm"
                    >
                      {{ tag }}
                    </div>
                    <div 
                      v-if="(context.tags?.length || 0) > 3" 
                      class="badge badge-sm badge-ghost"
                      :title="`${context.tags?.length} total tags`"
                    >
                      +{{ (context.tags?.length || 0) - 3 }}
                    </div>
                    <button 
                      @click="startEditTags(context)"
                      class="btn btn-xs btn-ghost btn-circle ml-1"
                      title="Edit tags"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </template>
                </div>
                
                <!-- No tags state -->
                <div v-else class="flex items-center gap-2">
                  <span class="text-base-content/50 text-xs">No tags</span>
                  <button 
                    @click="startEditTags(context)"
                    class="btn btn-xs btn-ghost btn-circle"
                    title="Add tags"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="text-sm text-base-content/70">
                {{ formatDate(context.createdAt) }}
              </td>
              <td>
                <div class="flex flex-col gap-1">
                  <div class="badge" :class="context.isArchived ? 'badge-warning' : 'badge-success'">
                    {{ context.isArchived ? 'Archived' : 'Active' }}
                  </div>
                  <!-- Task Indicator -->
                  <div v-if="context.task" 
                       class="badge badge-sm gap-1 cursor-pointer hover:badge-info" 
                       :class="getTaskBadgeClass(context.task.status)"
                       :title="`Task: ${context.task.name} (${getTaskStatusDisplay(context.task.status)})`"
                       @click="viewLinkedTasks(context)"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Task
                  </div>
                </div>
              </td>
              <td>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
                    <li><a @click="viewContext(context)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a></li>
                    <li><a @click="viewLinkedTasks(context)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      View Tasks
                    </a></li>
                    <li><a @click="createTaskFromContext(context)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Task
                    </a></li>
                    <li v-if="!context.isArchived">
                      <a @click="archiveContext(context)" class="text-warning">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8l4-4h6l4 4m0 0v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                        </svg>
                        Archive
                      </a>
                    </li>
                    <li v-else>
                      <a @click="restoreContext(context)" class="text-success">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restore
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-8 text-base-content/50">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No contexts found</p>
        <p class="text-sm">
          {{ hasActiveFilters ? 'Try adjusting your filters' : 'Context entries will appear here as they are ingested' }}
        </p>
      </div>
    </div>
  </div>

  <!-- Create Task from Context Modal -->
  <CreateTaskFromContextModal
    :is-open="showTaskModal"
    :context="selectedContextForTask"
    :project-id="projectId"
    @close="closeTaskModal"
    @success="handleTaskCreated"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFeedback } from '@/composables/useFeedback'
import CreateTaskFromContextModal from '@/components/modals/CreateTaskFromContextModal.vue'
import {
  useProjectContextsQuery,
  useProjectContextCategoriesQuery,
  useContextTypesQuery,
  useArchiveContextMutation,
  useRestoreContextMutation
} from '@/generated/graphql'

interface Props {
  projectId: string
}

const props = defineProps<Props>()
const feedback = useFeedback()

// State
const filters = reactive({
  search: '',
  categoryId: '',
  typeId: '',
  status: ''
})

// Tag editing state
const editingTags = ref<Record<string, string[]>>({})
const newTagInput = ref<Record<string, string>>({})

// Task creation state
const showTaskModal = ref(false)
const selectedContextForTask = ref<any>(null)

// GraphQL
const { result: contextsResult, loading: contextsLoading, refetch: refetchContexts } = useProjectContextsQuery({
  projectId: props.projectId
})

const { result: categoriesResult } = useProjectContextCategoriesQuery({
  projectId: props.projectId
})

const { result: typesResult } = useContextTypesQuery()

const { mutate: archiveContext_mutate } = useArchiveContextMutation()
const { mutate: restoreContext_mutate } = useRestoreContextMutation()

// Computed
const allContexts = computed(() => contextsResult.value?.projectContexts.edges || [])
const categories = computed(() => categoriesResult.value?.projectContextCategories || [])
const contextTypes = computed(() => typesResult.value?.contextTypes || [])

const contexts = computed(() => {
  let filtered = allContexts.value

  // Search filter
  if (filters.search.trim()) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(context => 
      context.title.toLowerCase().includes(search) ||
      context.description?.toLowerCase().includes(search) ||
      context.tags?.some(tag => tag.toLowerCase().includes(search))
    )
  }

  // Category filter
  if (filters.categoryId) {
    filtered = filtered.filter(context => context.category?.id === filters.categoryId)
  }

  // Type filter
  if (filters.typeId) {
    filtered = filtered.filter(context => context.contextType?.id === filters.typeId)
  }

  // Status filter
  if (filters.status) {
    const isArchived = filters.status === 'archived'
    filtered = filtered.filter(context => context.isArchived === isArchived)
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return filters.search || filters.categoryId || filters.typeId || filters.status
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewContext = (_context: any) => {
  // TODO: Implement context detail view
  feedback.info('Coming Soon', 'Context detail view will be available soon')
}

// Tag editing methods
const startEditTags = (context: any) => {
  editingTags.value[context.id] = [...(context.tags || [])]
  newTagInput.value[context.id] = ''
}

const cancelEditTags = (contextId: string) => {
  delete editingTags.value[contextId]
  delete newTagInput.value[contextId]
}

const addTag = (contextId: string) => {
  const tag = newTagInput.value[contextId]?.trim()
  if (tag && editingTags.value[contextId]) {
    // Check for duplicates (case-insensitive)
    const existingTags = editingTags.value[contextId].map(t => t.toLowerCase())
    if (!existingTags.includes(tag.toLowerCase())) {
      editingTags.value[contextId].push(tag)
      newTagInput.value[contextId] = ''
    } else {
      feedback.warning('Duplicate Tag', 'This tag already exists')
    }
  }
}

const removeTag = (contextId: string, index: number) => {
  if (editingTags.value[contextId]) {
    editingTags.value[contextId].splice(index, 1)
  }
}

const saveTagChanges = async (context: any) => {
  // TODO: Implement when backend API supports updating context tags
  feedback.info('Coming Soon', 'Tag editing will be available when the backend API supports updating context tags')
  
  // For now, just show what would be saved
  const newTags = editingTags.value[context.id]
  console.log('Would save tags for context:', context.id, newTags)
  
  // Cancel editing mode
  cancelEditTags(context.id)
}

// Task navigation methods
const router = useRouter()

const viewLinkedTasks = (context: any) => {
  // Navigate to tasks page with context filter
  router.push({
    name: 'MyTasks',
    query: { 
      contextId: context.id, 
      contextName: context.title 
    }
  })
}

// Task badge helper functions
const getTaskBadgeClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'TODO': 'badge-info',
    'IN_PROGRESS': 'badge-warning', 
    'COMPLETED': 'badge-success',
    'CANCELLED': 'badge-error'
  }
  return statusMap[status] || 'badge-neutral'
}

const getTaskStatusDisplay = (status: string) => {
  const statusMap: Record<string, string> = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  return statusMap[status] || status
}

// Task creation methods
const createTaskFromContext = (context: any) => {
  selectedContextForTask.value = context
  showTaskModal.value = true
}

const handleTaskCreated = (task: any) => {
  feedback.success('Task Created', `Task "${task.name}" created successfully`)
  showTaskModal.value = false
  selectedContextForTask.value = null
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedContextForTask.value = null
}

const archiveContext = async (context: any) => {
  try {
    await archiveContext_mutate({ contextId: context.id })
    feedback.success('Context Archived', `"${context.title}" has been archived`)
    refetchContexts()
  } catch (error) {
    console.error('Error archiving context:', error)
    feedback.error('Archive Failed', 'Failed to archive the context')
  }
}

const restoreContext = async (context: any) => {
  try {
    await restoreContext_mutate({ contextId: context.id })
    feedback.success('Context Restored', `"${context.title}" has been restored`)
    refetchContexts()
  } catch (error) {
    console.error('Error restoring context:', error)
    feedback.error('Restore Failed', 'Failed to restore the context')
  }
}

// Watch for filter changes to refetch data
// Filters are applied in computed property, no need to refetch or watch
</script>
