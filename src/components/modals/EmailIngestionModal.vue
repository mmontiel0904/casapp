<template>
  <dialog ref="modal" class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6 sticky top-0 bg-base-100 pb-4 border-b border-base-300 z-10">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-base-content">Email Ingestion</h2>
            <p class="text-sm text-base-content/60">Upload email screenshots for AI processing</p>
          </div>
        </div>
        
        <button 
          @click="closeModal" 
          class="btn btn-ghost btn-sm btn-circle"
          :disabled="isProcessing"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Step 1: Project Selection -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 class="text-lg font-semibold">Select Project</h3>
            </div>
            
            <ProjectSelector
              v-model="selectedProjectId"
              label="Target Project"
              placeholder="Choose a project for email ingestion"
              :required="true"
              :error="validationErrors.project"
              helper-text="Emails will be associated with this project"
              @change="handleProjectChange"
            />
          </div>
        </div>

        <!-- Step 2: File Upload -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center space-x-3 mb-4">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                :class="selectedProjectId ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/50'"
              >
                2
              </div>
              <h3 class="text-lg font-semibold" :class="{ 'text-base-content/50': !selectedProjectId }">
                Upload Email Screenshots
              </h3>
            </div>
            
            <div :class="{ 'opacity-50 pointer-events-none': !selectedProjectId }">
              <!-- Upload Methods Tabs -->
              <div class="tabs tabs-boxed mb-4">
                <a 
                  class="tab" 
                  :class="{ 'tab-active': uploadMethod === 'file' }"
                  @click="uploadMethod = 'file'"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </a>
                <a 
                  class="tab" 
                  :class="{ 'tab-active': uploadMethod === 'camera' }"
                  @click="uploadMethod = 'camera'"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photos
                </a>
              </div>

              <!-- File Upload Tab -->
              <div v-show="uploadMethod === 'file'">
                <FileDropZone
                  v-model="selectedFiles"
                  accept="image/*"
                  :multiple="true"
                  :max-files="10"
                  :max-size="10485760"
                  :disabled="!selectedProjectId || isProcessing"
                  @files-selected="handleFilesSelected"
                  @error="handleFileError"
                >
                  <div class="text-center py-8">
                    <svg class="w-16 h-16 mx-auto mb-4 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div class="space-y-2">
                      <p class="text-lg font-medium">Drop email screenshots here</p>
                      <p class="text-sm text-base-content/60">or click to browse files</p>
                      <div class="text-xs text-base-content/50 space-y-1">
                        <p>Supports: PNG, JPG, JPEG, WebP</p>
                        <p>Max size: 10MB per file</p>
                        <p>Max files: 10</p>
                      </div>
                    </div>
                  </div>
                </FileDropZone>
              </div>

              <!-- Camera Capture Tab -->
              <div v-show="uploadMethod === 'camera'">
                <div class="border-2 border-dashed border-base-300 rounded-lg p-6">
                  <CameraCapture 
                    @photo-captured="handlePhotoCaptured"
                    :disabled="!selectedProjectId || isProcessing"
                  />
                  
                  <div class="mt-4 text-center">
                    <p class="text-sm text-base-content/60 mb-2">Capture email screenshots with your camera</p>
                    <div class="text-xs text-base-content/50 space-y-1">
                      <p>• Point camera at email on screen or printed document</p>
                      <p>• Ensure good lighting and clear text</p>
                      <p>• You can take multiple photos</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- File Preview -->
              <div v-if="filesWithPreview.length > 0" class="mt-6">
                <FilePreviewGrid 
                  :files="filesWithPreview"
                  @remove="removeFile"
                  @preview-loaded="handlePreviewLoaded"
                  @preview-error="handlePreviewError"
                />
              </div>

              <!-- File upload error -->
              <div v-if="validationErrors.files" class="mt-4">
                <div class="alert alert-error">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ validationErrors.files }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Processing Options -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <div class="flex items-center space-x-3 mb-4">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                :class="canConfigureOptions ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/50'"
              >
                3
              </div>
              <h3 class="text-lg font-semibold" :class="{ 'text-base-content/50': !canConfigureOptions }">
                Configure Processing
              </h3>
            </div>
            
            <div :class="{ 'opacity-50 pointer-events-none': !canConfigureOptions }">
              <EmailIngestionOptionsComponent
                v-model="processingOptions"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-action sticky bottom-0 bg-base-100 pt-4 border-t border-base-300 mt-6">
        <div class="flex justify-between items-center w-full">
          <!-- Progress info -->
          <div v-if="isProcessing" class="flex items-center space-x-2 text-sm text-base-content/70">
            <span class="loading loading-spinner loading-sm"></span>
            <span>Processing {{ selectedFiles.length }} email{{ selectedFiles.length !== 1 ? 's' : '' }}...</span>
          </div>
          <div v-else-if="hasProcessedSuccessfully" class="flex items-center space-x-2 text-sm text-success">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Processing completed successfully</span>
          </div>
          <div v-else class="text-sm text-base-content/50">
            Select project and upload files to continue
          </div>

          <!-- Action buttons -->
          <div class="flex space-x-2">
            <button 
              class="btn btn-ghost" 
              @click="closeModal"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : hasProcessedSuccessfully ? 'Close' : 'Cancel' }}
            </button>
            
            <button 
              v-if="!hasProcessedSuccessfully"
              class="btn btn-primary" 
              @click="startProcessing"
              :disabled="!canProcess || isProcessing"
              :class="{ 'loading': isProcessing }"
            >
              {{ isProcessing ? 'Processing...' : 'Start Processing' }}
            </button>
            
            <button 
              v-else
              class="btn btn-primary" 
              @click="processMoreEmails"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Process More
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useEmailIngestion } from '@/composables/useEmailIngestion'
import { useToast } from '@/composables/useToast'
import ProjectSelector from '@/components/ui/ProjectSelector.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import FilePreviewGrid from '@/components/ui/FilePreviewGrid.vue'
import CameraCapture from '@/components/ui/CameraCapture.vue'
import EmailIngestionOptionsComponent from '@/components/email/EmailIngestionOptions.vue'

// Local type definitions
interface FileWithPreview extends File {
  preview?: string
  loading?: boolean
  status?: 'success' | 'error' | 'processing'
}

interface EmailIngestionOptions {
  extractAttachments: boolean
  createCategories: boolean
  enhancedOcr: boolean
  accountingProcess: string
  processingSpeed: 'fast' | 'balanced' | 'quality'
}

interface Props {
  isOpen: boolean
  projectId?: string
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'close'): void
  (e: 'success', result: any): void
  (e: 'error', error: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()
const { processEmailScreenshots, isProcessing } = useEmailIngestion()

// Component refs
const modal = ref<HTMLDialogElement>()

// Form state
const selectedProjectId = ref(props.projectId || '')
const selectedFiles = ref<File[]>([])
const filesWithPreview = ref<FileWithPreview[]>([])
const uploadMethod = ref<'file' | 'camera'>('file')
const processingOptions = ref<EmailIngestionOptions>({
  extractAttachments: true,
  createCategories: true,
  enhancedOcr: false,
  accountingProcess: '',
  processingSpeed: 'balanced'
})

// Validation
const validationErrors = ref({
  project: '',
  files: ''
})

// Computed properties
const canConfigureOptions = computed(() => {
  return selectedProjectId.value && selectedFiles.value.length > 0
})

const canProcess = computed(() => {
  return selectedProjectId.value && 
         selectedFiles.value.length > 0 && 
         !validationErrors.value.project && 
         !validationErrors.value.files
})

const hasProcessedSuccessfully = computed(() => {
  return false // No status tracking anymore
})

// Event handlers
const handleProjectChange = (project: any) => {
  validationErrors.value.project = ''
  if (!project) {
    selectedFiles.value = []
    filesWithPreview.value = []
  }
}

const handleFilesSelected = (files: File[]) => {
  validationErrors.value.files = ''
  
  // Create preview URLs for images
  filesWithPreview.value = files.map(file => {
    const fileWithPreview = file as FileWithPreview
    
    if (file.type.startsWith('image/')) {
      fileWithPreview.preview = URL.createObjectURL(file)
      fileWithPreview.loading = false
      fileWithPreview.status = undefined
    }
    
    return fileWithPreview
  })
}

const handleFileError = (error: string) => {
  validationErrors.value.files = error
  toast.error(error)
}

const removeFile = (index: number) => {
  const file = filesWithPreview.value[index]
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }
  
  selectedFiles.value.splice(index, 1)
  filesWithPreview.value.splice(index, 1)
}

const handlePreviewLoaded = (index: number) => {
  if (filesWithPreview.value[index]) {
    filesWithPreview.value[index].loading = false
  }
}

const handlePreviewError = (index: number) => {
  if (filesWithPreview.value[index]) {
    filesWithPreview.value[index].loading = false
    filesWithPreview.value[index].status = 'error'
  }
}

const handlePhotoCaptured = (file: File) => {
  // Add the captured photo to the files list
  selectedFiles.value.push(file)
  
  // Create preview for the captured photo
  const reader = new FileReader()
  reader.onload = (e) => {
    const fileWithPreview = file as FileWithPreview
    fileWithPreview.preview = e.target?.result as string
    fileWithPreview.loading = false
    fileWithPreview.status = 'success'
    filesWithPreview.value.push(fileWithPreview)
  }
  reader.readAsDataURL(file)
  
  // Clear any file-related validation errors
  if (validationErrors.value.files) {
    validationErrors.value.files = ''
  }
}

const startProcessing = async () => {
  if (!validateForm()) return
  
  try {
    const result = await processEmailScreenshots(
      selectedProjectId.value,
      selectedFiles.value,
      processingOptions.value
    )
    
    emit('success', result)
    toast.success('Email processing started successfully!')
    
  } catch (error) {
    console.error('Processing failed:', error)
    emit('error', error)
    toast.error('Failed to start email processing')
  }
}

const processMoreEmails = () => {
  // Reset form for new processing
  selectedFiles.value = []
  filesWithPreview.value = []
}

const validateForm = (): boolean => {
  validationErrors.value = { project: '', files: '' }
  
  if (!selectedProjectId.value) {
    validationErrors.value.project = 'Please select a project'
    return false
  }
  
  if (selectedFiles.value.length === 0) {
    validationErrors.value.files = 'Please upload at least one email screenshot'
    return false
  }
  
  return true
}

const closeModal = () => {
  if (isProcessing.value) {
    if (!confirm('Processing is in progress. Are you sure you want to close?')) {
      return
    }
  }
  
  // Clean up preview URLs
  filesWithPreview.value.forEach((file: any) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
  
  emit('update:isOpen', false)
  emit('close')
}

// Watch for modal open/close
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    modal.value?.showModal()
  } else {
    modal.value?.close()
  }
})

// Cleanup on unmount
defineExpose({
  closeModal,
  clearForm: () => {
    selectedProjectId.value = ''
    selectedFiles.value = []
    filesWithPreview.value = []
  }
})
</script>

<style scoped>
.modal-box {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

.modal-box::-webkit-scrollbar {
  width: 6px;
}

.modal-box::-webkit-scrollbar-track {
  background: transparent;
}

.modal-box::-webkit-scrollbar-thumb {
  background-color: rgb(203 213 225);
  border-radius: 3px;
}

.modal-box::-webkit-scrollbar-thumb:hover {
  background-color: rgb(148 163 184);
}
</style>
