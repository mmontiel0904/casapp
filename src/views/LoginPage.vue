<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="w-full max-w-md">
      <!-- App Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 class="text-4xl font-serif font-bold text-base-content mb-2">
          CasApp
        </h1>
        <p class="text-base-content/60 text-sm">
          Professional Case Management System
        </p>
      </div>

      <!-- Login Form Component -->
      <LoginForm />
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-base-content/50 text-xs">
          © 2025 CasApp. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>