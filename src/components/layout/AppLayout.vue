<template>
  <div class="min-h-screen bg-base-200 flex">
    <!-- Left Navigation Side Panel -->
    <NavigationSidePanel 
      :is-open="showNavPanel"
      @close="showNavPanel = false"
      @navigate="handleNavigation"
    />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navigation Bar -->
      <nav class="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 lg:px-6 sticky top-0 z-30">
        <div class="navbar-start">
          <!-- Mobile Menu Button -->
          <button 
            @click="showNavPanel = !showNavPanel"
            class="btn btn-ghost btn-square lg:hidden"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          
          <!-- Desktop Menu Button -->
          <button 
            @click="showNavPanel = !showNavPanel"
            class="btn btn-ghost btn-square hidden lg:flex"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          
          <!-- Logo -->
          <router-link to="/" class="btn btn-ghost text-xl font-bold font-serif text-primary ml-2">
            CasApp
          </router-link>
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
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <!-- User Menu -->
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
                  <svg v-if="isSuperAdmin" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg v-else-if="isAdmin" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.25-4.5a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 000 4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <svg v-if="isSuperAdmin" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg v-else-if="isAdmin" class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Settings
                </router-link>
              </li>
              
              <li>
                <a href="#" class="flex items-center gap-3 p-3">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { usePermissions } from '../../composables/usePermissions'
import NavigationSidePanel from './NavigationSidePanel.vue'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { isSuperAdmin, isAdmin, currentUserRole } = usePermissions()
const searchQuery = ref('')
const showNavPanel = ref(false)


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

// Handle navigation events from side panel
const handleNavigation = () => {
  // Close side panel on mobile after navigation
  showNavPanel.value = false
}

const handleLogout = async () => {
  logout()
  router.push('/login')
}
</script>