<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-xl font-bold mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        Invite New User
      </h2>
      
      <p class="text-base-content/70 text-sm mb-6">
        Send an invitation email to a new user. They'll receive a link to create their account.
      </p>

      <form @submit.prevent="handleInvitation" class="space-y-4">
        <!-- Email Field -->
        <div class="form-control">
          <label class="label" for="inviteEmail">
            <span class="label-text font-medium">Email Address</span>
          </label>
          <div class="input-group">
            <input 
              id="inviteEmail"
              v-model="email" 
              type="email" 
              placeholder="user@example.com"
              class="input input-bordered flex-1 bg-base-100 focus:input-accent transition-colors"
              :class="{ 'input-error': error && error.message.toLowerCase().includes('email') }"
              required 
              autocomplete="email"
            />
            <button 
              type="submit"
              class="btn btn-accent"
              :disabled="loading || !email"
            >
              <span v-if="!loading" class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Invite
              </span>
              <span v-else class="loading loading-spinner loading-xs"></span>
            </button>
          </div>
        </div>

        <!-- Recent Invitations -->
        <div v-if="recentInvitations.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Recent Invitations</h3>
          <div class="space-y-2">
            <div 
              v-for="invitation in recentInvitations" 
              :key="invitation.id"
              class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-8">
                    <span class="text-xs">{{ invitation.email[0].toUpperCase() }}</span>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-sm">{{ invitation.email }}</p>
                  <p class="text-xs text-base-content/60">
                    Sent {{ formatDate(invitation.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  :class="invitation.isUsed 
                    ? 'badge badge-success badge-xs' 
                    : new Date(invitation.expiresAt) > new Date() 
                      ? 'badge badge-info badge-xs' 
                      : 'badge badge-error badge-xs'"
                >
                  {{ invitation.isUsed 
                    ? 'Accepted' 
                    : new Date(invitation.expiresAt) > new Date() 
                      ? 'Pending' 
                      : 'Expired' 
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInviteUserMutation } from '../../generated/graphql'
import { useApolloFeedback } from '../../composables/useApolloFeedback'

const email = ref('')
const recentInvitations = ref<Array<{
  id: string
  email: string
  createdAt: string
  expiresAt: string
  isUsed: boolean
}>>([])

// Apollo's generated composable for user invitation
const { mutate: inviteUser, loading, error } = useInviteUserMutation()

// Auto-handle feedback for invitation operations
const feedback = useApolloFeedback()
feedback.handleMutation(loading, error, () => {
  // Success callback - clear form and update recent invitations
  email.value = ''
}, {
  successTitle: 'Invitation Sent!',
  successMessage: 'An invitation email has been sent successfully',
  errorTitle: 'Invitation Failed'
})

const handleInvitation = async () => {
  try {
    // Debug: Check authentication state
    const token = localStorage.getItem('auth_token')
    console.log('InviteUser: Token exists:', !!token)
    console.log('InviteUser: Attempting to invite:', email.value)
    
    const result = await inviteUser({ 
      email: email.value
    })
    
    if (result?.data?.inviteUser) {
      // Add to recent invitations list
      recentInvitations.value.unshift({
        id: result.data.inviteUser.id,
        email: result.data.inviteUser.email,
        createdAt: result.data.inviteUser.createdAt,
        expiresAt: result.data.inviteUser.expiresAt,
        isUsed: result.data.inviteUser.isUsed
      })
      
      // Keep only last 5 invitations
      if (recentInvitations.value.length > 5) {
        recentInvitations.value = recentInvitations.value.slice(0, 5)
      }
      
      console.log('User invited:', result.data.inviteUser)
    }
  } catch (err) {
    console.error('Invitation failed:', err)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
}
</script>