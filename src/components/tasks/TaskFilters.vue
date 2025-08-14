<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 rounded-lg">
    <div class="card-body p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Input -->
        <div class="form-control flex-1">
          <div class="input-group">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="input input-bordered input-sm w-full font-sans"
              @input="$emit('search', searchQuery)"
            />
            <button class="btn btn-square btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Status Filter -->
        <div class="form-control">
          <select
            v-model="selectedStatus"
            class="select select-bordered select-sm font-sans"
            @change="$emit('statusFilter', selectedStatus)"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="form-control">
          <select
            v-model="selectedPriority"
            class="select select-bordered select-sm font-sans"
            @change="$emit('priorityFilter', selectedPriority)"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Assignee Filter (if project members provided) -->
        <div v-if="projectMembers && projectMembers.length > 0" class="form-control">
          <select
            v-model="selectedAssignee"
            class="select select-bordered select-sm font-sans"
            @change="$emit('assigneeFilter', selectedAssignee)"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            <option 
              v-for="member in projectMembers" 
              :key="member.user.id" 
              :value="member.user.id"
            >
              {{ getUserDisplayName(member.user) }}
            </option>
          </select>
        </div>

        <!-- Quick Filters -->
        <div class="flex gap-2">
          <button
            @click="toggleQuickFilter('overdue')"
            :class="[
              'btn btn-outline btn-sm font-sans',
              quickFilters.overdue ? 'btn-error' : 'btn-ghost'
            ]"
            title="Show overdue tasks only"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="hidden lg:inline ml-1">Overdue</span>
          </button>

          <button
            @click="toggleQuickFilter('myTasks')"
            :class="[
              'btn btn-outline btn-sm font-sans',
              quickFilters.myTasks ? 'btn-info' : 'btn-ghost'
            ]"
            title="Show only tasks assigned to me"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="hidden lg:inline ml-1">My Tasks</span>
          </button>
        </div>

        <!-- Clear Filters Button -->
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="btn btn-ghost btn-sm font-sans"
          title="Clear all filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="hidden lg:inline ml-1">Clear</span>
        </button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
        <div class="text-sm text-base-content/70 font-sans">Active filters:</div>
        
        <div v-if="selectedStatus" class="badge badge-outline gap-1">
          Status: {{ getStatusDisplayName(selectedStatus) }}
          <button @click="clearStatusFilter" class="btn btn-ghost btn-xs">×</button>
        </div>
        
        <div v-if="selectedPriority" class="badge badge-outline gap-1">
          Priority: {{ getPriorityDisplayName(selectedPriority) }}
          <button @click="clearPriorityFilter" class="btn btn-ghost btn-xs">×</button>
        </div>
        
        <div v-if="selectedAssignee && selectedAssignee !== 'unassigned'" class="badge badge-outline gap-1">
          Assignee: {{ getAssigneeDisplayName(selectedAssignee) }}
          <button @click="clearAssigneeFilter" class="btn btn-ghost btn-xs">×</button>
        </div>
        
        <div v-if="selectedAssignee === 'unassigned'" class="badge badge-outline gap-1">
          Unassigned Tasks
          <button @click="clearAssigneeFilter" class="btn btn-ghost btn-xs">×</button>
        </div>
        
        <div v-if="quickFilters.overdue" class="badge badge-error badge-outline gap-1">
          Overdue Only
          <button @click="toggleQuickFilter('overdue')" class="btn btn-ghost btn-xs">×</button>
        </div>
        
        <div v-if="quickFilters.myTasks" class="badge badge-info badge-outline gap-1">
          My Tasks Only
          <button @click="toggleQuickFilter('myTasks')" class="btn btn-ghost btn-xs">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ProjectMember {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

interface Props {
  projectMembers?: ProjectMember[]
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'statusFilter', status: string): void
  (e: 'priorityFilter', priority: string): void
  (e: 'assigneeFilter', assigneeId: string): void
  (e: 'quickFilter', filter: string, active: boolean): void
  (e: 'clearFilters'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Remove unused currentUser

// Local state
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedAssignee = ref('')
const quickFilters = ref({
  overdue: false,
  myTasks: false
})

// Computed properties
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedStatus.value || 
         selectedPriority.value || 
         selectedAssignee.value ||
         quickFilters.value.overdue ||
         quickFilters.value.myTasks
})

// Helper functions
const getStatusDisplayName = (status: string): string => {
  const names = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return names[status as keyof typeof names] || status
}

const getPriorityDisplayName = (priority: string): string => {
  const names = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
  }
  return names[priority as keyof typeof names] || priority
}

const getUserDisplayName = (user: any): string => {
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return user.email.split('@')[0]
  }
}

const getAssigneeDisplayName = (assigneeId: string): string => {
  if (!props.projectMembers) return 'Unknown'
  
  const member = props.projectMembers.find(m => m.user.id === assigneeId)
  return member ? getUserDisplayName(member.user) : 'Unknown'
}

// Actions
const toggleQuickFilter = (filterType: 'overdue' | 'myTasks') => {
  quickFilters.value[filterType] = !quickFilters.value[filterType]
  emit('quickFilter', filterType, quickFilters.value[filterType])
}

const clearStatusFilter = () => {
  selectedStatus.value = ''
  emit('statusFilter', '')
}

const clearPriorityFilter = () => {
  selectedPriority.value = ''
  emit('priorityFilter', '')
}

const clearAssigneeFilter = () => {
  selectedAssignee.value = ''
  emit('assigneeFilter', '')
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPriority.value = ''
  selectedAssignee.value = ''
  quickFilters.value.overdue = false
  quickFilters.value.myTasks = false
  
  emit('search', '')
  emit('statusFilter', '')
  emit('priorityFilter', '')
  emit('assigneeFilter', '')
  emit('quickFilter', 'overdue', false)
  emit('quickFilter', 'myTasks', false)
  emit('clearFilters')
}
</script>