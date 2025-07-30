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
      
      <div v-if="error" class="alert alert-error mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error.message }}</span>
      </div>
      
      <div v-if="loginResult" class="alert alert-success mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Login successful! Welcome {{ loginResult.login.user.firstName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLoginMutation } from '../generated/graphql'
import { useAuth } from '../composables/useAuth'

const loginForm = reactive({
  email: '',
  password: ''
})

// Apollo's generated composable - fully type-safe
const { mutate: login, loading, error } = useLoginMutation()
const { setUser } = useAuth()
const loginResult = ref<any>(null)

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

