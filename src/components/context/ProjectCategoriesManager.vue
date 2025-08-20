<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h3 class="card-title">Project Categories</h3>
        <button class="btn btn-primary btn-sm" @click="showCreateModal = true">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      <!-- Categories List -->
      <div v-if="categoriesLoading" class="space-y-2">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-16 bg-base-300 rounded"></div>
        </div>
      </div>

      <div v-else-if="categories?.length" class="space-y-2">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="flex items-center justify-between p-3 border border-base-300 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full" 
              :style="{ backgroundColor: category.color }"
            ></div>
            <div>
              <div class="font-medium">{{ category.name }}</div>
              <div v-if="category.description" class="text-sm text-base-content/70">
                {{ category.description }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div class="badge" :class="category.isActive ? 'badge-success' : 'badge-warning'">
              {{ category.isActive ? 'Active' : 'Inactive' }}
            </div>
            
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-xs btn-circle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                <li><a @click="editCategory(category)">Edit</a></li>
                <li><a @click="deleteCategory(category)" class="text-error">Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-base-content/50">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>No categories configured</p>
        <p class="text-sm">Create your first category to organize contexts</p>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <CategoryManagementModal
      :is-open="showCreateModal || showEditModal"
      :category="selectedCategory"
      :project-id="projectId"
      @close="closeModals"
      @success="handleCategorySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import {
  useProjectContextCategoriesQuery,
  useDeleteContextCategoryMutation
} from '@/generated/graphql'
import CategoryManagementModal from '@/components/modals/CategoryManagementModal.vue'

interface Props {
  projectId: string
}

const props = defineProps<Props>()
const feedback = useFeedback()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedCategory = ref<any>(null)

// GraphQL
const { result: categoriesResult, loading: categoriesLoading, refetch: refetchCategories } = useProjectContextCategoriesQuery({
  projectId: props.projectId
})

const { mutate: deleteCategory_mutate } = useDeleteContextCategoryMutation()

// Computed
const categories = computed(() => categoriesResult.value?.projectContextCategories || [])

// Methods
const editCategory = (category: any) => {
  selectedCategory.value = category
  showEditModal.value = true
}

const deleteCategory = async (category: any) => {
  if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
    return
  }

  try {
    await deleteCategory_mutate({ categoryId: category.id })
    feedback.success('Category Deleted', `"${category.name}" has been deleted`)
    refetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    feedback.error('Delete Failed', 'Failed to delete the category')
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedCategory.value = null
}

const handleCategorySuccess = () => {
  closeModals()
  refetchCategories()
}
</script>
