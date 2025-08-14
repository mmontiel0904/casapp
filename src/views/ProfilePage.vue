<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-base-content">Profile Settings</h1>
        <p class="text-base-content/70 mt-2">Manage your account information and preferences</p>
      </div>
      
      <!-- User Role Badge -->
      <div v-if="currentUser?.role" class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-sm text-base-content/70">Current Role</div>
          <div :class="getRoleBadgeClass(currentUser.role)" class="badge badge-lg">
            {{ currentUser.role.name }}
            <span class="ml-2 text-xs opacity-75">Level {{ currentUser.role.level }}</span>
          </div>
        </div>
        
        <!-- Super Admin Crown -->
        <div v-if="isSuperAdmin" class="tooltip" data-tip="Super Administrator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-warning" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 14l5.5-5.5L10 7l4 4 4-4 1.5 1.5L14 14l2 2H5z"/>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information Card -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-xl font-serif mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>

            <form @submit.prevent="handleUpdateProfile" class="space-y-6">
              <!-- Avatar Section -->
              <div class="flex items-center gap-6">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-20">
                    <span class="text-2xl font-bold">{{ userInitials }}</span>
                  </div>
                </div>
                <div>
                  <button type="button" class="btn btn-outline btn-sm">
                    Change Avatar
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <p class="text-xs text-base-content/60 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">First Name</span>
                  </label>
                  <input 
                    v-model="profileForm.firstName"
                    type="text" 
                    placeholder="Enter your first name"
                    class="input input-bordered focus:input-primary" 
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Last Name</span>
                  </label>
                  <input 
                    v-model="profileForm.lastName"
                    type="text" 
                    placeholder="Enter your last name"
                    class="input input-bordered focus:input-primary" 
                  />
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Email Address</span>
                </label>
                <input 
                  v-model="profileForm.email"
                  type="email" 
                  class="input input-bordered"
                  disabled
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/60">
                    Email cannot be changed. Contact administrator if needed.
                  </span>
                </label>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4">
                <button type="button" @click="resetForm" class="btn btn-ghost">
                  Reset Changes
                </button>
                <button 
                  type="submit" 
                  :disabled="updateLoading || !hasChanges"
                  class="btn btn-primary"
                >
                  <span v-if="updateLoading" class="loading loading-spinner loading-xs"></span>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Security Section -->
        <PasswordChangeForm />
      </div>

      <!-- Sidebar Information -->
      <div class="space-y-6">
        <!-- Account Status -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">Account Status</h3>
            
            <div class="space-y-4">
              <!-- Email Verification -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Email Verified</span>
                <div :class="currentUser?.isEmailVerified ? 'badge-success' : 'badge-warning'" class="badge">
                  {{ currentUser?.isEmailVerified ? 'Verified' : 'Pending' }}
                </div>
              </div>

              <!-- Account Created -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Member Since</span>
                <span class="text-sm text-base-content/70">
                  {{ formatDate(currentUser?.createdAt) }}
                </span>
              </div>

              <!-- Last Updated -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Last Updated</span>
                <span class="text-sm text-base-content/70">
                  {{ formatDate(currentUser?.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Overview -->
        <div v-if="userPermissions.length > 0" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">
              Your Permissions
              <div class="badge badge-accent">{{ userPermissions.length }}</div>
            </h3>
            
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="permission in userPermissions" 
                :key="permission"
                class="flex items-center gap-2 p-2 bg-base-200 rounded text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatPermissionName(permission) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Role Information -->
        <div v-if="currentUser?.role" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-lg mb-4">Role Details</h3>
            
            <div class="space-y-4">
              <div>
                <div class="text-sm font-medium text-base-content/70">Role Name</div>
                <div class="text-lg font-bold">{{ currentUser.role.name }}</div>
              </div>
              
              <div>
                <div class="text-sm font-medium text-base-content/70">Authority Level</div>
                <div class="flex items-center gap-2">
                  <div class="text-lg font-bold">{{ currentUser.role.level }}</div>
                  <progress 
                    class="progress progress-primary w-20" 
                    :value="currentUser.role.level" 
                    max="100"
                  ></progress>
                </div>
              </div>
              
              <div v-if="currentUser.role.description">
                <div class="text-sm font-medium text-base-content/70">Description</div>
                <div class="text-sm">{{ currentUser.role.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { usePermissions } from '../composables/usePermissions'
import PasswordChangeForm from '../components/forms/PasswordChangeForm.vue'
import type { Role } from '../generated/graphql'

// Auth and permissions
const { currentUser } = useAuth()
const { userPermissions, isSuperAdmin } = usePermissions()

// Form states
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})


const updateLoading = ref(false)

// Computed properties
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

const hasChanges = computed(() => {
  if (!currentUser.value) return false
  
  return profileForm.value.firstName !== (currentUser.value.firstName || '') ||
         profileForm.value.lastName !== (currentUser.value.lastName || '')
})

// Helper functions
const getRoleBadgeClass = (role: Role): string => {
  if (role.level >= 100) return 'badge-error' // Super admin
  if (role.level >= 50) return 'badge-warning' // Admin  
  if (role.level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPermissionName = (permission: string): string => {
  return permission
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Actions
const resetForm = () => {
  if (currentUser.value) {
    profileForm.value = {
      firstName: currentUser.value.firstName || '',
      lastName: currentUser.value.lastName || '',
      email: currentUser.value.email
    }
  }
}

const handleUpdateProfile = async () => {
  updateLoading.value = true
  
  try {
    // TODO: Implement profile update mutation when available in API
    console.log('Profile update:', profileForm.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Success feedback would be handled here
    console.log('Profile updated successfully')
  } catch (error) {
    console.error('Profile update failed:', error)
  } finally {
    updateLoading.value = false
  }
}


// Initialize form with current user data
onMounted(() => {
  resetForm()
})
</script>