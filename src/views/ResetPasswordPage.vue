<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- App Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <router-link to="/" class="text-4xl font-bold text-base-content mb-2 hover:text-accent transition-colors">
          CasApp
        </router-link>
        <p class="text-base-content/60 text-sm">
          Create a new password
        </p>
      </div>

      <!-- Reset Password Form -->
      <div class="card w-full bg-base-100 shadow-2xl">
        <div class="card-body p-8">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-base-content mb-2">
              Set New Password
            </h2>
            <p class="text-base-content/70 text-sm">
              Enter your new password below to complete the reset process.
            </p>
          </div>
          
          <!-- Invalid Token Message -->
          <div v-if="!isValidToken" class="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">Invalid or Expired Link</h3>
              <div class="text-xs">This password reset link is invalid or has expired.</div>
            </div>
          </div>
          
          <!-- Password Reset Form -->
          <form v-if="isValidToken" @submit.prevent="handlePasswordReset" class="space-y-6">
            <!-- New Password Field -->
            <div class="form-control">
              <label class="label pb-2" for="password">
                <span class="label-text font-medium text-base-content">New Password</span>
              </label>
              <input 
                id="password"
                v-model="resetForm.password" 
                type="password" 
                placeholder="Enter your new password"
                class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                :class="{ 'input-error': error && error.message.toLowerCase().includes('password') }"
                required 
                minlength="8"
                autocomplete="new-password"
              />
            </div>

            <!-- Confirm Password Field -->
            <div class="form-control">
              <label class="label pb-2" for="confirmPassword">
                <span class="label-text font-medium text-base-content">Confirm New Password</span>
              </label>
              <input 
                id="confirmPassword"
                v-model="resetForm.confirmPassword" 
                type="password" 
                placeholder="Confirm your new password"
                class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                :class="{ 'input-error': passwordMismatch }"
                required 
                minlength="8"
                autocomplete="new-password"
              />
              <label v-if="passwordMismatch" class="label pt-1">
                <span class="label-text-alt text-error">Passwords do not match</span>
              </label>
            </div>
            
            <!-- Submit Button -->
            <div class="form-control mt-8">
              <button 
                type="submit" 
                class="btn btn-accent btn-lg w-full text-accent-content font-semibold"
                :disabled="loading || passwordMismatch || !resetForm.password || !resetForm.confirmPassword"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reset Password
                </span>
                <span v-else class="loading loading-spinner loading-sm"></span>
              </button>
            </div>
          </form>

          <!-- Footer Section -->
          <div class="divider text-base-content/50 text-xs">OR</div>
          
          <div class="text-center">
            <p class="text-base-content/70 text-sm">
              Need a new reset link? 
              <router-link to="/forgot-password" class="link link-accent font-medium">
                Request New Link
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResetPasswordMutation } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'

const router = useRouter()
const route = useRoute()

const resetForm = reactive({
  password: '',
  confirmPassword: ''
})

const token = ref('')
const isValidToken = ref(true)

// Check if passwords match
const passwordMismatch = computed(() => {
  return resetForm.confirmPassword && resetForm.password !== resetForm.confirmPassword
})

// Apollo's generated composable for password reset
const { mutate: resetPassword, loading, error } = useResetPasswordMutation()

// Auto-handle feedback for password reset operations
const feedback = useApolloFeedback()
feedback.handleMutation(loading, error, () => {
  // Success callback - redirect to login with success message
  resetForm.password = ''
  resetForm.confirmPassword = ''
  setTimeout(() => {
    router.push('/login')
  }, 2000)
}, {
  successTitle: 'Password Reset Successfully!',
  successMessage: 'You can now login with your new password',
  errorTitle: 'Password Reset Failed'
})

onMounted(() => {
  // Extract token from URL query parameters
  const urlToken = route.query.token as string
  if (urlToken) {
    token.value = urlToken
  } else {
    isValidToken.value = false
  }
})

const handlePasswordReset = async () => {
  if (passwordMismatch.value) return
  
  try {
    const result = await resetPassword({ 
      token: token.value,
      newPassword: resetForm.password
    })
    
    if (result?.data?.resetPassword) {
      // Success is handled by the feedback system
      console.log('Password reset successful:', result.data.resetPassword.message)
    }
  } catch (err) {
    console.error('Password reset failed:', err)
    // Check if it's a token error
    if (err && typeof err === 'object' && 'message' in err) {
      const errorMessage = (err as any).message.toLowerCase()
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        isValidToken.value = false
      }
    }
  }
}
</script>