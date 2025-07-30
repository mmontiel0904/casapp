<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-base-content mb-2">
          Welcome to CasApp
        </h1>
        <p class="text-base-content/70">
          Sign in to your account to continue
        </p>
      </div>

      <!-- Use the LoginForm component -->
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>