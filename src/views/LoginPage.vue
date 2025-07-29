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

      <!-- Login Form Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email address</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                class="input input-bordered input-primary"
                :class="{ 'input-error': errors.email }"
                required
                @blur="validateEmail"
              />
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>

            <!-- Password Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                class="input input-bordered input-primary"
                :class="{ 'input-error': errors.password }"
                required
                @blur="validatePassword"
              />
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">{{ errors.password }}</span>
              </label>
            </div>

            <!-- Error Alert -->
            <div v-if="loginError" class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold">Login Failed</h3>
                <div class="text-xs">{{ loginError.message }}</div>
              </div>
              <button class="btn btn-sm btn-ghost" @click="clearError">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!-- Submit Button -->
            <div class="space-y-4">
              <button
                type="submit"
                class="btn btn-primary w-full"
                :class="{ 'loading': isLoggingIn }"
                :disabled="isLoggingIn || !isFormValid"
              >
                <span v-if="!isLoggingIn">Sign in</span>
                <span v-else>Signing in...</span>
              </button>

              <!-- Registration Link -->
              <p class="text-center text-sm text-base-content/70">
                Don't have an account?
                <button
                  type="button"
                  class="link link-primary"
                  @click="showRegisterForm = !showRegisterForm"
                >
                  Create one here
                </button>
              </p>
            </div>
          </form>

          <!-- Registration Form (Collapsible) -->
          <div v-if="showRegisterForm" class="mt-8 pt-8 border-t border-base-300">
            <h3 class="text-lg font-semibold text-base-content mb-4">
              Create Account
            </h3>
            
            <form @submit.prevent="handleRegister" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">First Name</span>
                  </label>
                  <input
                    v-model="registerForm.firstName"
                    type="text"
                    placeholder="First name"
                    class="input input-bordered input-secondary"
                    :class="{ 'input-error': registerErrors.firstName }"
                  />
                  <label v-if="registerErrors.firstName" class="label">
                    <span class="label-text-alt text-error">{{ registerErrors.firstName }}</span>
                  </label>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Last Name</span>
                  </label>
                  <input
                    v-model="registerForm.lastName"
                    type="text"
                    placeholder="Last name"
                    class="input input-bordered input-secondary"
                    :class="{ 'input-error': registerErrors.lastName }"
                  />
                  <label v-if="registerErrors.lastName" class="label">
                    <span class="label-text-alt text-error">{{ registerErrors.lastName }}</span>
                  </label>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email address</span>
                </label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="Enter your email"
                  class="input input-bordered input-secondary"
                  :class="{ 'input-error': registerErrors.email }"
                  required
                />
                <label v-if="registerErrors.email" class="label">
                  <span class="label-text-alt text-error">{{ registerErrors.email }}</span>
                </label>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="Create a password"
                  class="input input-bordered input-secondary"
                  :class="{ 'input-error': registerErrors.password }"
                  required
                />
                <label class="label">
                  <span class="label-text-alt">Password must be at least 8 characters</span>
                </label>
                <label v-if="registerErrors.password" class="label">
                  <span class="label-text-alt text-error">{{ registerErrors.password }}</span>
                </label>
              </div>

              <!-- Register Error Alert -->
              <div v-if="registerError" class="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="font-bold">Registration Failed</h3>
                  <div class="text-xs">{{ registerError.message }}</div>
                </div>
                <button class="btn btn-sm btn-ghost" @click="clearRegisterError">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <!-- Register Success Alert -->
              <div v-if="registerSuccess" class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="font-bold">Account Created</h3>
                  <div class="text-xs">Your account has been created successfully. You can now sign in.</div>
                </div>
                <button class="btn btn-sm btn-ghost" @click="registerSuccess = false">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                class="btn btn-secondary w-full"
                :class="{ 'loading': isRegistering }"
                :disabled="isRegistering || !isRegisterFormValid"
              >
                <span v-if="!isRegistering">Create Account</span>
                <span v-else>Creating account...</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, register, isLoggingIn, isRegistering, loginError, registerError } = useAuth()

// Login form
const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

// Registration form
const showRegisterForm = ref(false)
const registerForm = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const registerErrors = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const registerSuccess = ref(false)

// Validation
const isFormValid = computed(() => {
  return form.value.email && form.value.password && !errors.value.email && !errors.value.password
})

const isRegisterFormValid = computed(() => {
  return registerForm.value.email && 
         registerForm.value.password && 
         !registerErrors.value.email && 
         !registerErrors.value.password
})

// Validation functions
const validateEmail = () => {
  const email = form.value.email.trim()
  if (!email) {
    errors.value.email = 'Email is required'
    return false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.value.email = 'Please enter a valid email address'
    return false
  } else {
    errors.value.email = ''
    return true
  }
}

const validatePassword = () => {
  const password = form.value.password
  if (!password) {
    errors.value.password = 'Password is required'
    return false
  } else if (password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return false
  } else {
    errors.value.password = ''
    return true
  }
}

// Form handlers
const handleSubmit = async () => {
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) return

  const result = await login(form.value.email, form.value.password)
  
  if (result.isSuccess) {
    router.push('/')
  }
}

const handleRegister = async () => {
  // Basic validation
  if (!registerForm.value.email) {
    registerErrors.value.email = 'Email is required'
    return
  }
  if (!registerForm.value.password || registerForm.value.password.length < 8) {
    registerErrors.value.password = 'Password must be at least 8 characters'
    return
  }

  const result = await register({
    email: registerForm.value.email,
    password: registerForm.value.password,
    firstName: registerForm.value.firstName || undefined,
    lastName: registerForm.value.lastName || undefined
  })

  if (result.isSuccess) {
    registerSuccess.value = true
    showRegisterForm.value = false
    // Reset form
    registerForm.value = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  }
}

const clearError = () => {
  // The error will be cleared automatically by the composable
}

const clearRegisterError = () => {
  // The error will be cleared automatically by the composable
}
</script>