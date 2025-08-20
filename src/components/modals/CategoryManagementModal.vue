<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">
        {{ isEditing ? 'Edit Category' : 'Create Category' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name *</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g., Meetings, Documents"
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
            placeholder="Describe what this category is for..."
            class="textarea textarea-bordered"
            rows="3"
          ></textarea>
        </div>

        <!-- Color -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Color</span>
          </label>
          <div class="flex items-center space-x-3">
            <input
              v-model="form.color"
              type="color"
              class="w-12 h-12 rounded border border-base-300"
            />
            <input
              v-model="form.color"
              type="text"
              placeholder="#3B82F6"
              class="input input-bordered flex-1"
            />
          </div>
        </div>

        <!-- Active Status -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start space-x-3">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="checkbox"
            />
            <span class="label-text">Active</span>
          </label>
          <div class="text-sm text-base-content/70 mt-1">
            Inactive categories won't be available for new contexts
          </div>
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
          :disabled="loading"
          :class="{ 'loading': loading }"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import {
  useCreateContextCategoryMutation,
  useUpdateContextCategoryMutation
} from '@/generated/graphql'

interface Props {
  isOpen: boolean
  category?: any
  projectId: string
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
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
  color: '#3B82F6',
  isActive: true
})

// GraphQL
const { mutate: createCategory } = useCreateContextCategoryMutation()
const { mutate: updateCategory } = useUpdateContextCategoryMutation()

// Computed
const isEditing = computed(() => !!props.category)

// Watchers
watch(() => props.category, (category) => {
  if (category) {
    form.name = category.name || ''
    form.description = category.description || ''
    form.color = category.color || '#3B82F6'
    form.isActive = category.isActive ?? true
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
  form.color = '#3B82F6'
  form.isActive = true
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  
  try {
    if (isEditing.value) {
      await updateCategory({
        input: {
          categoryId: props.category.id,
          name: form.name.trim(),
          description: form.description.trim() || null,
          color: form.color,
          isActive: form.isActive
        }
      })
      feedback.success('Category Updated', `"${form.name}" has been updated`)
    } else {
      await createCategory({
        input: {
          projectId: props.projectId,
          name: form.name.trim(),
          description: form.description.trim() || null,
          color: form.color,
          contextTypeName: 'general' // Default context type
        }
      })
      feedback.success('Category Created', `"${form.name}" has been created`)
    }
    
    emit('success')
  } catch (error) {
    console.error('Error saving category:', error)
    feedback.error('Save Failed', 'Failed to save the category')
  } finally {
    loading.value = false
  }
}
</script>
