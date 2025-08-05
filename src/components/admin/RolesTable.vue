<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-header p-6 border-b border-base-300">
      <h2 class="card-title text-xl font-semibold">System Roles</h2>
      <p class="text-base-content/70 mt-1">Manage role definitions and their associated permissions</p>
    </div>
    
    <div class="card-body p-6">
      <!-- Search and Filter -->
      <div class="flex justify-between items-center mb-4">
        <div class="form-control">
          <input 
            type="text" 
            placeholder="Search roles..." 
            class="input input-bordered input-sm w-64"
            v-model="searchQuery"
          />
        </div>
        <div class="text-sm text-base-content/60">
          {{ filteredRoles.length }} of {{ roles.length }} roles
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Role</th>
              <th>Level</th>
              <th>Users</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in filteredRoles" :key="role.id">
              <!-- Role Name & Description -->
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-8 h-8">
                      <span class="text-xs">{{ role.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ role.name }}</div>
                    <div class="text-sm opacity-50" v-if="role.description">{{ role.description }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Level -->
              <td>
                <div class="badge" :class="getRoleLevelBadgeClass(role.level)">
                  Level {{ role.level }}
                </div>
              </td>
              
              <!-- User Count -->
              <td>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {{ role.userCount }} users
                </div>
              </td>
              
              <!-- Permissions Count -->
              <td>
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {{ role.permissions.length }} permissions
                </div>
              </td>
              
              <!-- Status -->
              <td>
                <div class="badge" :class="role.isActive ? 'badge-success' : 'badge-warning'">
                  {{ role.isActive ? 'Active' : 'Inactive' }}
                </div>
              </td>
              
              <!-- Created Date -->
              <td>
                <div class="text-sm">{{ formatDate(role.createdAt) }}</div>
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
                      <a @click="$emit('edit', role)" :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Role
                      </a>
                    </li>
                    <li>
                      <a @click="$emit('assign-permissions', role)" :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Assign Permissions
                      </a>
                    </li>
                    <div class="divider my-1"></div>
                    <li>
                      <a 
                        @click="handleDelete(role)" 
                        :disabled="isLoading"
                        class="text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Role
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredRoles.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="font-semibold text-base-content/70 mb-1">No roles found</h3>
          <p class="text-base-content/50 text-sm">
            {{ searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first role' }}
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
  roles: any[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

// Emits
const emit = defineEmits<{
  edit: [role: any]
  delete: [role: any]
  'assign-permissions': [role: any]
}>()

// Local state
const searchQuery = ref('')

// Computed
const filteredRoles = computed(() => {
  if (!searchQuery.value) return props.roles
  
  const query = searchQuery.value.toLowerCase()
  return props.roles.filter(role => 
    role.name.toLowerCase().includes(query) ||
    role.description?.toLowerCase().includes(query)
  )
})

// Methods
const getRoleLevelBadgeClass = (level: number): string => {
  if (level >= 100) return 'badge-error' // Super admin
  if (level >= 50) return 'badge-warning' // Admin  
  if (level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleDelete = (role: any) => {
  if (confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
    emit('delete', role)
  }
}
</script>
