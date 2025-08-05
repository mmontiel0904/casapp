<template>
  <div class="min-h-screen bg-base-200">
    <!-- Persistent Navigation Bar -->
    <nav class="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 lg:px-6 sticky top-0 z-50">
      <div class="navbar-start">
        <!-- Logo -->
        <router-link to="/" class="btn btn-ghost text-xl font-bold font-serif text-primary">
          CasApp
        </router-link>
        
        <!-- Main Navigation Menu Button -->
        <div class="dropdown dropdown-end ml-4">
          <div tabindex="0" role="button" class="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-md dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-64">
            <!-- Dashboard -->
            <li>
              <router-link to="/" class="flex items-center gap-3 p-3 rounded-lg">
                <div class="p-2 rounded-lg bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">Dashboard</div>
                  <div class="text-xs text-base-content/60">Overview & quick actions</div>
                </div>
              </router-link>
            </li>
            
            <!-- My Tasks -->
            <li v-if="canAccessTasks">
              <router-link to="/my-tasks" class="flex items-center gap-3 p-3 rounded-lg">
                <div class="p-2 rounded-lg bg-success/10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">My Tasks</div>
                  <div class="text-xs text-base-content/60">Personal task management</div>
                </div>
              </router-link>
            </li>
            
            <!-- Projects -->
            <li v-if="canAccessProjects">
              <router-link to="/projects" class="flex items-center gap-3 p-3 rounded-lg">
                <div class="p-2 rounded-lg bg-info/10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">Projects</div>
                  <div class="text-xs text-base-content/60">Project management & tasks</div>
                </div>
              </router-link>
            </li>
            
            <!-- Admin Section -->
            <div v-if="canManageUsers || canAdminSystem" class="divider my-2 text-xs text-base-content/50">Administration</div>
            
            <!-- User Management -->
            <li v-if="canManageUsers">
              <router-link to="/admin/users" class="flex items-center gap-3 p-3 rounded-lg">
                <div class="p-2 rounded-lg bg-warning/10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">User Management</div>
                  <div class="text-xs text-base-content/60">Manage users & permissions</div>
                </div>
              </router-link>
            </li>
            
            <!-- Role & Permission Administration -->
            <li v-if="canAdminSystem">
              <router-link to="/admin/roles" class="flex items-center gap-3 p-3 rounded-lg">
                <div class="p-2 rounded-lg bg-error/10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.25-4.5a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 000 4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">Role Administration</div>
                  <div class="text-xs text-base-content/60">Manage roles & permissions</div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="navbar-center hidden lg:flex">
        <!-- Universal Search Bar -->
        <div class="form-control">
          <div class="input-group">
            <input 
              type="text" 
              placeholder="Search anything..." 
              class="input input-bordered input-md w-96"
              v-model="searchQuery"
            />
            <button class="btn btn-square btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <!-- Mobile search -->
        <div class="dropdown dropdown-end lg:hidden mr-2">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div tabindex="0" class="dropdown-content mt-3 z-[1] p-4 shadow-lg bg-base-100 rounded-box w-80">
            <div class="form-control">
              <input 
                type="text" 
                placeholder="Search..." 
                class="input input-bordered w-full"
                v-model="searchQuery"
              />
            </div>
          </div>
        </div>

        <!-- User Menu (Settings Only) -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost avatar relative">
            <div class="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span class="text-sm font-medium">
                {{ userInitials }}
              </span>
            </div>
            
            <!-- Role Badge -->
            <div v-if="currentUserRole" class="absolute -top-1 -right-1">
              <div 
                :class="getRoleBadgeClass(currentUserRole)" 
                class="badge badge-xs"
                :title="`${currentUserRole.name} (Level ${currentUserRole.level})`"
              >
                <svg v-if="isSuperAdmin" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg v-else-if="isAdmin" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.25-4.5a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 000 4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-72">
            <!-- User Info Header -->
            <li>
              <div class="px-4 py-3 text-sm border-b border-base-300 hover:bg-transparent">
                <div class="font-semibold">{{ userDisplayName }}</div>
                <div class="text-base-content/70">{{ currentUser?.email }}</div>
                <div v-if="currentUserRole" class="flex items-center gap-2 mt-2">
                  <div :class="getRoleBadgeClass(currentUserRole)" class="badge badge-xs">
                    <svg v-if="isSuperAdmin" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg v-else-if="isAdmin" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.25-4.5a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 000 4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ currentUserRole.name }}
                  </div>
                  <span class="text-xs text-base-content/60">Level {{ currentUserRole.level }}</span>
                </div>
              </div>
            </li>
            
            <!-- Settings Section -->
            <li>
              <router-link to="/profile" class="flex items-center gap-3 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Settings
              </router-link>
            </li>
            
            <li>
              <a href="#" class="flex items-center gap-3 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Preferences
              </a>
            </li>
            
            <div class="divider my-1"></div>
            
            <!-- Sign Out -->
            <li>
              <button @click="handleLogout" class="text-error flex items-center gap-3 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { usePermissions } from '../composables/usePermissions'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { canManageUsers, canAdminSystem, isSuperAdmin, isAdmin, currentUserRole, canAccessTasks, canAccessProjects } = usePermissions()
const searchQuery = ref('')


// Helper functions
const getRoleBadgeClass = (role: any): string => {
  if (!role) return 'badge-ghost'
  if (role.level >= 100) return 'badge-error' // Super admin
  if (role.level >= 50) return 'badge-warning' // Admin  
  if (role.level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

// Computed user display properties
const userDisplayName = computed(() => {
  if (!currentUser.value) return 'User'
  
  const { firstName, lastName, email } = currentUser.value
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return email.split('@')[0] // Use email username as fallback
  }
})

const userInitials = computed(() => {
  if (!currentUser.value) return 'U'
  
  const { firstName, lastName, email } = currentUser.value
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  } else if (firstName) {
    return firstName[0].toUpperCase()
  } else if (lastName) {
    return lastName[0].toUpperCase()
  } else {
    return email[0].toUpperCase()
  }
})

const handleLogout = async () => {
  logout()
  router.push('/login')
}
</script>