<template>
  <div class="space-y-4">
    <!-- Context Information Card -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div class="flex items-start gap-4">
          <!-- Context Icon -->
          <div class="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <!-- Context Details -->
          <div class="flex-1">
            <h3 class="text-xl font-semibold mb-2">{{ context?.title }}</h3>
            
            <!-- Description -->
            <div v-if="context?.description" class="mb-4">
              <h4 class="text-sm font-medium text-base-content/70 mb-1">Description</h4>
              <p class="text-base-content/80">{{ context.description }}</p>
            </div>
            
            <!-- Context Metadata -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Category -->
              <div v-if="context?.category">
                <h4 class="text-sm font-medium text-base-content/70 mb-1">Category</h4>
                <div class="flex items-center gap-2">
                  <div 
                    class="w-3 h-3 rounded-full" 
                    :style="{ backgroundColor: context.category.color }"
                  ></div>
                  <span class="text-base-content/80">{{ context.category.name }}</span>
                </div>
              </div>
              
              <!-- Context Type -->
              <div v-if="context?.contextType">
                <h4 class="text-sm font-medium text-base-content/70 mb-1">Type</h4>
                <div class="badge badge-outline">{{ context.contextType.name }}</div>
              </div>
              
              <!-- Created Date -->
              <div>
                <h4 class="text-sm font-medium text-base-content/70 mb-1">Created</h4>
                <span class="text-base-content/80">{{ formatDate(context?.createdAt) }}</span>
              </div>
              
              <!-- Status -->
              <div>
                <h4 class="text-sm font-medium text-base-content/70 mb-1">Status</h4>
                <div class="badge" :class="context?.isArchived ? 'badge-warning' : 'badge-success'">
                  {{ context?.isArchived ? 'Archived' : 'Active' }}
                </div>
              </div>
            </div>
            
            <!-- Tags -->
            <div v-if="context?.tags?.length" class="mb-4">
              <h4 class="text-sm font-medium text-base-content/70 mb-2">Tags</h4>
              <div class="flex flex-wrap gap-1">
                <div v-for="tag in context.tags" :key="tag" class="badge badge-sm">
                  {{ tag }}
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <router-link 
                :to="`/projects/${context?.projectId}?tab=context&contextId=${context?.id}`"
                class="btn btn-primary btn-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View in Project Context
              </router-link>
              
              <button 
                v-if="context?.contextType?.name === 'email'"
                class="btn btn-outline btn-sm"
                @click="viewEmailDetails"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                View Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Context Type Specific Information -->
    <div v-if="context?.contextType?.name === 'email' && context?.emailContext" class="card bg-base-100 shadow">
      <div class="card-body">
        <h4 class="font-semibold mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Details
        </h4>
        
        <div class="space-y-2 text-sm">
          <div><strong>Subject:</strong> {{ context.emailContext.subject }}</div>
          <div><strong>From:</strong> {{ context.emailContext.fromEmail }}</div>
          <div><strong>To:</strong> {{ context.emailContext.toEmails?.join(', ') }}</div>
          <div><strong>Date:</strong> {{ formatDate(context.emailContext.messageDate) }}</div>
          
          <div v-if="context.emailContext.hasAttachments" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>{{ context.emailContext.attachmentCount }} attachment(s)</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No Context State -->
    <div v-if="!context" class="text-center py-8 text-base-content/50">
      <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>No context information available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFeedback } from '@/composables/useFeedback'
import type { ProjectContext } from '@/generated/graphql'

interface Props {
  context: ProjectContext | null
}

defineProps<Props>()
const feedback = useFeedback()

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewEmailDetails = () => {
  // TODO: Implement email detail view
  feedback.info('Coming Soon', 'Detailed email view will be available soon')
}
</script>
