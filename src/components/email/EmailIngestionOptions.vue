<template>
  <div class="email-ingestion-options">
    <div class="space-y-4">
      <!-- Processing Options Header -->
      <div class="flex items-center space-x-2 mb-4">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-lg font-semibold">Processing Options</h3>
      </div>

      <!-- AI Processing Options -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h4 class="font-medium mb-3 flex items-center space-x-2">
            <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>AI Analysis</span>
          </h4>
          
          <div class="space-y-3">
            <label class="label cursor-pointer justify-start space-x-3">
              <input 
                type="checkbox" 
                v-model="localOptions.extractAttachments" 
                class="checkbox checkbox-primary"
                @change="emitChange"
              />
              <div class="flex-1">
                <span class="label-text font-medium">Extract Attachments</span>
                <div class="text-xs text-base-content/60 mt-1">
                  Detect and extract information about email attachments
                </div>
              </div>
            </label>

            <label class="label cursor-pointer justify-start space-x-3">
              <input 
                type="checkbox" 
                v-model="localOptions.createCategories" 
                class="checkbox checkbox-primary"
                @change="emitChange"
              />
              <div class="flex-1">
                <span class="label-text font-medium">Auto-create Categories</span>
                <div class="text-xs text-base-content/60 mt-1">
                  Automatically create new categories based on email content
                </div>
              </div>
            </label>

            <label class="label cursor-pointer justify-start space-x-3">
              <input 
                type="checkbox" 
                v-model="localOptions.enhancedOcr" 
                class="checkbox checkbox-primary"
                @change="emitChange"
              />
              <div class="flex-1">
                <span class="label-text font-medium">Enhanced OCR</span>
                <div class="text-xs text-base-content/60 mt-1">
                  Use advanced text recognition for better accuracy
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Accounting Process Hint -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h4 class="font-medium mb-3 flex items-center space-x-2">
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>Accounting Process</span>
          </h4>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text text-sm">Preferred accounting process (optional)</span>
            </label>
            <select 
              v-model="localOptions.accountingProcess" 
              class="select select-bordered select-sm"
              @change="emitChange"
            >
              <option value="">Auto-detect</option>
              <option value="AP">Accounts Payable (AP)</option>
              <option value="AR">Accounts Receivable (AR)</option>
              <option value="BR">Bank Reconciliation (BR)</option>
              <option value="Reporting">Reporting</option>
              <option value="Tax">Tax</option>
              <option value="Audit">Audit</option>
              <option value="Payroll">Payroll</option>
            </select>
            <label class="label">
              <span class="label-text-alt text-base-content/60">
                Leave blank for AI to automatically detect the process type
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Processing Quality -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <h4 class="font-medium mb-3 flex items-center space-x-2">
            <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Processing Speed</span>
          </h4>
          
          <div class="form-control">
            <div class="flex space-x-4">
              <label class="label cursor-pointer space-x-2">
                <input 
                  type="radio" 
                  name="processingSpeed" 
                  value="fast" 
                  v-model="localOptions.processingSpeed"
                  class="radio radio-primary radio-sm"
                  @change="emitChange"
                />
                <span class="label-text text-sm">Fast</span>
              </label>
              <label class="label cursor-pointer space-x-2">
                <input 
                  type="radio" 
                  name="processingSpeed" 
                  value="balanced" 
                  v-model="localOptions.processingSpeed"
                  class="radio radio-primary radio-sm"
                  @change="emitChange"
                />
                <span class="label-text text-sm">Balanced</span>
              </label>
              <label class="label cursor-pointer space-x-2">
                <input 
                  type="radio" 
                  name="processingSpeed" 
                  value="quality" 
                  v-model="localOptions.processingSpeed"
                  class="radio radio-primary radio-sm"
                  @change="emitChange"
                />
                <span class="label-text text-sm">High Quality</span>
              </label>
            </div>
            <label class="label">
              <span class="label-text-alt text-base-content/60">
                {{ getSpeedDescription(localOptions.processingSpeed) }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface EmailIngestionOptions {
  extractAttachments: boolean
  createCategories: boolean
  enhancedOcr: boolean
  accountingProcess: string
  processingSpeed: 'fast' | 'balanced' | 'quality'
}

interface Props {
  modelValue: EmailIngestionOptions
}

interface Emits {
  (e: 'update:modelValue', options: EmailIngestionOptions): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localOptions = reactive<EmailIngestionOptions>({ ...props.modelValue })

const emitChange = () => {
  emit('update:modelValue', { ...localOptions })
}

const getSpeedDescription = (speed: string): string => {
  switch (speed) {
    case 'fast':
      return 'Quick processing with basic accuracy (~30 seconds)'
    case 'balanced':
      return 'Good balance of speed and accuracy (~1-2 minutes)'
    case 'quality':
      return 'Maximum accuracy with detailed analysis (~3-5 minutes)'
    default:
      return ''
  }
}

// Watch for external changes
watch(() => props.modelValue, (newOptions) => {
  Object.assign(localOptions, newOptions)
}, { deep: true })
</script>

<style scoped>
/* Component styles if needed */
</style>
