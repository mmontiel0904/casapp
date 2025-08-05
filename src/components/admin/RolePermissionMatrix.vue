<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-header p-6 border-b border-base-300">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="card-title text-xl font-semibold">Role-Permission Matrix</h2>
          <p class="text-base-content/70 mt-1">Visual overview of permissions assigned to each role</p>
        </div>
      </div>
    </div>
    
    <div class="card-body p-6">
      <!-- Matrix Table -->
      <div class="overflow-x-auto">
        <table class="table table-pin-rows">
          <!-- Headers -->
          <thead>
            <tr>
              <th class="bg-base-200 w-64">
                <span class="font-semibold">Role</span>
              </th>
              <th 
                v-for="permission in permissions" 
                :key="permission.id"
                class="bg-base-200 text-center min-w-32"
              >
                <span class="font-mono text-xs font-semibold">{{ permission.action }}</span>
              </th>
            </tr>
          </thead>
          
          <!-- Matrix Body -->
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="hover">
              <td class="font-medium">
                <span class="font-semibold">{{ role.name }}</span>
              </td>
              <td 
                v-for="permission in permissions" 
                :key="permission.id"
                class="text-center p-2"
              >
                <div 
                  class="w-6 h-6 rounded mx-auto cursor-pointer"
                  :class="hasPermission(role, permission) ? 'bg-success' : 'bg-base-300'"
                  @click="togglePermission(role, permission)"
                >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  roles: any[]
  permissions: any[]
  resources: any[]
  isLoading?: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  'toggle-permission': [roleId: string, permissionId: string, hasPermission: boolean]
}>()

// Helper functions
const hasPermission = (role: any, permission: any) => {
  return role.permissions?.some((p: any) => p.id === permission.id) || false
}

const togglePermission = (role: any, permission: any) => {
  const hasCurrentPermission = hasPermission(role, permission)
  emit('toggle-permission', role.id, permission.id, hasCurrentPermission)
}
</script>
