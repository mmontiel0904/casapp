<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold font-serif text-base-content">Projects</h1>
        <p class="text-base-content/70 mt-2">Manage your projects and tasks</p>
      </div>
      
      <div class="flex gap-4">
        <button 
          v-if="canCreateProjects"
          @click="showCreateModal = true"
          class="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </button>
      </div>
    </div>

    <!-- Coming Soon Banner -->
    <div class="alert alert-info mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h4 class="font-bold">Task System Integration</h4>
        <div class="text-sm">The full task management system is being implemented following the TASK_SYSTEM_INTEGRATION.md guide. This includes project creation, task boards, member management, and role-based permissions.</div>
      </div>
    </div>

    <!-- Navigation Placeholder -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- My Projects Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Projects
          </h2>
          <p>Projects you own or collaborate on</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      <!-- My Tasks Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            My Tasks
          </h2>
          <p>Tasks assigned to you across all projects</p>
          <div class="card-actions justify-end">
            <button class="btn btn-secondary btn-sm" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      <!-- Project Templates Card -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Templates
          </h2>
          <p>Pre-built project templates to get started quickly</p>
          <div class="card-actions justify-end">
            <button class="btn btn-accent btn-sm" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Implementation Roadmap -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold font-serif mb-6">Implementation Roadmap</h2>
      
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="badge badge-success">✓</div>
          <span>Navigation integration with role-based access</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-success">✓</div>
          <span>GraphQL operations and type generation</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-success">✓</div>
          <span>Permission service for task system</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-success">✓</div>
          <span>Project listing and creation</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-ghost">○</div>
          <span>Kanban task boards</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-ghost">○</div>
          <span>Project member management</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-ghost">○</div>
          <span>Task assignment and tracking</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="badge badge-ghost">○</div>
          <span>Real-time updates and notifications</span>
        </div>
      </div>
    </div>

    <!-- Project Creation Modal -->
    <ProjectCreateModal 
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @project-created="handleProjectCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { taskPermissionService } from '../services/taskPermissions'
import ProjectCreateModal from '../components/ProjectCreateModal.vue'

const showCreateModal = ref(false)

// Permission checks - using basic role-based checks for now
const canCreateProjects = computed(() => {
  return taskPermissionService.canCreateProjectsBasic()
})

// Event handlers
const handleProjectCreated = (project: any) => {
  console.log('Project created successfully:', project.name)
  // TODO: Refresh projects list when we implement project listing
  // TODO: Optionally redirect to the new project page
}
</script>