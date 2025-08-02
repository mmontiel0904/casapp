<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-base-content">User Management</h1>
        <p class="text-base-content/70 mt-2">Manage users, roles, and permissions</p>
      </div>
      
      <!-- Admin Actions -->
      <div class="flex gap-4">
        <button 
          v-if="canInviteUsers"
          @click="showInviteModal = true"
          class="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Invite User
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="usersLoading || rolesLoading" class="flex justify-center py-12">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="usersError || rolesError" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Failed to load data. Please try again.</span>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-title">Total Users</div>
          <div class="stat-value text-primary">{{ users?.length || 0 }}</div>
          <div class="stat-desc">Active users in system</div>
        </div>
        
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-title">Admin Users</div>
          <div class="stat-value text-accent">{{ adminCount }}</div>
          <div class="stat-desc">Users with admin roles</div>
        </div>
        
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-title">Available Roles</div>
          <div class="stat-value text-secondary">{{ activeRoles?.length || 0 }}</div>
          <div class="stat-desc">Active role definitions</div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center mb-6">
            <h2 class="card-title text-2xl">Users</h2>
            
            <!-- Filter Controls -->
            <div class="flex gap-4">
              <select v-model="selectedRoleFilter" class="select select-bordered">
                <option value="">All Roles</option>
                <option v-for="role in activeRoles" :key="role.id" :value="role.name">
                  {{ role.name }} (Level {{ role.level }})
                </option>
              </select>
            </div>
          </div>

          <!-- Users Grid -->
          <div class="grid gap-4">
            <div 
              v-for="user in filteredUsers" 
              :key="user.id"
              class="flex items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
            >
              <!-- User Info -->
              <div class="flex items-center gap-4">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-12">
                    <span class="text-lg">{{ getUserInitials(user) }}</span>
                  </div>
                </div>
                
                <div>
                  <div class="font-semibold text-lg">
                    {{ user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'No Name' }}
                  </div>
                  <div class="text-sm text-base-content/70">{{ user.email }}</div>
                  
                  <!-- Role Badge -->
                  <div class="mt-1">
                    <span 
                      v-if="user.role"
                      :class="getRoleBadgeClass(user.role)"
                      class="badge badge-sm"
                    >
                      {{ user.role.name }} (Level {{ user.role.level }})
                    </span>
                    <span v-else class="badge badge-ghost badge-sm">No Role</span>
                  </div>
                </div>
              </div>

              <!-- User Actions -->
              <div class="flex items-center gap-2">
                <!-- Permissions Count -->
                <div class="tooltip" :data-tip="`${user.permissions.length} permissions`">
                  <div class="badge badge-info badge-outline">
                    {{ user.permissions.length }} perms
                  </div>
                </div>

                <!-- Email Verification Status -->
                <div class="tooltip" :data-tip="user.isEmailVerified ? 'Email verified' : 'Email not verified'">
                  <div :class="user.isEmailVerified ? 'badge-success' : 'badge-warning'" class="badge badge-sm">
                    {{ user.isEmailVerified ? '✓' : '!' }}
                  </div>
                </div>

                <!-- Role Management Actions -->
                <div v-if="canEditUserRoles && canManageUser(convertToAuthUser(user))" class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="openRoleAssignmentModal(user)">Assign Role</a></li>
                    <li v-if="user.role"><a @click="removeUserRole(user)" class="text-error">Remove Role</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="mt-4 text-base-content/70">No users found matching your filters</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite User Modal -->
    <div v-if="showInviteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Invite New User</h3>
        
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email Address</span>
            </label>
            <input 
              v-model="inviteForm.email" 
              type="email" 
              placeholder="user@example.com"
              class="input input-bordered" 
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Assign Role (Optional)</span>
            </label>
            <select v-model="inviteForm.roleId" class="select select-bordered">
              <option value="">No Role</option>
              <option 
                v-for="role in assignableRoles" 
                :key="role.id" 
                :value="role.id"
              >
                {{ role.name }} (Level {{ role.level }})
              </option>
            </select>
          </div>
        </div>

        <div class="modal-action">
          <button @click="showInviteModal = false" class="btn btn-ghost">Cancel</button>
          <button 
            @click="handleInviteUser" 
            :disabled="inviteUserLoading || !inviteForm.email"
            class="btn btn-primary"
          >
            <span v-if="inviteUserLoading" class="loading loading-spinner loading-xs"></span>
            Send Invitation
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showInviteModal = false"></div>
    </div>

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          Assign Role to {{ selectedUser?.firstName || selectedUser?.email }}
        </h3>
        
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Select Role</span>
            </label>
            <select v-model="selectedRoleId" class="select select-bordered">
              <option value="">No Role</option>
              <option 
                v-for="role in assignableRoles" 
                :key="role.id" 
                :value="role.id"
              >
                {{ role.name }} (Level {{ role.level }})
                <span v-if="role.description"> - {{ role.description }}</span>
              </option>
            </select>
          </div>
        </div>

        <div class="modal-action">
          <button @click="closeRoleModal" class="btn btn-ghost">Cancel</button>
          <button 
            @click="handleAssignRole" 
            :disabled="assignRoleLoading || !selectedRoleId"
            class="btn btn-primary"
          >
            <span v-if="assignRoleLoading" class="loading loading-spinner loading-xs"></span>
            Assign Role
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeRoleModal"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  useAllUsersQuery, 
  useAllRolesQuery, 
  useAssignRoleMutation,
  useRemoveUserRoleMutation,
  useInviteUserWithRoleMutation,
  type Role,
  type AllUsersQuery
} from '../generated/graphql'
import { usePermissions } from '../composables/usePermissions'
import { useApolloFeedback } from '../composables/useApolloFeedback'
import type { AuthUser } from '../services/permissions'

// Type aliases for actual GraphQL query results
type QueryUser = AllUsersQuery['allUsers'][0]
type QueryRole = NonNullable<QueryUser['role']>

// Helper to convert GraphQL role to full Role type
const convertToFullRole = (queryRole: QueryRole): Role => ({
  ...queryRole,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
})

// Helper to convert GraphQL query user to AuthUser with proper type handling
const convertToAuthUser = (user: QueryUser): AuthUser => {
  // Create a copy of the user with proper role conversion
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    permissions: user.permissions,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role ? convertToFullRole(user.role) : null
  }
  return authUser
}

// Permissions
const { 
  canInviteUsers, 
  canEditUserRoles, 
  canAssignRole, 
  canManageUser 
} = usePermissions()

// Data fetching
const { result: usersResult, loading: usersLoading, error: usersError } = useAllUsersQuery()
const { result: rolesResult, loading: rolesLoading, error: rolesError } = useAllRolesQuery()

// Computed data
const users = computed(() => usersResult.value?.allUsers || [])
const roles = computed(() => rolesResult.value?.allRoles || [])
const activeRoles = computed(() => roles.value.filter(role => role.isActive))

// Statistics
const adminCount = computed(() => 
  users.value.filter(user => user.role && user.role.level >= 50).length
)

// Filtering
const selectedRoleFilter = ref('')
const filteredUsers = computed(() => {
  if (!selectedRoleFilter.value) return users.value
  return users.value.filter(user => user.role?.name === selectedRoleFilter.value)
})

// Role assignment permissions - all roles should be assignable if user has permission
const assignableRoles = computed(() => {
  return activeRoles.value.filter(role => {
    // Convert AllRoles query result to Role type for permission checking
    const fullRole: Role = {
      id: role.id,
      name: role.name,
      level: role.level,
      description: role.description,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }
    return canAssignRole(fullRole)
  })
})

// Mutations
const { mutate: assignRole, loading: assignRoleLoading } = useAssignRoleMutation()
const { mutate: removeRole } = useRemoveUserRoleMutation()
const { mutate: inviteUserWithRole, loading: inviteUserLoading } = useInviteUserWithRoleMutation()

// Apollo feedback
const feedback = useApolloFeedback()

// Modal state
const showInviteModal = ref(false)
const showRoleModal = ref(false)
const selectedUser = ref<QueryUser | null>(null)
const selectedRoleId = ref('')

// Form state
const inviteForm = ref({
  email: '',
  roleId: ''
})

// Helper functions
const getUserInitials = (user: QueryUser): string => {
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (lastName) return lastName[0].toUpperCase()
  return user.email[0].toUpperCase()
}

const getRoleBadgeClass = (role: QueryRole | Role): string => {
  if (role.level >= 100) return 'badge-error' // Super admin
  if (role.level >= 50) return 'badge-warning' // Admin
  if (role.level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

// Actions
const openRoleAssignmentModal = (user: QueryUser) => {
  selectedUser.value = user
  selectedRoleId.value = user.role?.id || ''
  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
  selectedRoleId.value = ''
}

const handleAssignRole = async () => {
  if (!selectedUser.value || !selectedRoleId.value) return

  try {
    await assignRole({
      userId: selectedUser.value.id,
      roleId: selectedRoleId.value
    })
    
    feedback.success('Role Assigned', 'User role updated successfully')
    closeRoleModal()
  } catch (error) {
    feedback.error('Assignment Failed', 'Could not assign role to user')
  }
}

const removeUserRole = async (user: QueryUser) => {
  const authUser = convertToAuthUser(user)
  if (!canManageUser(authUser)) return

  try {
    await removeRole({ userId: user.id })
    feedback.success('Role Removed', 'User role removed successfully')
  } catch (error) {
    feedback.error('Removal Failed', 'Could not remove user role')
  }
}

const handleInviteUser = async () => {
  if (!inviteForm.value.email) return

  try {
    await inviteUserWithRole({
      email: inviteForm.value.email,
      roleId: inviteForm.value.roleId || undefined
    })
    
    feedback.success('Invitation Sent', 'User invitation sent successfully')
    showInviteModal.value = false
    inviteForm.value = { email: '', roleId: '' }
  } catch (error) {
    feedback.error('Invitation Failed', 'Could not send user invitation')
  }
}

// Note: Apollo feedback is handled manually in the action functions above
// since we need different success messages for different operations
</script>