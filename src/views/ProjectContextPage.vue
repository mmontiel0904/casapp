<template>
  <ProjectContextView :project-id="projectId" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProjectContextView from '@/components/project/ProjectContextView.vue'

const route = useRoute()

const projectId = computed(() => route.params.id as string)
</script>
