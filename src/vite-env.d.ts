/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Module declarations for our custom components
declare module '@/components/ui/ProjectSelector.vue'
declare module '@/components/ui/FileDropZone.vue' 
declare module '@/components/ui/FilePreviewGrid.vue'
declare module '@/components/email/EmailIngestionOptions.vue'
declare module '@/components/email/ProcessingStatusTracker.vue'
declare module '@/composables/useEmailIngestion'
declare module '@/composables/useToast'