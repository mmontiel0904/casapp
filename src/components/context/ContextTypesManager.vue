<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h3 class="card-title mb-4">Context Types</h3>
      
      <!-- Context Types List -->
      <div v-if="typesLoading" class="space-y-2">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-16 bg-base-300 rounded"></div>
        </div>
      </div>

      <div v-else-if="contextTypes?.length" class="space-y-2">
        <div 
          v-for="type in contextTypes" 
          :key="type.id" 
          class="flex items-center justify-between p-3 border border-base-300 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <div class="font-medium">{{ type.name }}</div>
                <div v-if="type.description" class="text-sm text-base-content/70">
                  {{ type.description }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div class="badge" :class="type.isActive ? 'badge-success' : 'badge-warning'">
              {{ type.isActive ? 'Active' : 'Inactive' }}
            </div>
            
            <div class="tooltip" data-tip="System types cannot be modified">
              <div class="badge badge-ghost badge-sm">System</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-base-content/50">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p>No context types available</p>
        <p class="text-sm">Context types are managed by the system</p>
      </div>

      <!-- Info Box -->
      <div class="alert alert-info mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <div class="font-medium">About Context Types</div>
          <div class="text-sm">
            Context types define the different kinds of information that can be ingested into projects. 
            These are system-managed and include types like documents, emails, meetings, and more.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContextTypesQuery } from '@/generated/graphql'

// GraphQL
const { result: typesResult, loading: typesLoading } = useContextTypesQuery()

// Computed
const contextTypes = computed(() => typesResult.value?.contextTypes || [])
</script>
