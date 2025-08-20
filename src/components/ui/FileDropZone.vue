<template>
  <div 
    class="file-drop-zone"
    :class="[
      'border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer',
      'hover:border-primary/50 hover:bg-primary/5',
      isDragOver ? 'border-primary bg-primary/10 scale-105' : 'border-base-300',
      hasError ? 'border-error bg-error/5' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @click="openFileDialog"
  >
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <!-- Drop zone content -->
    <div class="p-6 text-center">
      <slot>
        <!-- Default drop zone UI -->
        <div class="flex flex-col items-center space-y-2">
          <svg class="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div class="text-sm text-base-content/70">
            <span class="font-medium">Click to upload</span> or drag and drop
          </div>
          <div class="text-xs text-base-content/50">
            {{ acceptDescription }}
          </div>
        </div>
      </slot>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="px-6 pb-4">
      <div class="alert alert-error alert-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', files: File[]): void
  (e: 'filesSelected', files: File[]): void
  (e: 'error', message: string): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: true,
  maxFiles: 10,
  maxSize: 10485760, // 10MB
  disabled: false
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const errorMessage = ref('')
const hasError = computed(() => !!errorMessage.value)

const acceptDescription = computed(() => {
  if (props.accept.includes('image/*')) {
    return `Images up to ${Math.round(props.maxSize / 1024 / 1024)}MB`
  }
  return `Files up to ${Math.round(props.maxSize / 1024 / 1024)}MB`
})

const openFileDialog = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  processFiles(files)
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (props.disabled) return
  
  const files = Array.from(event.dataTransfer?.files || [])
  processFiles(files)
}

const handleDragOver = () => {
  if (!props.disabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const processFiles = (files: File[]) => {
  errorMessage.value = ''
  
  // Validate file count
  if (files.length > props.maxFiles) {
    const error = `Maximum ${props.maxFiles} files allowed`
    errorMessage.value = error
    emit('error', error)
    return
  }
  
  // Validate file types and sizes
  const validFiles: File[] = []
  for (const file of files) {
    // Check file type
    if (props.accept && !props.accept.includes('*') && !props.accept.split(',').some(type => file.type.match(type.trim()))) {
      const error = `File type not supported: ${file.name}`
      errorMessage.value = error
      emit('error', error)
      return
    }
    
    // Check file size
    if (file.size > props.maxSize) {
      const error = `File too large: ${file.name} (max ${Math.round(props.maxSize / 1024 / 1024)}MB)`
      errorMessage.value = error
      emit('error', error)
      return
    }
    
    validFiles.push(file)
  }
  
  emit('update:modelValue', validFiles)
  emit('filesSelected', validFiles)
}

// Clear error when files change externally
defineExpose({
  clearError: () => {
    errorMessage.value = ''
  }
})
</script>

<style scoped>
/* Component styles if needed */
</style>
