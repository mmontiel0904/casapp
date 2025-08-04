<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AppLayout from './components/AppLayout.vue'
import GlobalFeedback from './components/GlobalFeedback.vue'

const route = useRoute()
const { isInitializing, isAuthenticated } = useAuth()

// Show loading screen during auth initialization
const showLoadingScreen = computed(() => isInitializing.value)

// Guest routes that don't need the app layout (navbar)
const guestRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/accept-invitation']
const isGuestRoute = computed(() => guestRoutes.includes(route.path))

// Show app layout for authenticated users on non-guest routes
const showAppLayout = computed(() => !showLoadingScreen.value && isAuthenticated.value && !isGuestRoute.value)
</script>

<template>
  <div id="app" class="min-h-screen bg-base-200 font-sans">
    <!-- Loading screen during auth initialization -->
    <div 
      v-if="showLoadingScreen" 
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="mt-4 text-base-content opacity-70">Restoring your session...</p>
      </div>
    </div>
    
    <!-- App with persistent navigation layout -->
    <AppLayout v-else-if="showAppLayout">
      <router-view />
    </AppLayout>
    
    <!-- Guest pages without navigation -->
    <router-view v-else />
    
    <!-- Global feedback system -->
    <GlobalFeedback />
  </div>
</template>
