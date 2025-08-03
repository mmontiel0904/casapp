<template>
  <div class="card w-full max-w-lg bg-base-100 shadow-2xl mx-auto">
    <div class="card-body p-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h2 class="card-title text-3xl font-serif font-bold justify-center text-base-content mb-2">
          Welcome Back
        </h2>
        <p class="text-base-content/70 text-sm font-sans">
          Sign in to your account to continue
        </p>
      </div>
      
      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div class="form-control">
          <InputField
            v-model="loginForm.email"
            type="email"
            label="Email Address"
            placeholder="your@email.com"
            required
            autocomplete="email"
            class="font-sans"
          />
        </div>
        
        <!-- Password Field -->
        <div class="form-control">
          <InputField
            v-model="loginForm.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
            class="font-sans"
          />
          <label class="label pt-1">
            <span class="label-text-alt"></span>
            <router-link to="/forgot-password" class="label-text-alt link link-hover text-accent font-sans">
              Forgot password?
            </router-link>
          </label>
        </div>
        
        <!-- Submit Button -->
        <div class="form-control mt-8">
          <button 
            type="submit" 
            class="btn btn-accent btn-lg w-full text-accent-content font-semibold font-sans rounded-lg shadow-md"
            :class="{ 'loading': isLoading }"
            :disabled="isLoading"
          >
            <span v-if="!isLoading" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>
      </form>

      <!-- Footer Section -->
      <div class="divider text-base-content/50 text-xs font-sans">OR</div>
      <div class="text-center">
        <p class="text-base-content/70 text-sm font-sans">
          Don't have an account? 
          <a href="#" class="link link-accent font-medium font-sans">
            Contact Administrator
          </a>
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useApolloFeedback } from '../composables/useApolloFeedback'
import InputField from './ui/InputField.vue'

const loginForm = reactive({
  email: '',
  password: ''
})

const router = useRouter()

// Use enhanced auth composable with optimized login
const { login: authLogin, isLoading } = useAuth()

// Manual feedback handling to avoid timing issues
const feedback = useApolloFeedback()

const handleLogin = async () => {
  try {
    // ⚡ Use optimized login flow from enhanced useAuth
    console.log('🚀 Starting optimized login...')
    
    const user = await authLogin(loginForm.email, loginForm.password)
    
    console.log('✅ Login successful! User authenticated:', user.email)
    
    // Show success feedback and redirect
    feedback.success('Welcome!', 'Login successful', 3000)
    router.push('/')
  } catch (err) {
    console.error('❌ Login failed:', err)
    // Show error feedback using Apollo error handler
    feedback.fromApolloError(err, 'Login Failed')
  }
}
</script>

