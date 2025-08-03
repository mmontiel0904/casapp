<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from './composables/useAuth'
import GlobalFeedback from './components/GlobalFeedback.vue'

const { isInitializing } = useAuth()

// Show loading screen during auth initialization
const showLoadingScreen = computed(() => isInitializing.value)
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
    
    <!-- Main app content -->
    <router-view v-else />
    
    <!-- Global feedback system -->
    <GlobalFeedback />
  </div>
</template>
