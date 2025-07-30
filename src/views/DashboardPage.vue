<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <header class="bg-base-100 shadow-sm border-b border-base-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">
              CasApp Dashboard
            </h1>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-base-content/70">
              Welcome, {{ userDisplayName }}
            </span>
            
            <button
              class="btn btn-outline"
              @click="handleLogout"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">
          Welcome back!
        </h2>
        <p class="text-base-content/70">
          Here's what's available in your dashboard.
        </p>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- User Profile Card -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" @click="showUserProfile = !showUserProfile">
          <div class="card-body">
            <div class="flex items-center mb-2">
              <div class="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold">Profile</h3>
            </div>
            <p class="text-base-content/70">
              View and manage your account information
            </p>
          </div>
        </div>

        <!-- API Testing Card (Admin Only) -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center mb-2">
              <div class="h-8 w-8 bg-secondary/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold">API Testing</h3>
            </div>
            <p class="text-base-content/70">
              Test and validate all API endpoints
            </p>
          </div>
        </div>

        <!-- Health Check Card -->
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <div class="card-body">
            <div class="flex items-center mb-2">
              <div class="h-8 w-8 bg-accent/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold">API Health</h3>
            </div>
            <p class="text-base-content/70">
              Check the status of the API server
            </p>
            <div v-if="healthStatus" class="mt-2">
              <span :class="healthStatusClasses">
                {{ healthStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Details (Expandable) -->
      <div v-if="showUserProfile" class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">User Profile</h2>
          <div v-if="currentUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">
                  Email
                </label>
                <p class="text-sm">{{ currentUser.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">
                  Name
                </label>
                <p class="text-sm">{{ userDisplayName }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">
                  Account Created
                </label>
                <p class="text-sm">{{ formatDate(currentUser.createdAt) }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">
                  Email Verified
                </label>
                <span :class="emailVerifiedClasses">
                  {{ currentUser.isEmailVerified ? 'Verified' : 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Check Results -->
      <div v-if="healthError" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-bold">Health Check Failed</h3>
          <div class="text-xs">{{ healthError.message }}</div>
        </div>
        <button class="btn btn-sm btn-ghost" @click="healthError = null">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useHealthQuery } from '../generated/graphql'

const router = useRouter()
const { currentUser, logout } = useAuth()

// Apollo health query
const { result: healthResult, error: healthError } = useHealthQuery()

// Local state
const showUserProfile = ref(false)

// Computed health status from Apollo
const healthStatus = computed(() => healthResult.value?.health || null)

// Computed properties
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
    return email.split('@')[0]
  }
})

const healthStatusClasses = computed(() => {
  if (healthStatus.value?.toLowerCase().includes('healthy') || healthStatus.value?.toLowerCase().includes('ok')) {
    return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }
  return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
})

const emailVerifiedClasses = computed(() => {
  if (!currentUser.value) return ''
  
  return currentUser.value.isEmailVerified
    ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
    : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
})

// Methods
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Health check is now automatic with Apollo query - no manual function needed

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Apollo automatically handles queries - no manual lifecycle needed
</script>