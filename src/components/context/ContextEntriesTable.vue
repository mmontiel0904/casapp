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
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Tags</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
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
                <div v-if="context.tags?.length" class="flex flex-wrap gap-1">
                  <div 
                    v-for="tag in context.tags.slice(0, 2)" 
                    :key="tag" 
                    class="badge badge-sm"
                  >
                    {{ tag }}
                  </div>
                  <div 
                    v-if="context.tags.length > 2" 
                    class="badge badge-sm badge-ghost"
                  >
                    +{{ context.tags.length - 2 }}
                  </div>
                </div>
              </td>
              <td class="text-sm text-base-content/70">
                {{ formatDate(context.createdAt) }}
              </td>
              <td>
                <div class="badge" :class="context.isArchived ? 'badge-warning' : 'badge-success'">
                  {{ context.isArchived ? 'Archived' : 'Active' }}
                </div>
              </td>
              <td>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                    <li><a @click="viewContext(context)">View</a></li>
                    <li v-if="!context.isArchived">
                      <a @click="archiveContext(context)" class="text-warning">Archive</a>
                    </li>
                    <li v-else>
                      <a @click="restoreContext(context)" class="text-success">Restore</a>
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
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
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
