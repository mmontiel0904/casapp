<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-header p-6 border-b border-base-300">
      <h2 class="card-title text-xl font-semibold">System Resources</h2>
      <p class="text-base-content/70 mt-1">Manage resources that permissions can be applied to</p>
    </div>
    
    <div class="card-body p-6">
      <!-- Search and Filter -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <div class="form-control">
            <input 
              type="text" 
              placeholder="Search resources..." 
              class="input input-bordered input-sm w-64"
              v-model="searchQuery"
            />
          </div>
          <div class="form-control">
            <select class="select select-bordered select-sm w-48" v-model="statusFilter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="text-sm text-base-content/60">
          {{ filteredResources.length }} of {{ resources.length }} resources
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in filteredResources" :key="resource.id">
              <!-- Resource Name -->
              <td>
                <div>
                  <div class="font-bold">{{ resource.name }}</div>
                  <div class="text-sm opacity-50 font-mono">{{ resource.id }}</div>
                </div>
              </td>
              
              <!-- Description -->
              <td>
                <div class="text-sm max-w-xs truncate" :title="resource.description || undefined">
                  {{ resource.description || 'No description' }}
                </div>
              </td>
              
              <!-- Permissions Count -->
              <td>
                <div class="flex items-center gap-2">
                  <div class="badge badge-primary">
                    {{ getPermissionCount(resource.id) }} permissions
                  </div>
                  <button 
                    v-if="getPermissionCount(resource.id) > 0"
                    @click="$emit('view-permissions', resource)"
                    class="btn btn-ghost btn-xs"
                    title="View permissions for this resource"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
              
              <!-- Status -->
              <td>
                <div class="badge" :class="resource.isActive ? 'badge-success' : 'badge-warning'">
                  {{ resource.isActive ? 'Active' : 'Inactive' }}
                </div>
              </td>
              
              <!-- Created Date -->
              <td>
                <div class="text-sm">{{ formatDate(resource.createdAt) }}</div>
              </td>
              
              <!-- Actions -->
              <td>
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                    <li>
                      <a @click="$emit('edit', resource)" :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Resource
                      </a>
                    </li>
                    <li>
                      <a @click="$emit('view-permissions', resource)" :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        View Permissions
                      </a>
                    </li>
                    <div class="divider my-1"></div>
                    <li>
                      <a 
                        @click="handleDelete(resource)" 
                        :disabled="isLoading || getPermissionCount(resource.id) > 0"
                        class="text-error"
                        :class="{ 'opacity-50': getPermissionCount(resource.id) > 0 }"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Resource
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredResources.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="font-semibold text-base-content/70 mb-1">No resources found</h3>
          <p class="text-base-content/50 text-sm">
            {{ searchQuery || statusFilter ? 'Try adjusting your search criteria' : 'Get started by creating your first resource' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  resources: any[]
  permissions: any[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  edit: [resource: any]
  delete: [resource: any]
  'view-permissions': [resource: any]
}>()

// Local state
const searchQuery = ref('')
const statusFilter = ref('')

// Computed
const filteredResources = computed(() => {
  let filtered = props.resources
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(resource => 
      resource.name.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query) ||
      resource.id.toLowerCase().includes(query)
    )
  }
  
  // Filter by status
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(resource => resource.isActive === isActive)
  }
  
  return filtered
})

// Methods
const getPermissionCount = (resourceId: string): number => {
  return props.permissions.filter(permission => permission.resourceId === resourceId).length
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleDelete = (resource: any) => {
  const permissionCount = getPermissionCount(resource.id)
  
  if (permissionCount > 0) {
    alert(`Cannot delete resource "${resource.name}" because it has ${permissionCount} associated permissions. Please remove all permissions first.`)
    return
  }
  
  if (confirm(`Are you sure you want to delete the resource "${resource.name}"? This action cannot be undone.`)) {
    emit('delete', resource)
  }
}
</script>
