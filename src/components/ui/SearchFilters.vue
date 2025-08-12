<template>
  <div class="search-filters-container space-y-4">
    <!-- Search Bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="input input-bordered w-full pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        @input="handleSearch"
      />
      
      <!-- Clear Search -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Filters Row -->
    <div 
      v-if="filters && filters.length > 0"
      class="flex flex-wrap items-center gap-3"
    >
      <!-- Individual Filters -->
      <div
        v-for="filter in filters"
        :key="filter.key"
        class="filter-group"
      >
        <!-- Select Filter -->
        <select
          v-if="filter.type === 'select'"
          v-model="filterValues[filter.key]"
          class="select select-bordered select-sm min-w-32"
          @change="handleFilterChange(filter.key, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ filter.placeholder || `All ${filter.label}` }}</option>
          <option
            v-for="option in filter.options"
            :key="String(option.value)"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Multi-select Filter with Tags -->
        <div v-else-if="filter.type === 'multi-select'" class="relative">
          <div class="dropdown dropdown-bottom">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm m-1">
              {{ filter.label }}
              <span v-if="getSelectedCount(filter.key) > 0" class="badge badge-primary badge-sm ml-1">
                {{ getSelectedCount(filter.key) }}
              </span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </div>
            <div class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <div class="form-control">
                <label
                  v-for="option in filter.options"
                  :key="String(option.value)"
                  class="label cursor-pointer justify-start"
                >
                  <input
                    type="checkbox"
                    :checked="isMultiSelected(filter.key, option.value)"
                    @change="handleMultiSelectChange(filter.key, option.value, ($event.target as HTMLInputElement).checked)"
                    class="checkbox checkbox-sm checkbox-primary mr-2"
                  />
                  <span class="label-text">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Date Range Filter -->
        <div v-else-if="filter.type === 'date-range'" class="flex items-center gap-2">
          <input
            v-model="filterValues[filter.key + '_start']"
            type="date"
            class="input input-bordered input-sm"
            @change="handleDateRangeChange(filter.key)"
          />
          <span class="text-base-content/60">to</span>
          <input
            v-model="filterValues[filter.key + '_end']"
            type="date"
            class="input input-bordered input-sm"
            @change="handleDateRangeChange(filter.key)"
          />
        </div>
        
        <!-- Toggle Filter -->
        <label v-else-if="filter.type === 'toggle'" class="label cursor-pointer">
          <span class="label-text mr-2">{{ filter.label }}</span>
          <input
            v-model="filterValues[filter.key]"
            type="checkbox"
            class="toggle toggle-primary toggle-sm"
            @change="handleFilterChange(filter.key, ($event.target as HTMLInputElement).checked)"
          />
        </label>
      </div>
      
      <!-- Clear All Filters -->
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="btn btn-ghost btn-sm text-base-content/60 hover:text-error"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear Filters
      </button>
    </div>
    
    <!-- Active Filter Tags -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <!-- Search tag -->
      <div v-if="searchQuery" class="badge badge-outline gap-1">
        Search: "{{ searchQuery }}"
        <button @click="clearSearch" class="hover:text-error">×</button>
      </div>
      
      <!-- Filter tags -->
      <div
        v-for="(value, key) in activeFilterTags"
        :key="key"
        class="badge badge-outline gap-1"
      >
        {{ getFilterLabel(key) }}: {{ value }}
        <button @click="clearFilter(key)" class="hover:text-error">×</button>
      </div>
    </div>
    
    <!-- Results Summary -->
    <div v-if="showResultsCount && resultCount !== undefined" class="text-sm text-base-content/60">
      {{ resultCount === 0 ? 'No results found' : `${resultCount} result${resultCount !== 1 ? 's' : ''}` }}
      <span v-if="totalCount !== undefined && totalCount !== resultCount">
        of {{ totalCount }} total
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface Filter {
  key: string
  label: string
  type: 'select' | 'multi-select' | 'date-range' | 'toggle'
  placeholder?: string
  options?: FilterOption[]
}

interface Props {
  filters?: Filter[]
  searchPlaceholder?: string
  showResultsCount?: boolean
  resultCount?: number
  totalCount?: number
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search...',
  showResultsCount: true,
  debounceMs: 300
})

const emit = defineEmits<{
  search: [query: string]
  filter: [filters: Record<string, any>]
  change: [query: string, filters: Record<string, any>]
}>()

const searchQuery = ref('')
const filterValues = ref<Record<string, any>>({})

let searchTimeout: number

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || Object.values(filterValues.value).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'boolean') return value
    return value !== '' && value !== null && value !== undefined
  })
})

const activeFilterTags = computed(() => {
  const tags: Record<string, string> = {}
  
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (key.endsWith('_start') || key.endsWith('_end')) return // Skip date range parts
    
    if (Array.isArray(value) && value.length > 0) {
      const filter = props.filters?.find(f => f.key === key)
      const labels = value.map(v => {
        const option = filter?.options?.find(o => o.value === v)
        return option?.label || v
      })
      tags[key] = labels.join(', ')
    } else if (typeof value === 'boolean' && value) {
      tags[key] = 'Yes'
    } else if (value !== '' && value !== null && value !== undefined) {
      const filter = props.filters?.find(f => f.key === key)
      if (filter?.type === 'date-range') {
        const startDate = filterValues.value[key + '_start']
        const endDate = filterValues.value[key + '_end']
        if (startDate || endDate) {
          tags[key] = `${startDate || '...'} - ${endDate || '...'}`
        }
      } else {
        const option = filter?.options?.find(o => o.value === value)
        tags[key] = option?.label || value.toString()
      }
    }
  })
  
  return tags
})

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
    emit('change', searchQuery.value, filterValues.value)
  }, props.debounceMs)
}

const handleFilterChange = (key: string, value: any) => {
  filterValues.value[key] = value
  emit('filter', filterValues.value)
  emit('change', searchQuery.value, filterValues.value)
}

const handleMultiSelectChange = (key: string, value: any, checked: boolean) => {
  if (!filterValues.value[key]) {
    filterValues.value[key] = []
  }
  
  if (checked) {
    filterValues.value[key].push(value)
  } else {
    const index = filterValues.value[key].indexOf(value)
    if (index > -1) {
      filterValues.value[key].splice(index, 1)
    }
  }
  
  emit('filter', filterValues.value)
  emit('change', searchQuery.value, filterValues.value)
}

const handleDateRangeChange = (key: string) => {
  const startDate = filterValues.value[key + '_start']
  const endDate = filterValues.value[key + '_end']
  
  if (startDate || endDate) {
    filterValues.value[key] = { start: startDate, end: endDate }
  } else {
    delete filterValues.value[key]
  }
  
  emit('filter', filterValues.value)
  emit('change', searchQuery.value, filterValues.value)
}

const isMultiSelected = (key: string, value: any): boolean => {
  const values = filterValues.value[key] || []
  return Array.isArray(values) && values.includes(value)
}

const getSelectedCount = (key: string): number => {
  const values = filterValues.value[key] || []
  return Array.isArray(values) ? values.length : 0
}

const getFilterLabel = (key: string): string => {
  const filter = props.filters?.find(f => f.key === key)
  return filter?.label || key
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const clearFilter = (key: string) => {
  if (key.includes('_')) {
    // Handle date range
    const baseKey = key.replace('_start', '').replace('_end', '')
    delete filterValues.value[baseKey]
    delete filterValues.value[baseKey + '_start']
    delete filterValues.value[baseKey + '_end']
  } else {
    delete filterValues.value[key]
  }
  
  emit('filter', filterValues.value)
  emit('change', searchQuery.value, filterValues.value)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  filterValues.value = {}
  emit('search', '')
  emit('filter', {})
  emit('change', '', {})
}

// Initialize filters
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    newFilters.forEach(filter => {
      if (!(filter.key in filterValues.value)) {
        if (filter.type === 'multi-select') {
          filterValues.value[filter.key] = []
        } else if (filter.type === 'toggle') {
          filterValues.value[filter.key] = false
        } else {
          filterValues.value[filter.key] = ''
        }
      }
    })
  }
}, { immediate: true })
</script>