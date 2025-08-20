<template>
  <div class="min-h-screen bg-base-200 flex">
    <!-- Left Navigation Side Panel -->
    <NavigationSidePanel 
      :is-open="showNavPanel"
      @close="showNavPanel = false"
      @navigate="handleNavigation"
    />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navigation Bar -->
      <nav class="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 lg:px-6 sticky top-0 z-30">
        <div class="navbar-start">
          <!-- Mobile Menu Button -->
          <button 
            @click="showNavPanel = !showNavPanel"
            class="btn btn-ghost btn-square lg:hidden"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          
          <!-- Desktop Menu Button -->
          <button 
            @click="showNavPanel = !showNavPanel"
            class="btn btn-ghost btn-square hidden lg:flex"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
          
          <!-- Back to Projects -->
          <router-link to="/projects" class="btn btn-ghost ml-2">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </router-link>
        </div>

        <div class="navbar-center">
          <div class="text-xl font-semibold">{{ project?.name || 'Loading...' }}</div>
        </div>

        <div class="navbar-end">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a @click="openEmailIngestion">📧 Ingest Emails</a></li>
              <li><a @click="editProject">✏️ Edit Project</a></li>
              <li><a @click="goToSettings">⚙️ Settings</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 p-6 space-y-6">
        <!-- Loading State -->
        <div class="card bg-base-100 shadow-xl" v-if="projectLoading">
          <div class="card-body">
            <div class="animate-pulse">
              <div class="h-8 bg-base-300 rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
              <div class="flex gap-2">
                <div class="h-6 bg-base-300 rounded w-16"></div>
                <div class="h-6 bg-base-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Header -->
        <div class="card bg-base-100 shadow-xl" v-else-if="project">
          <div class="card-body">
            <h1 class="text-3xl font-bold text-base-content mb-2">{{ project.name }}</h1>
            <p class="text-base-content/70 mb-4">{{ project.description || 'No description available' }}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <div class="badge badge-primary">{{ project.isActive ? 'Active' : 'Inactive' }}</div>
              <div v-if="project.createdAt" class="badge badge-outline">
                Created {{ formatDate(project.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Context Tabs -->
        <div class="tabs tabs-boxed bg-base-200 p-1">
          <a 
            v-for="tab in tabs" 
            :key="tab.key"
            class="tab"
            :class="{ 'tab-active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <span class="mr-2">{{ tab.icon }}</span>
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="badge badge-sm ml-2">{{ tab.count }}</span>
          </a>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Project Stats -->
              <div class="card bg-base-100 shadow">
                <div class="card-body">
                  <h3 class="card-title text-lg">📊 Project Statistics</h3>
                  <div class="stats stats-vertical" v-if="projectTaskStats">
                    <div class="stat">
                      <div class="stat-title">Total Tasks</div>
                      <div class="stat-value text-2xl">{{ projectTaskStats.total }}</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title">Completed</div>
                      <div class="stat-value text-2xl text-success">{{ projectTaskStats.completed }}</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title">In Progress</div>
                      <div class="stat-value text-2xl text-warning">{{ projectTaskStats.inProgress }}</div>
                    </div>
                  </div>
                  <div v-else class="animate-pulse">
                    <div class="h-20 bg-base-300 rounded"></div>
                  </div>
                </div>
              </div>

              <!-- Team Members -->
              <div class="card bg-base-100 shadow">
                <div class="card-body">
                  <h3 class="card-title text-lg">👥 Team Members</h3>
                  <div class="space-y-2">
                    <div v-for="member in project?.members" :key="member.id" class="flex items-center space-x-3">
                      <div class="avatar placeholder">
                        <div class="bg-primary text-primary-content rounded-full w-8">
                          <span class="text-xs">{{ member.user?.firstName?.charAt(0) || '?' }}</span>
                        </div>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium">{{ member.user?.firstName }} {{ member.user?.lastName }}</p>
                        <p class="text-xs text-base-content/50">{{ member.user?.email }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Tasks -->
              <div class="card bg-base-100 shadow">
                <div class="card-body">
                  <h3 class="card-title text-lg">📋 Recent Tasks</h3>
                  <div class="space-y-2">
                    <div v-for="task in project?.tasks?.slice(0, 3)" :key="task.id" class="flex items-center justify-between">
                      <div class="flex-1">
                        <p class="text-sm font-medium">{{ task.name }}</p>
                        <div class="badge badge-sm" :class="getStatusBadgeClass(task.status)">
                          {{ task.status.replace('_', ' ') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tasks Tab -->
          <div v-else-if="activeTab === 'tasks'" class="space-y-4">
            <div class="card bg-base-100 shadow">
              <div class="card-body">
                <div class="flex justify-between items-center">
                  <h3 class="card-title">Project Tasks</h3>
                  <button class="btn btn-primary btn-sm" @click="createTask">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </button>
                </div>
              </div>
            </div>

            <!-- Tasks List -->
            <div class="grid gap-4">
              <div v-for="task in projectTasks" :key="task.id" class="card bg-base-100 shadow">
                <div class="card-body">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="card-title text-lg">{{ task.name }}</h4>
                      <p class="text-base-content/70 mb-2">{{ task.description || 'No description' }}</p>
                      
                      <div class="flex flex-wrap gap-2 mb-2">
                        <div class="badge" :class="getStatusBadgeClass(task.status)">
                          {{ task.status.replace('_', ' ') }}
                        </div>
                        <div class="badge" :class="getPriorityBadgeClass(task.priority)">
                          {{ task.priority }}
                        </div>
                        <div v-if="task.dueDate" class="badge badge-outline">
                          Due {{ formatDate(task.dueDate) }}
                        </div>
                      </div>
                      
                      <div v-if="task.assignee" class="flex items-center space-x-2">
                        <div class="avatar placeholder">
                          <div class="bg-neutral text-neutral-content rounded-full w-6">
                            <span class="text-xs">{{ task.assignee.firstName?.charAt(0) || '?' }}</span>
                          </div>
                        </div>
                        <span class="text-sm">{{ task.assignee.firstName }} {{ task.assignee.lastName }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="projectTasks?.length === 0" class="text-center py-12">
                <div class="text-base-content/50">
                  <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No tasks found</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Emails Tab -->
          <div v-else-if="activeTab === 'emails'" class="space-y-4">
            <!-- Email Search -->
            <div class="card bg-base-100 shadow">
              <div class="card-body">
                <div class="flex flex-wrap gap-4 items-center">
                  <div class="form-control flex-1">
                    <input 
                      v-model="emailSearchQuery" 
                      type="text" 
                      placeholder="Search emails..." 
                      class="input input-bordered"
                      @keyup.enter="searchEmails"
                    >
                  </div>
                  <button class="btn btn-primary" @click="searchEmails" :disabled="!emailSearchQuery.trim()">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                  <button class="btn btn-ghost" @click="clearEmailSearch" v-if="emailSearchQuery">
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <!-- Emails List -->
            <div class="space-y-4">
              <div v-if="emailsLoading" class="space-y-4">
                <div v-for="i in 5" :key="i" class="card bg-base-100 shadow animate-pulse">
                  <div class="card-body">
                    <div class="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-base-300 rounded w-1/2 mb-2"></div>
                    <div class="h-3 bg-base-300 rounded w-full"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="currentEmails?.length" class="space-y-4">
                <div v-for="email in currentEmails" :key="email.id" class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                  <div class="card-body">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <h4 class="font-semibold text-lg">{{ email.subject }}</h4>
                          <div class="badge badge-sm" :class="getProcessingStatusBadgeClass(email.processingStatus)">
                            {{ email.processingStatus }}
                          </div>
                        </div>
                        
                        <div class="text-sm text-base-content/70 mb-2">
                          <span class="font-medium">From:</span> {{ email.fromName || email.fromEmail }} &lt;{{ email.fromEmail }}&gt;
                        </div>
                        
                        <div class="text-sm text-base-content/70 mb-2">
                          <span class="font-medium">To:</span> {{ email.toEmails.join(', ') }}
                        </div>
                        
                        <!-- Message Content -->
                        <div class="mb-3">
                          <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-base-content/60">Message</span>
                            <button 
                              @click="toggleEmailExpansion(email.id)"
                              class="btn btn-xs btn-ghost"
                              v-if="email.fullMessage && email.fullMessage !== email.messagePreview"
                            >
                              {{ isEmailExpanded(email.id) ? 'Show Less' : 'Show Full Message' }}
                            </button>
                          </div>
                          <div class="text-sm text-base-content/80 p-3 bg-base-200 rounded-lg">
                            <div v-if="isEmailExpanded(email.id)" class="whitespace-pre-wrap">{{ email.fullMessage || 'No full message available' }}</div>
                            <div v-else>{{ email.messagePreview || 'No preview available' }}</div>
                          </div>
                        </div>
                        
                        <div v-if="email.aiSummary" class="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
                          <div class="text-xs font-medium text-primary mb-1">AI Summary</div>
                          <p class="text-sm">{{ email.aiSummary }}</p>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 items-center">
                          <div class="text-xs text-base-content/50">
                            {{ formatDate(email.messageDate || email.receivedDate) }}
                          </div>
                          <div v-if="email.hasAttachments" class="badge badge-ghost badge-sm">
                            📎 {{ email.attachmentCount }} attachment{{ email.attachmentCount > 1 ? 's' : '' }}
                          </div>
                          <div v-if="email.threadId" class="badge badge-ghost badge-sm">
                            Thread: {{ email.threadId.substring(0, 8) }}...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <div class="text-base-content/50">
                  <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>No emails found</p>
                  <p class="text-sm">Try adjusting your search or check back later</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Other tabs placeholder -->
          <div v-else class="text-center py-12">
            <div class="text-base-content/50">
              <p>{{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }} section coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Email Ingestion Modal -->
  <EmailIngestionModal 
    v-if="showEmailModal"
    :is-open="showEmailModal"
    :project-id="projectId"
    @update:is-open="showEmailModal = $event"
    @close="showEmailModal = false"
    @success="handleEmailIngestionSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import NavigationSidePanel from '@/components/layout/NavigationSidePanel.vue'
import EmailIngestionModal from '@/components/modals/EmailIngestionModal.vue'
import { useFeedback } from '@/composables/useFeedback'
import { 
  useProjectQuery,
  useProjectTasksQuery,
  useProjectTaskStatsQuery,
  useProjectEmailContextsQuery,
  useSearchEmailContextsQuery,
  TaskStatus,
  TaskPriority,
  ProcessingStatus
} from '@/generated/graphql'

// Props
interface Props {
  projectId: string
}

const props = defineProps<Props>()
const feedback = useFeedback()

// State
const activeTab = ref('overview')
const showEmailModal = ref(false)
const showNavPanel = ref(false)
const emailSearchQuery = ref('')
const isSearching = ref(false)
const expandedEmails = ref(new Set<string>()) // Track which emails have expanded messages

// GraphQL Queries
const { result: projectResult, loading: projectLoading } = useProjectQuery({
  projectId: props.projectId
})

const { result: taskStatsResult } = useProjectTaskStatsQuery({
  projectId: props.projectId
})

const { result: tasksResult } = useProjectTasksQuery({
  projectId: props.projectId,
  limit: 50,
  offset: 0
})

const { result: emailsResult, loading: emailsLoading, refetch: refetchEmails } = useProjectEmailContextsQuery({
  projectId: props.projectId,
  limit: 30,
  offset: 0
})

// For search emails, we'll use a simpler approach
const searchEmailsVariables = reactive({
  projectId: props.projectId,
  query: '',
  limit: 20
})

const { result: searchEmailsResult } = useSearchEmailContextsQuery(
  searchEmailsVariables, {
    enabled: computed(() => isSearching.value && emailSearchQuery.value.trim() !== '')
  }
)

// Computed properties
const project = computed(() => projectResult.value?.project)
const projectTaskStats = computed(() => taskStatsResult.value?.projectTaskStats)
const projectTasks = computed(() => tasksResult.value?.projectTasks || [])
const projectEmails = computed(() => emailsResult.value?.emailContexts.edges || [])
const searchedEmails = computed(() => searchEmailsResult.value?.searchEmailContexts || [])

const currentEmails = computed(() => {
  return isSearching.value ? searchedEmails.value : projectEmails.value
})

const tabs = computed(() => [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'tasks', label: 'Tasks', icon: '✅', count: projectTasks.value?.length || 0 },
  { key: 'emails', label: 'Emails', icon: '📧', count: projectEmails.value?.length || 0 },
  { key: 'files', label: 'Files', icon: '📁' },
  { key: 'activities', label: 'Activities', icon: '🕒' },
  { key: 'settings', label: 'Settings', icon: '⚙️' }
])

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const getStatusBadgeClass = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Completed: return 'badge-success'
    case TaskStatus.InProgress: return 'badge-warning'
    case TaskStatus.Todo: return 'badge-info'
    default: return 'badge-ghost'
  }
}

const getPriorityBadgeClass = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.High: return 'badge-error'
    case TaskPriority.Medium: return 'badge-warning'
    case TaskPriority.Low: return 'badge-info'
    default: return 'badge-ghost'
  }
}

const getProcessingStatusBadgeClass = (status: ProcessingStatus) => {
  switch (status) {
    case ProcessingStatus.Completed: return 'badge-success'
    case ProcessingStatus.ManualReview: return 'badge-warning'
    case ProcessingStatus.Failed: return 'badge-error'
    case ProcessingStatus.Pending: return 'badge-info'
    default: return 'badge-ghost'
  }
}

// Navigation methods
const handleNavigation = () => {
  showNavPanel.value = false
}

// Actions
const openEmailIngestion = () => {
  showEmailModal.value = true
}

const editProject = () => {
  feedback.info('Feature Coming Soon', 'Project editing will be available soon')
}

const goToSettings = () => {
  activeTab.value = 'settings'
}

const createTask = () => {
  feedback.info('Feature Coming Soon', 'Task creation will be available soon')
}

// Email methods
const searchEmails = () => {
  if (emailSearchQuery.value.trim()) {
    isSearching.value = true
    searchEmailsVariables.query = emailSearchQuery.value
  }
}

const clearEmailSearch = () => {
  emailSearchQuery.value = ''
  isSearching.value = false
  searchEmailsVariables.query = ''
}

const toggleEmailExpansion = (emailId: string) => {
  if (expandedEmails.value.has(emailId)) {
    expandedEmails.value.delete(emailId)
  } else {
    expandedEmails.value.add(emailId)
  }
}

const isEmailExpanded = (emailId: string) => {
  return expandedEmails.value.has(emailId)
}

const handleEmailIngestionSuccess = () => {
  feedback.success('Email Ingestion', 'Emails have been processed successfully')
  showEmailModal.value = false
  // Refetch emails to show new ones
  refetchEmails()
}

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'emails' && !emailsResult.value) {
    refetchEmails()
  }
})
</script>
