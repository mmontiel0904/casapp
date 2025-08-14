<template>
  <!-- Redesigned Task Management Toolbar -->
  <div class="space-y-4">
    <!-- Header Section - Page Title and Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Page Context with Live Stats -->
      <div class="flex items-center gap-4">
        <div class="flex items-baseline gap-3">
          <h1 class="text-3xl font-bold text-base-content">{{ title }}</h1>
          <div class="flex items-center gap-3 text-sm">
            <!-- Total Count Badge -->
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span class="font-mono font-medium">{{ totalCount }}</span>
              <span class="text-primary/80">total</span>
            </div>
            
            <!-- Critical Indicators -->
            <div v-if="overdueCount > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-error/10 text-error rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-mono font-medium">{{ overdueCount }}</span>
              <span class="text-error/80">overdue</span>
            </div>
            
            <div v-if="urgentCount > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-warning/10 text-warning rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-mono font-medium">{{ urgentCount }}</span>
              <span class="text-warning/80">urgent</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Secondary Actions -->
      <div class="flex items-center gap-3">
        <!-- Utility Actions Menu -->
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-square btn-sm hover:bg-base-200" title="More actions">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
            <li>
              <a @click="$emit('refresh')" :disabled="loading">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </a>
            </li>
            <li>
              <a @click="$emit('export')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Controls Section - Filters, Search, View Toggle, and Add Task -->
    <div class="bg-gradient-to-r from-base-100 to-base-50 border border-base-300 rounded-lg shadow-sm p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Left: Search and Filters -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <!-- Smart Search -->
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="searchQuery"
              @input="$emit('search', searchQuery)"
              type="text" 
              placeholder="Search tasks, projects, or assignees..."
              class="input input-sm input-bordered w-full pl-10 bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <!-- Filters Row -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Status Filter -->
            <select 
              v-model="selectedStatus"
              @change="$emit('statusFilter', selectedStatus)"
              class="select select-sm select-bordered bg-base-100 text-sm min-w-28"
            >
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <!-- Priority Filter -->
            <select 
              v-model="selectedPriority"
              @change="$emit('priorityFilter', selectedPriority)"
              class="select select-sm select-bordered bg-base-100 text-sm min-w-28"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            
            <!-- Recurrence Filter -->
            <select 
              v-model="selectedRecurrence"
              @change="$emit('recurrenceFilter', selectedRecurrence)"
              class="select select-sm select-bordered bg-base-100 text-sm min-w-32"
            >
              <option value="">All Tasks</option>
              <option value="NONE">One-time</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKDAYS">Weekdays</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="INSTANCES">Instances Only</option>
              <option value="PARENTS">Parent Tasks Only</option>
            </select>
            
            <!-- Quick Filters -->
            <div class="flex items-center gap-1">
              <button 
                @click="$emit('quickFilter', 'myTasks', !activeFilters.myTasks)"
                :class="['btn btn-xs', activeFilters.myTasks ? 'btn-primary' : 'btn-ghost']"
              >
                Mine
              </button>
              <button 
                @click="$emit('quickFilter', 'overdue', !activeFilters.overdue)"
                :class="['btn btn-xs', activeFilters.overdue ? 'btn-error' : 'btn-ghost']"
              >
                Overdue
              </button>
            </div>
            
            <!-- Clear Filters -->
            <button 
              v-if="hasActiveFilters"
              @click="$emit('clearFilters')"
              class="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <!-- Right: Actions and View Controls -->
        <div class="flex items-center gap-3">
          <!-- View Mode - Table Only -->
          <div class="badge badge-primary badge-lg gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-7 8H8m8 4H8m8-8h6m-6 4h6"></path>
            </svg>
            <span>Table View</span>
          </div>
          
          <!-- Primary Add Task Button - Now positioned near table -->
          <button 
            @click="$emit('addTask')"
            class="btn btn-primary gap-2 shadow-sm hover:shadow-md transition-all"
            :disabled="!canCreateTasks"
            title="Create a new task"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="hidden sm:inline">Add Task</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  title?: string
  totalCount?: number
  overdueCount?: number
  urgentCount?: number
  loading?: boolean
  canCreateTasks?: boolean
  activeFilters?: {
    myTasks: boolean
    overdue: boolean
  }
}

withDefaults(defineProps<Props>(), {
  title: 'My Tasks',
  totalCount: 0,
  overdueCount: 0,
  urgentCount: 0,
  loading: false,
  canCreateTasks: true,
  activeFilters: () => ({ myTasks: false, overdue: false })
})

// Emits
defineEmits<{
  addTask: []
  refresh: []
  export: []
  search: [query: string]
  statusFilter: [status: string]
  priorityFilter: [priority: string]
  recurrenceFilter: [recurrence: string]
  quickFilter: [type: string, active: boolean]
  clearFilters: []
}>()

// Local state
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedRecurrence = ref('')

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedStatus.value || selectedPriority.value || selectedRecurrence.value
})
</script>