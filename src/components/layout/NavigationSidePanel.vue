<template>
  <!-- Navigation Side Panel -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-40"
    @click.self="$emit('close')"
  >
    <!-- Backdrop (mobile only) -->
    <div class="absolute inset-0 bg-base-content/20 backdrop-blur-sm transition-opacity lg:hidden"></div>
    
    <!-- Side Panel -->
    <div class="absolute left-0 top-0 h-full w-80 bg-base-100 shadow-xl transform transition-transform ease-in-out duration-300">
      <!-- Panel Header -->
      <div class="flex items-center justify-between p-6 border-b border-base-300 bg-gradient-to-r from-primary/5 to-transparent">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="text-primary">
              <!-- Gradient definitions -->
              <defs>
                <linearGradient id="bgGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="heartGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <!-- Background circle -->
              <circle cx="60" cy="60" r="52" fill="url(#bgGradientNav)"/>
              
              <!-- Minimalist family representation using simple circles -->
              <!-- Parent figures (larger circles) -->
              <circle cx="44" cy="54" r="8" fill="white" opacity="0.95"/>
              <circle cx="76" cy="54" r="8" fill="white" opacity="0.95"/>
              
              <!-- Children figures (smaller circles) -->
              <circle cx="52" cy="71" r="5.5" fill="#FFE066" opacity="0.9"/>
              <circle cx="68" cy="71" r="5.5" fill="#66D9EF" opacity="0.9"/>
              
              <!-- Elegant heart with soft gradient -->
              <path d="M60 41 C56 37, 50 37, 50 43 C50 37, 44 37, 44 43 C44 49, 55 60, 60 64 C65 60, 76 49, 76 43 C76 37, 70 37, 70 43 C70 37, 64 37, 60 41 Z" 
                    fill="url(#heartGradientNav)" 
                    opacity="0.8"/>
            </svg>
          </div>
          <div>
            <router-link to="/" class="text-xl font-bold font-serif text-primary hover:text-primary/80 transition-colors">
              CasApp
            </router-link>
            <p class="text-xs text-base-content/60 mt-0.5">Project Management</p>
          </div>
        </div>
        
        <button 
          @click="$emit('close')"
          class="btn btn-ghost btn-square btn-sm hover:bg-base-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Navigation Content -->
      <div class="flex flex-col h-full">
        <!-- Main Navigation -->
        <nav class="flex-1 overflow-y-auto p-4">
          <div class="space-y-2">
            
            <!-- Dashboard -->
            <router-link 
              to="/" 
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
              :class="{ 'bg-primary/10 text-primary': $route.path === '/' }"
              @click="$emit('navigate')"
            >
              <div class="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold">Dashboard</div>
                <div class="text-xs text-base-content/60">Overview & quick actions</div>
              </div>
            </router-link>
            
            <!-- My Tasks -->
            <router-link 
              v-if="canAccessTasks"
              to="/my-tasks" 
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
              :class="{ 'bg-success/10 text-success': $route.path === '/my-tasks' }"
              @click="$emit('navigate')"
            >
              <div class="p-2 rounded-lg bg-success/10 group-hover:bg-success/20">
                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold">My Tasks</div>
                <div class="text-xs text-base-content/60">Personal task management</div>
              </div>
            </router-link>
            
            <!-- Projects -->
            <router-link 
              v-if="canAccessProjects"
              to="/projects" 
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
              :class="{ 'bg-info/10 text-info': $route.path === '/projects' }"
              @click="$emit('navigate')"
            >
              <div class="p-2 rounded-lg bg-info/10 group-hover:bg-info/20">
                <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold">Projects</div>
                <div class="text-xs text-base-content/60">Project management & tasks</div>
              </div>
            </router-link>
            
          </div>
          
          <!-- Admin Section -->
          <div v-if="canManageUsers || canAdminSystem" class="mt-8">
            <div class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-base-content/50 uppercase tracking-wider">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Administration
            </div>
            
            <div class="space-y-2 mt-3">
              <!-- User Management -->
              <router-link 
                v-if="canManageUsers"
                to="/admin/users" 
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
                :class="{ 'bg-warning/10 text-warning': $route.path === '/admin/users' }"
                @click="$emit('navigate')"
              >
                <div class="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20">
                  <svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-semibold">User Management</div>
                  <div class="text-xs text-base-content/60">Manage users & permissions</div>
                </div>
              </router-link>
              
              <!-- Role & Permission Administration -->
              <router-link 
                v-if="canAdminSystem"
                to="/admin/roles" 
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
                :class="{ 'bg-error/10 text-error': $route.path === '/admin/roles' }"
                @click="$emit('navigate')"
              >
                <div class="p-2 rounded-lg bg-error/10 group-hover:bg-error/20">
                  <svg class="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.25-4.5a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 000 4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-semibold">Role Administration</div>
                  <div class="text-xs text-base-content/60">Manage roles & permissions</div>
                </div>
              </router-link>
            </div>
          </div>
        </nav>
        
        <!-- User Profile Footer -->
        <div class="border-t border-base-300 p-4 bg-base-50">
          <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer" @click="showUserMenu = !showUserMenu">
            <!-- User Avatar -->
            <div class="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center relative">
              <span class="text-sm font-medium">
                {{ userInitials }}
              </span>
              
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
            
            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div class="font-semibold truncate">{{ userDisplayName }}</div>
              <div class="text-xs text-base-content/70 truncate">{{ currentUser?.email }}</div>
              <div v-if="currentUserRole" class="flex items-center gap-1 mt-1">
                <div :class="getRoleBadgeClass(currentUserRole)" class="badge badge-xs">
                  {{ currentUserRole.name }}
                </div>
                <span class="text-xs text-base-content/60">Level {{ currentUserRole.level }}</span>
              </div>
            </div>
            
            <!-- Menu Toggle -->
            <svg class="w-4 h-4 text-base-content/40" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          <!-- User Menu -->
          <div v-if="showUserMenu" class="mt-3 space-y-1">
            <router-link 
              to="/profile" 
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors text-sm"
              @click="$emit('navigate')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Account Settings
            </router-link>
            
            <a href="#" class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Preferences
            </a>
            
            <div class="divider my-2"></div>
            
            <button @click="handleLogout" class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors text-sm text-error w-full">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { usePermissions } from '../../composables/usePermissions'

// Props & Emits
interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<{
  close: []
  navigate: []
}>()

// Composables
const router = useRouter()
const { currentUser, logout } = useAuth()
const { canManageUsers, canAdminSystem, isSuperAdmin, isAdmin, currentUserRole, canAccessTasks, canAccessProjects } = usePermissions()

// Local state
const showUserMenu = ref(false)

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
  emit('close')
}
</script>