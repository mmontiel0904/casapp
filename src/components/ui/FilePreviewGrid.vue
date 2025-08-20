<template>
  <div class="file-preview-grid">
    <div 
      v-if="files.length === 0" 
      class="text-center py-8 text-base-content/50"
    >
      <svg class="w-12 h-12 mx-auto mb-2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm">No files selected</p>
    </div>

    <div 
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div 
        v-for="(file, index) in files" 
        :key="`${file.name}-${index}`"
        class="file-preview-item relative"
      >
        <div class="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
          <!-- File preview -->
          <figure class="relative h-24 bg-base-200">
            <img 
              v-if="file.preview"
              :src="file.preview" 
              :alt="file.name"
              class="w-full h-full object-cover"
              @load="handleImageLoad(index)"
              @error="handleImageError(index)"
            />
            <div v-else class="flex items-center justify-center h-full">
              <svg class="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <!-- Loading overlay -->
            <div 
              v-if="file.loading" 
              class="absolute inset-0 bg-base-100/80 flex items-center justify-center"
            >
              <span class="loading loading-spinner loading-sm"></span>
            </div>
          </figure>

          <!-- File info -->
          <div class="card-body p-3">
            <h3 class="text-xs font-medium truncate" :title="file.name">
              {{ file.name }}
            </h3>
            <div class="flex justify-between items-center text-xs text-base-content/60">
              <span>{{ formatFileSize(file.size) }}</span>
              <div class="badge badge-outline badge-xs">
                {{ getFileExtension(file.name) }}
              </div>
            </div>
          </div>

          <!-- Remove button -->
          <button 
            v-if="removable"
            @click="removeFile(index)"
            class="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 shadow-sm"
            :title="`Remove ${file.name}`"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Status indicator -->
          <div 
            v-if="file.status"
            class="absolute top-2 left-2"
          >
            <div 
              class="badge badge-xs"
              :class="{
                'badge-success': file.status === 'success',
                'badge-error': file.status === 'error', 
                'badge-warning': file.status === 'processing'
              }"
            >
              {{ file.status }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary info -->
    <div v-if="files.length > 0" class="mt-4 text-xs text-base-content/60 text-center">
      {{ files.length }} file{{ files.length !== 1 ? 's' : '' }} selected
      ({{ formatFileSize(totalSize) }} total)
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FileWithPreview extends File {
  preview?: string
  loading?: boolean
  status?: 'success' | 'error' | 'processing'
}

interface Props {
  files: FileWithPreview[]
  removable?: boolean
}

interface Emits {
  (e: 'remove', index: number): void
  (e: 'preview-loaded', index: number): void
  (e: 'preview-error', index: number): void
}

const props = withDefaults(defineProps<Props>(), {
  removable: true
})

const emit = defineEmits<Emits>()

const totalSize = computed(() => {
  return props.files.reduce((total, file) => total + file.size, 0)
})

const removeFile = (index: number) => {
  emit('remove', index)
}

const handleImageLoad = (index: number) => {
  emit('preview-loaded', index)
}

const handleImageError = (index: number) => {
  emit('preview-error', index)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE'
}
</script>

<style scoped>
.file-preview-grid {
  @apply w-full;
}

.file-preview-item {
  @apply transition-transform duration-200;
}

.file-preview-item:hover {
  @apply transform scale-105;
}
</style>

<script lang="ts">
export default {
  name: 'FilePreviewGrid'
}
</script>
