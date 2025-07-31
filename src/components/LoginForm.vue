<template>
  <div class="card w-full max-w-lg bg-base-100 shadow-2xl mx-auto">
    <div class="card-body p-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h2 class="card-title text-3xl font-bold justify-center text-base-content mb-2">
          Welcome Back
        </h2>
        <p class="text-base-content/70 text-sm">
          Sign in to your account to continue
        </p>
      </div>
      
      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div class="form-control">
          <label class="label pb-2" for="email">
            <span class="label-text font-medium text-base-content">Email Address</span>
          </label>
          <input 
            id="email"
            v-model="loginForm.email" 
            type="email" 
            placeholder="your@email.com"
            class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
            :class="{ 'input-error': error && error.message.toLowerCase().includes('email') }"
            required 
            autocomplete="email"
          />
        </div>
        
        <!-- Password Field -->
        <div class="form-control">
          <label class="label pb-2" for="password">
            <span class="label-text font-medium text-base-content">Password</span>
          </label>
          <input 
            id="password"
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
            :class="{ 'input-error': error && error.message.toLowerCase().includes('password') }"
            required 
            autocomplete="current-password"
          />
          <label class="label pt-1">
            <span class="label-text-alt"></span>
            <router-link to="/forgot-password" class="label-text-alt link link-hover text-accent">
              Forgot password?
            </router-link>
          </label>
        </div>
        
        <!-- Submit Button -->
        <div class="form-control mt-8">
          <button 
            type="submit" 
            class="btn btn-accent btn-lg w-full text-accent-content font-semibold"
            :class="{ 'loading': loading }"
            :disabled="loading"
          >
            <span v-if="!loading" class="flex items-center gap-2">
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
      <div class="divider text-base-content/50 text-xs">OR</div>
      
      <div class="text-center">
        <p class="text-base-content/70 text-sm">
          Don't have an account? 
          <a href="#" class="link link-accent font-medium">
            Contact Administrator
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginMutation } from '../generated/graphql'
import { useAuth } from '../composables/useAuth'
import { useApolloFeedback } from '../composables/useApolloFeedback'

const loginForm = reactive({
  email: '',
  password: ''
})

const router = useRouter()

// Apollo's generated composable - fully type-safe
const { mutate: login, loading, error } = useLoginMutation()
const { setUser } = useAuth()
const loginResult = ref<any>(null)

// Auto-handle feedback for login operations
const feedback = useApolloFeedback()
feedback.handleMutation(loading, error, () => {
  // Success callback - redirect to dashboard
  loginResult.value = null
  router.push('/')
}, {
  successTitle: 'Welcome!',
  successMessage: 'Successfully logged in',
  errorTitle: 'Login Failed'
})

const handleLogin = async () => {
  try {
    // Use generated mutation variables structure
    const result = await login({ 
      email: loginForm.email, 
      password: loginForm.password 
    })
    
    if (result?.data?.login) {
      const { accessToken, refreshToken, user } = result.data.login
      // Type-safe user with all required fields
      const fullUser = {
        ...user,
        createdAt: new Date().toISOString(), // Temp until we get from API
        updatedAt: new Date().toISOString()
      }
      // Store both access and refresh tokens
      setUser(fullUser, accessToken, refreshToken)
      loginResult.value = result.data
    }
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>

