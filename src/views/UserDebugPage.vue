<template>
  <div class="container mx-auto p-6">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-header p-6 border-b border-base-300">
        <h2 class="card-title text-xl font-semibold">User Debug Information</h2>
        <p class="text-base-content/70 mt-1">Debug current user's roles and permissions</p>
      </div>
      
      <div class="card-body p-6 space-y-6">
        <!-- Current User Info -->
        <div v-if="currentUser">
          <h3 class="text-lg font-semibold mb-3">Current User</h3>
          <div class="bg-base-200 p-4 rounded-lg">
            <pre class="text-sm">{{ JSON.stringify(currentUser, null, 2) }}</pre>
          </div>
        </div>

        <!-- User Permissions -->
        <div v-if="userPermissions.length > 0">
          <h3 class="text-lg font-semibold mb-3">User Permissions ({{ userPermissions.length }})</h3>
          <div class="bg-base-200 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div v-for="permission in userPermissions" :key="permission" class="badge badge-primary">
                {{ permission }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Permissions Warning -->
        <div v-else-if="!isLoading" class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="font-bold">No permissions found!</h3>
            <div class="text-sm">This confirms your user was created before the role system. Assign a role below to fix this.</div>
          </div>
        </div>

        <!-- Available Roles -->
        <div v-if="allRoles.length > 0">
          <h3 class="text-lg font-semibold mb-3">Available Roles</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Level</th>
                  <th>Permissions Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in allRoles" :key="role.id">
                  <td>{{ role.name }}</td>
                  <td>
                    <div class="badge" :class="getRoleLevelBadgeClass(role.level)">
                      Level {{ role.level }}
                    </div>
                  </td>
                  <td>{{ role.permissions?.length || 0 }}</td>
                  <td>
                    <button 
                      class="btn btn-sm btn-primary"
                      @click="assignRoleToUser(role)"
                      :disabled="isAssigning"
                    >
                      {{ isAssigning ? 'Assigning...' : 'Assign to Me' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Fix Buttons -->
        <div class="flex gap-4">
          <button 
            class="btn btn-warning"
            @click="refreshUserData"
            :disabled="isLoading"
          >
            Refresh Data
          </button>
          <button 
            class="btn btn-error"
            @click="createMissingAdminRole"
            :disabled="isCreating"
          >
            {{ isCreating ? 'Creating...' : 'Create Admin Role' }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-2">Loading user data...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error: {{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { USER_PERMISSIONS_QUERY } from '../graphql/queries'
import { ALL_ROLES_WITH_PERMISSIONS_QUERY, CREATE_ROLE_MUTATION } from '../graphql/roles'
import { ASSIGN_ROLE_MUTATION } from '../graphql/mutations'

const { currentUser } = useAuth()
const isLoading = ref(false)
const isAssigning = ref(false)
const isCreating = ref(false)
const error = ref('')
const userPermissions = ref<string[]>([])
const allRoles = ref<any[]>([])

// Queries
const { load: loadUserPermissions } = useLazyQuery(USER_PERMISSIONS_QUERY)
const { load: loadAllRoles } = useLazyQuery(ALL_ROLES_WITH_PERMISSIONS_QUERY)

// Mutations
const { mutate: assignRole } = useMutation(ASSIGN_ROLE_MUTATION)
const { mutate: createRole } = useMutation(CREATE_ROLE_MUTATION)

const getRoleLevelBadgeClass = (level: number): string => {
  if (level >= 100) return 'badge-error' // Super admin
  if (level >= 50) return 'badge-warning' // Admin  
  if (level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

const refreshUserData = async () => {
  if (!currentUser.value?.id) {
    error.value = 'No current user found'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    console.log('Loading user data for:', currentUser.value.id)
    
    // Load user permissions
    try {
      const permissionsResult = await loadUserPermissions(USER_PERMISSIONS_QUERY, { userId: currentUser.value.id })
      console.log('Permissions result:', permissionsResult)
      if (permissionsResult?.userPermissions) {
        userPermissions.value = permissionsResult.userPermissions
      }
    } catch (permError) {
      console.warn('Could not load user permissions:', permError)
      // Continue even if permissions fail
    }

    // Load all roles
    try {
      const rolesResult = await loadAllRoles(ALL_ROLES_WITH_PERMISSIONS_QUERY)
      console.log('Roles result:', rolesResult)
      if (rolesResult?.allRolesWithPermissions) {
        allRoles.value = rolesResult.allRolesWithPermissions
      } else if (rolesResult?.roles) {
        allRoles.value = rolesResult.roles
      }
    } catch (roleError) {
      console.warn('Could not load roles:', roleError)
      // Continue even if roles fail
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
    console.error('Error loading user data:', err)
  } finally {
    isLoading.value = false
  }
}

const assignRoleToUser = async (role: any) => {
  if (!currentUser.value?.id) {
    error.value = 'No current user found'
    return
  }
  
  isAssigning.value = true
  error.value = ''
  
  try {
    console.log('Assigning role:', role.name, 'to user:', currentUser.value.id)
    
    const result = await assignRole({
      userId: currentUser.value.id,
      roleId: role.id
    })
    
    console.log('Assignment result:', result)
    
    // Refresh data after assignment
    await refreshUserData()
    
    // Force reload of current user to get updated role
    window.location.reload()
    
    alert(`Successfully assigned role "${role.name}" to your user! Page will reload to update permissions.`)
  } catch (err) {
    console.error('Error assigning role:', err)
    error.value = err instanceof Error ? err.message : 'Failed to assign role'
  } finally {
    isAssigning.value = false
  }
}

const createMissingAdminRole = async () => {
  isCreating.value = true
  error.value = ''
  
  try {
    console.log('Creating Super Admin role...')
    
    const result = await createRole({
      roleData: {
        name: 'Super Admin',
        level: 100,
        description: 'Full system administrator with all permissions',
        isActive: true
      }
    })
    
    console.log('Create role result:', result)
    
    if (result?.data?.createRole) {
      await refreshUserData()
      alert('Super Admin role created successfully! You can now assign it to yourself.')
    } else {
      throw new Error('Failed to create role - no data returned')
    }
  } catch (err) {
    console.error('Error creating role:', err)
    error.value = err instanceof Error ? err.message : 'Failed to create admin role'
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  refreshUserData()
})
</script>
