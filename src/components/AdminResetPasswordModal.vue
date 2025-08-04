<template>
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-2xl">
      <form method="dialog">
        <button 
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      
      <h3 class="font-bold text-lg text-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Reset User Password
      </h3>
      
      <!-- Warning Alert -->
      <div class="alert alert-warning mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4 class="font-bold">Security Action Required</h4>
          <div class="text-sm">This action will trigger a password reset for the selected user. They will receive an email with instructions to set a new password.</div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-base-200 rounded-lg p-4 mb-6">
        <h4 class="font-semibold mb-3">User Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-sm font-medium text-base-content/70">Name:</span>
            <p class="font-medium">{{ userDisplayName }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-base-content/70">Email:</span>
            <p class="font-medium">{{ user.email }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-base-content/70">Role:</span>
            <div class="flex items-center gap-2 mt-1">
              <div :class="getRoleBadgeClass(user.role)" class="badge badge-sm">
                {{ user.role?.name || 'No Role' }}
              </div>
              <span v-if="user.role" class="text-xs text-base-content/60">
                Level {{ user.role.level }}
              </span>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium text-base-content/70">User ID:</span>
            <p class="font-mono text-xs text-base-content/70">{{ user.id }}</p>
          </div>
        </div>
      </div>

      <!-- Confirmation Checkbox -->
      <div class="form-control mb-6">
        <label class="label cursor-pointer justify-start gap-3">
          <input 
            v-model="confirmAction" 
            type="checkbox" 
            class="checkbox checkbox-error" 
          />
          <span class="label-text">
            I understand that this action will send a password reset email to 
            <strong>{{ user.email }}</strong> and they will need to create a new password.
          </span>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="modal-action">
        <button 
          @click="$emit('close')" 
          class="btn btn-ghost"
          :disabled="loading"
        >
          Cancel
        </button>
        <button 
          @click="handleResetPassword" 
          class="btn btn-error"
          :disabled="!confirmAction || loading"
          :class="{ 'loading': loading }"
        >
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ loading ? 'Resetting Password...' : 'Reset Password' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminResetUserPasswordMutation } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'
import type { AllUsersQuery } from '../generated/graphql'

type QueryUser = AllUsersQuery['allUsers'][0]

interface Props {
  user: QueryUser
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { mutate: resetPassword, loading, error } = useAdminResetUserPasswordMutation()
const feedback = useApolloFeedback()

const confirmAction = ref(false)

// Computed properties
const userDisplayName = computed(() => {
  const { firstName, lastName, email } = props.user
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return email.split('@')[0]
  }
})

// Helper functions
const getRoleBadgeClass = (role: any): string => {
  if (!role) return 'badge-ghost'
  if (role.level >= 100) return 'badge-error' // Super admin
  if (role.level >= 50) return 'badge-warning' // Admin  
  if (role.level >= 25) return 'badge-info' // Manager
  return 'badge-success' // Regular user
}

const handleResetPassword = async () => {
  if (!confirmAction.value) return
  
  try {
    await resetPassword({
      userId: props.user.id
    })
    
    // Success feedback
    feedback.success(
      'Password Reset Initiated', 
      `Password reset email has been sent to ${props.user.email}`
    )
    
    emit('success')
    emit('close')
    
  } catch (err) {
    console.error('Admin password reset failed:', err)
    // Error feedback handled by useApolloFeedback automatically
  }
}

// Handle Apollo feedback
feedback.handleMutation(loading, error, () => {}, {
  errorTitle: 'Password Reset Failed'
})
</script>