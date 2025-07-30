<script setup lang="ts">
import GlobalFeedback from './components/GlobalFeedback.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-base-200">
    <router-view />
    <!-- Global feedback system -->
    <GlobalFeedback />
  </div>
</template>
