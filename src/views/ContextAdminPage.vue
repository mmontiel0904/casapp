<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Context Management</h1>
        <p class="text-base-content/70 mt-1">
          Manage context categories, types, and system-wide settings
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-bordered">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab tab-lg" 
        :class="{ 'tab-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="w-5 h-5 mr-2" />
        {{ tab.name }}
        <div v-if="tab.comingSoon" class="badge badge-warning badge-xs ml-2">Soon</div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="min-h-96">
      <!-- Context Types -->
      <div v-if="activeTab === 'types'" class="space-y-6">
        <ContextTypesManager />
      </div>

      <!-- Global Categories -->
      <div v-else-if="activeTab === 'categories'" class="space-y-6">
        <GlobalCategoriesManager />
      </div>

      <!-- Ingestion Settings -->
      <div v-else-if="activeTab === 'ingestion'" class="space-y-6">
        <IngestionSettingsManager />
      </div>

      <!-- Processing Rules -->
      <div v-else-if="activeTab === 'rules'" class="space-y-6">
        <ProcessingRulesManager />
      </div>

      <!-- Analytics -->
      <div v-else-if="activeTab === 'analytics'" class="space-y-6">
        <ContextAnalytics />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import ContextTypesManager from '@/components/context/ContextTypesManager.vue'
import GlobalCategoriesManager from '@/components/context/GlobalCategoriesManager.vue'
import IngestionSettingsManager from '@/components/context/IngestionSettingsManager.vue'
import ProcessingRulesManager from '@/components/context/ProcessingRulesManager.vue'
import ContextAnalytics from '@/components/context/ContextAnalytics.vue'

// Icons as components
const CategoryIcon = () => h('svg', { 
  class: 'w-5 h-5', 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    'stroke-width': '2', 
    d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
  })
])

const TypeIcon = () => h('svg', { 
  class: 'w-5 h-5', 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    'stroke-width': '2', 
    d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' 
  })
])

const IngestionIcon = () => h('svg', { 
  class: 'w-5 h-5', 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    'stroke-width': '2', 
    d: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' 
  })
])

const RulesIcon = () => h('svg', { 
  class: 'w-5 h-5', 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    'stroke-width': '2', 
    d: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
  })
])

const AnalyticsIcon = () => h('svg', { 
  class: 'w-5 h-5', 
  fill: 'none', 
  stroke: 'currentColor', 
  viewBox: '0 0 24 24' 
}, [
  h('path', { 
    'stroke-linecap': 'round', 
    'stroke-linejoin': 'round', 
    'stroke-width': '2', 
    d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' 
  })
])

// State
const activeTab = ref('types')

const tabs = [
  { 
    id: 'types', 
    name: 'Context Types', 
    icon: TypeIcon,
    comingSoon: false
  },
  { 
    id: 'categories', 
    name: 'Global Categories', 
    icon: CategoryIcon,
    comingSoon: true
  },
  { 
    id: 'ingestion', 
    name: 'Ingestion Settings', 
    icon: IngestionIcon,
    comingSoon: true
  },
  { 
    id: 'rules', 
    name: 'Processing Rules', 
    icon: RulesIcon,
    comingSoon: true
  },
  { 
    id: 'analytics', 
    name: 'Analytics', 
    icon: AnalyticsIcon,
    comingSoon: true
  }
]
</script>
