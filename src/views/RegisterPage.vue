<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-lg">
      <!-- App Branding -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4">
          <svg width="48" height="48" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Gradient definitions -->
            <defs>
              <linearGradient id="bgGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="heartGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
              </linearGradient>
            </defs>
            
            <!-- Background circle -->
            <circle cx="60" cy="60" r="52" fill="url(#bgGradientRegister)"/>
            
            <!-- Minimalist family representation using simple circles -->
            <!-- Parent figures (larger circles) -->
            <circle cx="44" cy="54" r="8" fill="white" opacity="0.95"/>
            <circle cx="76" cy="54" r="8" fill="white" opacity="0.95"/>
            
            <!-- Children figures (smaller circles) -->
            <circle cx="52" cy="71" r="5.5" fill="#FFE066" opacity="0.9"/>
            <circle cx="68" cy="71" r="5.5" fill="#66D9EF" opacity="0.9"/>
            
            <!-- Elegant heart with soft gradient -->
            <path d="M60 41 C56 37, 50 37, 50 43 C50 37, 44 37, 44 43 C44 49, 55 60, 60 64 C65 60, 76 49, 76 43 C76 37, 70 37, 70 43 C70 37, 64 37, 60 41 Z" 
                  fill="url(#heartGradientRegister)" 
                  opacity="0.8"/>
          </svg>
        </div>
        <router-link to="/" class="text-4xl font-bold text-base-content mb-2 hover:text-accent transition-colors">
          CasApp
        </router-link>
        <p class="text-base-content/60 text-sm">
          {{ isInvitation ? 'Complete your invitation' : 'Create your account' }}
        </p>
      </div>

      <!-- Registration Form -->
      <div class="card w-full bg-base-100 shadow-2xl">
        <div class="card-body p-8">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-base-content mb-2">
              {{ isInvitation ? 'Accept Invitation' : 'Create Account' }}
            </h2>
            <p class="text-base-content/70 text-sm">
              {{ isInvitation 
                ? `You've been invited to join CasApp. Complete your profile to get started.`
                : 'Fill in your details to create a new account.'
              }}
            </p>
          </div>

          <!-- Invalid Token Message for Invitations -->
          <div v-if="isInvitation && !isValidToken" class="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">Invalid or Expired Invitation</h3>
              <div class="text-xs">This invitation link is invalid or has expired.</div>
            </div>
          </div>
          
          <!-- Registration Form -->
          <form v-if="!isInvitation || isValidToken" @submit.prevent="handleRegistration" class="space-y-6">
            <!-- Email Field (readonly for invitations) -->
            <div class="form-control" v-if="!isInvitation">
              <label class="label pb-2" for="email">
                <span class="label-text font-medium text-base-content">Email Address</span>
              </label>
              <input 
                id="email"
                v-model="registerForm.email" 
                type="email" 
                placeholder="your@email.com"
                class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                :class="{ 
                  'input-error': error && error.message.toLowerCase().includes('email'),
                  'input-disabled': isInvitation 
                }"
                :readonly="isInvitation"
                required 
                autocomplete="email"
              />
            </div>

            <!-- Name Fields Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="form-control">
                <label class="label pb-2" for="firstName">
                  <span class="label-text font-medium text-base-content">First Name</span>
                </label>
                <input 
                  id="firstName"
                  v-model="registerForm.firstName" 
                  type="text" 
                  placeholder="John"
                  class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                  autocomplete="given-name"
                />
              </div>

              <!-- Last Name -->
              <div class="form-control">
                <label class="label pb-2" for="lastName">
                  <span class="label-text font-medium text-base-content">Last Name</span>
                </label>
                <input 
                  id="lastName"
                  v-model="registerForm.lastName" 
                  type="text" 
                  placeholder="Doe"
                  class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                  autocomplete="family-name"
                />
              </div>
            </div>
            
            <!-- Password Field -->
            <div class="form-control">
              <label class="label pb-2" for="password">
                <span class="label-text font-medium text-base-content">Password</span>
              </label>
              <input 
                id="password"
                v-model="registerForm.password" 
                type="password" 
                placeholder="Create a strong password"
                class="input input-bordered w-full bg-base-100 focus:input-accent transition-colors"
                :class="{ 'input-error': error && error.message.toLowerCase().includes('password') }"
                required 
                minlength="8"
                autocomplete="new-password"
              />
              <label class="label pt-1">
                <span class="label-text-alt text-base-content/60">Minimum 8 characters</span>
              </label>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-control">
              <label class="label pb-2" for="confirmPassword">
                <span class="label-text font-medium text-base-content">Confirm Password</span>
              </label>
              <input 
                id="confirmPassword"
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="Confirm your password"
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
                :disabled="loading || passwordMismatch || !registerForm.password || !registerForm.confirmPassword || (!registerForm.email && !isInvitation )"do w
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ isInvitation ? 'Complete Registration' : 'Create Account' }}
                </span>
                <span v-else class="loading loading-spinner loading-sm"></span>
              </button>
            </div>
          </form>

          <!-- Footer Section -->
          <div class="divider text-base-content/50 text-xs">OR</div>
          
          <div class="text-center">
            <p class="text-base-content/70 text-sm">
              Already have an account? 
              <router-link to="/login" class="link link-accent font-medium">
                Sign In
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
import { useRegisterMutation, useAcceptInvitationMutation } from '../generated/graphql'
import { useAuth } from '../composables/useAuth'
import { useApolloFeedback } from '../composables/useApolloFeedback'

const router = useRouter()
const route = useRoute()
const { setUser } = useAuth()

const registerForm = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
})

const invitationToken = ref('')
const isValidToken = ref(true)

// Check if this is an invitation flow
const isInvitation = computed(() => !!invitationToken.value)

// Check if passwords match
const passwordMismatch = computed(() => {
  return registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword
})

// Apollo composables
const { mutate: register, loading: registerLoading, error: registerError } = useRegisterMutation()
const { mutate: acceptInvitation, loading: invitationLoading, error: invitationError } = useAcceptInvitationMutation()

// Compute combined loading and error states
const loading = computed(() => registerLoading.value || invitationLoading.value)
const error = computed(() => registerError.value || invitationError.value)

// Auto-handle feedback for registration operations
const feedback = useApolloFeedback()
feedback.handleMutation(loading, error, () => {
  // Success callback - redirect to login or dashboard
  if (isInvitation.value) {
    // For invitations, user is automatically logged in
    router.push('/')
  } else {
    // For regular registration, redirect to login
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}, {
  successTitle: isInvitation.value ? 'Welcome to CasApp!' : 'Account Created!',
  successMessage: isInvitation.value 
    ? 'Your account has been created and you are now logged in'
    : 'Please check your email to verify your account',
  errorTitle: isInvitation.value ? 'Invitation Failed' : 'Registration Failed'
})

onMounted(() => {
  // Check for invitation token in URL - API spec: /accept-invitation?token={token}
  const token = route.query.token as string
  if (token) {
    invitationToken.value = token
    // API spec: only token parameter, email is entered by user
  }
})

const handleRegistration = async () => {
  if (passwordMismatch.value) return
  
  try {
    if (isInvitation.value) {
      // Handle invitation acceptance - API spec compliant
      const result = await acceptInvitation({
        input: {
          invitationToken: invitationToken.value,
          password: registerForm.password,
          firstName: registerForm.firstName || undefined,
          lastName: registerForm.lastName || undefined
        }
      })
      
      if (result?.data?.acceptInvitation) {
        const { accessToken, refreshToken, user } = result.data.acceptInvitation
        // Set user session for invitation acceptance
        const fullUser = {
          ...user,
          isEmailVerified: true, // Accepting invitation implies email verification
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setUser(fullUser, accessToken, refreshToken)
      }
    } else {
      // Handle regular registration
      const result = await register({
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName || null,
        lastName: registerForm.lastName || null
      })
      
      if (result?.data?.register) {
        // Success is handled by the feedback system
        console.log('User registered:', result.data.register)
      }
    }
  } catch (err) {
    console.error('Registration failed:', err)
    // Check if it's a token error for invitations
    if (isInvitation.value && err && typeof err === 'object' && 'message' in err) {
      const errorMessage = (err as any).message.toLowerCase()
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid') || errorMessage.includes('invitation')) {
        isValidToken.value = false
      }
    }
  }
}
</script>