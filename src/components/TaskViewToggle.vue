<template>
  <div class="join bg-base-200 rounded-lg p-1">
    <button
      @click="$emit('toggle', 'table')"
      :class="[
        'btn btn-sm join-item font-sans',
        viewMode === 'table' 
          ? 'btn-primary' 
          : 'btn-ghost hover:bg-base-300'
      ]"
      :aria-pressed="viewMode === 'table'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-7 8H8m8 4H8m8-8h6m-6 4h6" />
      </svg>
      <span class="hidden sm:inline">Table</span>
    </button>
    
    <button
      @click="$emit('toggle', 'kanban')"
      :class="[
        'btn btn-sm join-item font-sans',
        viewMode === 'kanban' 
          ? 'btn-primary' 
          : 'btn-ghost hover:bg-base-300'
      ]"
      :aria-pressed="viewMode === 'kanban'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
      <span class="hidden sm:inline">Kanban</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TaskViewMode } from '../composables/useTasks'

interface Props {
  viewMode: TaskViewMode
}

interface Emits {
  (e: 'toggle', mode: TaskViewMode): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>