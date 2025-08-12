<template>
  <div class="grid-container" :class="containerClass">
    <!-- Loading State -->
    <div v-if="loading" class="grid gap-6" :class="gridClasses">
      <div 
        v-for="i in skeletonCount" 
        :key="`skeleton-${i}`"
        class="animate-pulse"
      >
        <div class="bg-base-300 rounded-lg" :style="{ height: `${skeletonHeight}px` }"></div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="isEmpty" class="col-span-full">
      <slot name="empty">
        <div class="text-center py-16">
          <div class="w-16 h-16 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
            <component v-if="emptyIcon" :is="emptyIcon" class="w-8 h-8 text-base-content/40" />
            <div v-else class="w-8 h-8 bg-base-content/20 rounded"></div>
          </div>
          <h3 class="text-lg font-semibold text-base-content/60 mb-2">
            {{ emptyTitle || 'No items found' }}
          </h3>
          <p class="text-sm text-base-content/40 max-w-md mx-auto">
            {{ emptyDescription || 'There are no items to display at the moment.' }}
          </p>
          <div v-if="$slots.emptyAction" class="mt-6">
            <slot name="emptyAction" />
          </div>
        </div>
      </slot>
    </div>
    
    <!-- Grid Items -->
    <div v-else class="grid gap-6" :class="gridClasses">
      <!-- Custom item rendering -->
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="grid-item"
        :class="[
          itemClass,
          // Stagger animation for smooth entrance
          'animate-in fade-in slide-in-from-bottom-4',
          `animation-delay-${Math.min(index * 100, 500)}ms`
        ]"
      >
        <slot name="item" :item="item" :index="index">
          <!-- Default item rendering -->
          <div class="p-4 bg-base-100 border border-base-300 rounded-lg">
            <pre class="text-xs">{{ JSON.stringify(item, null, 2) }}</pre>
          </div>
        </slot>
      </div>
    </div>
    
    <!-- Load More Section -->
    <div v-if="hasMore && !loading" class="col-span-full mt-8 text-center">
      <slot name="loadMore">
        <button 
          class="btn btn-outline btn-wide"
          :class="{ 'loading': loadingMore }"
          @click="handleLoadMore"
          :disabled="loadingMore"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </slot>
    </div>
    
    <!-- Pagination -->
    <div v-if="pagination && totalPages > 1" class="col-span-full mt-8">
      <slot name="pagination">
        <div class="flex justify-center">
          <div class="join">
            <button 
              class="join-item btn btn-sm"
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
            >
              «
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="join-item btn btn-sm"
              :class="{ 'btn-active': page === currentPage }"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>
            <button 
              class="join-item btn btn-sm"
              :disabled="currentPage === totalPages"
              @click="handlePageChange(currentPage + 1)"
            >
              »
            </button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  items?: any[]
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  } | number
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
  pagination?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
  keyField?: string
  containerClass?: string
  itemClass?: string
  skeletonCount?: number
  skeletonHeight?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => ({ default: 1, sm: 2, lg: 3 }),
  gap: 'md',
  currentPage: 1,
  totalPages: 0,
  pageSize: 12,
  skeletonCount: 6,
  skeletonHeight: 200,
  keyField: 'id'
})

const emit = defineEmits<{
  loadMore: []
  pageChange: [page: number]
}>()

const gridClasses = computed(() => {
  const baseClass = 'auto-rows-max'
  const gapClass = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }[props.gap]
  
  if (typeof props.columns === 'number') {
    return `${baseClass} ${gapClass} grid-cols-1 sm:grid-cols-${Math.min(props.columns, 2)} lg:grid-cols-${props.columns}`
  }
  
  // Responsive columns
  const cols = props.columns as { default?: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }
  const responsiveClasses = [
    cols.default ? `grid-cols-${cols.default}` : 'grid-cols-1',
    cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : '',
    cols['2xl'] ? `2xl:grid-cols-${cols['2xl']}` : ''
  ].filter(Boolean).join(' ')
  
  return `${baseClass} ${gapClass} ${responsiveClasses}`
})

const isEmpty = computed(() => {
  return !props.loading && (!props.items || props.items.length === 0)
})

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const delta = 2 // Number of pages to show on each side
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)
  
  const pages: (number | string)[] = []
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

const getItemKey = (item: any, index: number): string | number => {
  if (props.keyField && item && typeof item === 'object') {
    return item[props.keyField] || index
  }
  return index
}

const handleLoadMore = () => {
  emit('loadMore')
}

const handlePageChange = (page: number | string) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<style scoped>
@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: animate-in 0.5s ease-out forwards;
}

.fade-in {
  opacity: 0;
}

.slide-in-from-bottom-4 {
  transform: translateY(16px);
}

.animation-delay-0ms { animation-delay: 0ms; }
.animation-delay-100ms { animation-delay: 100ms; }
.animation-delay-200ms { animation-delay: 200ms; }
.animation-delay-300ms { animation-delay: 300ms; }
.animation-delay-400ms { animation-delay: 400ms; }
.animation-delay-500ms { animation-delay: 500ms; }
</style>