<template>
  <div class="p-6">
    <!-- Activity Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-xl font-sans font-semibold text-base-content">Activity & Comments</h3>
        <Chip variant="neutral" size="sm">
          {{ totalActivityCount }}
        </Chip>
      </div>

      <!-- Activity Filters -->
      <div class="flex items-center gap-3">
        <div class="form-control">
          <label class="label cursor-pointer gap-2 py-0">
            <span class="label-text text-sm text-base-content/70">Comments only</span>
            <input 
              v-model="showOnlyComments" 
              type="checkbox" 
              class="toggle toggle-sm toggle-accent" 
            />
          </label>
        </div>
        
        <button 
          @click="$emit('refresh-activities')"
          class="btn btn-ghost btn-sm btn-circle"
          :disabled="isLoadingActivities"
        >
          <svg v-if="!isLoadingActivities" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <div v-else class="loading loading-spinner loading-sm"></div>
        </button>
      </div>
    </div>

    <!-- Comment Composer -->
    <div class="bg-base-50/50 rounded-xl mb-6">
      <div class="p-4">
        <div class="flex gap-3">
          <!-- User Avatar -->
          <div class="avatar placeholder">
            <div class="w-10 h-10 rounded-full bg-primary/15 text-primary">
              <span class="text-sm font-medium">{{ getUserInitials(currentUser) }}</span>
            </div>
          </div>
          
          <!-- Comment Input -->
          <div class="flex-1">
            <textarea 
              v-model="newComment"
              class="textarea textarea-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all duration-200 w-full resize-none"
              :class="{
                'textarea-disabled': isSubmittingComment,
                'bg-primary/5': newComment.trim()
              }"
              placeholder="Add a comment... (Ctrl+Enter to send)"
              @keydown.ctrl.enter="handleAddComment"
              @keydown.meta.enter="handleAddComment"
              :disabled="isSubmittingComment"
              rows="3"
              maxlength="500"
            ></textarea>
            
            <!-- Comment Actions -->
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-base-content/50">{{ newComment.length }}/500</span>
              <div class="flex gap-2">
                <button 
                  v-if="newComment.trim()"
                  @click="newComment = ''"
                  class="btn btn-ghost btn-xs"
                  :disabled="isSubmittingComment"
                >
                  Cancel
                </button>
                <button 
                  class="btn btn-primary btn-sm"
                  @click="handleAddComment"
                  :disabled="!newComment.trim() || isSubmittingComment"
                >
                  <div v-if="isSubmittingComment" class="loading loading-spinner loading-xs"></div>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <span class="ml-1">{{ isSubmittingComment ? 'Sending...' : 'Send' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="relative">
      <!-- Loading State -->
      <div v-if="isLoadingActivities" class="flex justify-center py-8">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredActivities.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <h4 class="text-lg font-semibold text-base-content/60 mb-2">No activity yet</h4>
        <p class="text-sm text-base-content/50">
          {{ showOnlyComments ? 'No comments have been added.' : 'Activity will appear here as the task progresses.' }}
        </p>
      </div>

      <!-- Activity Items -->
      <div v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id" 
          class="group relative"
        >
          <!-- Timeline line -->
          <div class="absolute left-5 top-12 bottom-0 w-px bg-base-300 group-last:hidden"></div>
          
          <!-- Activity Card -->
          <div class="flex gap-4">
            <!-- Avatar -->
            <div class="avatar placeholder flex-shrink-0">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getActivityAvatarClass(activity)"
              >
                <span class="text-sm font-medium">{{ getUserInitials(activity.actor) }}</span>
              </div>
            </div>
            
            <!-- Activity Content -->
            <div class="flex-1 min-w-0">
              <div 
                class="bg-base-100 rounded-xl transition-all duration-200 hover:bg-base-50"
                :class="getActivityCardClass(activity)"
              >
                <div class="p-4">
                  <!-- Activity Header -->
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-base-content">{{ getUserName(activity.actor) }}</span>
                      <Chip
                        v-if="getActivityTypeLabel(activity.actionType)" 
                        :variant="getActivityChipVariant(activity.actionType)"
                        size="sm"
                      >
                        {{ getActivityTypeLabel(activity.actionType) }}
                      </Chip>
                    </div>
                    <time class="text-xs text-base-content/60" :title="formatFullDate(activity.createdAt)">
                      {{ formatRelativeTime(activity.createdAt) }}
                    </time>
                  </div>
                  
                  <!-- Activity Description -->
                  <div 
                    class="text-sm leading-relaxed"
                    :class="getActivityContentClass(activity)"
                  >
                    {{ activity.description || getDefaultActivityDescription(activity.actionType) }}
                  </div>
                  
                  <!-- Activity Changes -->
                  <div v-if="activity.changesJson" class="mt-3">
                    <div class="flex flex-wrap gap-2">
                      <div 
                        v-for="(change, key) in parseJsonMetadata(activity.changesJson)" 
                        :key="String(key)" 
                        class="inline-flex items-center gap-2 px-3 py-1 bg-base-200/50 rounded-full text-xs"
                      >
                        <span class="font-medium text-base-content/70">{{ formatFieldName(String(key)) }}:</span>
                        <span v-if="change && typeof change === 'object' && change.from !== undefined" 
                              class="font-mono text-error/70 line-through">{{ formatFieldValue(change.from) }}</span>
                        <svg v-if="change && typeof change === 'object' && change.from !== undefined" 
                             class="w-3 h-3 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        <span class="font-mono text-success/80">{{ 
                          change && typeof change === 'object' && change.to !== undefined 
                            ? formatFieldValue(change.to) 
                            : formatFieldValue(change) 
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Expandable Metadata -->
                  <details v-if="activity.metadataJson && activity.metadataJson !== activity.changesJson" class="mt-3">
                    <summary class="cursor-pointer text-xs text-base-content/60 hover:text-base-content transition-colors">
                      View technical details
                    </summary>
                    <div class="mt-2 p-3 bg-base-200/50 rounded-lg">
                      <pre class="text-xs text-base-content/70 overflow-auto">{{ formatJsonDisplay(activity.metadataJson) }}</pre>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { type TaskItem } from '../../composables/useTasks'
import Chip from '../ui/Chip.vue'

interface Activity {
  id: any
  actionType: string
  description?: string | null
  actor?: {
    id: any
    firstName?: string | null
    lastName?: string | null
    email: string
  } | null
  createdAt: any
  changesJson?: string | null
  metadataJson?: string | null
}

interface Props {
  task?: TaskItem | null
  activities?: Activity[]
  isLoadingActivities?: boolean
  totalActivityCount?: number
  isSubmittingComment?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activities: () => [],
  isLoadingActivities: false,
  totalActivityCount: 0,
  isSubmittingComment: false
})

const emit = defineEmits<{
  'add-comment': [content: string]
  'refresh-activities': []
}>()

// Auth
const { currentUser } = useAuth()

// Local state
const newComment = ref('')
const showOnlyComments = ref(false)

// Computed properties
const filteredActivities = computed(() => {
  if (showOnlyComments.value) {
    return props.activities.filter(activity => activity.actionType === 'comment')
  }
  return props.activities
})

// Activity styling helpers
const getActivityAvatarClass = (activity: Activity): string => {
  if (activity.actionType === 'comment') {
    return activity.actor?.id === currentUser.value?.id 
      ? 'bg-accent/20 text-accent' 
      : 'bg-primary/20 text-primary'
  }
  return 'bg-info/20 text-info'
}

const getActivityCardClass = (activity: Activity): string => {
  if (activity.actionType === 'comment') {
    return activity.actor?.id === currentUser.value?.id 
      ? 'border-accent/30 bg-accent/5' 
      : 'border-primary/30 bg-primary/5'
  }
  return 'border-base-300'
}

const getActivityContentClass = (activity: Activity): string => {
  if (activity.actionType === 'comment') {
    return 'font-medium text-base-content bg-base-50/80 p-3 rounded-lg'
  }
  return 'text-base-content/80'
}

const getActivityChipVariant = (actionType: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost' => {
  const variants: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'ghost'> = {
    'comment': 'primary',
    'create': 'success',
    'update': 'info',
    'delete': 'error',
    'assign': 'warning',
    'complete': 'success',
    'reopen': 'warning'
  }
  return variants[actionType] || 'neutral'
}


// Activity type labels
const getActivityTypeLabel = (actionType: string): string => {
  const typeLabels: Record<string, string> = {
    'create': 'Created',
    'update': 'Updated',
    'delete': 'Deleted',
    'assign': 'Assigned',
    'comment': 'Comment',
    'status_change': 'Status',
    'priority_change': 'Priority',
    'complete': 'Completed',
    'reopen': 'Reopened'
  }
  return typeLabels[actionType] || ''
}

const getDefaultActivityDescription = (actionType: string): string => {
  const descriptions: Record<string, string> = {
    'create': 'Created this task',
    'update': 'Updated task details',
    'delete': 'Deleted this task',
    'assign': 'Assigned the task',
    'comment': 'Added a comment',
    'status_change': 'Changed task status',
    'priority_change': 'Changed task priority',
    'complete': 'Marked task as complete',
    'reopen': 'Reopened the task'
  }
  return descriptions[actionType] || 'Performed an action on this task'
}

// Helper functions
const getUserInitials = (user: any): string => {
  if (!user) return 'U'
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (lastName) return lastName[0].toUpperCase()
  return user.email?.[0]?.toUpperCase() || 'U'
}

const getUserName = (user: any): string => {
  if (!user) return 'Unknown User'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email || 'Unknown User'
}

const parseJsonMetadata = (jsonString: string): any => {
  try {
    if (!jsonString || jsonString.trim() === '') return {}
    const parsed = JSON.parse(jsonString)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed
  } catch (error) {
    console.warn('Failed to parse JSON metadata:', error)
    return {}
  }
}

const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim()
}

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return 'None'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string') {
    if (value.includes('_')) {
      return value.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    }
    return value
  }
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const formatJsonDisplay = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return jsonString
  }
}

const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const formatFullDate = (dateString: string): string => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleString()
}

// Handle adding a comment
const handleAddComment = async () => {
  if (!newComment.value.trim() || props.isSubmittingComment) return
  
  emit('add-comment', newComment.value.trim())
  newComment.value = ''
}
</script>