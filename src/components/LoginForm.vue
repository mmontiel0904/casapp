<template>
  <div class="card w-96 bg-base-100 shadow-xl mx-auto mt-8">
    <div class="card-body">
      <h2 class="card-title text-2xl font-bold text-center justify-center mb-6">Login</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input 
            id="email"
            v-model="loginForm.email" 
            type="email" 
            placeholder="Enter your email"
            class="input input-bordered input-primary w-full"
            required 
          />
        </div>
        
        <div class="form-control">
          <label class="label" for="password">
            <span class="label-text">Password</span>
          </label>
          <input 
            id="password"
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            class="input input-bordered input-primary w-full"
            required 
          />
        </div>
        
        <div class="form-control mt-6">
          <button 
            type="submit" 
            class="btn btn-primary"
            :class="{ 'loading': loading }"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else>Logging in...</span>
          </button>
        </div>
      </form>
      
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
      const { accessToken, user } = result.data.login
      // Type-safe user with all required fields
      const fullUser = {
        ...user,
        createdAt: new Date().toISOString(), // Temp until we get from API
        updatedAt: new Date().toISOString()
      }
      setUser(fullUser, accessToken)
      loginResult.value = result.data
    }
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>

