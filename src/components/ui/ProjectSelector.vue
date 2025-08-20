<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text font-medium">{{ label }}</span>
      <span v-if="required" class="label-text-alt text-error">*</span>
    </label>
    
    <select 
      :value="modelValue"
      @change="handleChange"
      class="select select-bordered w-full"
      :class="{
        'select-error': error,
        'select-primary': !error,
        'select-disabled': disabled
      }"
      :disabled="disabled || loading"
    >
      <option value="" disabled>
        {{ loading ? 'Loading projects...' : placeholder }}
      </option>
      
      <option 
        v-for="project in projects" 
        :key="project.id" 
        :value="project.id"
      >
        {{ project.name }}
        <span v-if="project.description" class="text-base-content/60">
          - {{ truncateText(project.description, 50) }}
        </span>
      </option>
    </select>
    
    <!-- Error message -->
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
    
    <!-- Helper text -->
    <label v-else-if="helperText" class="label">
      <span class="label-text-alt text-base-content/60">{{ helperText }}</span>
    </label>

    <!-- Loading state -->
    <div v-if="loading" class="mt-2">
      <div class="flex items-center space-x-2 text-sm text-base-content/60">
        <span class="loading loading-spinner loading-xs"></span>
        <span>Loading projects...</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="projects.length === 0" class="mt-2">
      <div class="alert alert-info alert-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>No projects available. Create a project first.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMyProjectsQuery } from '@/generated/graphql'

interface Project {
  id: string
  name: string
  description?: string | null
}

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', project: Project | null): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a project',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

// Query projects using GraphQL
const { result, loading } = useMyProjectsQuery({
  limit: 100, // Get all user's projects
  offset: 0
})

const projects = computed(() => {
  return result.value?.myProjects?.map((project: any) => ({
    id: project.id,
    name: project.name,
    description: project.description
  })) || []
})

const selectedProject = computed(() => {
  return projects.value.find((p: Project) => p.id === props.modelValue) || null
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  emit('update:modelValue', value)
  
  const project = projects.value.find((p: Project) => p.id === value) || null
  emit('change', project)
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Expose methods for parent components
defineExpose({
  selectedProject,
  projects,
  loading
})
</script>

<style scoped>
/* Component styles if needed */
</style>
