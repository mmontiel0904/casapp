<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-xl mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Change Password
      </h2>

      <!-- API Status Alert -->
      <div v-if="!isPasswordChangeEnabled" class="alert alert-info mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <div class="font-bold">Feature Coming Soon</div>
          <div class="text-sm">Password change functionality will be available in the next API update. Use "Forgot Password" on the login page for now.</div>
        </div>
      </div>

      <!-- Password Change Form -->
      <form @submit.prevent="handlePasswordChange" class="space-y-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Current Password</span>
          </label>
          <div class="relative">
            <input 
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Enter your current password"
              class="input input-bordered focus:input-secondary pr-12"
              :disabled="!isPasswordChangeEnabled"
              required
            />
            <button 
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
              :disabled="!isPasswordChangeEnabled"
            >
              <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">New Password</span>
            </label>
            <div class="relative">
              <input 
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                class="input input-bordered focus:input-secondary pr-12"
                :disabled="!isPasswordChangeEnabled"
                required
                minlength="8"
              />
              <button 
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3"
                :disabled="!isPasswordChangeEnabled"
              >
                <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <!-- Password Strength Indicator -->
            <div v-if="passwordForm.newPassword" class="mt-2">
              <div class="flex items-center gap-2">
                <div class="text-xs text-base-content/70">Strength:</div>
                <div class="flex gap-1">
                  <div 
                    v-for="(strength, index) in passwordStrengthBars" 
                    :key="index"
                    :class="strength.active ? strength.color : 'bg-base-300'"
                    class="w-6 h-1 rounded"
                  ></div>
                </div>
                <div :class="passwordStrengthColor" class="text-xs font-medium">
                  {{ passwordStrengthText }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Confirm New Password</span>
            </label>
            <div class="relative">
              <input 
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                class="input input-bordered focus:input-secondary pr-12"
                :class="{ 'input-error': passwordForm.confirmPassword && !passwordsMatch }"
                :disabled="!isPasswordChangeEnabled"
                required
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3"
                :disabled="!isPasswordChangeEnabled"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <label v-if="passwordForm.confirmPassword && !passwordsMatch" class="label">
              <span class="label-text-alt text-error">Passwords do not match</span>
            </label>
            <label v-else-if="passwordForm.confirmPassword && passwordsMatch" class="label">
              <span class="label-text-alt text-success">Passwords match</span>
            </label>
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="font-bold">Password Requirements:</div>
            <ul class="list-disc list-inside text-sm mt-1 space-y-1">
              <li :class="passwordRequirements.length ? 'text-success' : 'text-base-content/70'">
                At least 8 characters long
              </li>
              <li :class="passwordRequirements.uppercase ? 'text-success' : 'text-base-content/70'">
                One uppercase letter
              </li>
              <li :class="passwordRequirements.lowercase ? 'text-success' : 'text-base-content/70'">
                One lowercase letter
              </li>
              <li :class="passwordRequirements.number ? 'text-success' : 'text-base-content/70'">
                One number
              </li>
              <li :class="passwordRequirements.special ? 'text-success' : 'text-base-content/70'">
                One special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button 
            type="button" 
            @click="resetPasswordForm"
            class="btn btn-ghost"
            :disabled="!isPasswordChangeEnabled"
          >
            Reset
          </button>
          <button 
            type="submit" 
            :disabled="!isPasswordChangeEnabled || !isFormValid || loading"
            class="btn btn-secondary"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs"></span>
            Change Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Feature flag - can be enabled when API supports password change
const isPasswordChangeEnabled = ref(false) // Set to true when API is ready

// Form state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)

// Password validation
const passwordRequirements = computed(() => ({
  length: passwordForm.value.newPassword.length >= 8,
  uppercase: /[A-Z]/.test(passwordForm.value.newPassword),
  lowercase: /[a-z]/.test(passwordForm.value.newPassword),
  number: /\d/.test(passwordForm.value.newPassword),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.value.newPassword)
}))

const passwordStrength = computed(() => {
  const requirements = passwordRequirements.value
  const score = Object.values(requirements).filter(Boolean).length
  
  if (score <= 2) return { level: 1, text: 'Weak', color: 'text-error' }
  if (score <= 3) return { level: 2, text: 'Fair', color: 'text-warning' }
  if (score <= 4) return { level: 3, text: 'Good', color: 'text-info' }
  return { level: 4, text: 'Strong', color: 'text-success' }
})

const passwordStrengthBars = computed(() => {
  const strength = passwordStrength.value
  return Array.from({ length: 4 }, (_, index) => ({
    active: index < strength.level,
    color: strength.level === 1 ? 'bg-error' : 
           strength.level === 2 ? 'bg-warning' :
           strength.level === 3 ? 'bg-info' : 'bg-success'
  }))
})

const passwordStrengthText = computed(() => passwordStrength.value.text)
const passwordStrengthColor = computed(() => passwordStrength.value.color)

const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const isFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordsMatch.value &&
         Object.values(passwordRequirements.value).every(Boolean)
})

// Actions
const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handlePasswordChange = async () => {
  if (!isFormValid.value) return

  loading.value = true
  
  try {
    // TODO: Implement password change mutation when API supports it
    console.log('Password change requested:', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Success - reset form and show feedback
    resetPasswordForm()
    console.log('Password changed successfully')
    
  } catch (error) {
    console.error('Password change failed:', error)
  } finally {
    loading.value = false
  }
}
</script>