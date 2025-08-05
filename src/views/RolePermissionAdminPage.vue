<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-base-content font-serif mb-2">Role & Permission Administration</h1>
          <p class="text-base-content/70">Manage system roles, permissions, and access control</p>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex gap-3">
          <button 
            @click="activeTab = 'roles'; showCreateRoleModal = true"
            class="btn btn-primary btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Role
          </button>
          <button 
            @click="activeTab = 'permissions'; showCreatePermissionModal = true"
            class="btn btn-secondary btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            New Permission
          </button>
          <button 
            @click="activeTab = 'resources'; showCreateResourceModal = true"
            class="btn btn-accent btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            New Resource
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Failed to load data. Please try again.</span>
      <button @click="refetchAll" class="btn btn-sm btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-title">Total Roles</div>
          <div class="stat-value text-primary font-mono">{{ roles.length }}</div>
          <div class="stat-desc">System roles defined</div>
        </div>
        
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div class="stat-title">Total Permissions</div>
          <div class="stat-value text-secondary font-mono">{{ permissions.length }}</div>
          <div class="stat-desc">Available permissions</div>
        </div>
        
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="stat-title">Resources</div>
          <div class="stat-value text-accent font-mono">{{ resources.length }}</div>
          <div class="stat-desc">Protected resources</div>
        </div>
        
        <div class="stat bg-base-100 shadow rounded-lg">
          <div class="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="stat-title">Active Users</div>
          <div class="stat-value text-info font-mono">{{ totalUserCount }}</div>
          <div class="stat-desc">Users with roles</div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs tabs-boxed bg-base-200">
        <button 
          @click="activeTab = 'roles'"
          :class="['tab', activeTab === 'roles' ? 'tab-active' : '']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Roles ({{ roles.length }})
        </button>
        <button 
          @click="activeTab = 'permissions'"
          :class="['tab', activeTab === 'permissions' ? 'tab-active' : '']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Permissions ({{ permissions.length }})
        </button>
        <button 
          @click="activeTab = 'resources'"
          :class="['tab', activeTab === 'resources' ? 'tab-active' : '']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Resources ({{ resources.length }})
        </button>
        <button 
          @click="activeTab = 'assignments'"
          :class="['tab', activeTab === 'assignments' ? 'tab-active' : '']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Role Assignments
        </button>
      </div>

      <!-- Tab Content -->
      <div class="min-h-96">
        <!-- Roles Tab -->
        <div v-if="activeTab === 'roles'" class="space-y-4">
          <RolesTable 
            :roles="rolesWithPermissions"
            :is-loading="isMutating"
            @edit="handleEditRole"
            @delete="handleDeleteRole"
            @assign-permissions="handleAssignPermissions"
          />
        </div>

        <!-- Permissions Tab -->
        <div v-else-if="activeTab === 'permissions'" class="space-y-4">
          <PermissionsTable 
            :permissions="permissions"
            :resources="resources"
            :is-loading="isMutating"
            @edit="handleEditPermission"
            @delete="handleDeletePermission"
          />
        </div>

        <!-- Resources Tab -->
        <div v-else-if="activeTab === 'resources'" class="space-y-4">
          <ResourcesTable 
            :resources="resources"
            :permissions="permissions"
            :is-loading="isMutating"
            @edit="handleEditResource"
            @delete="handleDeleteResource"
            @view-permissions="handleViewResourcePermissions"
          />
        </div>

        <!-- Role Assignments Tab -->
        <div v-else-if="activeTab === 'assignments'" class="space-y-4">
          <RolePermissionMatrix
            :roles="rolesWithPermissions"
            :permissions="permissions"
            :resources="resources"
            :is-loading="isMutating"
            @toggle-permission="handleTogglePermission"
          />
        </div>
      </div>
    </div>

    <!-- TODO: Create these modal components -->
    <!--
    <CreateRoleModal
      v-model:show="showCreateRoleModal"
      @created="handleRoleCreated"
    />

    <EditRoleModal
      v-model:show="showEditRoleModal"
      :role="selectedRole"
      @updated="handleRoleUpdated"
    />

    <CreatePermissionModal
      v-model:show="showCreatePermissionModal"
      :resources="resources"
      @created="handlePermissionCreated"
    />

    <EditPermissionModal
      v-model:show="showEditPermissionModal"
      :permission="selectedPermission"
      :resources="resources"
      @updated="handlePermissionUpdated"
    />

    <CreateResourceModal
      v-model:show="showCreateResourceModal"
      @created="handleResourceCreated"
    />

    <EditResourceModal
      v-model:show="showEditResourceModal"
      :resource="selectedResource"
      @updated="handleResourceUpdated"
    />

    <RolePermissionAssignmentModal
      v-model:show="showAssignPermissionsModal"
      :role="selectedRole"
      :permissions="permissions"
      :assigned-permissions="selectedRolePermissions"
      @assign="handleAssignPermissionToRole"
      @remove="handleRemovePermissionFromRole"
    />
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRolePermissionManagement } from '../composables/useRolePermissionManagement'

// Import only the components we've created
import RolesTable from '../components/admin/RolesTable.vue'
import PermissionsTable from '../components/admin/PermissionsTable.vue'
import ResourcesTable from '../components/admin/ResourcesTable.vue'
import RolePermissionMatrix from '../components/admin/RolePermissionMatrix.vue'

// TODO: Create these modal components later
// import CreateRoleModal from '../components/admin/CreateRoleModal.vue'
// import EditRoleModal from '../components/admin/EditRoleModal.vue'
// import CreatePermissionModal from '../components/admin/CreatePermissionModal.vue'
// import EditPermissionModal from '../components/admin/EditPermissionModal.vue'
// import CreateResourceModal from '../components/admin/CreateResourceModal.vue'
// import EditResourceModal from '../components/admin/EditResourceModal.vue'
// import RolePermissionAssignmentModal from '../components/admin/RolePermissionAssignmentModal.vue'

// Use the role permission management composable
const {
  roles,
  rolesWithPermissions,
  permissions,
  resources,
  isLoading,
  isMutating,
  hasError,
  handleDeleteRole: deleteRole,
  handleDeletePermission: deletePermission,
  handleDeleteResource: deleteResource,
  handleAssignPermissionToRole,
  handleRemovePermissionFromRole,
  refetchAll
} = useRolePermissionManagement()

// Local state
const activeTab = ref<'roles' | 'permissions' | 'resources' | 'assignments'>('roles')

// Modal states
const showCreateRoleModal = ref(false)
const showEditRoleModal = ref(false)
const showCreatePermissionModal = ref(false)
const showEditPermissionModal = ref(false)
const showCreateResourceModal = ref(false)
const showEditResourceModal = ref(false)
const showAssignPermissionsModal = ref(false)

// Selected items for editing
const selectedRole = ref<any>(null)
const selectedPermission = ref<any>(null)
const selectedResource = ref<any>(null)

// Computed properties
const totalUserCount = computed(() => {
  return rolesWithPermissions.value.reduce((total: number, role: any) => total + role.userCount, 0)
})

// ========================================
// EVENT HANDLERS
// ========================================

// Role handlers
const handleEditRole = (role: any) => {
  selectedRole.value = role
  showEditRoleModal.value = true
}

// Permission handlers
const handleEditPermission = (permission: any) => {
  selectedPermission.value = permission
  showEditPermissionModal.value = true
}

// Resource handlers
const handleEditResource = (resource: any) => {
  selectedResource.value = resource
  showEditResourceModal.value = true
}

// Assignment handlers
const handleAssignPermissions = (role: any) => {
  selectedRole.value = role
  showAssignPermissionsModal.value = true
}

// Delete handlers that accept objects
const handleDeleteRole = async (role: any) => {
  if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
    await deleteRole(role.id, role.name)
  }
}

const handleDeletePermission = async (permission: any) => {
  if (confirm(`Are you sure you want to delete permission "${permission.action}"?`)) {
    await deletePermission(permission.id, permission.action)
  }
}

const handleDeleteResource = async (resource: any) => {
  if (confirm(`Are you sure you want to delete resource "${resource.name}"?`)) {
    await deleteResource(resource.id, resource.name)
  }
}

// Additional handlers for components
const handleViewResourcePermissions = (resource: any) => {
  // Switch to permissions tab and filter by resource
  activeTab.value = 'permissions'
  // TODO: Add resource filtering to PermissionsTable component
  console.log('Viewing permissions for resource:', resource.name)
}

const handleTogglePermission = (roleId: string, permissionId: string, hasPermission: boolean) => {
  if (hasPermission) {
    // Remove permission from role
    handleRemovePermissionFromRole(roleId, permissionId)
  } else {
    // Add permission to role
    handleAssignPermissionToRole(roleId, permissionId)
  }
}
</script>
