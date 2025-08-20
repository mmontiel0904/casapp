<template>
  <AppLayout>
    <ProjectContextView :project-id="projectId" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectContextView from '@/components/project/ProjectContextView.vue'

const route = useRoute()

const projectId = computed(() => route.params.id as string)
</script>
