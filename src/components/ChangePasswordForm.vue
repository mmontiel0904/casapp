<template>
  <div class="card bg-base-100 shadow-sm border border-base-300">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">Change Password</h3>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <!-- Current Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Current Password</span>
          </label>
          <div class="relative">
            <input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="input input-bordered w-full pr-10"
              :class="{ 'input-error': errors.currentPassword }"
              placeholder="Enter your current password"
              required
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <label v-if="errors.currentPassword" class="label">
            <span class="label-text-alt text-error">{{ errors.currentPassword }}</span>
          </label>
        </div>

        <!-- New Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">New Password</span>
          </label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="input input-bordered w-full pr-10"
              :class="{ 'input-error': errors.newPassword, 'input-success': form.newPassword && !errors.newPassword }"
              placeholder="Enter your new password"
              required
              minlength="8"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          
          <!-- Password Strength Indicator -->
          <div v-if="form.newPassword" class="mt-2">
            <div class="text-xs text-base-content/70 mb-1">Password strength:</div>
            <progress 
              :class="passwordStrengthClass" 
              class="progress w-full h-2" 
              :value="passwordStrength" 
              max="100"
            ></progress>
            <div class="text-xs mt-1" :class="passwordStrengthTextClass">
              {{ passwordStrengthText }}
            </div>
          </div>
          
          <label v-if="errors.newPassword" class="label">
            <span class="label-text-alt text-error">{{ errors.newPassword }}</span>
          </label>
        </div>

        <!-- Confirm Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Confirm New Password</span>
          </label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="input input-bordered w-full pr-10"
              :class="{ 'input-error': errors.confirmPassword, 'input-success': form.confirmPassword && !errors.confirmPassword }"
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <label v-if="errors.confirmPassword" class="label">
            <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="form-control mt-6">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading">Change Password</span>
            <span v-else>Changing Password...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChangePasswordMutation } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'

const { mutate: changePassword, loading, error } = useChangePasswordMutation()
const feedback = useApolloFeedback()

// Form state
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation
const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.newPassword
  if (!password) return 0
  
  let strength = 0
  
  // Length check (0-25 points)
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 10
  
  // Character variety (0-65 points)
  if (/[a-z]/.test(password)) strength += 15
  if (/[A-Z]/.test(password)) strength += 15
  if (/[0-9]/.test(password)) strength += 15
  if (/[^A-Za-z0-9]/.test(password)) strength += 20
  
  return Math.min(strength, 100)
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'progress-error'
  if (strength < 50) return 'progress-warning'
  if (strength < 75) return 'progress-info'
  return 'progress-success'
})

const passwordStrengthTextClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'text-error'
  if (strength < 50) return 'text-warning'
  if (strength < 75) return 'text-info'
  return 'text-success'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'Weak'
  if (strength < 50) return 'Fair'
  if (strength < 75) return 'Good'
  return 'Strong'
})

// Form validation
const validateForm = () => {
  errors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  let isValid = true
  
  // Current password validation
  if (!form.value.currentPassword) {
    errors.value.currentPassword = 'Current password is required'
    isValid = false
  }
  
  // New password validation
  if (!form.value.newPassword) {
    errors.value.newPassword = 'New password is required'
    isValid = false
  } else if (form.value.newPassword.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters long'
    isValid = false
  } else if (form.value.newPassword === form.value.currentPassword) {
    errors.value.newPassword = 'New password must be different from current password'
    isValid = false
  }
  
  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const isFormValid = computed(() => {
  return form.value.currentPassword && 
         form.value.newPassword && 
         form.value.confirmPassword &&
         form.value.newPassword === form.value.confirmPassword &&
         form.value.newPassword !== form.value.currentPassword &&
         form.value.newPassword.length >= 8
})

// Watch for real-time validation
watch(() => form.value.confirmPassword, () => {
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = ''
  }
})

watch(() => form.value.newPassword, () => {
  if (form.value.newPassword && form.value.currentPassword && form.value.newPassword === form.value.currentPassword) {
    errors.value.newPassword = 'New password must be different from current password'
  } else if (form.value.newPassword && form.value.newPassword.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters long'
  } else {
    errors.value.newPassword = ''
  }
  
  // Re-validate confirm password when new password changes
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else if (form.value.confirmPassword) {
    errors.value.confirmPassword = ''
  }
})

const handleChangePassword = async () => {
  if (!validateForm()) return
  
  try {
    await changePassword({
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    
    // Success feedback
    feedback.success('Password Changed', 'Your password has been successfully updated')
    
    // Reset form
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    // Reset visibility toggles
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
    
  } catch (err) {
    console.error('Password change failed:', err)
    // Error feedback handled by useApolloFeedback automatically
  }
}

// Handle Apollo feedback
feedback.handleMutation(loading, error, () => {}, {
  errorTitle: 'Password Change Failed'
})
</script>