<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- App Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2H7v-2H4a1 1 0 01-1-1v-4c0-2.896 2.387-5.267 5.443-5.966A6 6 0 0121 9z" />
          </svg>
        </div>
        <router-link to="/" class="text-4xl font-bold text-base-content mb-2 hover:text-accent transition-colors">
          CasApp
        </router-link>
        <p class="text-base-content/60 text-sm">
          Reset your password
        </p>
      </div>

      <!-- Forgot Password Form -->
      <div class="card w-full bg-base-100 shadow-2xl">
        <div class="card-body p-8">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-base-content mb-2">
              Forgot your password?
            </h2>
            <p class="text-base-content/70 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <!-- Password Reset Form -->
          <form @submit.prevent="handlePasswordReset" class="space-y-6">
            <!-- Email Field -->
            <div class="form-control">
              <label class="label pb-2" for="email">
                <span class="label-text font-medium text-base-content">Email Address</span>
              </label>
              <input 
                id="email"
                v-model="email" 
                type="email" 
                placeholder="your@email.com"
                class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                :class="{ 'input-error': error && error.message.toLowerCase().includes('email') }"
                required 
                autocomplete="email"
              />
            </div>
            
            <!-- Submit Button -->
            <div class="form-control mt-8">
              <button 
                type="submit" 
                class="btn btn-accent btn-lg w-full text-accent-content font-semibold"
                :disabled="loading"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Reset Link
                </span>
                <span v-else class="loading loading-spinner loading-sm"></span>
              </button>
            </div>
          </form>

          <!-- Footer Section -->
          <div class="divider text-base-content/50 text-xs">OR</div>
          
          <div class="text-center">
            <p class="text-base-content/70 text-sm">
              Remember your password? 
              <router-link to="/login" class="link link-accent font-medium">
                Back to Login
              </router-link>
            </p>
          </div>
        </div>
      </div>
      
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestPasswordResetMutation } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'

const router = useRouter()
const email = ref('')

// Apollo's generated composable for password reset
const { mutate: requestPasswordReset, loading, error } = useRequestPasswordResetMutation()

// Auto-handle feedback for password reset operations
const feedback = useApolloFeedback()
feedback.handleMutation(loading, error, () => {
  // Success callback - show success message and redirect
  email.value = ''
  setTimeout(() => {
    router.push('/login')
  }, 3000)
}, {
  successTitle: 'Reset Link Sent!',
  successMessage: 'Check your email for a password reset link',
  errorTitle: 'Reset Request Failed'
})

const handlePasswordReset = async () => {
  try {
    const result = await requestPasswordReset({ 
      email: email.value
    })
    
    if (result?.data?.requestPasswordReset) {
      // Success is handled by the feedback system
      console.log('Password reset requested:', result.data.requestPasswordReset.message)
    }
  } catch (err) {
    console.error('Password reset request failed:', err)
  }
}
</script>