<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box bg-base-100 shadow-xl rounded-lg max-w-lg">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-base-content font-serif">Create New Project</h2>
        <button @click="closeModal" class="btn btn-ghost btn-sm btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Project Creation Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Project Name -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-sans font-medium">Project Name</span>
            <span class="label-text-alt text-error">*</span>
          </label>
          <input 
            v-model="form.name"
            type="text" 
            class="input input-bordered input-primary focus:ring-2"
            placeholder="Enter project name"
            required
            maxlength="255"
            ref="nameInput"
          />
        </div>

        <!-- Project Description -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text font-sans font-medium">Description</span>
          </label>
          <textarea 
            v-model="form.description"
            class="textarea textarea-bordered textarea-primary focus:ring-2 resize-none"
            placeholder="Describe the project goals and scope (optional)"
            rows="4"
            maxlength="1000"
          ></textarea>
          <label class="label">
            <span class="label-text-alt text-base-content/60">
              {{ form.description.length }}/1000 characters
            </span>
          </label>
        </div>

        <!-- Project Templates (Future Enhancement) -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text font-sans font-medium">Project Type</span>
          </label>
          <div class="grid grid-cols-1 gap-2">
            <label 
              v-for="template in projectTemplates" 
              :key="template.value"
              class="label cursor-pointer border rounded-lg p-3 hover:bg-base-200 transition-colors"
              :class="{ 'border-primary bg-primary/10': form.template === template.value }"
            >
              <div class="flex items-center gap-3 flex-1">
                <input 
                  v-model="form.template"
                  type="radio" 
                  :value="template.value"
                  class="radio radio-primary radio-sm"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <component :is="template.icon" class="h-5 w-5 text-primary" />
                    <span class="font-medium font-sans">{{ template.label }}</span>
                  </div>
                  <div class="text-sm text-base-content/70">{{ template.description }}</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4 border-t border-base-300">
          <button 
            type="submit"
            class="btn btn-primary flex-1 rounded-lg"
            :disabled="isSubmitting || !form.name.trim()"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Project' }}
          </button>
          
          <button 
            type="button"
            @click="closeModal"
            class="btn btn-ghost rounded-lg"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Modal backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useCreateProjectMutation } from '../generated/graphql'
import { useFeedback } from '../composables/useFeedback'
import type { CreateProjectInput } from '../generated/graphql'

// Props & Emits
interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<{
  close: []
  projectCreated: [project: any]
}>()

// Component refs
const modal = ref<HTMLDialogElement>()
const nameInput = ref<HTMLInputElement>()

// GraphQL Mutation
const { mutate: createProject, error: createError } = useCreateProjectMutation()

// Feedback system
const { success: showSuccess, error: showError } = useFeedback()

// Form state
const form = ref({
  name: '',
  description: '',
  template: 'general'
})

const isSubmitting = ref(false)

// Project templates for better UX (disabled for now - focusing on basic functionality)
// const projectTemplates = computed(() => [
//   {
//     value: 'general',
//     label: 'General Project', 
//     description: 'A flexible project for any type of work',
//     icon: 'svg'
//   },
//   {
//     value: 'software',
//     label: 'Software Development',
//     description: 'Development project with common development tasks',
//     icon: 'svg'
//   },
//   {
//     value: 'marketing',
//     label: 'Marketing Campaign',
//     description: 'Marketing project with campaign planning and tracking',
//     icon: 'svg'
//   },
//   {
//     value: 'design',
//     label: 'Design Project',
//     description: 'Creative project for design and branding work',
//     icon: 'svg'
//   }
// ])

// Simplified project templates for current implementation
const projectTemplates = computed(() => [
  {
    value: 'general',
    label: 'General Project',
    description: 'A flexible project for any type of work',
    icon: 'svg'
  }
])

// Helper functions
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    template: 'general'
  }
}

// Modal management
const openModal = async () => {
  modal.value?.showModal()
  // Focus the name input after modal opens
  await nextTick()
  nameInput.value?.focus()
}

const closeModal = () => {
  if (!isSubmitting.value) {
    modal.value?.close()
    emit('close')
    resetForm()
  }
}

// Form submission
const handleSubmit = async () => {
  if (!form.value.name.trim() || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    // Prepare project input following GraphQL schema
    const projectInput: CreateProjectInput = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined
    }

    const result = await createProject({ input: projectInput })
    const newProject = result?.data?.createProject

    if (newProject) {
      showSuccess('Project Created', `"${newProject.name}" has been created successfully`)
      emit('projectCreated', newProject)
      
      // Reset submitting state before closing modal
      isSubmitting.value = false
      closeModal()
    } else {
      showError('Project Creation Failed', 'Unable to create project. Please try again.')
      isSubmitting.value = false
    }
  } catch (error) {
    console.error('Project creation failed:', error)
    showError('Project Creation Failed', 'An error occurred while creating the project.')
    isSubmitting.value = false
  }
}

// Watch for prop changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    openModal()
  }
})

// Watch for GraphQL errors
watch(createError, (error) => {
  if (error) {
    console.error('GraphQL error:', error)
    showError('Project Creation Failed', 'Unable to create project. Please check your permissions.')
  }
})

// Public methods
defineExpose({
  openModal,
  closeModal
})

// Used in template - suppress TypeScript unused warnings
void projectTemplates
void handleSubmit
</script>

<style scoped>
/* Custom focus states for better accessibility */
.input:focus,
.textarea:focus {
  outline: 2px solid oklch(var(--p));
  outline-offset: 2px;
}

/* Enhanced radio button styling */
.radio:checked {
  background-image: radial-gradient(currentColor 40%, transparent 40%);
}

/* Smooth transitions for interactive elements */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal backdrop styling */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Character counter styling */
.label-text-alt {
  font-size: 0.75rem;
}

/* Template card hover effects */
.label.cursor-pointer:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Focus within template cards */
.label.cursor-pointer:focus-within {
  outline: 2px solid oklch(var(--p));
  outline-offset: 2px;
}
</style>