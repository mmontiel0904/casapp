<template>
  <!-- Redesigned Task Management Toolbar -->
  <div class="space-y-4">
    <!-- Header Section - Page Title and Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Page Context with Live Stats -->
      <div class="flex items-center gap-4">
        <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
          <h1 class="text-3xl font-bold text-base-content">{{ title }}</h1>
          <div class="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
            <!-- Total Count Badge -->
            <Chip variant="primary" size="sm">
              <template #icon>
                <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </template>
              <span class="font-mono font-medium">{{ totalCount }}</span>
              <span class="ml-1 text-primary/80">total</span>
            </Chip>
            
            <!-- Critical Indicators -->
            <Chip v-if="overdueCount > 0" variant="error" size="sm">
              <template #icon>
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </template>
              <span class="font-mono font-medium">{{ overdueCount }}</span>
              <span class="ml-1 text-error/80">overdue</span>
            </Chip>
            
            <Chip v-if="urgentCount > 0" variant="warning" size="sm">
              <template #icon>
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </template>
              <span class="font-mono font-medium">{{ urgentCount }}</span>
              <span class="ml-1 text-warning/80">urgent</span>
            </Chip>
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
          <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-xl w-40">
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
    <div class="bg-base-50/50 rounded-xl shadow-sm p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Left: Search and Primary Filters -->
        <div class="flex-1 space-y-3">
          <!-- Top Row: Search -->
          <div class="relative max-w-md">
            <input 
              v-model="searchQuery"
              @input="$emit('search', searchQuery)"
              type="text" 
              placeholder="Search tasks..."
              class="input input-sm input-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all w-full pl-10"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <!-- Bottom Row: Filters -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Primary Filters -->
            <div class="flex items-center gap-2">
              <select 
                v-model="selectedStatus"
                @change="$emit('statusFilter', selectedStatus)"
                class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all text-sm w-24"
              >
                <option value="">Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">Progress</option>
                <option value="COMPLETED">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              
              <select 
                v-model="selectedPriority"
                @change="$emit('priorityFilter', selectedPriority)"
                class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all text-sm w-24"
              >
                <option value="">Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              
              <select 
                v-model="selectedRecurrence"
                @change="$emit('recurrenceFilter', selectedRecurrence)"
                class="select select-sm select-ghost bg-base-100 focus:bg-base-100 hover:bg-base-100 transition-all text-sm w-28"
              >
                <option value="">Type</option>
                <option value="NONE">One-time</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKDAYS">Weekdays</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="INSTANCES">Instances</option>
                <option value="PARENTS">Parents</option>
              </select>
            </div>
            
            <!-- Quick Filters -->
            <div class="flex items-center gap-1.5">
              <button 
                @click="$emit('quickFilter', 'myTasks', !activeFilters.myTasks)"
                :class="['btn btn-xs transition-all', activeFilters.myTasks ? 'btn-primary' : 'btn-ghost hover:bg-primary/10']"
              >
                Mine
              </button>
              <button 
                @click="$emit('quickFilter', 'overdue', !activeFilters.overdue)"
                :class="['btn btn-xs transition-all', activeFilters.overdue ? 'btn-error' : 'btn-ghost hover:bg-error/10']"
              >
                Overdue
              </button>
            </div>
            
            <!-- Clear Filters -->
            <button 
              v-if="hasActiveFilters"
              @click="$emit('clearFilters')"
              class="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content transition-all"
            >
              <span class="hidden sm:inline">Clear All</span>
              <span class="sm:hidden">Clear</span>
            </button>
          </div>
        </div>
        
        <!-- Right: Actions and View Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- View Mode - Table Only -->
          <Chip variant="primary" size="md" class="hidden sm:flex">
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-7 8H8m8 4H8m8-8h6m-6 4h6"></path>
              </svg>
            </template>
            Table View
          </Chip>
          
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
import { TaskStatus, TaskPriority } from '../../generated/graphql'
import Chip from '../ui/Chip.vue'

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

const props = withDefaults(defineProps<Props>(), {
  title: 'My Tasks',
  totalCount: 0,
  overdueCount: 0,
  urgentCount: 0,
  loading: false,
  canCreateTasks: true,
  activeFilters: () => ({ myTasks: false, overdue: false })
})

// Emits with proper enum types
defineEmits<{
  addTask: []
  refresh: []
  export: []
  search: [query: string]
  statusFilter: [status: TaskStatus | '']
  priorityFilter: [priority: TaskPriority | '']
  recurrenceFilter: [recurrence: string]
  quickFilter: [type: string, active: boolean]
  clearFilters: []
}>()

// Local state with proper enum types
const searchQuery = ref('')
const selectedStatus = ref<TaskStatus | ''>('')
const selectedPriority = ref<TaskPriority | ''>('')
const selectedRecurrence = ref('')

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedStatus.value || selectedPriority.value || selectedRecurrence.value || props.activeFilters.overdue || props.activeFilters.myTasks
})
</script>