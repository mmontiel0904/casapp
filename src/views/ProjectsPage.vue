<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200/50 to-base-100">
    <!-- Hero Header Section -->
    <div class="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-base-300/50">
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Title and Description -->
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 class="text-4xl font-bold text-base-content">Projects</h1>
                <p class="text-base-content/60 mt-1">Organize, track, and collaborate on your work</p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button 
              v-if="canCreateProjects"
              @click="showCreateModal = true"
              class="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </button>

            <button 
              @click="showEmailIngestionModal = true"
              class="btn btn-secondary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Ingest Emails
            </button>
            
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-outline btn-square">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                <li><a @click="handleViewChange('grid')">Grid View</a></li>
                <li><a @click="handleViewChange('list')">List View</a></li>
                <li class="divider"></li>
                <li><a @click="handleSort('name')">Sort by Name</a></li>
                <li><a @click="handleSort('date')">Sort by Date</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-8 space-y-8">
      <!-- Overview Stats -->
      <ui-stats 
        :stats="projectStats" 
        :columns="4" 
        :loading="statsLoading"
        class="mb-8"
      />
      
      <!-- Search and Filters -->
      <ui-search-filters
        :filters="projectFilters"
        search-placeholder="Search projects by name or description..."
        :result-count="filteredProjects.length"
        :total-count="totalProjects"
        @search="handleSearch"
        @filter="handleFilter"
        @change="handleSearchAndFilter"
      />
      
      <!-- Projects Grid -->
      <ui-grid
        :items="filteredProjects"
        :columns="{ default: 1, sm: 2, lg: 3, xl: 4 }"
        :loading="projectsLoading"
        :skeleton-count="8"
        :skeleton-height="280"
        empty-title="No projects yet"
        empty-description="Create your first project to get started with organizing your work."
        :empty-icon="FolderPlusIcon"
      >
        <template #item="{ item: project }">
          <ui-card
            :title="project.name"
            :subtitle="project.description"
            :badge="getProjectStatusBadge(project)"
            :status="project.isActive ? 'Active' : 'Inactive'"
            :status-class="project.isActive ? 'badge-success' : 'badge-warning'"
            interactive
            @click="handleProjectClick(project)"
            class="h-full"
          >
            <template #quickActions>
              <ui-action-menu
                :actions="getProjectActions(project)"
                :item="project"
                @action="handleProjectAction"
              />
            </template>
            
              <div class="space-y-4">
              <!-- Email Context Stats -->
              <div v-if="project.emailStats" class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-base-content/70">{{ project.emailStats.total || 0 }} emails</span>
                </div>
                <button 
                  @click.stop="openEmailIngestionForProject(project.id)"
                  class="btn btn-outline btn-xs"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Emails
                </button>
              </div>

              <!-- Owner and Members -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span class="text-xs font-medium text-primary">
                        {{ getUserInitials(project.owner) }}
                      </span>
                    </div>
                  </div>
                  <span class="text-base-content/60">{{ getOwnerName(project.owner) }}</span>
                </div>
                <div v-if="project.members.length > 0" class="avatar-group -space-x-2">
                  <div 
                    v-for="member in project.members.slice(0, 3)" 
                    :key="member.id"
                    class="avatar"
                  >
                    <div class="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span class="text-xs font-medium text-secondary">
                        {{ getUserInitials(member.user) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="project.members.length > 3" class="avatar placeholder">
                    <div class="w-6 h-6 rounded-full bg-base-300">
                      <span class="text-xs">+{{ project.members.length - 3 }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Project Timeline -->
              <div class="text-xs text-base-content/50 space-y-1">
                <div>Created {{ formatDate(project.createdAt) }}</div>
                <div v-if="project.updatedAt !== project.createdAt">
                  Updated {{ formatDate(project.updatedAt) }}
                </div>
              </div>
            </div>
            
            <template #stats>
              <ui-stats 
                :stats="getProjectStatsData(project)" 
                :columns="2" 
                size="sm"
                interactive
                @stat-click="handleStatClick"
              />
            </template>
            
            <template #actions>
              <button 
                @click.stop="handleProjectClick(project)"
                class="btn btn-primary btn-sm"
              >
                Open Project
              </button>
            </template>
          </ui-card>
        </template>
        
        <template #emptyAction>
          <button 
            v-if="canCreateProjects"
            @click="showCreateModal = true"
            class="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Project
          </button>
        </template>
      </ui-grid>
    </div>

    <!-- Project Creation Modal -->
    <ProjectCreateModal 
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @project-created="handleProjectCreated"
    />

    <!-- Email Ingestion Modal -->
    <EmailIngestionModal 
      :is-open="showEmailIngestionModal"
      :project-id="selectedProjectForEmail"
      @close="closeEmailIngestionModal"
      @success="handleEmailIngestionSuccess"
      @error="handleEmailIngestionError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { taskPermissionService } from '../services/taskPermissions'
import { useMyProjectsQuery } from '../generated/graphql'
import { useApolloFeedback } from '../composables/useApolloFeedback'

// Components
import UiCard from '../components/ui/Card.vue'
import UiGrid from '../components/ui/Grid.vue'
import UiStats from '../components/ui/Stats.vue'
import UiSearchFilters from '../components/ui/SearchFilters.vue'
import UiActionMenu from '../components/ui/ActionMenu.vue'
import ProjectCreateModal from '../components/modals/ProjectCreateModal.vue'
import EmailIngestionModal from '../components/modals/EmailIngestionModal.vue'

// Icons
const FolderPlusIcon = 'svg'

// State
const showCreateModal = ref(false)
const showEmailIngestionModal = ref(false)
const selectedProjectForEmail = ref<string>('')
const searchQuery = ref('')
const activeFilters = ref({})
const currentView = ref('grid')

// GraphQL
const { result: projectsResult, loading: projectsLoading, refetch } = useMyProjectsQuery()
const feedback = useApolloFeedback()

// Computed
const projects = computed(() => projectsResult.value?.myProjects || [])
const totalProjects = computed(() => projects.value.length)

const filteredProjects = computed(() => {
  let filtered = [...projects.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    )
  }
  
  // Status filter
  if ((activeFilters.value as any).status) {
    const isActive = (activeFilters.value as any).status === 'active'
    filtered = filtered.filter(project => project.isActive === isActive)
  }
  
  return filtered
})

const projectStats = computed(() => [
  {
    key: 'total',
    label: 'Total Projects',
    value: totalProjects.value,
    icon: FolderPlusIcon,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10'
  },
  {
    key: 'active',
    label: 'Active Projects', 
    value: projects.value.filter(p => p.isActive).length,
    icon: FolderPlusIcon,
    iconColor: 'text-success',
    iconBg: 'bg-success/10'
  },
  {
    key: 'members',
    label: 'Team Members',
    value: [...new Set(projects.value.flatMap(p => p.members.map(m => m.user.id)))].length,
    icon: FolderPlusIcon,
    iconColor: 'text-info',
    iconBg: 'bg-info/10'
  },
  {
    key: 'recent',
    label: 'Created This Month',
    value: projects.value.filter(p => {
      const created = new Date(p.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length,
    icon: FolderPlusIcon,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10'
  }
])

const projectFilters = computed(() => [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active Projects', value: 'active' },
      { label: 'Inactive Projects', value: 'inactive' }
    ]
  }
])

const statsLoading = computed(() => projectsLoading.value)

// Permission checks
const canCreateProjects = computed(() => {
  return taskPermissionService.canCreateProjectsBasic()
})

// Methods
const getProjectStatusBadge = (project: any): string => {
  return project.isActive ? 'Active' : 'Inactive'
}

const getUserInitials = (user: any): string => {
  if (!user) return '?'
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  return user.email?.[0]?.toUpperCase() || '?'
}

const getOwnerName = (user: any): string => {
  if (!user) return 'Unknown'
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.email || 'Unknown'
}

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString))
}

const getProjectStatsData = (project: any) => [
  {
    label: 'Members',
    value: project.members?.length || 0,
    format: 'number' as const
  },
  {
    label: 'Tasks',
    value: project.tasks?.length || 0,
    format: 'number' as const
  }
]

const getProjectActions = (project: any) => [
  {
    key: 'open',
    label: 'Open Project',
    icon: FolderPlusIcon,
    variant: 'primary' as const
  },
  {
    key: 'edit',
    label: 'Edit Project',
    icon: FolderPlusIcon,
    variant: 'default' as const
  },
  {
    divider: true
  },
  {
    key: 'archive',
    label: project.isActive ? 'Archive' : 'Activate',
    icon: FolderPlusIcon,
    variant: 'warning' as const
  }
]

// Event Handlers
const handleProjectClick = (project: any) => {
  // Navigate to project detail page
  console.log('Opening project:', project.name)
}

const handleProjectAction = (action: any, project: any) => {
  switch (action.key) {
    case 'open':
      handleProjectClick(project)
      break
    case 'edit':
      // Open edit modal
      console.log('Edit project:', project.name)
      break
    case 'archive':
      // Toggle active status
      console.log('Toggle archive:', project.name)
      break
  }
}

const handleProjectCreated = async (project: any) => {
  feedback.success('Project Created', `${project.name} has been created successfully`)
  await refetch()
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleFilter = (filters: any) => {
  activeFilters.value = filters
}

const handleSearchAndFilter = (query: string, filters: any) => {
  searchQuery.value = query
  activeFilters.value = filters
}

const handleViewChange = (view: string) => {
  currentView.value = view
}

const handleSort = (sortBy: string) => {
  console.log('Sort by:', sortBy)
}

const handleStatClick = (stat: any) => {
  console.log('Stat clicked:', stat)
}

// Email Ingestion Methods
const openEmailIngestionForProject = (projectId: string) => {
  selectedProjectForEmail.value = projectId
  showEmailIngestionModal.value = true
}

const closeEmailIngestionModal = () => {
  showEmailIngestionModal.value = false
  selectedProjectForEmail.value = ''
}

const handleEmailIngestionSuccess = async (result: any) => {
  feedback.success('Email Ingestion', 'Emails have been processed successfully')
  console.log('Email ingestion success:', result)
  
  // Refresh projects to update email stats
  await refetch()
  
  // Keep modal open for potential additional processing
  // User can manually close or start new processing
}

const handleEmailIngestionError = (error: any) => {
  feedback.error('Email Ingestion Failed', 'There was an error processing the emails')
  console.error('Email ingestion error:', error)
}

// Lifecycle
onMounted(() => {
  // Component mounted
})
</script>