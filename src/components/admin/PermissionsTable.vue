<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-header p-6 border-b border-base-300">
      <h2 class="card-title text-xl font-semibold">System Permissions</h2>
      <p class="text-base-content/70 mt-1">Manage individual permissions and their resource associations</p>
    </div>
    
    <div class="card-body p-6">
      <!-- Search and Filter -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <div class="form-control">
            <input 
              type="text" 
              placeholder="Search permissions..." 
              class="input input-bordered input-sm w-64"
              v-model="searchQuery"
            />
          </div>
          <div class="form-control">
            <select class="select select-bordered select-sm w-48" v-model="resourceFilter">
              <option value="">All Resources</option>
              <option v-for="resource in resources" :key="resource.id" :value="resource.id">
                {{ resource.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="text-sm text-base-content/60">
          {{ filteredPermissions.length }} of {{ permissions.length }} permissions
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Permission</th>
              <th>Resource</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="permission in filteredPermissions" :key="permission.id">
              <!-- Permission Action & Description -->
              <td>
                <div>
                  <div class="font-bold font-mono text-sm">{{ permission.action }}</div>
                  <div class="text-sm opacity-50" v-if="permission.description">{{ permission.description }}</div>
                </div>
              </td>
              
              <!-- Resource -->
              <td>
                <div class="badge badge-outline">{{ permission.resourceName }}</div>
              </td>
              
              <!-- Status -->
              <td>
                <div class="badge" :class="permission.isActive ? 'badge-success' : 'badge-warning'">
                  {{ permission.isActive ? 'Active' : 'Inactive' }}
                </div>
              </td>
              
              <!-- Created Date -->
              <td>
                <div class="text-sm">{{ formatDate(permission.createdAt) }}</div>
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
                      <a @click="$emit('edit', permission)" :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Permission
                      </a>
                    </li>
                    <div class="divider my-1"></div>
                    <li>
                      <a 
                        @click="handleDelete(permission)" 
                        :disabled="isLoading"
                        class="text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Permission
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredPermissions.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 class="font-semibold text-base-content/70 mb-1">No permissions found</h3>
          <p class="text-base-content/50 text-sm">
            {{ searchQuery || resourceFilter ? 'Try adjusting your search criteria' : 'Get started by creating your first permission' }}
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
  permissions: any[]
  resources: any[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  edit: [permission: any]
  delete: [permission: any]
}>()

// Local state
const searchQuery = ref('')
const resourceFilter = ref('')

// Computed
const filteredPermissions = computed(() => {
  let filtered = props.permissions
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(permission => 
      permission.action.toLowerCase().includes(query) ||
      permission.description?.toLowerCase().includes(query) ||
      permission.resourceName.toLowerCase().includes(query)
    )
  }
  
  // Filter by resource
  if (resourceFilter.value) {
    filtered = filtered.filter(permission => permission.resourceId === resourceFilter.value)
  }
  
  return filtered
})

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleDelete = (permission: any) => {
  if (confirm(`Are you sure you want to delete the permission "${permission.action}"? This action cannot be undone.`)) {
    emit('delete', permission)
  }
}
</script>
